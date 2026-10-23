import React, { useState } from 'react';
import {
  Layout,
  MapPin,
  Clock,
  CheckCircle2,
  Circle,
  BookOpen,
  Layers,
  Sparkles,
  ArrowLeft,
  Search,
  FolderTree,
} from 'lucide-react';
import { ChallengeSubmission } from '../types';
import { ChallengeSubmissionPanel } from '../components/ChallengeSubmissionPanel';

interface FrontendChallengeScreenProps {
  completedItems: string[];
  onToggleItem: (itemKey: string) => void;
  submission?: ChallengeSubmission;
  onSaveSubmission: (challengeId: string, data: Partial<ChallengeSubmission>) => void;
  onOpenModule: (moduleId: string) => void;
  onNavigateFinalChallenge?: () => void;
}

const MOCK_ITINERARIO_DATA: Record<
  string,
  { seq: number; via: string; localidade: string; sentido: string }[]
> = {
  '0.111': [
    { seq: 1, via: 'Plataforma E - Rodoviária do Plano Piloto', localidade: 'Plano Piloto', sentido: 'I' },
    { seq: 2, via: 'Eixo Rodoviário Norte (Eixão)', localidade: 'Asa Norte', sentido: 'I' },
    { seq: 3, via: 'Via L2 Norte - Quadras 406/408', localidade: 'Asa Norte', sentido: 'I' },
    { seq: 4, via: 'Campus Universitário Darcy Ribeiro (UnB)', localidade: 'Asa Norte', sentido: 'I' },
  ],
  '0.170': [
    { seq: 1, via: 'Avenida Comercial Sul - Taguatinga', localidade: 'Taguatinga', sentido: 'I' },
    { seq: 2, via: 'Via EPTG (Estrada Parque Taguatinga)', localidade: 'Guará / Águas Claras', sentido: 'I' },
    { seq: 3, via: 'Eixo Monumental - Rodoviária do Plano Piloto', localidade: 'Plano Piloto', sentido: 'I' },
  ],
};

const MOCK_HORARIOS_DATA: Record<
  string,
  { hr: string; sentido: string; operadora: string; dias: string }[]
> = {
  '0.111': [
    { hr: '06:15', sentido: 'IDA', operadora: 'Piracicabana', dias: 'Seg a Sex' },
    { hr: '07:30', sentido: 'IDA', operadora: 'Piracicabana', dias: 'Seg a Sáb' },
    { hr: '12:15', sentido: 'VOLTA', operadora: 'Piracicabana', dias: 'Seg a Sex' },
    { hr: '18:15', sentido: 'VOLTA', operadora: 'Piracicabana', dias: 'Seg a Sex' },
  ],
  '0.170': [
    { hr: '05:45', sentido: 'IDA', operadora: 'Marechal', dias: 'Todos os dias' },
    { hr: '06:30', sentido: 'IDA', operadora: 'Marechal', dias: 'Seg a Sex' },
    { hr: '17:30', sentido: 'VOLTA', operadora: 'Marechal', dias: 'Seg a Sex' },
  ],
};

const SCL_CHALLENGE_STATIONS = [
  {
    key: 'scl-st-1',
    order: '1ª Estação',
    file: 'src/config/modules.ts',
    title: 'Registar os 2 Submódulos dentro do Módulo SCL',
    desc: 'Dentro do objeto do módulo "scl" em src/config/modules.ts, adicione os submódulos "consultar-itinerario" (/scl/consultar-itinerario) e "consultar-horarios" (/scl/consultar-horarios).',
  },
  {
    key: 'scl-st-2',
    order: '2ª Estação',
    file: 'src/modulos/SCL/SCLMenu.tsx & src/App.tsx',
    title: 'Adicionar os 2 Novos Cards no SCLMenu.tsx e Mapear as Rotas no App.tsx',
    desc: 'Adicione os cartões "Consultar Itinerário" e "Consultar Tabela Horária" ao lado de ConsultaOS e RelatorioLinha no SCLMenu.tsx, e declare as duas rotas protegidas no src/App.tsx.',
  },
  {
    key: 'scl-st-3',
    order: '3ª Estação',
    file: 'src/modulos/SCL/ConsultarItinerario/ (types, services, hooks, components)',
    title: 'Construir as 4 Subpastas de Base da Tela ConsultarItinerario',
    desc: 'Seguindo o modelo de RelatorioLinha, crie types/index.ts, services/itinerarioService.ts (consumindo GET /linhas/:codigo/itinerario), hooks/useItinerarioData.ts e components/ (FormSearch, ViasList, Loading, ErrorMessage).',
  },
  {
    key: 'scl-st-4',
    order: '4ª Estação',
    file: 'src/modulos/SCL/ConsultarItinerario/ConsultarItinerario.tsx',
    title: 'Criar o Ficheiro .tsx Compilador de ConsultarItinerario',
    desc: 'Na raiz da subpasta ConsultarItinerario/, crie o ficheiro final ConsultarItinerario.tsx que importa o hook e compila/orquestra os componentes visuais.',
  },
  {
    key: 'scl-st-5',
    order: '5ª Estação',
    file: 'src/modulos/SCL/ConsultarHorarios/ (5 Camadas + Compilador .tsx)',
    title: 'Construir a Subpasta Completa de ConsultarHorarios consumindo a 2ª API',
    desc: 'Crie types/, services/horarioService.ts (consumindo GET /linhas/:codigo/horarios), hooks/useHorariosData.ts, components/ (FormSearch, QuadroHorariosTable) e o compilador final ConsultarHorarios.tsx.',
  },
];

export const FrontendChallengeScreen: React.FC<FrontendChallengeScreenProps> = ({
  completedItems,
  onToggleItem,
  submission,
  onSaveSubmission,
  onOpenModule,
  onNavigateFinalChallenge,
}) => {
  const [activeSclView, setActiveSclView] = useState<'menu' | 'itinerario' | 'horarios'>('menu');
  const [codigoBusca, setCodigoBusca] = useState('0.111');

  const currentVias = MOCK_ITINERARIO_DATA[codigoBusca] || [];
  const currentHorarios = MOCK_HORARIOS_DATA[codigoBusca] || [];

  return (
    <div className="screen-container">
      {/* Hero Banner */}
      <section className="hero-banner">
        <div className="hero-content">
          <span className="hero-badge">
            <Layout size={14} /> Etapa 3 da Jornada Prática • Engenharia Front-end (Módulo SCL)
          </span>
          <h1>Criando "Consultar Itinerário" e "Consultar Horários" no Módulo SCL</h1>
          <p>
            No desafio de Back-end você criou as rotas <code>GET /api/linhas/:codigo/itinerario</code> e{' '}
            <code>GET /api/linhas/:codigo/horarios</code>. Agora, no <strong>BoilerPlate_Front_end</strong>, você
            vai entrar no módulo <strong>SCL (`src/modulos/SCL/`)</strong> e criar essas duas novas telas tomando{' '}
            <code>RelatorioLinha</code> como modelo!
          </p>
          <div className="hero-actions">
            <button className="btn-secondary" onClick={() => onOpenModule('mod-5-frontend')}>
              <BookOpen size={16} /> Revisar as 7 Estações no Manual de Front-end
            </button>
            {onNavigateFinalChallenge && (
              <button className="btn-primary" onClick={onNavigateFinalChallenge}>
                🚀 Ver Próxima Etapa: Desafio Final InfoÔnibus
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Simulador Interativo do Módulo SCL no BoilerPlate_Front_end */}
      <section className="section-card">
        <div className="section-header-row">
          <div>
            <h2>
              <Sparkles size={20} style={{ display: 'inline', marginRight: '0.5rem' }} />
              Protótipo Interativo: Como o seu Módulo SCL deve ficar
            </h2>
            <p className="text-muted">
              Clique nos 2 novos cartões abaixo (destacados em azul/verde) para simular a navegação do{' '}
              <code>SCLMenu.tsx</code> para as duas novas telas consumindo as APIs da porta 8097:
            </p>
          </div>
        </div>

        <div
          className="browser-mockup"
          style={{
            marginTop: '1.25rem',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '1px solid rgba(148, 163, 184, 0.25)',
          }}
        >
          {/* Barra Superior do Browser Simulado */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1.25rem',
              background: 'rgba(15, 23, 42, 0.9)',
              borderBottom: '1px solid rgba(148, 163, 184, 0.2)',
            }}
          >
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#ef4444' }} />
              <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#f59e0b' }} />
              <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#10b981' }} />
            </div>
            <div
              style={{
                flex: 1,
                background: 'rgba(30, 41, 59, 0.9)',
                padding: '0.3rem 0.85rem',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontFamily: 'monospace',
                color: '#38bdf8',
              }}
            >
              http://localhost:5173
              {activeSclView === 'menu'
                ? '/scl (SCLMenu.tsx)'
                : activeSclView === 'itinerario'
                ? '/scl/consultar-itinerario (ConsultarItinerario.tsx)'
                : '/scl/consultar-horarios (ConsultarHorarios.tsx)'}
            </div>
          </div>

          {/* Conteúdo do Simulador SCL */}
          <div style={{ padding: '1.5rem' }}>
            {activeSclView === 'menu' && (
              <div>
                <div style={{ marginBottom: '1rem' }}>
                  <span className="status-pill passed" style={{ fontSize: '0.72rem' }}>
                    src/modulos/SCL/SCLMenu.tsx
                  </span>
                  <h3 style={{ fontSize: '1.25rem', marginTop: '0.35rem' }}>
                    SCL — Sistema de Controle de Linhas
                  </h3>
                  <p className="text-muted" style={{ fontSize: '0.85rem' }}>
                    Os 2 primeiros cartões já existem no BoilerPlate_Front_end. Clique nos 2 novos cartões abaixo para ver o que você vai construir:
                  </p>
                </div>

                <div className="cards-grid two-cols">
                  <div className="glass-card" style={{ opacity: 0.65, padding: '1.1rem' }}>
                    <span className="status-pill pending" style={{ fontSize: '0.7rem' }}>
                      Já existente em src/modulos/SCL/ConsultaOS/
                    </span>
                    <h4 style={{ marginTop: '0.4rem' }}>📄 Consulta de OS</h4>
                    <p className="text-muted" style={{ fontSize: '0.8rem' }}>
                      Ordens de serviço operacionais da frota.
                    </p>
                  </div>

                  <div className="glass-card" style={{ opacity: 0.65, padding: '1.1rem' }}>
                    <span className="status-pill pending" style={{ fontSize: '0.7rem' }}>
                      Já existente em src/modulos/SCL/RelatorioLinha/ (Seu Modelo!)
                    </span>
                    <h4 style={{ marginTop: '0.4rem' }}>📊 Relatório de Linhas</h4>
                    <p className="text-muted" style={{ fontSize: '0.8rem' }}>
                      Catálogo geral de linhas, estatísticas e exportação CSV.
                    </p>
                  </div>

                  {/* Card Novo 1: Consultar Itinerário */}
                  <div
                    onClick={() => setActiveSclView('itinerario')}
                    className="glass-card"
                    style={{
                      cursor: 'pointer',
                      border: '2px solid #38bdf8',
                      padding: '1.2rem',
                    }}
                  >
                    <span className="status-pill passed" style={{ fontSize: '0.72rem' }}>
                      ✨ NOVA TELA 1 • Clique para testar!
                    </span>
                    <h4 style={{ marginTop: '0.45rem', color: '#38bdf8', fontSize: '1.05rem' }}>
                      🗺️ Consultar Itinerário da Linha
                    </h4>
                    <p className="text-muted" style={{ fontSize: '0.82rem', marginTop: '0.25rem' }}>
                      Consome <code>GET /api/linhas/:codigo/itinerario</code> e lista a sequência de vias.
                    </p>
                  </div>

                  {/* Card Novo 2: Consultar Tabela Horária */}
                  <div
                    onClick={() => setActiveSclView('horarios')}
                    className="glass-card"
                    style={{
                      cursor: 'pointer',
                      border: '2px solid #10b981',
                      padding: '1.2rem',
                    }}
                  >
                    <span className="status-pill passed" style={{ fontSize: '0.72rem' }}>
                      ✨ NOVA TELA 2 • Clique para testar!
                    </span>
                    <h4 style={{ marginTop: '0.45rem', color: '#10b981', fontSize: '1.05rem' }}>
                      🕒 Consultar Tabela Horária
                    </h4>
                    <p className="text-muted" style={{ fontSize: '0.82rem', marginTop: '0.25rem' }}>
                      Consome <code>GET /api/linhas/:codigo/horarios</code> e exibe partidas e dias da semana.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeSclView !== 'menu' && (
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '0.75rem',
                    marginBottom: '1.25rem',
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: '1.2rem' }}>
                      {activeSclView === 'itinerario'
                        ? '🗺️ SCL • Consultar Itinerário Descritivo'
                        : '🕒 SCL • Consultar Tabela Horária da Linha'}
                    </h3>
                    <p className="text-muted" style={{ fontSize: '0.82rem', fontFamily: 'monospace' }}>
                      Consumindo: GET http://localhost:8097/api/linhas/{codigoBusca}/
                      {activeSclView}
                    </p>
                  </div>

                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setActiveSclView('menu')}
                  >
                    <ArrowLeft size={15} /> Voltar ao SCLMenu.tsx
                  </button>
                </div>

                {/* Simulação do componente FormSearch.tsx */}
                <div
                  className="glass-card"
                  style={{
                    padding: '0.9rem 1.1rem',
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    flexWrap: 'wrap',
                  }}
                >
                  <Search size={16} color="#38bdf8" />
                  <span style={{ fontSize: '0.84rem', fontWeight: 600 }}>
                    Selecione uma linha de teste (FormSearch.tsx):
                  </span>
                  {(['0.111', '0.170'] as const).map((cod) => (
                    <button
                      key={cod}
                      type="button"
                      onClick={() => setCodigoBusca(cod)}
                      className={`sql-filter-btn ${codigoBusca === cod ? 'active' : ''}`}
                    >
                      Linha {cod}
                    </button>
                  ))}
                </div>

                {/* Resultado da Tela 1: Itinerário */}
                {activeSclView === 'itinerario' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {currentVias.map((item) => (
                      <div
                        key={item.seq}
                        className="glass-card"
                        style={{
                          padding: '0.85rem 1.1rem',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <span className="status-pill passed">{item.seq}º</span>
                          <div>
                            <strong style={{ fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: 5 }}>
                              <MapPin size={14} color="#38bdf8" /> {item.via}
                            </strong>
                            <span className="text-muted" style={{ fontSize: '0.78rem' }}>
                              Localidade: {item.localidade}
                            </span>
                          </div>
                        </div>
                        <span className="status-pill pending">Sentido: {item.sentido}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Resultado da Tela 2: Horários */}
                {activeSclView === 'horarios' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {currentHorarios.map((h, i) => (
                      <div
                        key={i}
                        className="glass-card"
                        style={{
                          padding: '0.85rem 1.1rem',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <span className="status-pill passed" style={{ fontFamily: 'monospace', fontWeight: 700 }}>
                            <Clock size={13} style={{ display: 'inline', marginRight: 4 }} />
                            {h.hr}
                          </span>
                          <strong>Operadora: {h.operadora}</strong>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <span className="status-pill pending">{h.sentido}</span>
                          <span className="status-pill passed">{h.dias}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Mapa da Estrutura de Ficheiros que o Aluno Deve Criar no SCL */}
      <section className="section-card">
        <h2>
          <FolderTree size={20} style={{ display: 'inline', marginRight: '0.5rem' }} />
          Árvore de Ficheiros Esperada dentro do seu BoilerPlate_Front_end
        </h2>
        <pre className="code-block" style={{ marginTop: '0.85rem' }}>
          <code>{`src/
 ├── config/
 │    └── modules.ts                     ← 1. Registar os 2 novos submódulos dentro de 'scl'
 ├── App.tsx                             ← 2. Registar as rotas /scl/consultar-itinerario e /scl/consultar-horarios
 └── modulos/
      └── SCL/
           ├── SCLMenu.tsx               ← 3. Adicionar os 2 novos Cards no menu do SCL
           ├── RelatorioLinha/           ← (Use esta pasta existente como modelo!)
           ├── ConsultarItinerario/      ← 4. CRIAR SUBMÓDULO 1:
           │    ├── types/               (typesItinerario.ts + index.ts)
           │    ├── services/            (itinerarioService.ts -> GET /linhas/:codigo/itinerario)
           │    ├── hooks/               (useItinerarioData.ts)
           │    ├── components/          (FormSearch.tsx, ViasList.tsx, Loading.tsx, ErrorMessage.tsx)
           │    └── ConsultarItinerario.tsx  ← (Ficheiro final que compila os hooks e components!)
           │
           └── ConsultarHorarios/        ← 5. CRIAR SUBMÓDULO 2:
                ├── types/               (typesHorarios.ts + index.ts)
                ├── services/            (horariosService.ts -> GET /linhas/:codigo/horarios)
                ├── hooks/               (useHorariosData.ts)
                ├── components/          (FormSearch.tsx, HorariosTable.tsx, Loading.tsx, ErrorMessage.tsx)
                └── ConsultarHorarios.tsx    ← (Ficheiro final que compila os hooks e components!)`}</code>
        </pre>
      </section>

      {/* Checklist Guiado das 5 Estações */}
      <section className="section-card">
        <h2>
          <Layers size={20} style={{ display: 'inline', marginRight: '0.5rem' }} />
          Roteiro das Estações de Implementação no SCL
        </h2>
        <div className="checklist-box" style={{ marginTop: '1rem' }}>
          {SCL_CHALLENGE_STATIONS.map((step) => {
            const done = completedItems.includes(step.key);
            return (
              <div
                key={step.key}
                onClick={() => onToggleItem(step.key)}
                className={`checklist-item ${done ? 'completed' : ''}`}
                style={{ cursor: 'pointer', alignItems: 'flex-start' }}
              >
                <div style={{ marginTop: '0.15rem' }}>
                  {done ? <CheckCircle2 size={20} color="#10b981" /> : <Circle size={20} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span className="status-pill passed" style={{ fontSize: '0.72rem' }}>
                      {step.order}
                    </span>
                    <strong>{step.title}</strong>
                    <code style={{ fontSize: '0.78rem', opacity: 0.8 }}>{step.file}</code>
                  </div>
                  <p className="text-muted" style={{ fontSize: '0.85rem', marginTop: '0.3rem' }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Submissão do Desafio Front-end (Módulo SCL) */}
      <ChallengeSubmissionPanel
        challengeId="challenge-frontend-ui"
        title="Entrega das 2 Novas Telas no Módulo SCL (BoilerPlate_Front_end)"
        subtitle="Confirme se seguiu o fluxo completo desde src/config/modules.ts até os ficheiros .tsx compiladores e envie o link do repositório."
        requireRepoUrl={true}
        existingSubmission={submission}
        onSaveSubmission={onSaveSubmission}
        prChecklist={[
          'Registei os submódulos consultar-itinerario e consultar-horarios em src/config/modules.ts, no SCLMenu.tsx e no src/App.tsx?',
          'Isolei as chamadas para GET /linhas/:codigo/itinerario e GET /linhas/:codigo/horarios nas pastas services/ usando o api global?',
          'Separei estados e buscas em micro-hooks dentro de hooks/ e dividi a interface em micro-componentes dentro de components/?',
          'Os ficheiros finais ConsultarItinerario.tsx e ConsultarHorarios.tsx atuam apenas como compiladores/orquestradores limpos e sem "any"?',
        ]}
      />
    </div>
  );
};
