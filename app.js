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
const accessCodeInput = document.getElementById("accessCodeInput");
const accessCodeBtn = document.getElementById("accessCodeBtn");
const accessCodeMessage = document.getElementById("accessCodeMessage");

const app = document.getElementById("app");
const startBtn = document.getElementById("startBtn");

const numberDisplay = document.getElementById("numberDisplay");
const keypad = document.getElementById("keypad");

const stageMessage = document.getElementById("stageMessage");
const candidateName = document.getElementById("candidateName");
const candidateNumber = document.getElementById("candidateNumber");
const candidatePhoto = document.getElementById("candidatePhoto");
const voteStatus = document.getElementById("voteStatus");

const blankBtn = document.getElementById("blankBtn");
const clearBtn = document.getElementById("clearBtn");
const enterBtn = document.getElementById("enterBtn");

const footerMessage = document.getElementById("footerMessage");
const restartBtn = document.getElementById("restartBtn");

const confirmDialog = document.getElementById("confirmDialog");
const dialogCandidate = document.getElementById("dialogCandidate");
const cancelBtn = document.getElementById("cancelBtn");
const confirmBtn = document.getElementById("confirmBtn");

const settingsBtn = document.getElementById("settingsBtn");

/* =========================
MOSTRAR FOTO DO CANDIDATO
========================= */

function showCandidatePhoto(photo, candidateNameText) {
candidatePhoto.innerHTML = "";

if (!photo) {
candidatePhoto.textContent = "?";
return;
}

const img = document.createElement("img");

img.src = encodeURI(photo);

img.alt = "Foto de " + candidateNameText;
img.title = candidateNameText;

img.style.width = "100%";
img.style.height = "100%";
img.style.objectFit = "cover";
img.style.objectPosition = "center";
img.style.display = "block";

img.onerror = function() {
candidatePhoto.innerHTML = "";
candidatePhoto.textContent = "?";
};

candidatePhoto.appendChild(img);
}

/* =========================
INICIAR VOTAÇÃO
========================= */

function startVoting() {
bootScreen.hidden = true;
accessScreen.hidden = false;
app.hidden = true;

accessCode = "";
accessCodeValidated = false;

accessCodeInput.value = "";
accessCodeMessage.textContent = "";

setTimeout(function() {
accessCodeInput.focus();
}, 100);
}

/* =========================
VALIDAR CÓDIGO DE ACESSO
========================= */

async function validateAccessCode() {
const code = accessCodeInput.value.trim();

if (!code) {
accessCodeMessage.textContent =
"Digite o código de acesso.";

accessCodeInput.focus();

return;

}

accessCodeBtn.disabled = true;

accessCodeMessage.textContent =
"Validando código...";

try {
/*
Aqui fazemos apenas uma consulta ao banco.

  O código NÃO é consumido neste momento.
  Ele somente precisa existir e estar disponível.
*/
const { data, error } = await supabaseClient
  .from("access_codes")
  .select("id, code, used")
  .eq("code", code)
  .eq("used", false)
  .maybeSingle();

if (error) {
  console.error("Erro ao validar código:", error);

  accessCodeMessage.textContent =
    "Não foi possível validar o código. Tente novamente.";

  accessCodeBtn.disabled = false;

  return;
}

if (!data) {
  accessCodeMessage.textContent =
    "Código inválido ou já utilizado.";

  accessCodeBtn.disabled = false;

  accessCodeInput.focus();

  return;
}

accessCode = data.code;
accessCodeValidated = true;

accessScreen.hidden = true;
app.hidden = false;

resetVoting();

footerMessage.textContent =
  "Digite o número do candidato usando o teclado.";

} catch (error) {
console.error("Erro inesperado:", error);

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

enterBtn.disabled = false;
blankBtn.disabled = false;
clearBtn.disabled = false;

if (keypad) {
const keys = keypad.querySelectorAll("button");

keys.forEach(function(key) {
  key.disabled = false;
});

}
}

/* =========================
MOSTRAR NÚMERO DIGITADO
========================= */

function updateNumberDisplay() {
if (typedNumber.length === 0) {
numberDisplay.innerHTML =
'<span class="number-placeholder">_</span>';

return;

}

numberDisplay.textContent = typedNumber;
}

/* =========================
DIGITAR NÚMERO
========================= */

function typeNumber(number) {
if (votingFinished) {
return;
}

if (typedNumber.length >= 2) {
return;
}

voteType = "candidate";

typedNumber += number;

updateNumberDisplay();

if (typedNumber.length === 1) {
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
selectedCandidate = candidates[typedNumber];

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
alert("Informe um código de acesso válido.");
return;
}

if (voteType === "none") {
alert("Digite um número ou escolha BRANCO.");
return;
}

if (voteType === "candidate" && typedNumber.length < 2) {
alert("Digite os dois números do candidato.");
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
"VOTO NULO — número " + typedNumber;

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
CONFIRMAR VOTO
========================= */

async function confirmVote() {
if (!confirmDialog.open) {
return;
}

if (!accessCodeValidated || !accessCode) {
alert("Código de acesso não validado.");
return;
}

confirmBtn.disabled = true;
cancelBtn.disabled = true;

voteStatus.textContent =
"Registrando voto...";

try {
/*
AGORA o código é consumido.

  A função do Supabase só consegue alterar
  um código que ainda esteja como used = false.
*/
const { data, error } = await supabaseClient
  .rpc("use_access_code", {
    p_code: accessCode
  });

if (error) {
  console.error("Erro ao consumir código:", error);

  voteStatus.textContent =
    "Não foi possível registrar o voto.";

  confirmBtn.disabled = false;
  cancelBtn.disabled = false;

  return;
}

/*
  Se nenhuma linha foi retornada,
  o código foi usado por outra tentativa
  ou deixou de estar disponível.
*/
if (!data || data.length === 0) {
  confirmDialog.close();

  accessCodeValidated = false;
  votingFinished = false;

  alert(
    "Este código de acesso já foi utilizado ou não está mais disponível."
  );

  app.hidden = true;
  accessScreen.hidden = false;

  accessCodeInput.value = "";
  accessCodeMessage.textContent =
    "Informe outro código de acesso.";

  accessCodeBtn.disabled = false;

  setTimeout(function() {
    accessCodeInput.focus();
  }, 100);

  return;
}

/*
  Somente aqui consideramos a votação finalizada.
*/
confirmDialog.close();

votingFinished = true;

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

const keys = keypad.querySelectorAll("button");

keys.forEach(function(key) {
  key.disabled = true;
});

} catch (error) {
console.error("Erro inesperado ao registrar voto:", error);

voteStatus.textContent =
  "Ocorreu um erro ao registrar o voto.";

confirmBtn.disabled = false;
cancelBtn.disabled = false;

}
}

/* =========================
EVENTO DO BOTÃO INICIAR
========================= */

if (startBtn) {
startBtn.addEventListener("click", startVoting);
}

/* =========================
BOTÃO VALIDAR CÓDIGO
========================= */

if (accessCodeBtn) {
accessCodeBtn.addEventListener(
"click",
validateAccessCode
);
}

/* =========================
ENTER NO CAMPO DO CÓDIGO
========================= */

if (accessCodeInput) {
accessCodeInput.addEventListener(
"keydown",
function(event) {
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
keypad.addEventListener("click", function(event) {
const button = event.target.closest("[data-number]");

if (!button || button.disabled) {
  return;
}

typeNumber(button.dataset.number);

});
}

/* =========================
BOTÃO CORRIGE
========================= */

if (clearBtn) {
clearBtn.addEventListener("click", clearNumber);
}

/* =========================
BOTÃO BRANCO
========================= */

if (blankBtn) {
blankBtn.addEventListener("click", voteBlank);
}

/* =========================
BOTÃO CONFIRMA
========================= */

if (enterBtn) {
enterBtn.addEventListener("click", openConfirmation);
}

/* =========================
CANCELAR CONFIRMAÇÃO
========================= */

if (cancelBtn) {
cancelBtn.addEventListener("click", function() {
confirmDialog.close();

confirmBtn.disabled = false;
cancelBtn.disabled = false;

});
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
restartBtn.addEventListener("click", function() {
resetVoting();

accessCode = "";
accessCodeValidated = false;

if (accessScreen) {
  accessScreen.hidden = true;
}

if (app) {
  app.hidden = true;
}

if (bootScreen) {
  bootScreen.hidden = false;
}

});
}

/* =========================
BOTÃO CONFIGURAÇÕES
========================= */

if (settingsBtn) {
settingsBtn.addEventListener("click", function() {
alert(
"Simulador de Votação\n\n" +
"Digite o número usando o teclado.\n" +
"CONFIRMA registra o voto.\n" +
"CORRIGE apaga o número.\n" +
"BRANCO permite votar em branco."
);
});
}

/* =========================
LIMPA VERSÕES ANTIGAS
DO SERVICE WORKER
E DO CACHE
========================= */

if ("serviceWorker" in navigator) {
window.addEventListener("load", function () {
navigator.serviceWorker.getRegistrations()
.then(function (registrations) {
registrations.forEach(function (registration) {
registration.unregister();
});
})
.catch(function (error) {
console.log(
"Não foi possível remover o Service Worker:",
error
);
});
});
}

if ("caches" in window) {
caches.keys()
.then(function (cacheNames) {
return Promise.all(
cacheNames.map(function (cacheName) {
return caches.delete(cacheName);
})
);
})
.catch(function (error) {
console.log(
"Não foi possível limpar o cache:",
error
);
});
}
