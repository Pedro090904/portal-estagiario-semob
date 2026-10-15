import React, { useState, useMemo } from 'react';
import {
  Layout,
  Search,
  Bus,
  Clock,
  MapPin,
  CheckCircle2,
  Circle,
  BookOpen,
  Layers,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { ChallengeSubmissionPanel } from '../components/ChallengeSubmissionPanel';

interface FrontendChallengeScreenProps {
  completedItems: string[];
  onToggleItem: (itemKey: string) => void;
  onOpenModule: (moduleId: string) => void;
}

interface MockBusLine {
  cd_linha: string;
  nm_linha: string;
  vl_tarifa: number;
  sentido: 'IDA' | 'VOLTA' | 'CIRCULAR';
  operadora: string;
  itinerario: string[];
  horarios: string[];
}

const INFO_ONIBUS_MOCK_LINES: MockBusLine[] = [
  {
    cd_linha: '0.110',
    nm_linha: 'Rodoviária do Plano Piloto / UnB',
    vl_tarifa: 2.7,
    sentido: 'CIRCULAR',
    operadora: 'Piracicabana',
    itinerario: ['Plataforma E - Rodoviária', 'Eixo Norte', 'L2 Norte (406/408)', 'Campus UnB - ICC'],
    horarios: ['06:15', '06:45', '07:15', '07:45', '08:15', '12:00', '18:10'],
  },
  {
    cd_linha: '0.152',
    nm_linha: 'Taguatinga Sul / Esplanada dos Ministérios',
    vl_tarifa: 5.5,
    sentido: 'IDA',
    operadora: 'Marechal',
    itinerario: ['Pistão Sul', 'EPIG', 'Parque da Cidade', 'Eixo Monumental', 'Esplanada'],
    horarios: ['05:40', '06:10', '06:30', '07:00', '07:30'],
  },
  {
    cd_linha: '2204',
    nm_linha: 'Gama (Terminal BRT) / Rodoviária do Plano Piloto',
    vl_tarifa: 5.5,
    sentido: 'IDA',
    operadora: 'Pioneira',
    itinerario: ['Terminal Gama', 'Corredor Exclusivo BRT Sul', 'Terminal Park Way', 'Rodoviária'],
    horarios: ['05:00', '05:15', '05:30', '05:45', '06:00', '06:15'],
  },
  {
    cd_linha: '0.812',
    nm_linha: 'W3 Norte / Sudoeste / Cruzeiro',
    vl_tarifa: 3.8,
    sentido: 'VOLTA',
    operadora: 'Urbi',
    itinerario: ['W3 Norte (516)', 'Setor Hospitalar Norte', 'Sudoeste (QMSW 5)', 'Cruzeiro Novo'],
    horarios: ['16:30', '17:00', '17:30', '18:00', '18:40'],
  },
];

const FRONTEND_STEPS = [
  {
    key: 'front-step-1',
    order: '1º Ficheiro',
    file: 'src/types/linha.ts',
    title: 'Tipagem das Entidades e Filtros',
    desc: 'Crie a interface Linha e os tipos de filtro (SentidoFiltro = "TODOS" | "IDA" | "VOLTA" | "CIRCULAR") sem usar any.',
  },
  {
    key: 'front-step-2',
    order: '2º Ficheiro',
    file: 'src/services/linhasApi.ts',
    title: 'Camada de Comunicação HTTP (Service)',
    desc: 'Isole o fetch/axios que consome a sua API Backend (GET /linhas e GET /linhas/:cd_linha).',
  },
  {
    key: 'front-step-3',
    order: '3º Ficheiro',
    file: 'src/hooks/useLinhas.ts',
    title: 'Custom Hook de Estado (Loading, Error, Data)',
    desc: 'Gerencie os estados de carregamento, erro de rede, filtro por texto/sentido e linha selecionada.',
  },
  {
    key: 'front-step-4',
    order: '4º Ficheiro',
    file: 'src/components/LinhaCard.tsx & LinhaDetalheModal.tsx',
    title: 'Componentização Visual Desacoplada',
    desc: 'Construa os cartões de linha e o painel de horários/itinerário recebendo dados via props tipadas.',
  },
];

export const FrontendChallengeScreen: React.FC<FrontendChallengeScreenProps> = ({
  completedItems,
  onToggleItem,
  onOpenModule,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sentidoFilter, setSentidoFilter] = useState<'TODOS' | 'IDA' | 'VOLTA' | 'CIRCULAR'>('TODOS');
  const [selectedLine, setSelectedLine] = useState<MockBusLine>(INFO_ONIBUS_MOCK_LINES[0]);

  const filteredLines = useMemo(() => {
    return INFO_ONIBUS_MOCK_LINES.filter((line) => {
      const matchesSentido = sentidoFilter === 'TODOS' || line.sentido === sentidoFilter;
      const matchesSearch =
        line.cd_linha.toLowerCase().includes(searchQuery.toLowerCase()) ||
        line.nm_linha.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSentido && matchesSearch;
    });
  }, [searchQuery, sentidoFilter]);

  return (
    <div className="screen-container">
      {/* Hero Banner */}
      <section className="hero-banner">
        <div className="hero-content">
          <span className="hero-badge">
            <Layout size={14} /> Desafio Prático • Engenharia Frontend
          </span>
          <h1>Projeto InfoÔnibus — Protótipo Interativo & Arquitetura React</h1>
          <p>
            Interaja abaixo com o modelo vivo do <strong>InfoÔnibus — DF</strong> para entender o
            comportamento exato que a sua aplicação React + TypeScript deve entregar ao consumir a API Backend.
          </p>
          <div className="hero-actions">
            <button className="btn-secondary" onClick={() => onOpenModule('mod-5-frontend')}>
              <BookOpen size={16} /> Revisar Módulo de Arquitetura Frontend na Plataforma
            </button>
          </div>
        </div>
      </section>

      {/* Protótipo Interativo InfoÔnibus (Browser Mockup Original) */}
      <section className="section-card">
        <div className="section-header-row">
          <div>
            <h2>
              <Sparkles size={20} style={{ display: 'inline', marginRight: '0.5rem' }} />
              Guia Visual Interativo: Como o seu "InfoÔnibus" deve funcionar
            </h2>
            <p className="text-muted">
              Experimente digitar na busca, alternar os sentidos e clicar numa linha para ver o painel de itinerário e horários.
            </p>
          </div>
        </div>

        <div className="browser-mockup" style={{ marginTop: '1.25rem', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(148, 163, 184, 0.25)' }}>
          {/* Barra do Navegador Simulado */}
          <div
            className="browser-header"
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
                color: '#94a3b8',
              }}
            >
              http://localhost:5173/info-onibus-df
            </div>
          </div>

          {/* Corpo do Simulador InfoÔnibus */}
          <div style={{ padding: '1.5rem' }}>
            {/* Filtros de Busca e Sentido */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: '1 1 260px' }}>
                <Search size={18} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por número (ex: 0.110) ou destino (ex: UnB)..."
                  className="sql-editor-textarea"
                  style={{ minHeight: '40px', height: '40px', padding: '0.45rem 0.85rem' }}
                />
              </div>

              <div className="sql-filter-buttons">
                {(['TODOS', 'IDA', 'VOLTA', 'CIRCULAR'] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSentidoFilter(s)}
                    className={`sql-filter-btn ${sentidoFilter === s ? 'active' : ''}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid Mestre-Detalhe do InfoÔnibus */}
            <div className="cards-grid two-cols">
              {/* Coluna Esquerda: Lista de Cartões de Ônibus */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {filteredLines.length === 0 ? (
                  <div className="glass-card" style={{ textAlign: 'center', padding: '2rem' }}>
                    <p className="text-muted">Nenhuma linha encontrada para o filtro informado (Empty State).</p>
                  </div>
                ) : (
                  filteredLines.map((line) => {
                    const isSelected = selectedLine?.cd_linha === line.cd_linha;
                    return (
                      <div
                        key={line.cd_linha}
                        onClick={() => setSelectedLine(line)}
                        className="glass-card io-bus-card"
                        style={{
                          cursor: 'pointer',
                          border: isSelected ? '2px solid #0ea5e9' : undefined,
                          padding: '1rem',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span className="status-pill passed" style={{ fontWeight: 800 }}>
                            <Bus size={14} style={{ display: 'inline', marginRight: 4 }} />
                            Linha {line.cd_linha}
                          </span>
                          <span className="status-pill pending" style={{ fontSize: '0.72rem' }}>
                            {line.sentido} • R$ {Number(line.vl_tarifa).toFixed(2)}
                          </span>
                        </div>
                        <h4 style={{ marginTop: '0.5rem', fontSize: '0.98rem' }}>{line.nm_linha}</h4>
                        <p className="text-muted" style={{ fontSize: '0.78rem', marginTop: '0.25rem' }}>
                          Operadora: {line.operadora}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Coluna Direita: Painel de Detalhes da Linha Selecionada */}
              {selectedLine && (
                <div className="glass-card" style={{ padding: '1.25rem' }}>
                  <div style={{ borderBottom: '1px solid rgba(148,163,184,0.2)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
                    <span className="text-muted" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>
                      Detalhes da Linha Selecionada
                    </span>
                    <h3 style={{ fontSize: '1.2rem', marginTop: '0.2rem' }}>
                      {selectedLine.cd_linha} — {selectedLine.nm_linha}
                    </h3>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <strong style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                      <MapPin size={15} /> Principais Pontos do Itinerário:
                    </strong>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignItems: 'center' }}>
                      {selectedLine.itinerario.map((ponto, idx) => (
                        <React.Fragment key={ponto}>
                          <span className="status-pill pending" style={{ fontSize: '0.75rem' }}>
                            {ponto}
                          </span>
                          {idx < selectedLine.itinerario.length - 1 && <ArrowRight size={13} />}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  <div>
                    <strong style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                      <Clock size={15} /> Próximas Partidas Programadas:
                    </strong>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {selectedLine.horarios.map((h) => (
                        <span key={h} className="status-pill passed" style={{ fontFamily: 'monospace' }}>
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Roteiro de Arquitetura de Pastas Frontend */}
      <section className="section-card">
        <h2>
          <Layers size={20} style={{ display: 'inline', marginRight: '0.5rem' }} />
          Sequência Guiada de Ficheiros do Frontend
        </h2>
        <div className="checklist-box" style={{ marginTop: '1rem' }}>
          {FRONTEND_STEPS.map((step) => {
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

      {/* Painel Padronizado de Revisão de PR e Submissão */}
      <ChallengeSubmissionPanel
        challengeId="challenge-frontend-ui"
        title="Entrega do Repositório & Checklist do Projeto InfoÔnibus"
        subtitle="Confirme se a sua interface trata todos os estados de UI e cole o link do repositório Git."
        requireRepoUrl={true}
        prChecklist={[
          'Separei a chamada HTTP num serviço dedicado (services/api.ts) fora do JSX dos componentes?',
          'Tratei os 4 estados obrigatórios de UI: Loading, Erro de Rede, Lista Vazia (Empty State) e Sucesso?',
          'O filtro por texto (código/nome) e por sentido (TODOS, IDA, VOLTA) funciona sem recarregar a página?',
          'O projeto compila sem nenhum erro de TypeScript e sem uso de "any"?',
        ]}
      />
    </div>
  );
};
export default FrontendChallengeScreen;
