// =========================================================
// Edge Function: request-access
//
// Fluxo:
// 1. Recebe { email, turnstileToken } do front-end.
// 2. Valida o token do Turnstile junto à Cloudflare.
// 3. Verifica rate-limit: bloqueia se esse e-mail já pediu
//    um código nas últimas RATE_LIMIT_HOURS horas.
// 4. Chama a função SQL create_random_access_code(email),
//    usando a service_role key (que ignora RLS e o REVOKE
//    aplicado a anon).
// 5. Envia o código por e-mail via SMTP do HostGator.
// 6. Responde { success: true } ou { success: false, error }.
//
// Variáveis de ambiente necessárias (configuradas como
// secrets no Supabase, nunca no código):
//   SUPABASE_URL              (já disponível automaticamente)
//   SUPABASE_SERVICE_ROLE_KEY (já disponível automaticamente)
//   TURNSTILE_SECRET_KEY
//   SMTP_HOST
//   SMTP_PORT
//   SMTP_USER
//   SMTP_PASSWORD
// =========================================================

import { createClient } from "npm:@supabase/supabase-js@2";
import { SMTPClient } from "npm:emailjs@4";

const RATE_LIMIT_HOURS = 24;

// CORS: ajuste allowedOrigins para os domínios reais que vão
// chamar essa function (a página de solicitação de acesso).
const allowedOrigins = [
  "https://simuladortwas10.com.br",
  "https://www.simuladortwas10.com.br",
  "https://twas10.github.io",
];

function corsHeaders(origin: string | null) {
  const allowOrigin =
    origin && allowedOrigins.includes(origin) ? origin : allowedOrigins[0];

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
  };
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function verifyTurnstile(token: string, remoteIp: string | null): Promise<boolean> {
  const secret = Deno.env.get("TURNSTILE_SECRET_KEY");

  if (!secret) {
    console.error("TURNSTILE_SECRET_KEY não configurada.");
    return false;
  }

  const body = new URLSearchParams();
  body.append("secret", secret);
  body.append("response", token);
  if (remoteIp) body.append("remoteip", remoteIp);

  const res = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      body,
    }
  );

  const data = await res.json();
  return data.success === true;
}

async function hashIp(ip: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(ip);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function sendAccessCodeEmail(email: string, code: string) {
  const host = Deno.env.get("SMTP_HOST");
  const port = Number(Deno.env.get("SMTP_PORT") ?? "465");
  const user = Deno.env.get("SMTP_USER");
  const password = Deno.env.get("SMTP_PASSWORD");

  if (!host || !user || !password) {
    throw new Error("Configuração de SMTP incompleta.");
  }

  const client = new SMTPClient({
    host,
    port,
    user,
    password,
    ssl: port === 465,
    tls: port === 587,
  });

  const subject = "Seu código de acesso — Simulador de Votação TWAS10";

  const text =
    `Olá!\n\n` +
    `Seu código de acesso ao Simulador de Votação TWAS10 é:\n\n` +
    `${code}\n\n` +
    `Digite esse código na tela inicial do simulador para começar.\n` +
    `O código é de uso único e válido por tempo limitado.\n\n` +
    `Acesse o simulador em: https://twas10.github.io/simulador-votacao/\n\n` +
    `Se você não solicitou esse código, apenas ignore este e-mail.`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
      <h2 style="color:#0b2a5c;">Simulador de Votação TWAS10</h2>
      <p>Seu código de acesso é:</p>
      <p style="font-size: 28px; font-weight: bold; letter-spacing: 4px;
                background:#f2f2f2; padding: 16px; text-align:center;
                border-radius: 8px;">
        ${code}
      </p>
      <p>Digite esse código na tela inicial do simulador para começar.</p>
      <p style="color:#666; font-size: 13px;">
        O código é de uso único e válido por tempo limitado.
      </p>
      <p>
        <a href="https://twas10.github.io/simulador-votacao/"
           style="color:#0b2a5c;">
          Acessar o simulador
        </a>
      </p>
      <hr style="border:none; border-top:1px solid #eee; margin:24px 0;">
      <p style="color:#999; font-size: 12px;">
        Se você não solicitou esse código, apenas ignore este e-mail.
      </p>
    </div>
  `;

  await client.sendAsync({
    from: `Simulador de Votação TWAS10 <${user}>`,
    to: email,
    subject,
    text,
    attachment: [{ data: html, alternative: true }],
  });
}

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin");
  const headers = corsHeaders(origin);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ success: false, error: "Método não permitido." }),
      { status: 405, headers }
    );
  }

  try {
    const { email, turnstileToken } = await req.json();

    if (!email || typeof email !== "string" || !isValidEmail(email)) {
      return new Response(
        JSON.stringify({ success: false, error: "E-mail inválido." }),
        { status: 400, headers }
      );
    }

    if (!turnstileToken || typeof turnstileToken !== "string") {
      return new Response(
        JSON.stringify({ success: false, error: "Verificação de segurança ausente." }),
        { status: 400, headers }
      );
    }

    const remoteIp = req.headers.get("x-forwarded-for");

    // 1. Validar CAPTCHA
    const captchaOk = await verifyTurnstile(turnstileToken, remoteIp);
    if (!captchaOk) {
      return new Response(
        JSON.stringify({ success: false, error: "Falha na verificação de segurança." }),
        { status: 400, headers }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // 2. Rate-limit: já pediu recentemente?
    const cutoff = new Date(
      Date.now() - RATE_LIMIT_HOURS * 60 * 60 * 1000
    ).toISOString();

    const { data: recentRequests, error: rateLimitError } = await supabase
      .from("access_requests")
      .select("id, requested_at")
      .eq("email", normalizedEmail)
      .gte("requested_at", cutoff)
      .limit(1);

    if (rateLimitError) {
      console.error("Erro ao checar rate-limit:", rateLimitError);
      return new Response(
        JSON.stringify({ success: false, error: "Erro interno. Tente novamente." }),
        { status: 500, headers }
      );
    }

    if (recentRequests && recentRequests.length > 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: `Você já solicitou um código recentemente. Aguarde ${RATE_LIMIT_HOURS}h ou verifique seu e-mail (incluindo a caixa de spam).`,
        }),
        { status: 429, headers }
      );
    }

    // 3. Gerar código (via função SQL, roda como service_role)
    const { data: codeData, error: codeError } = await supabase.rpc(
      "create_random_access_code",
      { p_email: normalizedEmail }
    );

    if (codeError || !codeData || codeData.length === 0) {
      console.error("Erro ao gerar código:", codeError);
      return new Response(
        JSON.stringify({ success: false, error: "Não foi possível gerar o código. Tente novamente." }),
        { status: 500, headers }
      );
    }

    const code = codeData[0].code as string;

    // 4. Registrar hash do IP (best-effort, não bloqueia o fluxo se falhar)
    if (remoteIp) {
      try {
        const ipHash = await hashIp(remoteIp);
        await supabase
          .from("access_requests")
          .update({ ip_hash: ipHash })
          .eq("email", normalizedEmail)
          .eq("code", code);
      } catch (e) {
        console.error("Erro ao gravar ip_hash (não bloqueante):", e);
      }
    }

    // 5. Enviar e-mail
    try {
      await sendAccessCodeEmail(normalizedEmail, code);
    } catch (emailError) {
      console.error("Erro ao enviar e-mail:", emailError);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Código gerado, mas houve falha ao enviar o e-mail. Tente novamente em instantes.",
        }),
        { status: 502, headers }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers }
    );

  } catch (err) {
    console.error("Erro inesperado:", err);
    return new Response(
      JSON.stringify({ success: false, error: "Erro interno inesperado." }),
      { status: 500, headers }
    );
  }
});