import type { BallotOption } from "../data";

type Variant = "principal" | "party" | "council" | "blank";

export function CandidateCard({ candidate, onSelect, variant }: { candidate: BallotOption; onSelect: (id: string) => void; variant: Variant }) {
  return <button type="button" className={`ballot-card ballot-card--${variant} tone-${candidate.color ?? "neutral"} ${candidate.featured ? "ballot-card--featured" : ""}`} onClick={() => onSelect(candidate.id)} aria-label={`${candidate.name}${candidate.list ? `, lista ${candidate.list}` : ""}${candidate.option ? `, opción ${candidate.option}` : ""}`}>
    {variant === "principal" && <>
      <strong className="principal-party">{candidate.party}</strong>
      <span className="principal-center"><span className="portrait portrait--principal" aria-hidden="true">{candidate.image && <img src={candidate.image} alt="" />}</span><span className="principal-list"><small>LISTA</small><b>{candidate.list}</b><em>{candidate.shortParty}</em></span></span>
      <span className="principal-name">{candidate.name}</span>
    </>}
    {variant === "party" && <span className="party-content"><span className="party-number"><small>Lista</small><b>{candidate.list}</b></span><strong>{candidate.name}</strong><em>{candidate.shortParty}</em></span>}
    {variant === "council" && <><span className="council-top"><span className="portrait portrait--council" aria-hidden="true">{candidate.image && <img src={candidate.image} alt="" />}</span><span className="council-option"><small>Opción</small><b>{candidate.option}</b></span></span><span className="council-name">{candidate.name}</span></>}
    {variant === "blank" && <strong className="blank-label">VOTO EN BLANCO</strong>}
  </button>;
}
