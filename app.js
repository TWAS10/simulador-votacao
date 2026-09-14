const candidates = {
  "13": {
    name: "Luiz Inácio Lula da Silva",
    party: "PT",
    number: "13",
    photo: "fotos/LULA.jpg"
  },

  "22": {
    name: "Flávio Bolsonaro",
    party: "PL",
    number: "22",
    photo: "fotos/FLAVIO BOLSONARO.jpg"
  },

  "45": {
    name: "Ronaldo Caiado",
    party: "PSD",
    number: "45",
    photo: "fotos/RONALDO CAIADO.jpg"
  },

  "29": {
    name: "Rui Costa Pimenta",
    party: "PCO",
    number: "29",
    photo: "fotos/RUI COSTA PIMENTA.jpg"
  },

  "80": {
    name: "Samara Martins",
    party: "UP",
    number: "80",
    photo: "fotos/SAMARA MARTINS.jpg"
  },

  "30": {
    name: "Romeu Zema",
    party: "Novo",
    number: "30",
    photo: "fotos/ROMEU ZEMA.jpg"
  },

  "16": {
    name: "Hertz Dias",
    party: "PSTU",
    number: "16",
    photo: "fotos/HERTZ DIAS.jpg"
  },

  "21": {
    name: "Edmilson Costa",
    party: "PCB",
    number: "21",
    photo: "fotos/EDMILSON COSTA.jpg"
  },

  "14": {
    name: "Renan Santos",
    party: "Missão",
    number: "14",
    photo: "fotos/RENAN SANTOS.jpg"
  },

  "35": {
    name: "Wilson Grassi",
    party: "Democrata",
    number: "35",
    photo: "fotos/WILSON GRASSI.jpg"
  },

  "27": {
    name: "Clariana Barão",
    party: "DC",
    number: "27",
    photo: "fotos/CLARIANA BARAO.jpg"
  },

  "70": {
    name: "Augusto Cury",
    party: "Avante",
    number: "70",
    photo: "fotos/AUGUSTO CURY.jpg"
  }
};


/* =========================
ESTADO DA VOTAÇÃO
========================= */

let typedNumber = "";
let selectedCandidate = null;
let votingFinished = false;
let voteType = "none";

let accessCode = "";
let accessCodeValidated = false;


/* =========================
ELEMENTOS DO HTML
========================= */

const bootScreen = document.getElementById("bootScreen");
const accessScreen = document.getElementById("accessScreen");

const accessCodeInput =
  document.getElementById("accessCodeInput");

const accessCodeBtn =
  document.getElementById("accessCodeBtn");

const accessCodeMessage =
  document.getElementById("accessCodeMessage");

const app =
  document.getElementById("app");

const startBtn =
  document.getElementById("startBtn");

const numberDisplay =
  document.getElementById("numberDisplay");

const keypad =
  document.getElementById("keypad");

const stageMessage =
  document.getElementById("stageMessage");

const candidateName =
  document.getElementById("candidateName");

const candidateNumber =
  document.getElementById("candidateNumber");

const candidatePhoto =
  document.getElementById("candidatePhoto");

const voteStatus =
  document.getElementById("voteStatus");

const blankBtn =
  document.getElementById("blankBtn");

const clearBtn =
  document.getElementById("clearBtn");

const enterBtn =
  document.getElementById("enterBtn");

const footerMessage =
  document.getElementById("footerMessage");

const restartBtn =
  document.getElementById("restartBtn");

const confirmDialog =
  document.getElementById("confirmDialog");

const dialogCandidate =
  document.getElementById("dialogCandidate");

const cancelBtn =
  document.getElementById("cancelBtn");

const confirmBtn =
  document.getElementById("confirmBtn");

const settingsBtn =
  document.getElementById("settingsBtn");


/* =========================
CLIENTE SUPABASE
========================= */

function getSupabaseClient() {

  if (
    typeof window.supabaseClient !== "undefined" &&
    window.supabaseClient
  ) {
    return window.supabaseClient;
  }

  if (
    typeof supabaseClient !== "undefined" &&
    supabaseClient
  ) {
    return supabaseClient;
  }

  return null;
}


/* =========================
MOSTRAR FOTO DO CANDIDATO
========================= */

function showCandidatePhoto(
  photo,
  candidateNameText
) {

  candidatePhoto.innerHTML = "";

  if (!photo) {

    candidatePhoto.textContent = "?";

    return;

  }

  const img =
    document.createElement("img");

  img.src =
    encodeURI(photo);

  img.alt =
    "Foto de " + candidateNameText;

  img.title =
    candidateNameText;

  img.style.width =
    "100%";

  img.style.height =
    "100%";

  img.style.objectFit =
    "cover";

  img.style.objectPosition =
    "center";

  img.style.display =
    "block";

  img.onerror =
    function () {

      candidatePhoto.innerHTML = "";

      candidatePhoto.textContent = "?";

    };

  candidatePhoto.appendChild(img);

}


/* =========================
INICIAR VOTAÇÃO
========================= */

function startVoting() {

  if (
    !accessScreen ||
    !app ||
    !bootScreen
  ) {

    console.error(
      "Elementos da tela de acesso não encontrados."
    );

    return;

  }

  bootScreen.hidden = true;

  accessScreen.hidden = false;

  app.hidden = true;

  accessCode = "";

  accessCodeValidated = false;

  if (accessCodeInput) {

    accessCodeInput.value = "";

  }

  if (accessCodeMessage) {

    accessCodeMessage.textContent = "";

  }

  if (accessCodeBtn) {

    accessCodeBtn.disabled = false;

  }

  setTimeout(
    function () {

      if (accessCodeInput) {

        accessCodeInput.focus();

      }

    },
    100
  );

}


/* =========================
VALIDAR CÓDIGO DE ACESSO
========================= */

async function validateAccessCode() {

  if (
    !accessCodeInput ||
    !accessCodeBtn ||
    !accessCodeMessage
  ) {

    console.error(
      "Elementos do código de acesso não encontrados."
    );

    return;

  }

  const code =
    accessCodeInput.value.trim();

  if (!code) {

    accessCodeMessage.textContent =
      "Digite o código de acesso.";

    accessCodeInput.focus();

    return;

  }

  const client =
    getSupabaseClient();

  if (!client) {

    console.error(
      "supabaseClient não está disponível."
    );

    accessCodeMessage.textContent =
      "Erro de conexão com o sistema.";

    return;

  }

  accessCodeBtn.disabled = true;

  accessCodeMessage.textContent =
    "Validando código...";

  try {

    const {
      data,
      error
    } = await client.rpc(
      "validate_access_code",
      {
        p_code: code
      }
    );

    if (error) {

      console.error(
        "Erro ao validar código:",
        error
      );

      accessCodeMessage.textContent =
        "Não foi possível validar o código. Tente novamente.";

      accessCodeBtn.disabled = false;

      return;

    }

    if (
      !data ||
      data.length === 0 ||
      data[0].valid !== true
    ) {

      accessCodeMessage.textContent =
        "Código inválido ou já utilizado.";

      accessCodeBtn.disabled = false;

      accessCodeInput.focus();

      return;

    }

    accessCode =
      code;

    accessCodeValidated =
      true;

    accessScreen.hidden = true;

    app.hidden = false;

    resetVoting();

    footerMessage.textContent =
      "Digite o número do candidato usando o teclado.";

  } catch (error) {

    console.error(
      "Erro inesperado ao validar o código:",
      error
    );

    accessCodeMessage.textContent =
      "Ocorreu um erro ao validar o código.";

    accessCodeBtn.disabled = false;

  }

}


/* =========================
REINICIAR VOTAÇÃO
========================= */

function resetVoting() {

  typedNumber = "";

  selectedCandidate = null;

  votingFinished = false;

  voteType = "none";


  /* =========================
  REATIVAR BOTÕES
  ========================= */

  enterBtn.disabled = false;

  blankBtn.disabled = false;

  clearBtn.disabled = false;

  /*
  IMPORTANTE:

  Durante a confirmação de um voto,
  os dois botões da janela de confirmação
  são desativados.

  Ao iniciar uma nova votação,
  eles precisam obrigatoriamente
  voltar a ficar ativos.
  */

  confirmBtn.disabled = false;

  cancelBtn.disabled = false;


  /* =========================
  FECHAR CONFIRMAÇÃO
  ========================= */

  if (
    confirmDialog &&
    confirmDialog.open
  ) {

    confirmDialog.close();

  }


  /* =========================
  LIMPAR NÚMERO
  ========================= */

  updateNumberDisplay();


  /* =========================
  RESTAURAR TELA PRINCIPAL
  ========================= */

  stageMessage.textContent =
    "Digite o número do candidato";

  candidateName.textContent =
    "Aguardando voto";

  candidateNumber.textContent =
    "—";

  candidatePhoto.innerHTML = "";

  candidatePhoto.textContent =
    "?";

  voteStatus.textContent =
    "Nenhum número digitado";

  footerMessage.textContent =
    "Digite o número usando o teclado.";


  /* =========================
  REATIVAR TECLADO
  ========================= */

  if (keypad) {

    const keys =
      keypad.querySelectorAll("button");

    keys.forEach(
      function (key) {

        key.disabled = false;

      }
    );

  }

}


/* =========================
MOSTRAR NÚMERO DIGITADO
========================= */

function updateNumberDisplay() {

  if (
    typedNumber.length === 0
  ) {

    numberDisplay.innerHTML =
      '<span class="number-placeholder">_</span>';

    return;

  }

  numberDisplay.textContent =
    typedNumber;

}


/* =========================
DIGITAR NÚMERO
========================= */

function typeNumber(number) {

  if (votingFinished) {

    return;

  }

  if (
    typedNumber.length >= 2
  ) {

    return;

  }

  voteType = "candidate";

  typedNumber += number;

  updateNumberDisplay();

  if (
    typedNumber.length === 1
  ) {

    stageMessage.textContent =
      "Digite o segundo número";

    voteStatus.textContent =
      "Número incompleto";

    return;

  }

  showCandidate();

}


/* =========================
MOSTRAR CANDIDATO
========================= */

function showCandidate() {

  selectedCandidate =
    candidates[typedNumber];

  if (!selectedCandidate) {

    voteType = "null";

    stageMessage.textContent =
      "Número inválido";

    candidateName.textContent =
      "VOTO NULO";

    candidateNumber.textContent =
      typedNumber;

    candidatePhoto.innerHTML = "";

    candidatePhoto.textContent =
      "X";

    voteStatus.textContent =
      "Esse número não está cadastrado.";

    footerMessage.textContent =
      "Pressione CORRIGE para tentar novamente.";

    return;

  }

  voteType = "candidate";

  stageMessage.textContent =
    "Confira os dados do candidato";

  candidateName.textContent =
    selectedCandidate.name;

  candidateNumber.textContent =
    selectedCandidate.number;

  showCandidatePhoto(
    selectedCandidate.photo,
    selectedCandidate.name
  );

  voteStatus.textContent =
    selectedCandidate.party;

  footerMessage.textContent =
    "Confira os dados e pressione CONFIRMA.";

}


/* =========================
CORRIGIR NÚMERO
========================= */

function clearNumber() {

  if (votingFinished) {

    return;

  }

  typedNumber = "";

  selectedCandidate = null;

  voteType = "none";

  updateNumberDisplay();

  stageMessage.textContent =
    "Digite o número do candidato";

  candidateName.textContent =
    "Aguardando voto";

  candidateNumber.textContent =
    "—";

  candidatePhoto.innerHTML = "";

  candidatePhoto.textContent =
    "?";

  voteStatus.textContent =
    "Nenhum número digitado";

  footerMessage.textContent =
    "Digite o número usando o teclado.";

}


/* =========================
VOTO EM BRANCO
========================= */

function voteBlank() {

  if (votingFinished) {

    return;

  }

  typedNumber = "";

  selectedCandidate = null;

  voteType = "blank";

  updateNumberDisplay();

  stageMessage.textContent =
    "VOTO EM BRANCO";

  candidateName.textContent =
    "VOTO BRANCO";

  candidateNumber.textContent =
    "BRANCO";

  candidatePhoto.innerHTML = "";

  candidatePhoto.textContent =
    "B";

  voteStatus.textContent =
    "Você escolheu votar em branco.";

  footerMessage.textContent =
    "Pressione CONFIRMA para registrar o voto em branco.";

}


/* =========================
ABRIR CONFIRMAÇÃO
========================= */

function openConfirmation() {

  if (votingFinished) {

    return;

  }

  if (!accessCodeValidated) {

    alert(
      "Informe um código de acesso válido."
    );

    return;

  }

  if (voteType === "none") {

    alert(
      "Digite um número ou escolha BRANCO."
    );

    return;

  }

  if (
    voteType === "candidate" &&
    typedNumber.length < 2
  ) {

    alert(
      "Digite os dois números do candidato."
    );

    return;

  }

  if (voteType === "blank") {

    dialogCandidate.textContent =
      "VOTO EM BRANCO";

    confirmDialog.showModal();

    return;

  }

  if (voteType === "null") {

    dialogCandidate.textContent =
      "VOTO NULO — número " +
      typedNumber;

    confirmDialog.showModal();

    return;

  }

  if (selectedCandidate) {

    dialogCandidate.textContent =
      selectedCandidate.name +
      " — número " +
      selectedCandidate.number;

    confirmDialog.showModal();

  }

}


/* =========================
PREPARAR DADOS DO VOTO
========================= */

function getVotePayload() {

  if (
    voteType === "candidate"
  ) {

    return {
      candidate_number: typedNumber,
      vote_type: "candidate"
    };

  }

  if (
    voteType === "blank"
  ) {

    return {
      candidate_number: null,
      vote_type: "blank"
    };

  }

  if (
    voteType === "null"
  ) {

    return {
      candidate_number: null,
      vote_type: "null"
    };

  }

  return null;

}


/* =========================
CONFIRMAR VOTO

IMPORTANTE — SEGURANÇA:

Este é o ÚNICO caminho que grava um voto.
Ele chama exclusivamente a função remota
"register_vote_with_access_code" (RPC),
que deve validar o código de acesso e o
candidato dentro do próprio banco de dados,
em uma única transação.

Não crie funções que façam
`client.from("votes").insert(...)`
diretamente a partir do navegador: como
o código de acesso é validado apenas na
RPC, um insert direto contornaria essa
validação por completo. Duas funções
antigas que faziam isso
(`registerVote` e `consumeAccessCode`)
foram removidas deste arquivo por esse
motivo — elas não eram usadas por nenhum
fluxo, mas representavam um risco caso
fossem chamadas por engano no futuro.
========================= */

async function confirmVote() {

  if (!confirmDialog.open) {
    return;
  }

  if (
    !accessCodeValidated ||
    !accessCode
  ) {
    alert(
      "Código de acesso não validado."
    );
    return;
  }

  const client =
    getSupabaseClient();

  if (!client) {
    alert(
      "Erro de conexão com o sistema."
    );
    return;
  }

  const payload =
    getVotePayload();

  if (!payload) {
    alert(
      "Tipo de voto inválido."
    );
    return;
  }

  confirmBtn.disabled = true;
  cancelBtn.disabled = true;

  voteStatus.textContent =
    "Registrando voto...";

  try {

    const {
      data,
      error
    } = await client.rpc(
      "register_vote_with_access_code",
      {
        p_code:
          accessCode,

        p_candidate_number:
          payload.candidate_number,

        p_vote_type:
          payload.vote_type
      }
    );

    if (error) {

      console.error(
        "Erro ao registrar voto:",
        error
      );

      throw error;
    }

    if (
      !data ||
      data.length === 0 ||
      data[0].success !== true
    ) {

      throw new Error(
        "O sistema não confirmou o registro do voto."
      );

    }

    console.log(
      "Voto registrado com sucesso:",
      data
    );

    confirmDialog.close();

    votingFinished = true;

    accessCodeValidated = false;

    accessCode = "";

    stageMessage.textContent =
      "VOTO CONFIRMADO";

    candidateName.textContent =
      "FIM";

    candidateNumber.textContent =
      "✓";

    candidatePhoto.innerHTML = "";

    candidatePhoto.textContent =
      "✓";

    voteStatus.textContent =
      "Seu voto foi registrado no simulador.";

    footerMessage.textContent =
      "Votação encerrada. Clique em Reiniciar para votar novamente.";

    enterBtn.disabled = true;

    blankBtn.disabled = true;

    clearBtn.disabled = true;

    if (keypad) {

      const keys =
        keypad.querySelectorAll("button");

      keys.forEach(function (key) {
        key.disabled = true;
      });

    }

  } catch (error) {

    console.error(
      "Erro ao finalizar votação:",
      error
    );

    voteStatus.textContent =
      "Não foi possível concluir a votação. Verifique o sistema antes de tentar novamente.";

    confirmBtn.disabled = false;
    cancelBtn.disabled = false;

  }

}


/* =========================
EVENTO DO BOTÃO INICIAR
========================= */

if (startBtn) {

  startBtn.addEventListener(
    "click",
    startVoting
  );

}


/* =========================
BOTÃO VALIDAR CÓDIGO
========================= */

if (accessCodeBtn) {

  accessCodeBtn.addEventListener(
    "click",
    function () {

      validateAccessCode();

    }
  );

}


/* =========================
ENTER NO CAMPO DO CÓDIGO
========================= */

if (accessCodeInput) {

  accessCodeInput.addEventListener(
    "keydown",
    function (event) {

      if (event.key === "Enter") {

        event.preventDefault();

        validateAccessCode();

      }

    }
  );

}


/* =========================
EVENTO DO TECLADO
========================= */

if (keypad) {

  keypad.addEventListener(
    "click",
    function (event) {

      const button =
        event.target.closest(
          "[data-number]"
        );

      if (
        !button ||
        button.disabled
      ) {

        return;

      }

      typeNumber(
        button.dataset.number
      );

    }
  );

}


/* =========================
BOTÃO CORRIGE
========================= */

if (clearBtn) {

  clearBtn.addEventListener(
    "click",
    clearNumber
  );

}


/* =========================
BOTÃO BRANCO
========================= */

if (blankBtn) {

  blankBtn.addEventListener(
    "click",
    voteBlank
  );

}


/* =========================
BOTÃO CONFIRMA
========================= */

if (enterBtn) {

  enterBtn.addEventListener(
    "click",
    openConfirmation
  );

}


/* =========================
CANCELAR CONFIRMAÇÃO
========================= */

if (cancelBtn) {

  cancelBtn.addEventListener(
    "click",
    function () {

      confirmDialog.close();

      confirmBtn.disabled = false;

      cancelBtn.disabled = false;

    }
  );

}


/* =========================
CONFIRMAR DENTRO DA JANELA
========================= */

if (confirmBtn) {

  confirmBtn.addEventListener(
    "click",
    confirmVote
  );

}


/* =========================
BOTÃO REINICIAR
========================= */

if (restartBtn) {

  restartBtn.addEventListener(
    "click",
    function () {

      /*
      Primeiro garantimos que qualquer
      janela de confirmação esteja fechada
      e que seus botões estejam ativos.
      */

      if (
        confirmDialog &&
        confirmDialog.open
      ) {

        confirmDialog.close();

      }

      confirmBtn.disabled = false;

      cancelBtn.disabled = false;


      /*
      Limpa o estado da votação.
      */

      resetVoting();


      /*
      O código anterior da votação
      não pode ser reutilizado.
      */

      accessCode = "";

      accessCodeValidated = false;


      /*
      Volta para a tela inicial.
      */

      if (accessScreen) {

        accessScreen.hidden = true;

      }

      if (app) {

        app.hidden = true;

      }

      if (bootScreen) {

        bootScreen.hidden = false;

      }

    }
  );

}


/* =========================
BOTÃO CONFIGURAÇÕES
========================= */

if (settingsBtn) {

  settingsBtn.addEventListener(
    "click",
    function () {

      alert(
        "Simulador de Votação\n\n" +
        "Digite o número usando o teclado.\n" +
        "CONFIRMA registra o voto.\n" +
        "CORRIGE apaga o número.\n" +
        "BRANCO permite votar em branco."
      );

    }
  );

}


/* =========================
LIMPA VERSÕES ANTIGAS
DO SERVICE WORKER E CACHE
========================= */

if (
  "serviceWorker" in navigator
) {

  window.addEventListener(
    "load",
    function () {

      navigator.serviceWorker
        .getRegistrations()
        .then(
          function (registrations) {

            registrations.forEach(
              function (registration) {

                registration.unregister();

              }
            );

          }
        )
        .catch(
          function (error) {

            console.log(
              "Não foi possível remover o Service Worker:",
              error
            );

          }
        );

    }
  );

}


if ("caches" in window) {

  caches.keys()
    .then(
      function (cacheNames) {

        return Promise.all(
          cacheNames.map(
            function (cacheName) {

              return caches.delete(
                cacheName
              );

            }
          )
        );

      }
    )
    .catch(
      function (error) {

        console.log(
          "Não foi possível limpar o cache:",
          error
        );

      }
    );

}
