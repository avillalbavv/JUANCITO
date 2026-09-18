export function ShellHeader({ title, light = false, compact = false }: { title: string; light?: boolean; compact?: boolean }) {
  return <header className={`machine-header ${light ? "is-light" : ""} ${compact ? "is-compact" : ""}`}>
    <div className="machine-brand" aria-label="Simulador municipal Piribebuy"><span className="machine-brand__mark">JZ</span><span><strong>SIMULACIÓN</strong><small>MUNICIPAL · PIRIBEBUY</small></span></div>
    <div className="election-meta"><span>Elección: ELECCIONES MUNICIPALES</span><span>Departamento: 3-CORDILLERA</span><span>Distrito: 27-PIRIBEBUY</span><strong className="simulation-note">SIMULADOR DEMOSTRATIVO — NO ES UN SISTEMA OFICIAL DE VOTACIÓN</strong></div>
    <div className="campaign-seal" aria-label="Juancito Zalazar, Lista 1, Opción 3"><strong>JZ</strong><span>1/3</span></div>
    <div className="screen-title"><span>{title}</span></div>
  </header>;
}
