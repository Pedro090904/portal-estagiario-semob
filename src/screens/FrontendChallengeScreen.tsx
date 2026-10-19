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
  Map,
  Compass,
  Radio,
  Navigation,
  Globe2,
  Cpu,
} from 'lucide-react';
import { ChallengeSubmissionPanel } from '../components/ChallengeSubmissionPanel';
import { ChallengeSubmission } from '../types';

interface FrontendChallengeScreenProps {
  completedItems: string[];
  onToggleItem: (itemKey: string) => void;
  onOpenModule: (moduleId: string) => void;
  submission?: ChallengeSubmission;
  onSaveSubmission: (challengeId: string, data: Partial<ChallengeSubmission>) => void;
}

interface MockBusLine {
  cd_linha: string;
  nm_linha: string;
  vl_tarifa: number;
  sentido: 'IDA' | 'VOLTA' | 'CIRCULAR';
  operadora: string;
  corLinha: string;
  itinerario: { nome: string; x: number; y: number }[];
  pathD: string;
  horarios: string[];
  gpsStatus: string;
  velocidadeMedia: string;
  prefixoAtivo: string;
}

const INFO_ONIBUS_MOCK_LINES: MockBusLine[] = [
  {
    cd_linha: '0.110',
    nm_linha: 'Rodoviária do Plano Piloto / Campus UnB (Asa Norte)',
    vl_tarifa: 2.7,
    sentido: 'CIRCULAR',
    operadora: 'Piracicabana',
    corLinha: '#0ea5e9',
    pathD: 'M 360,250 C 370,210 390,170 410,130 C 440,110 470,120 480,150 C 485,180 440,220 390,240 Z',
    itinerario: [
      { nome: 'Plataforma E - Rodoviária', x: 360, y: 250 },
      { nome: 'Eixo Norte (Altura 106)', x: 410, y: 170 },
      { nome: 'L2 Norte (406/408)', x: 460, y: 130 },
      { nome: 'Campus UnB - ICC Norte', x: 480, y: 160 },
      { nome: 'Retorno Rodoviária', x: 360, y: 250 },
    ],
    horarios: ['06:15', '06:45', '07:15', '07:45', '08:15', '12:00', '18:10'],
    gpsStatus: 'Operando no Horário • Pontual',
    velocidadeMedia: '38 km/h',
    prefixoAtivo: '112.450',
  },
  {
    cd_linha: '0.152',
    nm_linha: 'Taguatinga Sul / Eixo Monumental / Esplanada',
    vl_tarifa: 5.5,
    sentido: 'IDA',
    operadora: 'Marechal',
    corLinha: '#10b981',
    pathD: 'M 110,340 C 160,320 220,290 280,270 C 320,260 360,250 420,250 C 470,250 510,245 540,245',
    itinerario: [
      { nome: 'Terminal Taguatinga Sul', x: 110, y: 340 },
      { nome: 'Corredor EPTG / EPIG', x: 230, y: 285 },
      { nome: 'Parque da Cidade', x: 310, y: 265 },
      { nome: 'Torre de TV / Rodoviária', x: 370, y: 250 },
      { nome: 'Esplanada dos Ministérios', x: 540, y: 245 },
    ],
    horarios: ['05:40', '06:10', '06:30', '07:00', '07:30', '17:15', '18:00'],
    gpsStatus: 'Tráfego Moderado na EPIG',
    velocidadeMedia: '44 km/h',
    prefixoAtivo: '441.902',
  },
  {
    cd_linha: '2204',
    nm_linha: 'Terminal Gama (BRT Sul) / Rodoviária Plano Piloto',
    vl_tarifa: 5.5,
    sentido: 'IDA',
    operadora: 'Pioneira',
    corLinha: '#f59e0b',
    pathD: 'M 190,460 C 210,400 250,340 290,290 C 320,260 350,255 360,250',
    itinerario: [
      { nome: 'Terminal BRT Gama Sul', x: 190, y: 460 },
      { nome: 'Balão do Periquito', x: 215, y: 395 },
      { nome: 'Terminal Park Way BRT', x: 270, y: 315 },
      { nome: 'Viaduto Camargo Corrêa', x: 330, y: 265 },
      { nome: 'Plataforma BRT Rodoviária', x: 360, y: 250 },
    ],
    horarios: ['05:00', '05:15', '05:30', '05:45', '06:00', '06:15', '17:40'],
    gpsStatus: 'Corredor Exclusivo Livre',
    velocidadeMedia: '62 km/h',
    prefixoAtivo: '228.114',
  },
  {
    cd_linha: '0.812',
    nm_linha: 'W3 Norte / Setor Hospitalar / Sudoeste / Cruzeiro',
    vl_tarifa: 3.8,
    sentido: 'VOLTA',
    operadora: 'Urbi',
    corLinha: '#a855f7',
    pathD: 'M 390,140 C 370,180 350,220 340,260 C 310,270 270,290 250,300 C 230,310 220,330 210,340',
    itinerario: [
      { nome: 'W3 Norte (516 Norte)', x: 390, y: 140 },
      { nome: 'Setor Hospitalar Norte', x: 360, y: 210 },
      { nome: 'Venâncio Shopping / W3 Sul', x: 335, y: 265 },
      { nome: 'Sudoeste (QMSW 5)', x: 265, y: 290 },
      { nome: 'Cruzeiro Novo (Terminal)', x: 210, y: 340 },
    ],
    horarios: ['16:30', '17:00', '17:30', '18:00', '18:40', '19:20'],
    gpsStatus: 'Paradas Frequentes na W3',
    velocidadeMedia: '29 km/h',
    prefixoAtivo: '335.801',
  },
];

const FRONTEND_STEPS = [
  {
    key: 'front-step-1',
    order: '1ª Camada • Types',
    file: 'src/types/linha.ts',
    title: 'Modelagem dos Tipos e Contratos de Domínio',
    desc: 'Crie os contratos TypeScript: Linha, SentidoLinha, Operadora e FiltroLinhas. Sem uso de "any", garantindo tipagem estrita em todo o front-end.',
  },
  {
    key: 'front-step-2',
    order: '2ª Camada • Service',
    file: 'src/services/linhasApi.ts',
    title: 'Isolamento de Comunicação HTTP (API Client)',
    desc: 'Isole chamadas fetch/axios em funções puras (getLinhas, getLinhaByCodigo, getVeiculosLinha) com baseURL configurável via import.meta.env.',
  },
  {
    key: 'front-step-3',
    order: '3ª Camada • Hook',
    file: 'src/hooks/useLinhas.ts',
    title: 'Custom Hook de Estado (Regra das 50 Linhas)',
    desc: 'Encapsule loading, error, linhas e selectedLine. Respeite a regra de ouro da SUTINF: hooks reutilizáveis, coesos e com menos de 50 linhas de código.',
  },
  {
    key: 'front-step-4',
    order: '4ª Camada • Components',
    file: 'src/components/LinhaCard.tsx & LinhaDetalhes.tsx',
    title: 'Componentização Visual Desacoplada e Pura',
    desc: 'Construa os cards de linha, badges de tarifa e painéis de horário. Componentes burros (presentational) que apenas recebem props e emitem callbacks.',
  },
  {
    key: 'front-step-5',
    order: '5ª Camada • Screen',
    file: 'src/screens/InfoOnibusScreen.tsx ou src/App.tsx',
    title: 'Composição da Tela e Tratamento dos 4 Estados de UI',
    desc: 'Una o hook aos componentes implementando os 4 estados obrigatórios: Carregando (Skeleton), Erro de Rede, Busca Vazia (Empty State) e Dados Carregados.',
  },
];

export const FrontendChallengeScreen: React.FC<FrontendChallengeScreenProps> = ({
  completedItems,
  onToggleItem,
  onOpenModule,
  submission,
  onSaveSubmission,
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
          <h1>Projeto InfoÔnibus DF — Painel de Mobilidade Urbana em React</h1>
          <p>
            Construa a aplicação web oficial do <strong>InfoÔnibus — DF</strong> consumindo a API REST
            desenvolvida no módulo anterior. Aplique a <strong>Arquitetura Frontend em 5 Camadas da SEMOB</strong>,
            tratamento dos 4 estados de UI e uma experiência de mapa e itinerário responsiva para a população do DF.
          </p>
          <div className="hero-actions">
            <button className="btn-secondary" onClick={() => onOpenModule('mod-5-frontend')}>
              <BookOpen size={16} /> Revisar Módulo 5: Arquitetura Frontend na Plataforma
            </button>
          </div>
        </div>
      </section>

      {/* Explicação Profunda do Desafio */}
      <section className="section-card">
        <h2>
          <Compass size={20} style={{ display: 'inline', marginRight: '0.5rem' }} />
          O que é o Desafio InfoÔnibus, Para que serve e Como funciona
        </h2>
        <p className="text-muted" style={{ marginTop: '0.4rem', marginBottom: '1.25rem' }}>
          Entenda a importância institucional e as diretrizes de engenharia por trás do projeto que você entregará:
        </p>

        <div className="cards-grid three-cols">
          <div className="glass-card" style={{ borderLeft: '4px solid #0ea5e9', padding: '1.25rem' }}>
            <h3 style={{ fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Globe2 size={18} color="#0ea5e9" /> O que é o Desafio
            </h3>
            <p className="text-muted" style={{ fontSize: '0.85rem', marginTop: '0.5rem', lineHeight: 1.6 }}>
              O <strong>InfoÔnibus</strong> é a interface web de consulta pública da SEMOB-DF. Ela permite que cidadãos, motoristas e fiscais localizem linhas do Sistema de Transporte Público Coletivo (STPC-DF), consultem itinerários detalhados, valores de tarifas e partidas programadas.
            </p>
          </div>

          <div className="glass-card" style={{ borderLeft: '4px solid #10b981', padding: '1.25rem' }}>
            <h3 style={{ fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Cpu size={18} color="#10b981" /> Como Funciona
            </h3>
            <p className="text-muted" style={{ fontSize: '0.85rem', marginTop: '0.5rem', lineHeight: 1.6 }}>
              É uma Single Page Application (SPA) desenvolvida com <strong>Vite + React + TypeScript</strong>. O frontend não acessa banco de dados: ele consome exclusivamente os endpoints da API Backend criada por você (<code>GET /linhas</code> e <code>GET /veiculos</code>) através de serviços isolados.
            </p>
          </div>

          <div className="glass-card" style={{ borderLeft: '4px solid #f59e0b', padding: '1.25rem' }}>
            <h3 style={{ fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={18} color="#f59e0b" /> Critérios de Excelência
            </h3>
            <p className="text-muted" style={{ fontSize: '0.85rem', marginTop: '0.5rem', lineHeight: 1.6 }}>
              A SUTINF avalia: fidelidade aos 4 estados de tela (Loading com Skeleton, Erro com botão de retry, Lista Vazia quando a busca não encontra resultados e Sucesso com os cards), hooks com menos de 50 linhas e tipagem estrita sem <code>any</code>.
            </p>
          </div>
        </div>
      </section>

      {/* Protótipo Interativo InfoÔnibus com Simulador de Mapa SVG */}
      <section className="section-card">
        <div className="section-header-row">
          <div>
            <h2>
              <Sparkles size={20} style={{ display: 'inline', marginRight: '0.5rem' }} />
              Simulador Vivo: InfoÔnibus com Mapa de Rotas e Rastreamento GPS
            </h2>
            <p className="text-muted">
              Clique em diferentes linhas da lista para ver o <strong>mapa vetorial do Distrito Federal</strong> traçar a rota correspondente, posicionar as paradas e simular o ônibus em trânsito com GPS ao vivo!
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
              background: 'rgba(15, 23, 42, 0.95)',
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
                padding: '0.35rem 0.85rem',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontFamily: 'monospace',
                color: '#94a3b8',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span>http://localhost:5173/info-onibus-df</span>
              <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Radio size={12} /> SISMOB Live Telemetry
              </span>
            </div>
          </div>

          {/* Corpo do Simulador InfoÔnibus */}
          <div style={{ padding: '1.5rem' }}>
            {/* Filtros de Busca e Sentido */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: '1 1 280px' }}>
                <Search size={18} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por código (0.110, 2204) ou destino (UnB, Gama, Esplanada)..."
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

            {/* Layout Principal: Lista de Ônibus à Esquerda, Mapa e Detalhes à Direita */}
            <div className="cards-grid two-cols">
              {/* Coluna Esquerda: Lista de Cartões de Ônibus */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {filteredLines.length === 0 ? (
                  <div className="glass-card" style={{ textAlign: 'center', padding: '2rem' }}>
                    <p className="text-muted">Nenhuma linha encontrada para o filtro informado (Estado Vazio / Empty State).</p>
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
                          border: isSelected ? `2px solid ${line.corLinha}` : undefined,
                          padding: '1rem',
                          background: isSelected ? 'rgba(14, 165, 233, 0.08)' : undefined,
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span
                            className="status-pill passed"
                            style={{
                              fontWeight: 800,
                              background: isSelected ? line.corLinha : undefined,
                              color: isSelected ? '#ffffff' : undefined,
                            }}
                          >
                            <Bus size={14} style={{ display: 'inline', marginRight: 4 }} />
                            Linha {line.cd_linha}
                          </span>
                          <span className="status-pill pending" style={{ fontSize: '0.72rem' }}>
                            {line.sentido} • R$ {Number(line.vl_tarifa).toFixed(2)}
                          </span>
                        </div>
                        <h4 style={{ marginTop: '0.5rem', fontSize: '0.98rem' }}>{line.nm_linha}</h4>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.4rem', fontSize: '0.78rem' }}>
                          <span className="text-muted">Operadora: <strong>{line.operadora}</strong></span>
                          <span style={{ color: line.corLinha, fontWeight: 600 }}>Clique para ver rota no mapa →</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Coluna Direita: Mapa Interativo SVG + Detalhes Operacionais */}
              {selectedLine && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {/* Canvas do Mapa SVG do Distrito Federal */}
                  <div
                    className="glass-card"
                    style={{
                      padding: '1rem',
                      overflow: 'hidden',
                      position: 'relative',
                      background: 'radial-gradient(circle at 50% 50%, rgba(15, 23, 42, 0.95), rgba(2, 6, 23, 1))',
                      borderRadius: '12px',
                      border: `1px solid ${selectedLine.corLinha}44`,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Map size={16} color={selectedLine.corLinha} />
                        <span style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Mapa Operacional DF • Traçado da Rota
                        </span>
                      </div>
                      <span className="status-pill active" style={{ fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Radio size={10} className="pulse-icon" /> GPS Ativo
                      </span>
                    </div>

                    {/* SVG Map Container */}
                    <div style={{ width: '100%', height: '260px', position: 'relative' }}>
                      <svg
                        viewBox="0 0 600 500"
                        style={{ width: '100%', height: '100%', borderRadius: '8px' }}
                      >
                        {/* Grade e Malha Viária de Fundo do DF */}
                        <defs>
                          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(148, 163, 184, 0.07)" strokeWidth="1" />
                          </pattern>
                          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="3" result="glow" />
                            <feComposite in="SourceGraphic" in2="glow" operator="over" />
                          </filter>
                        </defs>

                        <rect width="600" height="500" fill="url(#grid)" />

                        {/* Silhueta Estilizada do Lago Paranoá */}
                        <path
                          d="M 430,120 Q 510,160 480,220 T 450,290 T 520,340 T 440,390"
                          fill="none"
                          stroke="rgba(56, 189, 248, 0.2)"
                          strokeWidth="14"
                          strokeLinecap="round"
                        />
                        <text x="495" y="270" fill="rgba(56, 189, 248, 0.4)" fontSize="11" fontFamily="sans-serif">
                          Lago Paranoá
                        </text>

                        {/* Principais Eixos Rodoviários de Fundo */}
                        {/* Eixo Monumental */}
                        <line x1="280" y1="250" x2="560" y2="250" stroke="rgba(148, 163, 184, 0.2)" strokeWidth="3" strokeDasharray="4 4" />
                        <text x="500" y="240" fill="rgba(148, 163, 184, 0.4)" fontSize="10">Esplanada</text>

                        {/* Eixão Norte / Sul */}
                        <line x1="360" y1="80" x2="360" y2="420" stroke="rgba(148, 163, 184, 0.2)" strokeWidth="4" />
                        <text x="365" y="95" fill="rgba(148, 163, 184, 0.4)" fontSize="10">Asa Norte</text>
                        <text x="365" y="415" fill="rgba(148, 163, 184, 0.4)" fontSize="10">Asa Sul</text>

                        {/* Taguatinga / EPTG */}
                        <line x1="80" y1="340" x2="280" y2="250" stroke="rgba(148, 163, 184, 0.2)" strokeWidth="3" />
                        <text x="90" y="360" fill="rgba(148, 163, 184, 0.4)" fontSize="10">Taguatinga</text>

                        {/* BRT Sul / Gama */}
                        <line x1="190" y1="460" x2="360" y2="250" stroke="rgba(148, 163, 184, 0.2)" strokeWidth="3" strokeDasharray="3 3" />
                        <text x="180" y="480" fill="rgba(148, 163, 184, 0.4)" fontSize="10">Gama</text>

                        {/* Ponto Central: Rodoviária do Plano Piloto */}
                        <circle cx="360" cy="250" r="7" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
                        <text x="372" y="254" fill="#ffffff" fontSize="11" fontWeight="bold">
                          Rodoviária
                        </text>

                        {/* Rota Ativa da Linha Selecionada */}
                        <path
                          d={selectedLine.pathD}
                          fill="none"
                          stroke={selectedLine.corLinha}
                          strokeWidth="5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          filter="url(#glow)"
                        />

                        {/* Marcadores de Paradas ao longo da Rota */}
                        {selectedLine.itinerario.map((p, idx) => (
                          <g key={idx}>
                            <circle
                              cx={p.x}
                              cy={p.y}
                              r={idx === 0 || idx === selectedLine.itinerario.length - 1 ? 6 : 4}
                              fill={idx === 0 ? '#10b981' : idx === selectedLine.itinerario.length - 1 ? '#ef4444' : selectedLine.corLinha}
                              stroke="#ffffff"
                              strokeWidth="1.5"
                            />
                            <text
                              x={p.x + 8}
                              y={p.y - 6}
                              fill="#f8fafc"
                              fontSize="9"
                              fontWeight="600"
                              style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}
                            >
                              {idx + 1}. {p.nome.split('-')[0].trim()}
                            </text>
                          </g>
                        ))}

                        {/* Ônibus em Movimento Animado (GPS) */}
                        <circle r="8" fill={selectedLine.corLinha} stroke="#ffffff" strokeWidth="2">
                          <animateMotion
                            path={selectedLine.pathD}
                            dur="12s"
                            repeatCount="indefinite"
                          />
                        </circle>
                        <circle r="14" fill="none" stroke={selectedLine.corLinha} strokeWidth="1.5" opacity="0.6">
                          <animateMotion
                            path={selectedLine.pathD}
                            dur="12s"
                            repeatCount="indefinite"
                          />
                          <animate
                            attributeName="r"
                            values="8;18;8"
                            dur="2s"
                            repeatCount="indefinite"
                          />
                          <animate
                            attributeName="opacity"
                            values="0.8;0.1;0.8"
                            dur="2s"
                            repeatCount="indefinite"
                          />
                        </circle>
                      </svg>
                    </div>

                    {/* Barra de Telemetria do Veículo em Tempo Real */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: '0.6rem',
                        padding: '0.5rem 0.75rem',
                        background: 'rgba(30, 41, 59, 0.7)',
                        borderRadius: '8px',
                        fontSize: '0.78rem',
                        flexWrap: 'wrap',
                        gap: '0.5rem',
                      }}
                    >
                      <div>
                        <span className="text-muted">Prefixo: </span>
                        <strong>{selectedLine.prefixoAtivo}</strong>
                      </div>
                      <div>
                        <span className="text-muted">Velocidade: </span>
                        <strong style={{ color: '#10b981' }}>{selectedLine.velocidadeMedia}</strong>
                      </div>
                      <div>
                        <span className="text-muted">Status: </span>
                        <span style={{ color: selectedLine.corLinha }}>{selectedLine.gpsStatus}</span>
                      </div>
                    </div>
                  </div>

                  {/* Painel de Detalhes da Linha Selecionada */}
                  <div className="glass-card" style={{ padding: '1.25rem' }}>
                    <div style={{ borderBottom: '1px solid rgba(148,163,184,0.2)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
                      <span className="text-muted" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>
                        Itinerário & Horários da Linha Selecionada
                      </span>
                      <h3 style={{ fontSize: '1.2rem', marginTop: '0.2rem' }}>
                        {selectedLine.cd_linha} — {selectedLine.nm_linha}
                      </h3>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                      <strong style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                        <MapPin size={15} color={selectedLine.corLinha} /> Sequência de Paradas do Itinerário:
                      </strong>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignItems: 'center' }}>
                        {selectedLine.itinerario.map((ponto, idx) => (
                          <React.Fragment key={idx}>
                            <span className="status-pill pending" style={{ fontSize: '0.75rem' }}>
                              {idx + 1}. {ponto.nome}
                            </span>
                            {idx < selectedLine.itinerario.length - 1 && <ArrowRight size={13} />}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>

                    <div>
                      <strong style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                        <Clock size={15} color={selectedLine.corLinha} /> Próximas Partidas Programadas:
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
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Roteiro de Arquitetura Frontend em 5 Camadas */}
      <section className="section-card">
        <div className="section-header-row">
          <div>
            <h2>
              <Layers size={20} style={{ display: 'inline', marginRight: '0.5rem' }} />
              Sequência Guiada de Ficheiros do Frontend (5 Camadas SUTINF)
            </h2>
            <p className="text-muted">
              Siga a ordem arquitetural rigorosa: Types → Services → Custom Hooks (&lt;50 linhas) → Components → Screen:
            </p>
          </div>
        </div>

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
        existingSubmission={submission}
        onSaveSubmission={onSaveSubmission}
        prChecklist={[
          'Isolei as chamadas HTTP num serviço dedicado (src/services/linhasApi.ts) fora do JSX dos componentes?',
          'Criei o custom hook (src/hooks/useLinhas.ts) respeitando a regra de ouro de ter menos de 50 linhas?',
          'Tratei os 4 estados obrigatórios de UI: Carregamento (Loading/Skeleton), Erro de Conexão, Busca Vazia (Empty State) e Sucesso?',
          'O filtro por texto (código/nome) e por sentido (TODOS, IDA, VOLTA, CIRCULAR) funciona instantaneamente sem recarregar?',
          'O projeto compila sem nenhum erro de TypeScript e sem uso do tipo "any"?',
        ]}
      />
    </div>
  );
};
export default FrontendChallengeScreen;

