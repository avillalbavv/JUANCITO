"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Result = {
  id: string;
  fullName: string;
  maskedDocument: string;
  pollingPlace: { code: string; name: string; district: string };
  table: string;
  orderNumber: string;
  mapsUrl: string;
};

type Recent = Pick<Result, "id" | "fullName" | "maskedDocument" | "table" | "orderNumber"> & {
  pollingPlaceName: string;
};

function CandidatePhoto({ name, initials, src, featured = false }: { name: string; initials: string; src: string; featured?: boolean }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className={`candidate-photo ${featured ? "candidate-photo--featured" : ""}`} aria-label={`Foto de ${name}`}>
      <span aria-hidden>{initials}</span>
      {!failed ? <img src={src} alt={name} onError={() => setFailed(true)} /> : null}
    </div>
  );
}

function FlagStripe() {
  return <div className="flag-stripe" aria-hidden />;
}

export function ElectoralApp() {
  const [screen, setScreen] = useState<"welcome" | "lookup">("welcome");
  const [mode, setMode] = useState<"document" | "name">("document");
  const [documentNumber, setDocumentNumber] = useState("");
  const [fullName, setFullName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "empty" | "error" | "success">("idle");
  const [message, setMessage] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [selected, setSelected] = useState<Result | null>(null);
  const [recent, setRecent] = useState<Recent[]>([]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        setRecent(JSON.parse(localStorage.getItem("juancito-recent") || "[]"));
      } catch {
        setRecent([]);
      }
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const formattedDocument = useMemo(
    () => documentNumber.replace(/\B(?=(\d{3})+(?!\d))/g, "."),
    [documentNumber],
  );

  function remember(result: Result) {
    const item: Recent = {
      id: result.id,
      fullName: result.fullName,
      maskedDocument: result.maskedDocument,
      pollingPlaceName: result.pollingPlace.name,
      table: result.table,
      orderNumber: result.orderNumber,
    };
    const next = [item, ...recent.filter((entry) => entry.id !== item.id)].slice(0, 3);
    setRecent(next);
    localStorage.setItem("juancito-recent", JSON.stringify(next));
  }

  function choose(result: Result) {
    setSelected(result);
    setResults([]);
    remember(result);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setMessage("");
    setSelected(null);
    setResults([]);

    if (mode === "document" && documentNumber.length < 5) {
      setMessage("Ingresá un número de cédula válido.");
      return;
    }
    if (mode === "name" && fullName.trim().length < 4) {
      setMessage("Ingresá al menos 4 letras del nombre o apellido.");
      return;
    }

    setStatus("loading");
    try {
      const response = await fetch("/api/consulta", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(mode === "document" ? { documentNumber } : { fullName }),
      });
      const payload = (await response.json()) as { results?: Result[]; message?: string };
      if (!response.ok || !payload.results?.length) {
        setStatus(response.status === 404 ? "empty" : "error");
        setMessage(payload.message || "No pudimos completar la consulta.");
        return;
      }
      if (payload.results.length === 1) choose(payload.results[0]);
      else setResults(payload.results);
      setStatus("success");
    } catch {
      setStatus("error");
      setMessage("No se pudo conectar. Revisá tu conexión e intentá nuevamente.");
    }
  }

  function resetSearch() {
    setStatus("idle");
    setSelected(null);
    setResults([]);
    setMessage("");
    setDocumentNumber("");
    setFullName("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function share(result: Result) {
    const text = `${result.fullName}\nLocal: ${result.pollingPlace.name}\nMesa ${result.table} · Orden ${result.orderNumber}`;
    if (navigator.share) {
      try { await navigator.share({ title: "Consulta electoral", text }); } catch { /* cancelado */ }
    } else {
      await navigator.clipboard?.writeText(text);
      setMessage("Información copiada.");
    }
  }

  if (screen === "welcome") {
    return (
      <main className="welcome-shell">
        <FlagStripe />
        <section className="welcome-card">
          <div className="welcome-kicker">Piribebuy · Lista 1 · Opción 3</div>
          <CandidatePhoto name="Juancito Zalazar" initials="JZ" src="/candidatos/juancito-zalazar.png" featured />
          <p className="role-pill">Candidato a concejal</p>
          <h1>Juancito<br /><strong>Zalazar</strong></h1>
          <p className="welcome-copy">Encontrá tu local de votación, mesa y número de orden de forma rápida y segura.</p>
          <button className="primary-button primary-button--large" onClick={() => setScreen("lookup")}>
            Entrar a consultas electorales <span aria-hidden>→</span>
          </button>
          <div className="running-with">
            <CandidatePhoto name="Enmanuel Gini" initials="EG" src="/candidatos/enmanuel-gini.png" />
            <div>
              <span>Con</span>
              <strong>Enmanuel Gini</strong>
              <small>Candidato a intendente · Lista 1</small>
            </div>
          </div>
        </section>
        <footer className="welcome-footer">Una herramienta informativa para la ciudadanía de Piribebuy.</footer>
      </main>
    );
  }

  return (
    <div className="app-shell">
      <header className="candidate-header">
        <FlagStripe />
        <div className="header-inner">
          <button className="back-button" onClick={() => setScreen("welcome")} aria-label="Volver al inicio">←</button>
          <div className="header-title"><span>Consulta electoral</span><strong>Piribebuy</strong></div>
          <div className="header-candidates" aria-label="Candidatos">
            <CandidatePhoto name="Enmanuel Gini" initials="EG" src="/candidatos/enmanuel-gini.png" />
            <CandidatePhoto name="Juancito Zalazar" initials="JZ" src="/candidatos/juancito-zalazar.png" />
          </div>
        </div>
        <div className="ticket-row">
          <span><b>Enmanuel Gini</b> · Intendente <em>Lista 1</em></span><i aria-hidden />
          <span><b>Juancito Zalazar</b> · Concejal <em>Opción 3</em></span>
        </div>
      </header>

      <main className="content-shell">
        {!selected ? (
          <section className="search-card">
            <div className="eyebrow">Padrón electoral de Piribebuy</div>
            <h1>¿Dónde votás?</h1>
            <p>Consultá tu local, mesa y orden en segundos.</p>
            <div className="search-tabs" role="tablist" aria-label="Tipo de búsqueda">
              <button className={mode === "document" ? "active" : ""} onClick={() => { setMode("document"); setMessage(""); }} type="button">Por cédula</button>
              <button className={mode === "name" ? "active" : ""} onClick={() => { setMode("name"); setMessage(""); }} type="button">Por nombre</button>
            </div>
            <form onSubmit={submit}>
              {mode === "document" ? (
                <label>Número de cédula
                  <div className="input-wrap"><span aria-hidden>CI</span><input inputMode="numeric" enterKeyHint="search" autoComplete="off" placeholder="1.234.567" value={formattedDocument} onChange={(event) => { setDocumentNumber(event.target.value.replace(/\D/g, "").slice(0, 9)); setMessage(""); }} /></div>
                </label>
              ) : (
                <label>Nombre y apellido
                  <div className="input-wrap"><span aria-hidden>⌕</span><input enterKeyHint="search" autoComplete="off" placeholder="Ej. María Giménez" value={fullName} onChange={(event) => { setFullName(event.target.value); setMessage(""); }} /></div>
                </label>
              )}
              {message ? <p className={`form-message ${status === "error" ? "form-message--error" : ""}`} role="status">{message}</p> : null}
              <button className="primary-button" type="submit" disabled={status === "loading"}>{status === "loading" ? "Consultando…" : "Consultar padrón"}</button>
            </form>
            {status === "empty" ? <div className="state-card"><strong>Sin coincidencias</strong><span>Revisá los datos ingresados e intentá otra vez.</span></div> : null}
            {results.length ? (
              <div className="match-list">
                <h2>Seleccioná tu registro</h2><p>Encontramos {results.length} coincidencias.</p>
                {results.map((result) => (
                  <button key={result.id} onClick={() => choose(result)}><span><strong>{result.fullName}</strong><small>CI {result.maskedDocument}</small></span><b aria-hidden>→</b></button>
                ))}
              </div>
            ) : null}
          </section>
        ) : (
          <section className="result-card">
            <FlagStripe />
            <div className="result-content">
              <div className="success-mark" aria-hidden>✓</div><div className="eyebrow">Registro encontrado</div>
              <h1>{selected.fullName}</h1><p className="masked-document">CI {selected.maskedDocument}</p>
              <div className="place-card"><span>Local de votación</span><strong>{selected.pollingPlace.name}</strong><small>{selected.pollingPlace.district}</small></div>
              <div className="numbers-grid"><div><span>Mesa</span><strong>{selected.table}</strong></div><div><span>Orden</span><strong>{selected.orderNumber}</strong></div></div>
              <a className="maps-button" href={selected.mapsUrl} target="_blank" rel="noreferrer">Abrir ubicación en Google Maps ↗</a>
              <div className="result-actions"><button onClick={resetSearch}>Nueva consulta</button><button onClick={() => share(selected)}>Compartir</button></div>
            </div>
          </section>
        )}

        <aside className="reminder-card"><span aria-hidden>!</span><p><strong>Recordatorio</strong>Llevá tu cédula de identidad y verificá tu mesa antes de salir.</p></aside>
        {recent.length && !selected ? (
          <section className="recent-card">
            <div className="recent-heading"><h2>Consultas recientes</h2><button onClick={() => { setRecent([]); localStorage.removeItem("juancito-recent"); }}>Borrar</button></div>
            {recent.map((item) => <div key={item.id}><span><strong>{item.fullName}</strong><small>{item.pollingPlaceName}</small></span><b>Mesa {item.table} · Orden {item.orderNumber}</b></div>)}
          </section>
        ) : null}
        <footer className="site-footer">Información electoral esencial · Base de Piribebuy</footer>
      </main>
    </div>
  );
}
