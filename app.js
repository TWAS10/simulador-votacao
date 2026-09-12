const candidates = {
  "13": {
    name: "Candidato 13",
    party: "Partido da Esperança",
    number: "13",
    photo: "13"
  },

  "22": {
    name: "Candidato 22",
    party: "Partido da Mudança",
    number: "22",
    photo: "22"
  },

  "45": {
    name: "Candidato 45",
    party: "Partido do Futuro",
    number: "45",
    photo: "45"
  }
};


/* =========================
   ESTADO DA VOTAÇÃO
========================= */

let typedNumber = "";
let selectedCandidate = null;
let votingFinished = false;
let voteType = "none";


/* =========================
   ELEMENTOS DO HTML
========================= */

const bootScreen = document.getElementById("bootScreen");
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
   INICIAR VOTAÇÃO
========================= */

function startVoting() {
  bootScreen.hidden = true;
  app.hidden = false;

  resetVoting();

  footerMessage.textContent =
    "Digite o número do candidato usando o teclado.";
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

  candidatePhoto.textContent =
    "?";

  voteStatus.textContent =
    "Nenhum número digitado";

  footerMessage.textContent =
    "Digite o número usando o teclado.";

  enterBtn.disabled = false;
  blankBtn.disabled = false;
  clearBtn.disabled = false;
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

  candidatePhoto.textContent =
    selectedCandidate.photo;

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

function confirmVote() {
  if (!confirmDialog.open) {
    return;
  }

  confirmDialog.close();

  votingFinished = true;

  stageMessage.textContent =
    "VOTO CONFIRMADO";

  candidateName.textContent =
    "FIM";

  candidateNumber.textContent =
    "✓";

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
}


/* =========================
   EVENTO DO BOTÃO INICIAR
========================= */

if (startBtn) {
  startBtn.addEventListener("click", startVoting);
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
  });
}


/* =========================
   CONFIRMAR DENTRO DA JANELA
========================= */

if (confirmBtn) {
  confirmBtn.addEventListener("click", confirmVote);
}


/* =========================
   BOTÃO REINICIAR
========================= */

if (restartBtn) {
  restartBtn.addEventListener("click", function() {
    resetVoting();

    app.hidden = true;
    bootScreen.hidden = false;
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
