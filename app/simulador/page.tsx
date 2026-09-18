"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CandidateCard } from "./components/CandidateCard";
import { ShellHeader } from "./components/ShellHeader";
import { allCandidates, candidatesByList, intendants, partyLists, type BallotOption } from "./data";
import "./simulator.css";

type Stage = "intendant" | "party" | "council" | "review" | "complete";
declare global { interface Document { modelContext?: { registerTool: (tool: { name: string; title?: string; description: string; inputSchema: object; execute: (input: unknown) => unknown | Promise<unknown>; annotations?: { readOnlyHint?: boolean; untrustedContentHint?: boolean } }, options?: { signal?: AbortSignal }) => void | Promise<void> } } }

function UtilityFooter({ stage, onBack, highContrast, onToggleContrast }: { stage: Stage; onBack: () => void; highContrast: boolean; onToggleContrast: () => void }) {
  return <footer className="machine-footer"><button type="button" className="utility-button" onClick={onToggleContrast} aria-pressed={highContrast}><span className="utility-glyph" aria-hidden="true">◐</span><span>Vista alto<br />contraste</span></button>{stage !== "intendant" && <button type="button" className="utility-button" onClick={onBack}><span className="utility-glyph" aria-hidden="true">←</span><span>Volver<br />Atrás</span></button>}<span className="footer-disclaimer">NINGUNA SELECCIÓN REAL ES REGISTRADA</span></footer>;
}

function ReviewPanel({ title, item, onModify }: { title: string; item?: BallotOption; onModify: () => void }) {
  if (!item) return null;
  return <article className={`review-panel tone-${item.color ?? "red"} ${item.featured ? "review-panel--featured" : ""}`}><h2>{title}</h2><div className="review-panel__main"><strong className="review-party">{item.party}</strong><div className="review-choice"><span className="review-portrait" aria-hidden="true">{item.image && <img src={item.image} alt="" />}</span>{!item.blank && <span className="review-list"><small>Lista</small><b>{item.list}</b></span>}</div><strong className="review-name">{item.name}</strong>{item.option && <span className="review-option">Opción <b>{item.option}</b></span>}</div><button type="button" className="modify-button" onClick={onModify}>Modificar</button></article>;
}

export default function Home() {
  const [stage, setStage] = useState<Stage>("intendant");
  const [selectedIntendant, setSelectedIntendant] = useState<string>();
  const [selectedParty, setSelectedParty] = useState<string>();
  const [selectedCouncil, setSelectedCouncil] = useState<string>();
  const [highContrast, setHighContrast] = useState(false);
  const selectedIntendantData = useMemo(() => intendants.find(item => item.id === selectedIntendant), [selectedIntendant]);
  const selectedPartyData = useMemo(() => partyLists.find(item => item.id === selectedParty), [selectedParty]);
  const selectedCouncilData = useMemo(() => allCandidates.find(item => item.id === selectedCouncil), [selectedCouncil]);
  const activeCandidates = selectedPartyData?.list ? candidatesByList[selectedPartyData.list] : [];
  const reset = useCallback(() => { setSelectedIntendant(undefined); setSelectedParty(undefined); setSelectedCouncil(undefined); setStage("intendant"); window.scrollTo({ top: 0 }); }, []);
  useEffect(() => { const context = document.modelContext; if (!context?.registerTool) return; const lifecycle = new AbortController(); void Promise.resolve(context.registerTool({ name: "reiniciar_simulacion", title: "Reiniciar simulación", description: "Borra las selecciones temporales y vuelve a la primera pantalla.", inputSchema: { type: "object", properties: {}, additionalProperties: false }, annotations: { readOnlyHint: false, untrustedContentHint: false }, execute: () => { reset(); return { estado: "reiniciada", voto_real: false }; } }, { signal: lifecycle.signal })).catch(() => undefined); return () => lifecycle.abort(); }, [reset]);
  function selectIntendant(id: string) { setSelectedIntendant(id); window.setTimeout(() => { setStage("party"); window.scrollTo({ top: 0 }); }, 90); }
  function selectParty(id: string) { setSelectedParty(id); setSelectedCouncil(undefined); window.setTimeout(() => { setStage("council"); window.scrollTo({ top: 0 }); }, 90); }
  function selectCouncil(id: string) { setSelectedCouncil(id); window.setTimeout(() => { setStage("review"); window.scrollTo({ top: 0 }); }, 90); }
  function goBack() { if (stage === "party") setStage("intendant"); if (stage === "council") setStage("party"); if (stage === "review") setStage("council"); if (stage === "complete") setStage("review"); window.scrollTo({ top: 0 }); }
  const headerTitle = stage === "intendant" ? "Candidatos a INTENDENTE MUNICIPAL" : stage === "party" ? "Listas participantes al cargo de JUNTA MUNICIPAL" : stage === "council" ? "Candidatos a JUNTA MUNICIPAL" : stage === "review" ? "Opciones seleccionadas" : "Simulación completada";
  return <div className="simulator-shell">
    <div className="simulator-site-header"><a href="/" aria-label="Volver al inicio de Juancito Zalazar">← Volver al inicio</a><strong>JUANCITO ZALAZAR <span>· Lista 1 · Opción 3</span></strong></div>
    <main className={`machine-frame ${highContrast ? "high-contrast" : ""} stage-${stage}`}>
    <ShellHeader title={headerTitle} light={stage === "council"} compact={stage === "review" || stage === "complete"} />
    {stage === "intendant" && <section className="ballot-area principal-grid" aria-label="Candidatos a Intendente Municipal">{intendants.slice(0, 2).map(item => <CandidateCard key={item.id} candidate={item} onSelect={selectIntendant} variant="principal" />)}<CandidateCard candidate={intendants[2]} onSelect={selectIntendant} variant="blank" /></section>}
    {stage === "party" && <section className="ballot-area party-grid" aria-label="Listas participantes para Junta Municipal">{partyLists.map(item => <CandidateCard key={item.id} candidate={item} onSelect={selectParty} variant="party" />)}<CandidateCard candidate={{ id: "party-blank", name: "Voto en blanco", party: "", color: "neutral" }} onSelect={() => { setSelectedParty(undefined); setSelectedCouncil("c-blank"); window.setTimeout(() => setStage("review"), 90); }} variant="blank" /></section>}
    {stage === "council" && <section className="ballot-area council-area" aria-label="Candidatos a Junta Municipal"><div className={`selected-list-header tone-${selectedPartyData?.color ?? "red"}`}><span>Lista <b>{selectedPartyData?.list}</b></span><strong>{selectedPartyData?.name}</strong><small>{selectedPartyData?.shortParty}</small></div><div className="council-grid">{activeCandidates.map(item => <CandidateCard key={item.id} candidate={item} onSelect={selectCouncil} variant="council" />)}</div></section>}
    {stage === "review" && <section className="review-layout" aria-label="Opciones seleccionadas"><ReviewPanel title="INTENDENTE MUNICIPAL" item={selectedIntendantData} onModify={() => setStage("intendant")} /><ReviewPanel title="JUNTA MUNICIPAL" item={selectedCouncilData} onModify={() => setStage(selectedParty ? "council" : "party")} /><aside className="review-actions"><button type="button" className="review-action review-action--reset" onClick={reset}><span className="review-glyph" aria-hidden="true">↻</span><span>Reiniciar<br />Selección</span></button><button type="button" className="review-action review-action--confirm" onClick={() => setStage("complete")}><span className="review-glyph" aria-hidden="true">✓</span><span>Finalizar<br />Simulación</span></button></aside></section>}
    {stage === "complete" && <section className="completion-layout" aria-label="Simulación completada"><div className="completion-check" aria-hidden="true">✓</div><h1>SIMULACIÓN COMPLETADA</h1><p>Esta demostración no registró ni transmitió un voto real.</p><div className="completion-choice">{!selectedCouncilData?.blank && <span>Lista {selectedCouncilData?.list}</span>}<strong>{selectedCouncilData?.name}</strong>{!selectedCouncilData?.blank && <b>Opción {selectedCouncilData?.option}</b>}</div><button type="button" onClick={reset}>NUEVA SIMULACIÓN</button></section>}
    {stage !== "review" && stage !== "complete" && <UtilityFooter stage={stage} onBack={goBack} highContrast={highContrast} onToggleContrast={() => setHighContrast(value => !value)} />}
    </main>
  </div>;
}
