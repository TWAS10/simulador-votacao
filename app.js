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

let typedNumber = "";
let selectedCandidate = null;
let votingFinished = false;

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


function startVoting() {
  bootScreen.hidden = true;
  app.hidden = false;

  resetVoting();

  footerMessage.textContent =
    "Digite o número do candidato usando o teclado.";
}


function resetVoting() {
  typedNumber = "";
  selectedCandidate = null;
  votingFinished = false;

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


function updateNumberDisplay() {
  if (typedNumber.length === 0) {
    numberDisplay.innerHTML =
      '<span class="number-placeholder">_</span>';

    return;
  }

  numberDisplay.textContent = typedNumber;
}


function typeNumber(number) {
  if (votingFinished) {
    return;
  }

  if (typedNumber.length >= 2) {
    return;
  }

  typedNumber += number;

  updateNumberDisplay();

  if (typedNumber.length === 2) {
    showCandidate();
  } else {
    stageMessage.textContent =
      "Digite o segundo número";

    voteStatus.textContent =
      "Número incompleto";
  }
}


function showCandidate() {
  selectedCandidate = candidates[typedNumber];

  if (!selectedCandidate) {
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


function clearNumber() {
  if (votingFinished) {
    return;
  }

  typedNumber = "";
  selectedCandidate = null;

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


function voteBlank() {
  if (votingFinished) {
    return;
  }

  typedNumber = "";
  selectedCandidate = null;

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


function openConfirmation() {
  if (votingFinished) {
    return;
  }

  if (typedNumber.length === 0) {
    alert("Digite um número ou escolha BRANCO.");
    return;
  }

  if (typedNumber.length < 2) {
    alert("Digite os dois números do candidato.");
    return;
  }

  if (selectedCandidate) {
    dialogCandidate.textContent =
      selectedCandidate.name +
      " — número " +
      selectedCandidate.number;
  } else {
    dialogCandidate.textContent =
      "VOTO NULO — número " +
      typedNumber;
  }

  confirmDialog.showModal();
}


function confirmVote() {
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
}


startBtn.addEventListener("click", startVoting);

keypad.addEventListener("click", function(event) {
  const button = event.target.closest("[data-number]");

  if (!button) {
    return;
  }

  typeNumber(button.dataset.number);
});

clearBtn.addEventListener("click", clearNumber);

blankBtn.addEventListener("click", voteBlank);

enterBtn.addEventListener("click", openConfirmation);

cancelBtn.addEventListener("click", function() {
  confirmDialog.close();
});

confirmBtn.addEventListener("click", confirmVote);

restartBtn.addEventListener("click", function() {
  resetVoting();
});

settingsBtn.addEventListener("click", function() {
  alert(
    "Simulador de Votação\n\n" +
    "Use o teclado para digitar o número.\n" +
    "CONFIRMA registra o voto.\n" +
    "CORRIGE apaga o número."
  );
});
