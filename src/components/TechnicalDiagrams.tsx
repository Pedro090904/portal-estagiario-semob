import React from 'react';

interface TechnicalDiagramProps {
  type:
    | 'git-4-zones'
    | 'git-tags-pipeline'
    | 'sql-where-join'
    | 'sql-pg-vs-oracle'
    | 'backend-request-lifecycle'
    | 'frontend-unidirectional-flow';
}

export const TechnicalDiagram: React.FC<TechnicalDiagramProps> = ({ type }) => {
  if (type === 'git-4-zones') {
    return (
      <div className="glass-card" style={{ padding: '1.5rem', margin: '1.5rem 0', textAlign: 'center', overflowX: 'auto' }}>
        <div style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem', opacity: 0.8 }}>
          Diagrama: O Fluxo de Dados entre as 4 Camadas do Git
        </div>
        <svg viewBox="0 0 900 300" style={{ width: '100%', maxWidth: '880px', height: 'auto', margin: '0 auto', display: 'block' }}>
          <rect x="20" y="30" width="190" height="230" rx="8" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
          <text x="115" y="65" fill="#38bdf8" fontWeight="bold" fontSize="13" textAnchor="middle">1. WORKING DIRECTORY</text>
          <text x="115" y="85" fill="#94a3b8" fontSize="11" textAnchor="middle">(Seus ficheiros reais na IDE)</text>

          <rect x="250" y="30" width="190" height="230" rx="8" fill="#1e293b" stroke="#818cf8" strokeWidth="2" />
          <text x="345" y="65" fill="#818cf8" fontWeight="bold" fontSize="13" textAnchor="middle">2. STAGING AREA</text>
          <text x="345" y="85" fill="#94a3b8" fontSize="11" textAnchor="middle">(O "palco" de preparação)</text>

          <rect x="480" y="30" width="190" height="230" rx="8" fill="#1e293b" stroke="#10b981" strokeWidth="2" />
          <text x="575" y="65" fill="#10b981" fontWeight="bold" fontSize="13" textAnchor="middle">3. REPOSITÓRIO LOCAL</text>
          <text x="575" y="85" fill="#94a3b8" fontSize="11" textAnchor="middle">(Histórico definitivo .git)</text>

          <rect x="710" y="30" width="170" height="230" rx="8" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
          <text x="795" y="65" fill="#f59e0b" fontWeight="bold" fontSize="13" textAnchor="middle">4. REPOSITÓRIO REMOTO</text>
          <text x="795" y="85" fill="#94a3b8" fontSize="11" textAnchor="middle">(GitHub / GitLab na Nuvem)</text>

          <path d="M 210 125 L 250 125" stroke="#38bdf8" strokeWidth="2.5" />
          <text x="230" y="115" fill="#38bdf8" fontFamily="monospace" fontSize="11" textAnchor="middle">git add</text>

          <path d="M 440 125 L 480 125" stroke="#818cf8" strokeWidth="2.5" />
          <text x="460" y="115" fill="#818cf8" fontFamily="monospace" fontSize="11" textAnchor="middle">git commit</text>

          <path d="M 670 125 L 710 125" stroke="#10b981" strokeWidth="2.5" />
          <text x="690" y="115" fill="#10b981" fontFamily="monospace" fontSize="11" textAnchor="middle">git push</text>

          <path d="M 710 180 L 480 180" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4" />
          <text x="595" y="170" fill="#f59e0b" fontFamily="monospace" fontSize="11" textAnchor="middle">git fetch / git pull</text>

          <path d="M 480 225 L 210 225" stroke="#ef4444" strokeWidth="2" strokeDasharray="4" />
          <text x="345" y="215" fill="#ef4444" fontFamily="monospace" fontSize="11" textAnchor="middle">git checkout / git restore</text>
        </svg>
      </div>
    );
  }

  if (type === 'git-tags-pipeline') {
    return (
      <div className="glass-card" style={{ padding: '1.5rem', margin: '1.5rem 0', textAlign: 'center', overflowX: 'auto' }}>
        <div style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem', opacity: 0.8 }}>
          Diagrama: Estratégia de Branches e Tags por Ambiente (Dev ➔ Homolog ➔ Prod)
        </div>
        <svg viewBox="0 0 950 280" style={{ width: '100%', maxWidth: '880px', height: 'auto', margin: '0 auto', display: 'block' }}>
          <line x1="120" y1="60" x2="880" y2="60" stroke="#ef4444" strokeWidth="4" />
          <text x="15" y="65" fill="#ef4444" fontWeight="bold" fontSize="12">PROD (main)</text>

          <line x1="120" y1="140" x2="880" y2="140" stroke="#f59e0b" strokeWidth="3" strokeDasharray="6" />
          <text x="15" y="145" fill="#f59e0b" fontWeight="bold" fontSize="12">HOMOLOG (staging)</text>

          <line x1="120" y1="220" x2="880" y2="220" stroke="#38bdf8" strokeWidth="2" />
          <text x="15" y="225" fill="#38bdf8" fontWeight="bold" fontSize="12">DEV (develop/feat)</text>

          <circle cx="180" cy="220" r="7" fill="#38bdf8" />
          <circle cx="270" cy="220" r="7" fill="#38bdf8" />
          <circle cx="360" cy="220" r="7" fill="#38bdf8" />

          <path d="M 360 220 L 460 140" stroke="#818cf8" strokeWidth="2" strokeDasharray="3" />
          <circle cx="460" cy="140" r="8" fill="#f59e0b" />
          <rect x="420" y="105" width="80" height="22" rx="4" fill="#f59e0b" />
          <text x="460" y="120" fill="#090d16" fontFamily="monospace" fontWeight="bold" fontSize="10" textAnchor="middle">v1.2.0-rc.1</text>

          <path d="M 460 140 L 600 60" stroke="#10b981" strokeWidth="2" />
          <circle cx="600" cy="60" r="9" fill="#ef4444" />
          <rect x="565" y="18" width="70" height="24" rx="4" fill="#10b981" />
          <text x="600" y="34" fill="#ffffff" fontFamily="monospace" fontWeight="bold" fontSize="11" textAnchor="middle">v1.2.0</text>

          <circle cx="750" cy="60" r="8" fill="#ef4444" />
          <rect x="715" y="18" width="70" height="24" rx="4" fill="#ef4444" />
          <text x="750" y="34" fill="#ffffff" fontFamily="monospace" fontWeight="bold" fontSize="11" textAnchor="middle">v1.2.1</text>
        </svg>
      </div>
    );
  }

  if (type === 'sql-where-join') {
    return (
      <div className="glass-card" style={{ padding: '1.5rem', margin: '1.5rem 0', textAlign: 'center', overflowX: 'auto' }}>
        <div style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem', opacity: 0.8 }}>
          Diagrama: Junção Relacional Explícita por Cláusula WHERE
        </div>
        <svg viewBox="0 0 860 200" style={{ width: '100%', maxWidth: '820px', height: 'auto', margin: '0 auto', display: 'block' }}>
          <rect x="30" y="25" width="240" height="150" rx="8" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
          <text x="150" y="55" fill="#38bdf8" fontWeight="bold" fontSize="14" textAnchor="middle">tab_linha (l)</text>
          <line x1="30" y1="70" x2="270" y2="70" stroke="#374151" strokeWidth="1" />
          <text x="50" y="100" fill="#f3f4f6" fontFamily="monospace" fontSize="12">PK: id_linha = 42</text>
          <text x="50" y="125" fill="#9ca3af" fontFamily="monospace" fontSize="12">cd_linha = '0.111'</text>
          <text x="50" y="150" fill="#9ca3af" fontFamily="monospace" fontSize="12">vl_tarifa = 5.50</text>

          <rect x="590" y="25" width="240" height="150" rx="8" fill="#1e293b" stroke="#818cf8" strokeWidth="2" />
          <text x="710" y="55" fill="#818cf8" fontWeight="bold" fontSize="14" textAnchor="middle">tab_itinerario (i)</text>
          <line x1="590" y1="70" x2="830" y2="70" stroke="#374151" strokeWidth="1" />
          <text x="610" y="100" fill="#f3f4f6" fontFamily="monospace" fontSize="12">PK: id_itinerario = 980</text>
          <text x="610" y="125" fill="#38bdf8" fontFamily="monospace" fontWeight="bold" fontSize="12">FK: id_linha = 42</text>
          <text x="610" y="150" fill="#9ca3af" fontFamily="monospace" fontSize="12">lin_extensao = 45.20</text>

          <path d="M 270 95 L 590 120" stroke="#10b981" strokeWidth="3" strokeDasharray="6" />
          <circle cx="270" cy="95" r="5" fill="#10b981" />
          <circle cx="590" cy="120" r="5" fill="#10b981" />

          <rect x="330" y="75" width="200" height="50" rx="6" fill="#111827" stroke="#10b981" strokeWidth="1.5" />
          <text x="430" y="97" fill="#10b981" fontWeight="bold" fontSize="11" textAnchor="middle">VÍNCULO NO WHERE</text>
          <text x="430" y="115" fill="#e2e8f0" fontFamily="monospace" fontSize="10" textAnchor="middle">l.id_linha = i.id_linha</text>
        </svg>
      </div>
    );
  }

  if (type === 'sql-pg-vs-oracle') {
    return (
      <div className="glass-card" style={{ padding: '1.5rem', margin: '1.5rem 0', textAlign: 'center', overflowX: 'auto' }}>
        <div style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem', opacity: 0.8 }}>
          Contraste Arquitetural: PostgreSQL (dados_mobilidade) vs. Oracle (DFTRANS)
        </div>
        <svg viewBox="0 0 920 290" style={{ width: '100%', maxWidth: '880px', height: 'auto', margin: '0 auto', display: 'block' }}>
          <rect x="20" y="20" width="410" height="250" rx="10" fill="#111827" stroke="#38bdf8" strokeWidth="1.5" />
          <text x="225" y="45" fill="#38bdf8" fontWeight="bold" fontSize="12" textAnchor="middle">POSTGRESQL (dados_mobilidade) — OPERACIONAL</text>
          <rect x="45" y="70" width="160" height="45" rx="6" fill="#1e293b" stroke="#38bdf8" />
          <text x="125" y="98" fill="#f3f4f6" fontFamily="monospace" fontSize="11" textAnchor="middle">tab_linha</text>
          <path d="M 205 92 L 245 92" stroke="#38bdf8" strokeWidth="2" />
          <rect x="245" y="70" width="165" height="45" rx="6" fill="#1e293b" stroke="#38bdf8" />
          <text x="327" y="93" fill="#f3f4f6" fontFamily="monospace" fontSize="10" textAnchor="middle">tab_operadora_linha</text>
          <path d="M 327 115 L 327 160" stroke="#38bdf8" strokeWidth="2" />
          <rect x="245" y="160" width="165" height="45" rx="6" fill="#1e293b" stroke="#38bdf8" />
          <text x="327" y="188" fill="#f3f4f6" fontFamily="monospace" fontSize="11" textAnchor="middle">tab_operadora</text>
          <path d="M 125 115 L 125 205" stroke="#38bdf8" strokeWidth="2" />
          <rect x="45" y="205" width="160" height="45" rx="6" fill="#1e293b" stroke="#38bdf8" />
          <text x="125" y="233" fill="#f3f4f6" fontFamily="monospace" fontSize="11" textAnchor="middle">tab_itinerario</text>

          <rect x="480" y="20" width="420" height="250" rx="10" fill="#111827" stroke="#f59e0b" strokeWidth="1.5" />
          <text x="690" y="45" fill="#f59e0b" fontWeight="bold" fontSize="12" textAnchor="middle">ORACLE (DFTRANS) — REGULATÓRIO NORMALIZADO</text>
          <rect x="500" y="70" width="110" height="45" rx="6" fill="#1e293b" stroke="#f59e0b" />
          <text x="555" y="97" fill="#f3f4f6" fontFamily="monospace" fontSize="10" textAnchor="middle">LINHAS</text>
          <path d="M 610 92 L 635 92" stroke="#f59e0b" strokeWidth="2" />
          <rect x="635" y="70" width="125" height="45" rx="6" fill="#1e293b" stroke="#f59e0b" />
          <text x="697" y="97" fill="#f3f4f6" fontFamily="monospace" fontSize="9" textAnchor="middle">LINHAS_ESPEC_TEC</text>
          <path d="M 760 92 L 785 92" stroke="#f59e0b" strokeWidth="2" />
          <rect x="785" y="70" width="105" height="45" rx="6" fill="#1e293b" stroke="#f59e0b" />
          <text x="837" y="97" fill="#f3f4f6" fontFamily="monospace" fontSize="10" textAnchor="middle">ITINERARIOS</text>
          <path d="M 697 115 L 697 150" stroke="#f59e0b" strokeWidth="2" />
          <rect x="635" y="150" width="125" height="45" rx="6" fill="#1e293b" stroke="#f59e0b" />
          <text x="697" y="177" fill="#f3f4f6" fontFamily="monospace" fontSize="9" textAnchor="middle">LINHAS_ESPEC_OP</text>
          <path d="M 697 195 L 697 220" stroke="#f59e0b" strokeWidth="2" />
          <rect x="635" y="220" width="125" height="40" rx="6" fill="#1e293b" stroke="#f59e0b" />
          <text x="697" y="245" fill="#f3f4f6" fontFamily="monospace" fontSize="9" textAnchor="middle">VW_OPERADORA</text>
        </svg>
      </div>
    );
  }

  if (type === 'backend-request-lifecycle') {
    return (
      <div className="glass-card" style={{ padding: '1.5rem', margin: '1.5rem 0', textAlign: 'center', overflowX: 'auto' }}>
        <div style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem', opacity: 0.8 }}>
          Diagrama: Ciclo de Vida da Requisição HTTP no Backend (Clean Architecture / NestJS / Express)
        </div>
        <svg viewBox="0 0 920 180" style={{ width: '100%', maxWidth: '880px', height: 'auto', margin: '0 auto', display: 'block' }}>
          <rect x="20" y="45" width="140" height="90" rx="8" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
          <text x="90" y="85" fill="#38bdf8" fontWeight="bold" fontSize="12" textAnchor="middle">1. CLIENTE HTTP</text>
          <text x="90" y="105" fill="#94a3b8" fontSize="10" textAnchor="middle">Browser / Postman</text>

          <path d="M 160 90 L 205 90" stroke="#38bdf8" strokeWidth="2" />
          <polygon points="205,86 215,90 205,94" fill="#38bdf8" />

          <rect x="215" y="45" width="145" height="90" rx="8" fill="#1e293b" stroke="#818cf8" strokeWidth="2" />
          <text x="287" y="80" fill="#818cf8" fontWeight="bold" fontSize="12" textAnchor="middle">2. CONTROLLER</text>
          <text x="287" y="100" fill="#94a3b8" fontSize="10" textAnchor="middle">Rotas & DTOs</text>
          <text x="287" y="115" fill="#94a3b8" fontSize="9" textAnchor="middle">Validação Class-Validator</text>

          <path d="M 360 90 L 405 90" stroke="#818cf8" strokeWidth="2" />
          <polygon points="405,86 415,90 405,94" fill="#818cf8" />

          <rect x="415" y="45" width="145" height="90" rx="8" fill="#1e293b" stroke="#10b981" strokeWidth="2" />
          <text x="487" y="80" fill="#10b981" fontWeight="bold" fontSize="12" textAnchor="middle">3. SERVICE</text>
          <text x="487" y="100" fill="#94a3b8" fontSize="10" textAnchor="middle">Regras de Negócio</text>
          <text x="487" y="115" fill="#94a3b8" fontSize="9" textAnchor="middle">Cálculos & Políticas</text>

          <path d="M 560 90 L 605 90" stroke="#10b981" strokeWidth="2" />
          <polygon points="605,86 615,90 605,94" fill="#10b981" />

          <rect x="615" y="45" width="145" height="90" rx="8" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
          <text x="687" y="80" fill="#f59e0b" fontWeight="bold" fontSize="12" textAnchor="middle">4. REPOSITORY</text>
          <text x="687" y="100" fill="#94a3b8" fontSize="10" textAnchor="middle">Prisma / TypeORM</text>
          <text x="687" y="115" fill="#94a3b8" fontSize="9" textAnchor="middle">Queries com WHERE</text>

          <path d="M 760 90 L 805 90" stroke="#f59e0b" strokeWidth="2" />
          <polygon points="805,86 815,90 805,94" fill="#f59e0b" />

          <rect x="815" y="45" width="90" height="90" rx="8" fill="#1e293b" stroke="#ec4899" strokeWidth="2" />
          <text x="860" y="85" fill="#ec4899" fontWeight="bold" fontSize="12" textAnchor="middle">5. BANCO</text>
          <text x="860" y="105" fill="#94a3b8" fontSize="10" textAnchor="middle">PostgreSQL</text>
        </svg>
      </div>
    );
  }

  if (type === 'frontend-unidirectional-flow') {
    return (
      <div className="glass-card" style={{ padding: '1.5rem', margin: '1.5rem 0', textAlign: 'center', overflowX: 'auto' }}>
        <div style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem', opacity: 0.8 }}>
          Diagrama: Fluxo Unidirecional de Dados no React (State ➔ UI ➔ Action ➔ Reducer/State)
        </div>
        <svg viewBox="0 0 860 220" style={{ width: '100%', maxWidth: '820px', height: 'auto', margin: '0 auto', display: 'block' }}>
          <rect x="40" y="60" width="180" height="100" rx="8" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
          <text x="130" y="100" fill="#38bdf8" fontWeight="bold" fontSize="13" textAnchor="middle">ESTADO (State)</text>
          <text x="130" y="125" fill="#94a3b8" fontSize="11" textAnchor="middle">useState / Context / TanStack</text>

          <path d="M 220 110 L 320 110" stroke="#38bdf8" strokeWidth="2.5" />
          <polygon points="320,105 330,110 320,115" fill="#38bdf8" />
          <text x="275" y="98" fill="#38bdf8" fontSize="10" textAnchor="middle">Renderiza</text>

          <rect x="330" y="60" width="180" height="100" rx="8" fill="#1e293b" stroke="#10b981" strokeWidth="2" />
          <text x="420" y="100" fill="#10b981" fontWeight="bold" fontSize="13" textAnchor="middle">VIEW (UI / JSX)</text>
          <text x="420" y="125" fill="#94a3b8" fontSize="11" textAnchor="middle">Componentes & DOM</text>

          <path d="M 510 110 L 610 110" stroke="#10b981" strokeWidth="2.5" />
          <polygon points="610,105 620,110 610,115" fill="#10b981" />
          <text x="565" y="98" fill="#10b981" fontSize="10" textAnchor="middle">Dispara Evento</text>

          <rect x="620" y="60" width="200" height="100" rx="8" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
          <text x="720" y="100" fill="#f59e0b" fontWeight="bold" fontSize="13" textAnchor="middle">AÇÃO / HANDLER</text>
          <text x="720" y="125" fill="#94a3b8" fontSize="11" textAnchor="middle">onClick ➔ setState / API</text>

          <path d="M 720 160 L 720 195 L 130 195 L 130 160" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4" fill="none" />
          <polygon points="126,165 130,155 134,165" fill="#f59e0b" />
          <text x="425" y="190" fill="#f59e0b" fontSize="10" textAnchor="middle">Atualização Imutável do Estado</text>
        </svg>
      </div>
    );
  }

  return null;
};
