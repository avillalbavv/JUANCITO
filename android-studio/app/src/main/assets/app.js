const $ = (selector) => document.querySelector(selector);
const welcome = $("#welcome");
const lookup = $("#lookup");
const searchCard = $("#search-card");
const resultCard = $("#result");
const message = $("#message");
const matches = $("#matches");
let mode = "document";

$("#enter").addEventListener("click", () => { welcome.classList.add("hidden"); lookup.classList.remove("hidden"); });
$("#back").addEventListener("click", () => { lookup.classList.add("hidden"); welcome.classList.remove("hidden"); });

document.querySelectorAll("[data-mode]").forEach((button) => button.addEventListener("click", () => {
  mode = button.dataset.mode;
  document.querySelectorAll("[data-mode]").forEach((item) => item.classList.toggle("active", item === button));
  $("#document-label").classList.toggle("hidden", mode !== "document");
  $("#name-label").classList.toggle("hidden", mode !== "name");
  message.classList.add("hidden"); matches.classList.add("hidden");
}));

$("#document").addEventListener("input", (event) => {
  const digits = event.target.value.replace(/\D/g, "").slice(0, 9);
  event.target.value = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
});

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", "'":"&#39;", '"':"&quot;" }[character]));
}

function openResult(item) {
  searchCard.classList.add("hidden");
  resultCard.classList.remove("hidden");
  resultCard.innerHTML = `<div class="success">✓</div><p class="kicker">Registro encontrado</p><h2>${escapeHtml(item.fullName)}</h2><p class="masked">CI ${escapeHtml(item.maskedDocument)}</p><div class="place"><span>Local de votación</span><strong>${escapeHtml(item.pollingPlaceName)}</strong><small>${escapeHtml(item.district)}</small></div><div class="numbers"><div><span>Mesa</span><strong>${escapeHtml(item.table)}</strong></div><div><span>Orden</span><strong>${escapeHtml(item.orderNumber)}</strong></div></div><a class="maps" href="${escapeHtml(item.mapsUrl)}">Abrir ubicación en Google Maps ↗</a><div class="actions"><button id="again">Nueva consulta</button><button id="share">Compartir</button></div>`;
  $("#again").onclick = () => { resultCard.classList.add("hidden"); searchCard.classList.remove("hidden"); matches.classList.add("hidden"); $("#document").value=""; $("#name").value=""; };
  $("#share").onclick = () => {
    const text = `${item.fullName}\nLocal: ${item.pollingPlaceName}\nMesa ${item.table} · Orden ${item.orderNumber}`;
    if (navigator.share) navigator.share({ title:"Consulta electoral", text }).catch(() => {});
  };
  scrollTo({ top:0, behavior:"smooth" });
}

$("#form").addEventListener("submit", (event) => {
  event.preventDefault();
  const documentNumber = $("#document").value.replace(/\D/g, "");
  const fullName = $("#name").value.trim();
  if ((mode === "document" && documentNumber.length < 5) || (mode === "name" && fullName.length < 4)) {
    message.textContent = mode === "document" ? "Ingresá una cédula válida." : "Ingresá al menos 4 letras.";
    message.classList.remove("hidden"); return;
  }
  message.textContent = "Consultando…"; message.classList.remove("hidden");
  setTimeout(() => {
    let results = [];
    try { results = JSON.parse(AndroidPadron.search(mode === "document" ? documentNumber : "", mode === "name" ? fullName : "")); }
    catch { message.textContent = "No se pudo leer la base local."; return; }
    if (!results.length) { message.textContent = "No encontramos coincidencias en el padrón de Piribebuy."; matches.classList.add("hidden"); return; }
    message.classList.add("hidden");
    if (results.length === 1) { openResult(results[0]); return; }
    matches.innerHTML = `<h3>Seleccioná tu registro</h3><p>Encontramos ${results.length} coincidencias.</p>` + results.map((item,index) => `<button data-index="${index}"><span><strong>${escapeHtml(item.fullName)}</strong><small>CI ${escapeHtml(item.maskedDocument)}</small></span><b>→</b></button>`).join("");
    matches.classList.remove("hidden");
    matches.querySelectorAll("button").forEach((button) => button.onclick = () => openResult(results[Number(button.dataset.index)]));
  }, 40);
});
