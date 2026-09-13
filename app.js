const candidates = {
  "13": {
    name: "Luiz Inácio Lula da Silva",
    party: "PT",
    number: "13",
    photo: "fotos/13.jpg"
  },

  "22": {
    name: "Flávio Bolsonaro",
    party: "PL",
    number: "22",
    photo: "fotos/22.jpg"
  },

  "45": {
    name: "Ronaldo Caiado",
    party: "PSD",
    number: "45",
    photo: "fotos/45.jpg"
  },

  "29": {
    name: "Rui Costa Pimenta",
    party: "PCO",
    number: "29",
    photo: "fotos/29.jpg"
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
    photo: "fotos/30.jpg"
  },

  "16": {
    name: "Hertz Dias",
    party: "PSTU",
    number: "16",
    photo: "fotos/16.jpg"
  },

  "21": {
    name: "Edmilson Costa",
    party: "PCB",
    number: "21",
    photo: "fotos/21.jpg"
  },

  "14": {
    name: "Renan Santos",
    party: "Missão",
    number: "14",
    photo: "fotos/14.jpg"
  },

  "35": {
    name: "Wilson Grassi",
    party: "Democrata",
    number: "35",
    photo: "fotos/35.jpg"
  },

  "27": {
    name: "Clariana Barão",
    party: "DC",
    number: "27",
    photo: "fotos/27.jpg"
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
   MOSTRAR FOTO DO CANDIDATO
========================= */

function showCandidatePhoto(photo, candidateNameText) {
  candidatePhoto.innerHTML = "";

  if (!photo) {
    candidatePhoto.textContent = "?";
    return;
  }

  const img = document.createElement("img");

  /*
    encodeURI permite que o caminho funcione mesmo
    quando o nome do arquivo possui espaços.
  */
  img.src = encodeURI(photo);

  img.alt = "Foto de " + candidateNameText;
  img.title = candidateNameText;

  /*
    Faz a imagem ocupar exatamente o espaço
    reservado para a fotografia.
  */
  img.style.width = "100%";
  img.style.height = "100%";
  img.style.objectFit = "cover";
  img.style.objectPosition = "center";
  img.style.display = "block";

  /*
    Se a foto não existir no GitHub,
    mostra novamente o ponto de interrogação.
  */
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

  /*
    Reativa também as teclas numéricas caso
    a votação anterior tenha sido finalizada.
  */
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

  /*
    Número não encontrado:
    caracteriza voto nulo no simulador.
  */
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

  /*
    AQUI ESTÁ A CORREÇÃO PRINCIPAL:
    em vez de mostrar "13", "22", etc.,
    o sistema agora cria uma imagem.
  */
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
