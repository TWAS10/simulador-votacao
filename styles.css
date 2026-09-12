* {
  box-sizing: border-box;
}

:root {
  --blue: #123c68;
  --dark-blue: #09243f;
  --screen: #dce5d5;
  --green: #168447;
  --red: #d83232;
  --yellow: #f0b323;
  --text: #17202a;
}

body {
  margin: 0;
  min-height: 100vh;
  font-family: Arial, Helvetica, sans-serif;
  color: white;
  background:
    radial-gradient(circle at top, #315b7f, #0b1c2d 70%);
}

button {
  font: inherit;
  cursor: pointer;
}

button:focus-visible {
  outline: 4px solid #ffd54a;
  outline-offset: 3px;
}

/* TELA INICIAL */

.boot-screen {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
}

.boot-card {
  width: min(100%, 480px);
  padding: 36px 28px;
  text-align: center;
  background: linear-gradient(145deg, #1d527f, #09243f);
  border: 3px solid #527da2;
  border-radius: 22px;
  box-shadow: 0 20px 60px #0008;
}

.originalIcon {
  display: block;
  width: 180px;
  height: 120px;
  object-fit: contain;
  margin: 0 auto 18px;
}

.boot-card h1 {
  margin: 0 0 12px;
  font-size: clamp(25px, 5vw, 38px);
}

.boot-card p {
  color: #d5e4f1;
  margin-bottom: 28px;
}

/* BOTÕES */

.primary-btn,
.small-btn,
.action-btn,
.restart-btn {
  border: 0;
  font-weight: bold;
  transition: transform 0.15s, filter 0.15s;
}

.primary-btn:hover,
.small-btn:hover,
.action-btn:hover,
.restart-btn:hover {
  filter: brightness(1.12);
  transform: translateY(-2px);
}

.primary-btn {
  padding: 16px 28px;
  border-radius: 10px;
  color: white;
  background: var(--green);
  box-shadow: 0 5px 0 #07552b;
}

/* APLICAÇÃO */

.app {
  min-height: 100vh;
  padding: 18px;
}

.topbar {
  width: min(1100px, 100%);
  margin: 0 auto 22px;
  padding: 15px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  background: #071a2dcc;
  border: 1px solid #6e91ae;
  border-radius: 12px;
}

.topbar strong {
  display: block;
  font-size: clamp(16px, 3vw, 24px);
  letter-spacing: 1px;
}

.topbar span {
  display: block;
  margin-top: 4px;
  color: #b8d0e4;
  font-size: 13px;
}

.small-btn {
  width: 42px;
  height: 42px;
  border-radius: 8px;
  color: white;
  background: #315b7f;
}

/* ÁREA PRINCIPAL */

.voting-area {
  width: min(1100px, 100%);
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(300px, 0.85fr);
  gap: 28px;
  align-items: center;
}

/* URNA */

.urn-container {
  display: flex;
  justify-content: center;
}

.urn {
  width: min(100%, 560px);
  padding: 18px;
  border-radius: 24px 24px 30px 30px;
  background:
    linear-gradient(135deg, #315d82, #123957 45%, #09243f);
  border: 5px solid #6e91ae;
  box-shadow:
    inset 0 0 0 4px #071a2d,
    0 25px 45px #0008;
}

.urn-top {
  padding: 12px;
  text-align: center;
  color: #dceafa;
  font-size: 13px;
  font-weight: bold;
  letter-spacing: 2px;
}

.urn-screen-frame {
  padding: 14px;
  border-radius: 12px;
  background: #07131f;
  border: 3px solid #7894a9;
}

.urn-screen {
  min-height: 340px;
  overflow: hidden;
  color: var(--text);
  background: var(--screen);
  border: 5px solid #9ba99b;
  box-shadow: inset 0 0 25px #0003;
}

.screen-header {
  padding: 12px;
  text-align: center;
  color: white;
  background: #233b50;
  font-weight: bold;
  letter-spacing: 2px;
}

.screen-content {
  padding: 22px;
}

.stage-message {
  min-height: 48px;
  margin: 0 0 18px;
  font-size: 19px;
  font-weight: bold;
}

.candidate-info {
  display: flex;
  align-items: center;
  gap: 18px;
  min-height: 125px;
  padding: 15px;
  border: 2px solid #9ba99b;
  background: #edf2e9;
}

.candidate-photo {
  width: 82px;
  height: 100px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  color: white;
  background: #526b7d;
  border: 3px solid #344a5b;
  font-size: 36px;
  font-weight: bold;
}

.candidate-details {
  display: grid;
  gap: 7px;
  color: var(--text);
}

.label {
  font-size: 11px;
  font-weight: bold;
  color: #52606b;
}

.candidate-details strong {
  font-size: 19px;
}

.vote-status {
  margin-top: 18px;
  padding: 12px;
  color: #253a28;
  background: #c5d5bd;
  border: 1px solid #8ca184;
  font-size: 14px;
}

/* PARTE INFERIOR DA URNA */

.urn-bottom {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 18px 8px 4px;
  color: #c5d9e9;
  font-size: 12px;
  font-weight: bold;
  letter-spacing: 1px;
}

.urn-light {
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: #35d879;
  box-shadow: 0 0 14px #35d879;
}

/* PAINEL DE TECLADO */

.interaction {
  padding: 22px;
  border-radius: 18px;
  background: linear-gradient(145deg, #d5dbe0, #8997a2);
  border: 4px solid #566b7a;
  box-shadow: 0 18px 35px #0007;
}

.number-display {
  margin-bottom: 18px;
  color: #17202a;
  font-size: 12px;
  font-weight: bold;
  text-align: center;
}

.number-box {
  min-height: 64px;
  margin-top: 8px;
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #17202a;
  background: #edf2f4;
  border: 3px inset #71818d;
  font-size: 34px;
  letter-spacing: 8px;
}

.number-placeholder {
  color: #71818d;
}

/* TECLADO */

.keypad {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.key {
  min-height: 62px;
  border: 0;
  border-radius: 8px;
  color: white;
  background: linear-gradient(#344b5b, #172b3a);
  box-shadow: 0 5px 0 #07131f;
  font-size: 25px;
  font-weight: bold;
}

.key:active {
  transform: translateY(4px);
  box-shadow: 0 1px 0 #07131f;
}

.key-zero {
  grid-column: 2;
}

/* BOTÕES DE AÇÃO */

.action-buttons {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
  margin-top: 18px;
}

.action-btn {
  min-height: 48px;
  padding: 12px;
  border-radius: 7px;
  color: white;
  box-shadow: 0 4px 0 #0005;
}

.blank-btn {
  background: #777f86;
}

.clear-btn {
  background: var(--red);
}

.confirm-btn {
  background: var(--green);
}

/* RODAPÉ */

.footer {
  width: min(1100px, 100%);
  margin: 22px auto 0;
  padding: 15px 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
  color: #d5e4f1;
  background: #071a2dcc;
  border: 1px solid #6e91ae;
  border-radius: 12px;
}

.restart-btn {
  padding: 10px 16px;
  border-radius: 7px;
  color: white;
  background: #315b7f;
}

/* JANELA */

.confirm-dialog {
  width: min(90%, 440px);
  padding: 0;
  border: 0;
  border-radius: 18px;
  color: #17202a;
  box-shadow: 0 20px 70px #000b;
}

.confirm-dialog::backdrop {
  background: #0009;
}

.dialog-content {
  padding: 28px;
}

.dialog-content h2 {
  margin-top: 0;
}

.dialog-candidate {
  margin: 20px 0;
  padding: 18px;
  background: #e5ecef;
  border-radius: 10px;
  font-weight: bold;
}

.dialog-actions {
  display: flex;
  gap: 12px;
}

.dialog-actions .action-btn {
  flex: 1;
}

/* CELULAR */

@media (max-width: 800px) {
  .voting-area {
    grid-template-columns: 1fr;
  }

  .urn {
    width: min(100%, 560px);
  }

  .interaction {
    width: min(100%, 560px);
    margin: 0 auto;
  }
}

@media (max-width: 480px) {
  .app {
    padding: 10px;
  }

  .urn {
    padding: 9px;
    border-width: 3px;
  }

  .urn-screen {
    min-height: 300px;
  }

  .screen-content {
    padding: 14px;
  }

  .candidate-info {
    gap: 10px;
    padding: 10px;
  }

  .candidate-photo {
    width: 62px;
    height: 80px;
  }

  .candidate-details strong {
    font-size: 16px;
  }

  .interaction {
    padding: 14px;
  }

  .key {
    min-height: 55px;
  }

  .footer {
    font-size: 13px;
  }
}
