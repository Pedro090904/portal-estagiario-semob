import React, { useState } from 'react';
import { ScreenType } from '../types';
import { 
  Layout, 
  Search, 
  MapPin, 
  Navigation, 
  CheckCircle2, 
  Bus, 
  Clock, 
  Layers, 
  ExternalLink,
  BookOpen,
  SlidersHorizontal,
  RefreshCw
} from 'lucide-react';

interface FrontendChallengeScreenProps {
  isCompleted: boolean;
  onToggleComplete: () => void;
  onNavigate: (screen: ScreenType) => void;
}

export const FrontendChallengeScreen: React.FC<FrontendChallengeScreenProps> = ({
  isCompleted,
  onToggleComplete,
  onNavigate,
}) => {
  // Simulador interativo do InfoÔnibus
  const [selectedLine, setSelectedLine] = useState<string>('0.111');
  const [activeFilterSentido, setActiveFilterSentido] = useState<'IDA' | 'VOLTA'>('IDA');
  const [isSimulatingLive, setIsSimulatingLive] = useState<boolean>(true);
  const [busPositionIndex, setBusPositionIndex] = useState<number>(1);

  const mockLines = [
    {
      numero: '0.111',
      nome: 'Terminal Asa Sul / W3 Sul / W3 Norte / Terminal Asa Norte',
      empresa: 'Piracicabana',
      tarifa: 'R$ 3,80',
      sentido: 'IDA',
      veiculo: '11042',
      velocidade: '42 km/h',
      proximaParada: 'Estação 106 Sul',
      paradas: [
        'Terminal Asa Sul (Início)',
        'Hospital Sarah Brasília',
        'Estação Metrô 106 Sul',
        'Galeria dos Estados',
        'Shopping Conjunto Nacional',
        'Brasília Shopping (W3 Norte)',
        'Universidade de Brasília (UnB)',
        'Terminal Asa Norte (Fim)',
      ],
    },
    {
      numero: '0.170',
      nome: 'Gama / Eixo Sul / Rodoviária do Plano Piloto',
      empresa: 'Pioneira',
      tarifa: 'R$ 5,50',
      sentido: 'IDA',
      veiculo: '22190',
      velocidade: '65 km/h',
      proximaParada: 'Catetinho (BR-040)',
      paradas: [
        'Terminal do Gama (Sul)',
        'Setor Central do Gama',
        'Passarela Catetinho',
        'Trecho EPIA Sul',
        'Terminal Asa Sul (Integração)',
        'Rodoviária do Plano Piloto (Plataforma C)',
      ],
    },
  ];

  const currentLineData = mockLines.find((l) => l.numero === selectedLine) || mockLines[0];

  const handleNextPosition = () => {
    setBusPositionIndex((prev) => (prev + 1) % currentLineData.paradas.length);
  };

  return (
    <div className="frontend-challenge-screen">
      {/* Header */}
      <div className="challenge-page-header">
        <div className="header-badge bg-cyan-pill">
          <Layout size={16} />
          <span>DESAFIO PRÁTICO FRONT-END</span>
        </div>
        <h1 className="page-title">O Novo "InfoÔnibus": Interface em Tempo Real</h1>
        <p className="page-subtitle">
          Construa a aplicação de visualização de transporte para os cidadãos e fiscais do DF. Aplique o padrão SUTINF de 5 camadas, a Regra das 50 Linhas e integração com APIs de telemetria.
        </p>

        <div className="challenge-completion-box">
          <div className="completion-info">
            <strong>Status do Desafio Front-end:</strong>
            <span>{isCompleted ? '✓ Concluído com Sucesso' : 'Em andamento'}</span>
          </div>
          <button 
            onClick={onToggleComplete}
            className={`btn-primary ${isCompleted ? 'btn-green' : ''}`}
          >
            <CheckCircle2 size={18} />
            {isCompleted ? 'Conclusão Registrada!' : 'Marcar Desafio como Concluído'}
          </button>
        </div>
      </div>

      {/* Specifications Checklist */}
      <div className="specs-checklist-card">
        <h3>📋 Requisitos Obrigatórios da Solução</h3>
        <div className="specs-grid">
          <div className="spec-item">
            <CheckCircle2 size={18} className="text-cyan" />
            <div>
              <strong>Pesquisa Dinâmica de Linhas:</strong>
              <p>Campo de busca integrado à API com sugestões automáticas por número ou nome.</p>
            </div>
          </div>
          <div className="spec-item">
            <CheckCircle2 size={18} className="text-cyan" />
            <div>
              <strong>Pontos de Parada:</strong>
              <p>Exibição ordenada de todas as paradas do trajeto com destaque para início e fim.</p>
            </div>
          </div>
          <div className="spec-item">
            <CheckCircle2 size={18} className="text-cyan" />
            <div>
              <strong>GPS & Telemetria ao Vivo:</strong>
              <p>Marcador no mapa da posição atual do veículo com velocidade em km/h.</p>
            </div>
          </div>
          <div className="spec-item">
            <CheckCircle2 size={18} className="text-cyan" />
            <div>
              <strong>Traçado Espacial no Mapa:</strong>
              <p>Renderização de LineString do PostGIS com cores diferenciadas por sentido.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive InfoÔnibus Simulator Demo */}
      <div className="simulator-interactive-section">
        <div className="sim-header">
          <div className="sim-badge">
            <Bus size={16} />
            <span>DEMONSTRAÇÃO INTERATIVA DO INFOÔNIBUS</span>
          </div>
          <p>Experimente abaixo como a sua interface deve se comportar ao consultar linhas e telemetria:</p>
        </div>

        <div className="infoonibus-simulator-container">
          {/* Top Search Toolbar */}
          <div className="infoonibus-toolbar">
            <div className="select-line-box">
              <label>Selecione a Linha:</label>
              <select 
                value={selectedLine} 
                onChange={(e) => {
                  setSelectedLine(e.target.value);
                  setBusPositionIndex(1);
                }}
                className="select-custom"
              >
                <option value="0.111">Linha 0.111 (W3 Sul / Norte)</option>
                <option value="0.170">Linha 0.170 (Gama / Eixo Sul)</option>
              </select>
            </div>

            <div className="filter-sentido-buttons">
              <button
                onClick={() => setActiveFilterSentido('IDA')}
                className={`sentido-btn ${activeFilterSentido === 'IDA' ? 'active' : ''}`}
              >
                Sentido IDA
              </button>
              <button
                onClick={() => setActiveFilterSentido('VOLTA')}
                className={`sentido-btn ${activeFilterSentido === 'VOLTA' ? 'active' : ''}`}
              >
                Sentido VOLTA
              </button>
            </div>

            <button onClick={handleNextPosition} className="btn-secondary btn-sm" title="Simular próximo ponto de GPS">
              <RefreshCw size={14} />
              Simular Avanço GPS
            </button>
          </div>

          {/* InfoÔnibus View Body */}
          <div className="infoonibus-body-grid">
            {/* Map Simulator */}
            <div className="simulated-map-card">
              <div className="map-overlay-header">
                <span className="dot-live"></span>
                <strong>Telemetria em Tempo Real (Brasília-DF)</strong>
                <span className="text-muted text-xs">GPS Atualizado há 4s</span>
              </div>

              {/* Vector representation of route & bus */}
              <div className="svg-map-frame">
                <svg viewBox="0 0 500 280" className="interactive-svg-route">
                  {/* Background grid */}
                  <defs>
                    <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                      <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
                    </pattern>
                  </defs>
                  <rect width="500" height="280" fill="url(#grid)" />

                  {/* Route Polyline */}
                  <path
                    d="M 40,240 C 120,200 150,140 240,120 S 380,80 460,40"
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="6"
                    strokeDasharray="4 2"
                    className="route-line"
                  />

                  {/* Stops */}
                  <circle cx="40" cy="240" r="6" fill="#10b981" />
                  <text x="45" y="255" fill="#94a3b8" fontSize="10">Terminal Partida</text>

                  <circle cx="160" cy="165" r="5" fill="#38bdf8" />
                  <circle cx="240" cy="120" r="5" fill="#38bdf8" />
                  <circle cx="340" cy="85" r="5" fill="#38bdf8" />

                  <circle cx="460" cy="40" r="6" fill="#ef4444" />
                  <text x="410" y="30" fill="#94a3b8" fontSize="10">Terminal Destino</text>

                  {/* Dynamic Bus Icon Marker */}
                  <g 
                    transform={`translate(${
                      busPositionIndex === 0 ? 40 : 
                      busPositionIndex === 1 ? 160 : 
                      busPositionIndex === 2 ? 240 : 
                      busPositionIndex === 3 ? 340 : 460
                    }, ${
                      busPositionIndex === 0 ? 240 : 
                      busPositionIndex === 1 ? 165 : 
                      busPositionIndex === 2 ? 120 : 
                      busPositionIndex === 3 ? 85 : 40
                    })`}
                    className="bus-marker-pulse"
                  >
                    <circle r="16" fill="rgba(56, 189, 248, 0.3)" className="radar-circle" />
                    <circle r="10" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" />
                    <text x="-4" y="4" fill="#0f172a" fontSize="10" fontWeight="bold">🚌</text>
                  </g>
                </svg>

                <div className="bus-floating-telemetry">
                  <div className="telemetry-pill">
                    <Navigation size={14} className="text-sky" />
                    <span>Veículo: <strong>{currentLineData.veiculo}</strong></span>
                  </div>
                  <div className="telemetry-pill">
                    <Clock size={14} className="text-emerald" />
                    <span>Velocidade: <strong>{currentLineData.velocidade}</strong></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Line Information & Stops Card */}
            <div className="simulated-info-card">
              <div className="line-badge-top">
                <span className="line-num">{currentLineData.numero}</span>
                <span className="line-fare">{currentLineData.tarifa}</span>
              </div>
              <h4 className="line-name">{currentLineData.nome}</h4>
              <div className="line-meta-row">
                <span>Operadora: <strong>{currentLineData.empresa}</strong></span>
                <span>Sentido: <strong>{activeFilterSentido}</strong></span>
              </div>

              <div className="stops-timeline-header">
                <MapPin size={16} />
                <span>Sequência de Paradas ({currentLineData.paradas.length})</span>
              </div>

              <div className="stops-timeline-list">
                {currentLineData.paradas.map((parada, idx) => {
                  const isCurrentStop = idx === busPositionIndex;

                  return (
                    <div key={idx} className={`timeline-stop-item ${isCurrentStop ? 'active-stop' : ''}`}>
                      <div className="stop-bullet">
                        {isCurrentStop ? <Bus size={12} /> : idx + 1}
                      </div>
                      <div className="stop-name">
                        {parada}
                        {isCurrentStop && <span className="pill-near">Próxima Parada</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SUTINF Architectural Standard Guide */}
      <div className="architecture-recap-card">
        <h3>🏛️ Estrutura de Pastas Recomendada para o Projeto</h3>
        <pre className="code-tree">
{`src/
├── screens/
│   └── InfoOnibusScreen.tsx        # UI pura (sem chamadas a APIs!)
├── hooks/
│   └── useInfoOnibus.ts           # Regra das 50 Linhas: estado, timer de GPS e busca
├── services/
│   └── infoonibusService.ts       # Chamadas HTTP com axios (VITE_API_URL)
├── components/
│   ├── MapaItinerario.tsx         # Componente burro de renderização do mapa
│   ├── ListaParadas.tsx           # Componente burro de lista de paradas
│   └── LinhaSearchInput.tsx       # Componente burro de busca
└── types/
    └── infoonibus.ts              # Interfaces estritas (proibido usar any!)`}
        </pre>
      </div>

      {/* Footer Banner */}
      <div className="frontend-footer-cta">
        <p>Revise as 4 Regras de Ouro e a analogia do restaurante no Guia Oficial de Front-end:</p>
        <button onClick={() => onNavigate('modulo-frontend')} className="btn-secondary">
          <BookOpen size={16} />
          Consultar Guia Prático de Arquitetura Front-end
        </button>
      </div>
    </div>
  );
};
