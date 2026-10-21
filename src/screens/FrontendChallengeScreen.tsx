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
  Shield,
  Zap,
  ListOrdered,
  Calendar,
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
  itinerario: { sequencia: number; nomeVia: string; localidade: string; x: number; y: number }[];
  pathD: string;
  horariosUteis: string[];
  horariosSabado: string[];
  horariosDomingo: string[];
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
      { sequencia: 1, nomeVia: 'Plataforma Superior E', localidade: 'Rodoviária do Plano Piloto', x: 360, y: 250 },
      { sequencia: 2, nomeVia: 'Eixo Rodoviário Norte (Eixinho)', localidade: 'Asa Norte (104/204)', x: 410, y: 170 },
      { sequencia: 3, nomeVia: 'Avenida L2 Norte', localidade: 'Quadras 406/408 Norte', x: 460, y: 130 },
      { sequencia: 4, nomeVia: 'Via Universitária (Acesso ICC)', localidade: 'Campus Darcy Ribeiro - UnB', x: 480, y: 160 },
      { sequencia: 5, nomeVia: 'Retorno Plataforma Eixo Monumental', localidade: 'Rodoviária Central', x: 360, y: 250 },
    ],
    horariosUteis: ['06:15', '06:35', '06:55', '07:15', '07:35', '08:00', '12:10', '17:45', '18:15', '19:00'],
    horariosSabado: ['06:30', '07:30', '08:30', '12:00', '14:00', '18:00'],
    horariosDomingo: ['07:00', '09:00', '11:00', '13:00', '17:00', '19:00'],
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
      { sequencia: 1, nomeVia: 'Terminal Rodoviário Taguatinga Sul', localidade: 'Taguatinga Sul', x: 110, y: 340 },
      { sequencia: 2, nomeVia: 'Estrada Parque Taguatinga (EPTG)', localidade: 'Corredor Exclusivo', x: 230, y: 285 },
      { sequencia: 3, nomeVia: 'Estrada Parque Indústrias Gráficas (EPIG)', localidade: 'Parque da Cidade', x: 310, y: 265 },
      { sequencia: 4, nomeVia: 'Eixo Monumental Oeste', localidade: 'Torre de TV / Rodoviária', x: 370, y: 250 },
      { sequencia: 5, nomeVia: 'Eixo Monumental Leste', localidade: 'Esplanada dos Ministérios', x: 540, y: 245 },
    ],
    horariosUteis: ['05:40', '06:05', '06:25', '06:50', '07:15', '07:40', '16:45', '17:20', '18:00'],
    horariosSabado: ['06:00', '07:00', '08:00', '12:30', '17:00'],
    horariosDomingo: ['06:30', '08:30', '11:30', '16:30'],
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
      { sequencia: 1, nomeVia: 'Terminal BRT Gama Sul', localidade: 'Setor Sul Gama', x: 190, y: 460 },
      { sequencia: 2, nomeVia: 'DF-480 Canaleta BRT', localidade: 'Balão do Periquito', x: 215, y: 395 },
      { sequencia: 3, nomeVia: 'Terminal BRT Park Way', localidade: 'SMPW Quadra 26', x: 270, y: 315 },
      { sequencia: 4, nomeVia: 'Viaduto Camargo Corrêa', localidade: 'Asa Sul / Eixão', x: 330, y: 265 },
      { sequencia: 5, nomeVia: 'Plataforma BRT Inferior', localidade: 'Rodoviária do Plano Piloto', x: 360, y: 250 },
    ],
    horariosUteis: ['05:00', '05:15', '05:30', '05:45', '06:00', '06:15', '06:30', '17:15', '17:40', '18:10'],
    horariosSabado: ['05:30', '06:00', '06:30', '07:00', '12:00', '17:30'],
    horariosDomingo: ['06:00', '07:00', '08:30', '11:00', '16:00', '18:00'],
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
      { sequencia: 1, nomeVia: 'Avenida W3 Norte', localidade: 'Terminal 516 Norte', x: 390, y: 140 },
      { sequencia: 2, nomeVia: 'Setor Hospitalar Local Norte (SHLN)', localidade: 'Hospital Regional Asa Norte', x: 360, y: 210 },
      { sequencia: 3, nomeVia: 'Avenida W3 Sul', localidade: 'Pátio Brasil / Venâncio Shopping', x: 335, y: 265 },
      { sequencia: 4, nomeVia: 'Primeira Avenida do Sudoeste', localidade: 'QMSW 5 / Bloco C', x: 265, y: 290 },
      { sequencia: 5, nomeVia: 'Terminal Rodoviário Cruzeiro Novo', localidade: 'Cruzeiro Novo', x: 210, y: 340 },
    ],
    horariosUteis: ['06:20', '07:00', '07:40', '08:20', '12:15', '16:30', '17:15', '18:00', '18:45'],
    horariosSabado: ['07:00', '08:15', '12:00', '14:30', '17:45'],
    horariosDomingo: ['08:00', '11:00', '14:00', '17:00'],
    gpsStatus: 'Paradas Frequentes na W3',
    velocidadeMedia: '29 km/h',
    prefixoAtivo: '335.801',
  },
];

const FRONTEND_STEPS = [
  {
    key: 'front-step-1',
    order: '1ª Camada • Types',
    file: 'src/modulos/SCL/Itinerarios/types/ & Horarios/types/',
    title: 'Modelagem dos Tipos e Contratos de Domínio',
    desc: 'Crie os contratos TypeScript: ItinerarioDescritivo, PontoTrajeto, HorarioPartida e FiltroHorario. Tipagem estrita sem "any", espelhando as entidades do backend.',
  },
  {
    key: 'front-step-2',
    order: '2ª Camada • Service',
    file: 'src/modulos/SCL/Itinerarios/services/ & Horarios/services/',
    title: 'Isolamento de Comunicação HTTP com Dual-Mode',
    desc: 'Implemente itinerarioService.ts e horarioService.ts consumindo /api/linhas/:codigo/itinerario e /horarios com fallback automático para mock se o backend estiver offline.',
  },
  {
    key: 'front-step-3',
    order: '3ª Camada • Hook',
    file: 'src/modulos/SCL/Itinerarios/hooks/useItinerario.ts & useHorarios.ts',
    title: 'Custom Hooks de Estado (Regra das 50 Linhas)',
    desc: 'Encapsule loading, error, dados e filtros respeitando o padrão SUTINF: hooks limpos, reutilizáveis e com menos de 50 linhas de código.',
  },
  {
    key: 'front-step-4',
    order: '4ª Camada • Components',
    file: 'src/modulos/SCL/Itinerarios/components/ & Horarios/components/',
    title: 'Componentização Visual Desacoplada e Pura',
    desc: 'Crie ItinerarioTimeline.tsx (timeline sequencial de vias e localidades) e HorariosGrid.tsx (grid com seletor de dias úteis, sábados e domingos).',
  },
  {
    key: 'front-step-5',
    order: '5ª Camada • Screen',
    file: 'src/modulos/SCL/Itinerarios/ItinerariosPage.tsx & HorariosPage.tsx',
    title: 'Composição de Telas com os 4 Estados de UI',
    desc: 'Construa as telas completas tratando obrigatoriamente: Carregando (Skeleton), Erro com botão de retry, Busca Vazia (Empty State) e Dados Carregados.',
  },
  {
    key: 'front-step-6',
    order: '6ª Integração • SCL Menu',
    file: 'src/modulos/SCL/SCLMenu.tsx & src/App.tsx',
    title: 'Registro no Menu do SCL e Guardas de Permissão CDP',
    desc: 'Adicione os novos botões no menu do SCL ("Itinerários" e "Horários") protegidos pelo componente <Can action="LEITURA"> e registre as rotas na aplicação.',
  },
  {
    key: 'front-step-7',
    order: '7º Projeto Final • Capstone',
    file: 'src/modulos/SCL/Vol/VolDesafio.tsx (/infoonibus)',
    title: 'Capstone Infoônibus: Mapa Interativo & Telemetria GPS',
    desc: 'Com as duas APIs integradas, acesse o módulo VOL e finalize o Infoônibus com mapa espacial Leaflet, rota traçada e telemetria GPS em tempo real.',
  },
];

export const FrontendChallengeScreen: React.FC<FrontendChallengeScreenProps> = ({
  completedItems,
  onToggleItem,
  onOpenModule,
  submission,
  onSaveSubmission,
}) => {
  const [activeTab, setActiveTab] = useState<'itinerario' | 'horarios' | 'infoonibus'>('itinerario');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTipoDia, setSelectedTipoDia] = useState<'UTIL' | 'SABADO' | 'DOMINGO'>('UTIL');
  const [selectedLine, setSelectedLine] = useState<MockBusLine>(INFO_ONIBUS_MOCK_LINES[0]);

  const filteredLines = useMemo(() => {
    return INFO_ONIBUS_MOCK_LINES.filter((line) => {
      return (
        line.cd_linha.toLowerCase().includes(searchQuery.toLowerCase()) ||
        line.nm_linha.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [searchQuery]);

  const activeHorariosList = useMemo(() => {
    if (selectedTipoDia === 'SABADO') return selectedLine.horariosSabado;
    if (selectedTipoDia === 'DOMINGO') return selectedLine.horariosDomingo;
    return selectedLine.horariosUteis;
  }, [selectedLine, selectedTipoDia]);

  return (
    <div className="screen-container">
      {/* Hero Banner */}
      <section className="hero-banner">
        <div className="hero-content">
          <span className="hero-badge">
            <Layout size={14} /> Desafio Prático • Engenharia Frontend
          </span>
          <h1>Desafio Frontend: Submódulos SCL (Itinerários e Horários) & Infoônibus</h1>
          <p>
            Construa os novos submódulos no <strong>Boilerplate_Front</strong> consumindo diretamente as APIs de
            Linhas desenvolvidas no backend (<code>GET /api/linhas/:codigo/itinerario</code> e <code>/horarios</code>).
            Aplique a <strong>Arquitetura em 5 Camadas</strong>, o <strong>Dual-Mode</strong> (backend real :8097 ou mock offline),
            guardas de permissão <strong>CDP</strong> e culmine no <strong>Projeto Final Infoônibus</strong> com mapa e telemetria.
          </p>
          <div className="hero-actions">
            <button className="btn-secondary" onClick={() => onOpenModule('mod-5-frontend')}>
              <BookOpen size={16} /> Revisar Módulo 5: Arquitetura Frontend na Plataforma
            </button>
          </div>
        </div>
      </section>

      {/* Roteiro Estruturante da Missão */}
      <section className="section-card">
        <h2>
          <Compass size={20} style={{ display: 'inline', marginRight: '0.5rem' }} />
          Roteiro da Missão: Do Setup dos Submódulos ao Capstone Infoônibus
        </h2>
        <p className="text-muted" style={{ marginTop: '0.4rem', marginBottom: '1.25rem' }}>
          Siga a evolução natural do desenvolvedor na SUTINF: aprenda com o módulo base de Linhas, construa os dois novos submódulos do SCL e entregue o Infoônibus:
        </p>

        <div className="cards-grid three-cols">
          <div className="glass-card" style={{ borderTop: '4px solid #0ea5e9', padding: '1.25rem' }}>
            <span className="status-pill pending" style={{ marginBottom: '0.5rem' }}>Fase 1 • Setup & Dual-Mode</span>
            <h3 style={{ fontSize: '1.05rem', marginTop: '0.3rem' }}>Clonar Boilerplate Front</h3>
            <p className="text-muted" style={{ fontSize: '0.85rem', marginTop: '0.5rem', lineHeight: 1.6 }}>
              Clone o repositório base React + Vite. Ele já possui o componente <code>StatusIntegracaoBackend</code> que detecta automaticamente se o NestJS está rodando na porta 8097 ou ativa o mock offline:
            </p>
            <pre className="code-block" style={{ fontSize: '0.78rem', margin: '0.75rem 0' }}>
              <code>git clone https://github.com/pedro090904/SISMOB-BOILERPLATE-FRONT.git&#10;cd SISMOB-BOILERPLATE-FRONT&#10;npm install &amp;&amp; npm run dev</code>
            </pre>
          </div>

          <div className="glass-card" style={{ borderTop: '4px solid #10b981', padding: '1.25rem' }}>
            <span className="status-pill active" style={{ marginBottom: '0.5rem' }}>Fase 2 • Desafio Principal</span>
            <h3 style={{ fontSize: '1.05rem', marginTop: '0.3rem' }}>Criar os 2 Submódulos SCL</h3>
            <p className="text-muted" style={{ fontSize: '0.85rem', marginTop: '0.5rem', lineHeight: 1.6 }}>
              Construa <code>src/modulos/SCL/Itinerarios/</code> e <code>src/modulos/SCL/Horarios/</code>. Cada submódulo possui suas 5 camadas (Types, Service, Hook &lt;50 linhas, Components e Page) e consome as APIs do backend.
            </p>
            <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}>
              ✓ Registre ambos no menu SCLMenu.tsx
            </div>
          </div>

          <div className="glass-card" style={{ borderTop: '4px solid #f59e0b', padding: '1.25rem' }}>
            <span className="status-pill passed" style={{ marginBottom: '0.5rem' }}>Fase 3 • Capstone Final</span>
            <h3 style={{ fontSize: '1.05rem', marginTop: '0.3rem' }}>Módulo VOL: Infoônibus DF</h3>
            <p className="text-muted" style={{ fontSize: '0.85rem', marginTop: '0.5rem', lineHeight: 1.6 }}>
              Acesse <code>src/modulos/SCL/Vol/VolDesafio.tsx</code> (rota <code>/infoonibus</code>). Integre o mapa Leaflet com o traçado das rotas e telemetria GPS em tempo real, entregando a aplicação cidadã de mobilidade!
            </p>
          </div>
        </div>
      </section>

      {/* Simulador Interativo Vivo dos 3 Módulos */}
      <section className="section-card">
        <div className="section-header-row">
          <div>
            <h2>
              <Sparkles size={20} style={{ display: 'inline', marginRight: '0.5rem' }} />
              Simulador Vivo: Explore as Telas que Você Vai Construir
            </h2>
            <p className="text-muted">
              Alterne entre as 3 visões para experimentar como os submódulos de Itinerários, Quadro de Horários e o Capstone Infoônibus funcionam na prática:
            </p>
          </div>
        </div>

        {/* Browser Mockup */}
        <div className="browser-mockup" style={{ marginTop: '1.25rem', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(148, 163, 184, 0.25)' }}>
          {/* Header do Navegador */}
          <div
            className="browser-header"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1.25rem',
              background: 'rgba(15, 23, 42, 0.95)',
              borderBottom: '1px solid rgba(148, 163, 184, 0.2)',
              flexWrap: 'wrap',
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
                minWidth: '220px',
              }}
            >
              <span>
                http://localhost:5173
                {activeTab === 'itinerario'
                  ? '/scl/itinerarios'
                  : activeTab === 'horarios'
                  ? '/scl/horarios'
                  : '/infoonibus'}
              </span>
              <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.72rem' }}>
                <Zap size={12} /> Dual-Mode Ativo (:8097)
              </span>
            </div>

            {/* Seletor de Telas do Simulador */}
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button
                type="button"
                onClick={() => setActiveTab('itinerario')}
                className={`sql-filter-btn ${activeTab === 'itinerario' ? 'active' : ''}`}
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
              >
                <ListOrdered size={14} style={{ display: 'inline', marginRight: 4 }} />
                1. Itinerários
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('horarios')}
                className={`sql-filter-btn ${activeTab === 'horarios' ? 'active' : ''}`}
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
              >
                <Clock size={14} style={{ display: 'inline', marginRight: 4 }} />
                2. Quadro de Horários
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('infoonibus')}
                className={`sql-filter-btn ${activeTab === 'infoonibus' ? 'active' : ''}`}
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
              >
                <Map size={14} style={{ display: 'inline', marginRight: 4 }} />
                3. Capstone Infoônibus
              </button>
            </div>
          </div>

          {/* Corpo do Simulador */}
          <div style={{ padding: '1.5rem' }}>
            {/* Barra de Busca de Linhas */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: '1 1 280px' }}>
                <Search size={18} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar linha por código (0.110, 2204) ou itinerário..."
                  className="sql-editor-textarea"
                  style={{ minHeight: '40px', height: '40px', padding: '0.45rem 0.85rem' }}
                />
              </div>

              {/* Seletor de Tipo de Dia para a aba Horários */}
              {activeTab === 'horarios' && (
                <div className="sql-filter-buttons">
                  {(['UTIL', 'SABADO', 'DOMINGO'] as const).map((tipo) => (
                    <button
                      key={tipo}
                      type="button"
                      onClick={() => setSelectedTipoDia(tipo)}
                      className={`sql-filter-btn ${selectedTipoDia === tipo ? 'active' : ''}`}
                      style={{ fontSize: '0.75rem' }}
                    >
                      <Calendar size={12} style={{ display: 'inline', marginRight: 4 }} />
                      {tipo === 'UTIL' ? 'Dias Úteis' : tipo === 'SABADO' ? 'Sábados' : 'Domingos e Feriados'}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Layout em Duas Colunas */}
            <div className="cards-grid two-cols">
              {/* Coluna Esquerda: Lista de Linhas Disponíveis */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <span className="text-muted" style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Linhas do DF ({filteredLines.length} encontradas):
                </span>
                {filteredLines.length === 0 ? (
                  <div className="glass-card" style={{ textAlign: 'center', padding: '2rem' }}>
                    <p className="text-muted">Nenhuma linha encontrada (Estado Vazio / Empty State).</p>
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
                          padding: '0.9rem',
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
                            <Bus size={13} style={{ display: 'inline', marginRight: 4 }} />
                            Linha {line.cd_linha}
                          </span>
                          <span className="status-pill pending" style={{ fontSize: '0.72rem' }}>
                            {line.sentido} • R$ {Number(line.vl_tarifa).toFixed(2)}
                          </span>
                        </div>
                        <h4 style={{ marginTop: '0.4rem', fontSize: '0.92rem' }}>{line.nm_linha}</h4>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.4rem', fontSize: '0.78rem' }}>
                          <span className="text-muted">Operadora: <strong>{line.operadora}</strong></span>
                          <span style={{ color: line.corLinha, fontWeight: 600 }}>Selecionar →</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Coluna Direita: Conteúdo Dinâmico conforme a Aba Ativa */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* 1. ABA ITINERÁRIOS: Timeline sequencial de vias */}
                {activeTab === 'itinerario' && (
                  <div className="glass-card" style={{ padding: '1.25rem', borderLeft: `4px solid ${selectedLine.corLinha}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid rgba(148,163,184,0.15)', paddingBottom: '0.75rem' }}>
                      <div>
                        <span className="status-pill passed" style={{ fontSize: '0.72rem' }}>
                          Submódulo Itinerários • SCL
                        </span>
                        <h3 style={{ fontSize: '1.15rem', marginTop: '0.3rem' }}>
                          Trajeto Sequencial da Linha {selectedLine.cd_linha}
                        </h3>
                        <p className="text-muted" style={{ fontSize: '0.8rem' }}>
                          Consome <code>GET /api/linhas/{selectedLine.cd_linha}/itinerario</code>
                        </p>
                      </div>
                      <span className="status-pill active" style={{ fontSize: '0.72rem' }}>
                        {selectedLine.itinerario.length} Paradas Mapeadas
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {selectedLine.itinerario.map((ponto, idx) => (
                        <div
                          key={ponto.sequencia}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '0.75rem',
                            padding: '0.65rem 0.85rem',
                            background: 'rgba(30, 41, 59, 0.4)',
                            borderRadius: '8px',
                            borderLeft: idx === 0 ? '3px solid #10b981' : idx === selectedLine.itinerario.length - 1 ? '3px solid #ef4444' : `3px solid ${selectedLine.corLinha}`,
                          }}
                        >
                          <div
                            style={{
                              width: 26,
                              height: 26,
                              borderRadius: '50%',
                              background: idx === 0 ? '#10b981' : idx === selectedLine.itinerario.length - 1 ? '#ef4444' : selectedLine.corLinha,
                              color: '#fff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 700,
                              fontSize: '0.75rem',
                              flexShrink: 0,
                            }}
                          >
                            {ponto.sequencia}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{ponto.nomeVia}</div>
                            <div className="text-muted" style={{ fontSize: '0.78rem' }}>
                              <MapPin size={12} style={{ display: 'inline', marginRight: 3 }} />
                              {ponto.localidade}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. ABA HORÁRIOS: Quadro de partidas programadas */}
                {activeTab === 'horarios' && (
                  <div className="glass-card" style={{ padding: '1.25rem', borderLeft: `4px solid ${selectedLine.corLinha}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid rgba(148,163,184,0.15)', paddingBottom: '0.75rem' }}>
                      <div>
                        <span className="status-pill passed" style={{ fontSize: '0.72rem' }}>
                          Submódulo Horários • SCL
                        </span>
                        <h3 style={{ fontSize: '1.15rem', marginTop: '0.3rem' }}>
                          Quadro de Partidas da Linha {selectedLine.cd_linha}
                        </h3>
                        <p className="text-muted" style={{ fontSize: '0.8rem' }}>
                          Consome <code>GET /api/linhas/{selectedLine.cd_linha}/horarios?tipoDia={selectedTipoDia}</code>
                        </p>
                      </div>
                      <span className="status-pill active" style={{ fontSize: '0.72rem' }}>
                        {activeHorariosList.length} Viagens Programadas
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(75px, 1fr))', gap: '0.5rem' }}>
                      {activeHorariosList.map((hr, idx) => (
                        <div
                          key={idx}
                          style={{
                            padding: '0.6rem 0.4rem',
                            textAlign: 'center',
                            background: 'rgba(30, 41, 59, 0.6)',
                            border: `1px solid ${selectedLine.corLinha}44`,
                            borderRadius: '8px',
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            fontSize: '0.92rem',
                            color: '#f8fafc',
                          }}
                        >
                          {hr}
                        </div>
                      ))}
                    </div>

                    <div style={{ marginTop: '1rem', padding: '0.6rem 0.85rem', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '8px', fontSize: '0.78rem' }}>
                      <span className="text-muted">Observação Operacional: </span>
                      Partidas sujeitas às condições de tráfego dos eixos estruturantes do DF. Dados homologados pela SEMOB.
                    </div>
                  </div>
                )}

                {/* 3. ABA INFOÔNIBUS CAPSTONE: Mapa SVG e Telemetria GPS */}
                {activeTab === 'infoonibus' && (
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
                          Capstone Infoônibus • Mapa & Telemetria DF
                        </span>
                      </div>
                      <span className="status-pill active" style={{ fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Radio size={10} className="pulse-icon" /> GPS Ativo
                      </span>
                    </div>

                    {/* Canvas do Mapa SVG */}
                    <div style={{ width: '100%', height: '240px', position: 'relative' }}>
                      <svg viewBox="0 0 600 500" style={{ width: '100%', height: '100%', borderRadius: '8px' }}>
                        <defs>
                          <pattern id="grid-fe" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(148, 163, 184, 0.07)" strokeWidth="1" />
                          </pattern>
                          <filter id="glow-fe" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="3" result="glow" />
                            <feComposite in="SourceGraphic" in2="glow" operator="over" />
                          </filter>
                        </defs>
                        <rect width="600" height="500" fill="url(#grid-fe)" />

                        {/* Lago Paranoá */}
                        <path d="M 430,120 Q 510,160 480,220 T 450,290 T 520,340 T 440,390" fill="none" stroke="rgba(56, 189, 248, 0.2)" strokeWidth="14" strokeLinecap="round" />
                        <text x="495" y="270" fill="rgba(56, 189, 248, 0.4)" fontSize="11">Lago Paranoá</text>

                        {/* Rodoviária */}
                        <circle cx="360" cy="250" r="7" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
                        <text x="372" y="254" fill="#ffffff" fontSize="11" fontWeight="bold">Rodoviária</text>

                        {/* Rota Ativa */}
                        <path d={selectedLine.pathD} fill="none" stroke={selectedLine.corLinha} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" filter="url(#glow-fe)" />

                        {/* Marcadores de Paradas */}
                        {selectedLine.itinerario.map((p, idx) => (
                          <g key={idx}>
                            <circle cx={p.x} cy={p.y} r={idx === 0 || idx === selectedLine.itinerario.length - 1 ? 6 : 4} fill={idx === 0 ? '#10b981' : idx === selectedLine.itinerario.length - 1 ? '#ef4444' : selectedLine.corLinha} stroke="#ffffff" strokeWidth="1.5" />
                            <text x={p.x + 8} y={p.y - 6} fill="#f8fafc" fontSize="9" fontWeight="600">{idx + 1}. {p.nomeVia.split(' ')[0]}</text>
                          </g>
                        ))}

                        {/* Ônibus em Movimento Animado */}
                        <circle r="8" fill={selectedLine.corLinha} stroke="#ffffff" strokeWidth="2">
                          <animateMotion path={selectedLine.pathD} dur="12s" repeatCount="indefinite" />
                        </circle>
                        <circle r="14" fill="none" stroke={selectedLine.corLinha} strokeWidth="1.5" opacity="0.6">
                          <animateMotion path={selectedLine.pathD} dur="12s" repeatCount="indefinite" />
                          <animate attributeName="r" values="8;18;8" dur="2s" repeatCount="indefinite" />
                          <animate attributeName="opacity" values="0.8;0.1;0.8" dur="2s" repeatCount="indefinite" />
                        </circle>
                      </svg>
                    </div>

                    {/* Telemetria do Veículo */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.6rem', padding: '0.5rem 0.75rem', background: 'rgba(30, 41, 59, 0.7)', borderRadius: '8px', fontSize: '0.78rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div><span className="text-muted">Prefixo: </span><strong>{selectedLine.prefixoAtivo}</strong></div>
                      <div><span className="text-muted">Velocidade: </span><strong style={{ color: '#10b981' }}>{selectedLine.velocidadeMedia}</strong></div>
                      <div><span className="text-muted">Status: </span><span style={{ color: selectedLine.corLinha }}>{selectedLine.gpsStatus}</span></div>
                    </div>
                  </div>
                )}
              </div>
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
              Sequência Guiada de Desenvolvimento (Passo a Passo SUTINF)
            </h2>
            <p className="text-muted">
              Siga a ordem arquitetural rigorosa para construir os submódulos de Itinerários e Horários e destravar o Infoônibus:
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

      {/* Diretrizes de Excelência e Governança SUTINF */}
      <section className="section-card">
        <div className="cards-grid three-cols">
          <div className="glass-card" style={{ padding: '1.25rem', borderLeft: '4px solid #3b82f6' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}>
              <Cpu size={18} color="#3b82f6" /> Regra das 50 Linhas
            </h3>
            <p className="text-muted" style={{ fontSize: '0.85rem', marginTop: '0.4rem', lineHeight: 1.5 }}>
              Todo custom hook (<code>useItinerario.ts</code> e <code>useHorarios.ts</code>) deve ter no máximo 50 linhas de código, mantendo responsabilidade única e alta coesão.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '1.25rem', borderLeft: '4px solid #10b981' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}>
              <Zap size={18} color="#10b981" /> Dual-Mode Resiliente
            </h3>
            <p className="text-muted" style={{ fontSize: '0.85rem', marginTop: '0.4rem', lineHeight: 1.5 }}>
              Seus services devem tentar conectar ao backend em <code>/api</code>. Se a API estiver offline ou em manutenção, o sistema faz fallback gracioso para mock sem quebrar a tela.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '1.25rem', borderLeft: '4px solid #8b5cf6' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}>
              <Shield size={18} color="#8b5cf6" /> Guardas CDP
            </h3>
            <p className="text-muted" style={{ fontSize: '0.85rem', marginTop: '0.4rem', lineHeight: 1.5 }}>
              No <code>SCLMenu.tsx</code>, utilize o componente <code>&lt;Can action="LEITURA"&gt;</code> para proteger a navegação conforme o perfil (Aluno, Operador ou Administrador).
            </p>
          </div>
        </div>
      </section>

      {/* Painel Padronizado de Revisão de PR e Submissão */}
      <ChallengeSubmissionPanel
        challengeId="challenge-frontend-ui"
        title="Entrega do Repositório & Checklist dos Submódulos SCL & Infoônibus"
        subtitle="Confirme o cumprimento das 5 camadas, Dual-Mode e cole o link do seu Merge Request / Repositório Git."
        requireRepoUrl={true}
        existingSubmission={submission}
        onSaveSubmission={onSaveSubmission}
        prChecklist={[
          'Criei os submódulos src/modulos/SCL/Itinerarios/ e Horarios/ seguindo as 5 camadas canônicas?',
          'Isolei as chamadas HTTP em itinerarioService.ts e horarioService.ts consumindo o backend NestJS (:8097)?',
          'Implementei a resiliência Dual-Mode (conexão real com fallback gracioso para mock se offline)?',
          'Os custom hooks useItinerario e useHorarios respeitam a regra de ouro de ter menos de 50 linhas?',
          'Tratei os 4 estados obrigatórios de UI: Loading/Skeleton, Erro de Rede, Lista Vazia e Sucesso com dados?',
          'Adicionei os novos submódulos no SCLMenu.tsx protegidos por guardas de permissão CDP <Can action="LEITURA">?',
          'Integrei o projeto final Infoônibus no módulo VOL (src/modulos/SCL/Vol/VolDesafio.tsx) com o mapa e rotas?',
        ]}
      />
    </div>
  );
};

export default FrontendChallengeScreen;
