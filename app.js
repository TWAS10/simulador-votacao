const DEFAULTS=[
{office:"DEPUTADO FEDERAL",number:"1234",name:"Candidato Exemplo",party:"Partido Demonstração"},
{office:"DEPUTADO FEDERAL",number:"5678",name:"Candidata Exemplo",party:"Partido Demonstração"},
{office:"DEPUTADO ESTADUAL",number:"12345",name:"Candidato Estadual",party:"Partido Demonstração"},
{office:"DEPUTADO ESTADUAL",number:"67890",name:"Candidata Estadual",party:"Partido Demonstração"}];
const KEY="simulador-v4-candidatos";
let data=load(),stage="DEPUTADO FEDERAL",input="",done=false;
const $=s=>document.querySelector(s);
function load(){try{return JSON.parse(localStorage.getItem(KEY))||structuredClone(DEFAULTS)}catch{return structuredClone(DEFAULTS)}}
function save(){localStorage.setItem(KEY,JSON.stringify(data))}
function toast(t){const x=$("#toast");x.textContent=t;x.classList.add("show");clearTimeout(window.tt);window.tt=setTimeout(()=>x.classList.remove("show"),1900)}
function render(){
  $("#digits").textContent=input||"";
  const c=data.find(x=>x.office===stage&&x.number===input);
  $("#candidate").classList.toggle("hidden",!c);
  if(c){$("#avatar").textContent=c.name.split(/\s+/).map(x=>x[0]).slice(0,2).join("").toUpperCase();$("#name").textContent=c.name;$("#party").textContent=c.party;$("#num").textContent="Nº "+c.number;$("#message").textContent="Confira os dados e pressione CONFIRMA."}
  else $("#message").textContent=input?"Número não cadastrado nesta demonstração.":"Digite o número para consultar.";
}
function resetVote(){stage="DEPUTADO FEDERAL";input="";done=false;$("#office").textContent=stage;$("#step").innerHTML="01 <i>/ 02</i>";$("#heroScreen").innerHTML="<small>SIMULAÇÃO DE VOTO</small><strong>PRIMEIRO,</strong><b>DEPUTADO<br>FEDERAL</b>";$("#confirm").disabled=false;$("#blank").disabled=false;render()}
function next(){
  input="";
  if(stage==="DEPUTADO FEDERAL"){stage="DEPUTADO ESTADUAL";$("#office").textContent=stage;$("#step").innerHTML="02 <i>/ 02</i>";$("#heroScreen").innerHTML="<small>SIMULAÇÃO DE VOTO</small><strong>AGORA,</strong><b>DEPUTADO<br>ESTADUAL</b>";render();return}
  done=true;$("#office").textContent="SIMULAÇÃO CONCLUÍDA";$("#step").textContent="✓";$("#heroScreen").innerHTML="<small>SIMULAÇÃO</small><strong>FLUXO</strong><b>CONCLUÍDO!</b>";$("#message").textContent="Nenhum voto real foi registrado.";$("#candidate").classList.add("hidden");$("#confirm").disabled=true;$("#blank").disabled=true;$("#digits").textContent="";toast("Simulação concluída.")}
function renderKeys(){const k=$("#keypad");k.innerHTML="";["1","2","3","4","5","6","7","8","9","0"].forEach(n=>{const b=document.createElement("button");b.className="key";b.textContent=n;b.type="button";b.setAttribute("aria-label","Número "+n);b.onclick=()=>{if(!done&&input.length<5){input+=n;render()}};k.appendChild(b)})}
$("#enter").onclick=()=>{$("#boot").hidden=true;$("#app").hidden=false;window.scrollTo({top:0,behavior:"smooth"})};
$("#correct").onclick=()=>{if(!done){input="";render()}};
$("#blank").onclick=()=>{if(!done){toast("Voto em branco na simulação.");setTimeout(next,550)}};
$("#confirm").onclick=()=>{if(done)return;const c=data.find(x=>x.office===stage&&x.number===input);if(!c){toast("Digite um número válido.");return}toast("Voto confirmado na simulação.");setTimeout(next,650)};
$("#restart").onclick=()=>{resetVote();toast("Simulação reiniciada.")};
$("#settings").onclick=()=>{
 const e=$("#editor");e.innerHTML="";
 data.forEach((c,i)=>{const r=document.createElement("div");r.className="row";["office","number","name","party"].forEach(k=>{const x=document.createElement("input");x.value=c[k];x.dataset.i=i;x.dataset.k=k;x.setAttribute("aria-label",k);r.appendChild(x)});e.appendChild(r)});
 $("#admin").showModal()
};
$("#close").onclick=()=>$("#admin").close();
$("#resetData").onclick=()=>{data=structuredClone(DEFAULTS);save();$("#admin").close();resetVote();toast("Exemplos restaurados.")};
$("#save").onclick=()=>{document.querySelectorAll("#editor input").forEach(x=>data[+x.dataset.i][x.dataset.k]=x.value.trim());save();$("#admin").close();resetVote();toast("Alterações salvas no dispositivo.")};
window.addEventListener("online",()=>toast("Conexão disponível. O app continua funcionando offline."));
window.addEventListener("offline",()=>toast("Modo offline ativo."));
if("serviceWorker" in navigator) window.addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>{}));
renderKeys();render();