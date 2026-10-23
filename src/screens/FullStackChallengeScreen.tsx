import React, { useState, useMemo } from 'react';
import {
  Rocket,
  Search,
  Bus,
  Clock,
  MapPin,
  Map,
  Database,
  CheckCircle2,
  Circle,
  Layers,
  Sparkles,
  Server,
  Layout,
  Compass,
} from 'lucide-react';
import { ChallengeSubmission } from '../types';
import { ChallengeSubmissionPanel } from '../components/ChallengeSubmissionPanel';

interface FullStackChallengeScreenProps {
  completedItems: string[];
  onToggleItem: (itemKey: string) => void;
  submission?: ChallengeSubmission;
  onSaveSubmission: (challengeId: string, data: Partial<ChallengeSubmission>) => void;
}

interface MockFullBusLine {
  cd_linha: string;
  tx_linha: string;
  vl_tarifa: number;
  sentido: 'IDA' | 'VOLTA' | 'CIRCULAR';
  nm_operadora: string;
  lin_extensao: number;
  svgPath: string;
  originLabel: string;
  destLabel: string;
  originCoords: { x: number; y: number };
  destCoords: { x: number; y: number };
  itinerarioDescritivo: { seq: number; via: string }[];
  horarios: { hr: string; dias: string }[];
}

const INFO_ONIBUS_FULL_MOCK: MockFullBusLine[] = [
  {
    cd_linha: '0.111',
    tx_linha: 'RODOVIÁRIA DO PLANO PILOTO / ASA NORTE (UNB)',
    vl_tarifa: 3.8,
    sentido: 'CIRCULAR',
    nm_operadora: 'VIAÇÃO PIRACICABANA LTDA',
    lin_extensao: 29.7,
    svgPath: 'M 260 155 Q 275 110, 295 85 T 275 65 Q 255 95, 260 155',
    originLabel: 'Rodoviária Plano Piloto',
    destLabel: 'Campus UnB / Asa Norte',
    originCoords: { x: 260, y: 155 },
    destCoords: { x: 285, y: 72 },
    itinerarioDescritivo: [
      { seq: 1, via: 'PLATAFORMA E - RODOVIÁRIA DO PLANO PILOTO' },
      { seq: 2, via: 'EIXO RODOVIÁRIO NORTE (EIXÃO)' },
      { seq: 3, via: 'VIA L2 NORTE - QUADRAS 406/408' },
      { seq: 4, via: 'CAMPUS UNIVERSITÁRIO DARCY RIBEIRO (UNB)' },
      { seq: 5, via: 'EIXO RODOVIÁRIO NORTE (RETORNO)' },
    ],
    horarios: [
      { hr: '06:15', dias: 'Segunda a Sexta' },
      { hr: '06:45', dias: 'Segunda a Sexta' },
      { hr: '07:30', dias: 'Todos os dias' },
      { hr: '12:15', dias: 'Segunda a Sexta' },
      { hr: '18:15', dias: 'Segunda a Sexta' },
    ],
  },
  {
    cd_linha: '0.170',
    tx_linha: 'TAGUATINGA SUL / RODOVIÁRIA DO PLANO PILOTO (EPTG)',
    vl_tarifa: 5.5,
    sentido: 'IDA',
    nm_operadora: 'AUTO VIAÇÃO MARECHAL',
    lin_extensao: 38.4,
    svgPath: 'M 105 175 Q 165 168, 210 162 T 260 155',
    originLabel: 'Taguatinga Sul',
    destLabel: 'Rodoviária Plano Piloto',
    originCoords: { x: 105, y: 175 },
    destCoords: { x: 260, y: 155 },
    itinerarioDescritivo: [
      { seq: 1, via: 'AVENIDA COMERCIAL SUL - TAGUATINGA' },
      { seq: 2, via: 'ESTRADA PARQUE TAGUATINGA (VIA EPTG)' },
      { seq: 3, via: 'VIA EPIG / SETOR SUDOESTE' },
      { seq: 4, via: 'EIXO MONUMENTAL - RODOVIÁRIA DO PLANO PILOTO' },
    ],
    horarios: [
      { hr: '05:45', dias: 'Todos os dias' },
      { hr: '06:15', dias: 'Segunda a Sexta' },
      { hr: '06:50', dias: 'Segunda a Sexta' },
      { hr: '17:30', dias: 'Segunda a Sexta' },
      { hr: '22:40', dias: 'Sábado e Domingo' },
    ],
  },
  {
    cd_linha: '2204',
    tx_linha: 'GAMA (TERMINAL BRT) / RODOVIÁRIA DO PLANO PILOTO',
    vl_tarifa: 5.5,
    sentido: 'IDA',
    nm_operadora: 'VIAÇÃO PIONEIRA LTDA',
    lin_extensao: 74.8,
    svgPath: 'M 155 255 Q 195 220, 225 190 T 260 155',
    originLabel: 'Terminal BRT Gama',
    destLabel: 'Rodoviária Plano Piloto',
    originCoords: { x: 155, y: 255 },
    destCoords: { x: 260, y: 155 },
    itinerarioDescritivo: [
      { seq: 1, via: 'TERMINAL DE INTEGRAÇÃO BRT GAMA' },
      { seq: 2, via: 'DF-480 / BR-040 (CORREDOR EXCLUSIVO BRT SUL)' },
      { seq: 3, via: 'ESTAÇÃO PARK WAY / TERMINAL FLORICULTURA' },
      { seq: 4, via: 'EIXO RODOVIÁRIO SUL (EIXÃO SUL)' },
      { seq: 5, via: 'RODOVIÁRIA DO PLANO PILOTO' },
    ],
    horarios: [
      { hr: '05:00', dias: 'Todos os dias' },
      { hr: '05:20', dias: 'Segunda a Sexta' },
      { hr: '05:40', dias: 'Segunda a Sexta' },
      { hr: '06:00', dias: 'Todos os dias' },
    ],
  },
];

const INFO_ONIBUS_STATIONS = [
  {
    key: 'info-st-1',
    phase: '1ª Etapa • Migração para o Banco BDG',
    file: '.env & src/config/Database.ts (BoilerPlate_Back_end)',
    title: 'Desconectar do Docker Local e Conectar ao Banco BDG com suas Credenciais',
    desc: 'No BoilerPlate_Back_end, altere as variáveis DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME e DB_PASSWORD no seu .env para apontar para o banco oficial de desenvolvimento/homologação (bdg) da SEMOB usando as suas próprias credenciais (com DB_SYNCHRONIZE=false obrigatório!).',
  },
  {
    key: 'info-st-2',
    phase: '2ª Etapa • Reaproveitamento + Novas APIs no Back-end',
    file: 'src/repository/Linha.ts, src/service/Linha.ts & src/controller/Linha.ts',
    title: 'Aproveitar as 2 APIs Anteriores e Criar as Novas APIs do InfoÔnibus',
    desc: 'Reaproveite as APIs de Itinerário Descritivo e Tabela Horária já criadas e construa as novas APIs no Back-end: 1) Pesquisa Geral de Linhas (por código ou nome); 2) Detalhes Completos da Linha (retornando tarifa, extensão, sentidos e empresa operadora via tab_operadora); e 3) API de Itinerário Espacial (retornando geo_linhas_lin / geometria da linha por sentido para desenhar no mapa de Brasília).',
  },
  {
    key: 'info-st-3',
    phase: '3ª Etapa • Registo do InfoÔnibus dentro do SCL',
    file: 'src/config/modules.ts, src/modulos/SCL/SCLMenu.tsx & src/App.tsx',
    title: 'Registar o InfoÔnibus dentro do Módulo SCL como Novo Padrão',
    desc: 'No BoilerPlate_Front_end, registe a rota "/scl/infoonibus" em src/config/modules.ts e no src/App.tsx, e adicione o Card em destaque do InfoÔnibus (com a logo /images/logo_infoonibus.webp) dentro do src/modulos/SCL/SCLMenu.tsx.',
  },
  {
    key: 'info-st-4',
    phase: '4ª Etapa • Construção em 5 Camadas + Mapa de Brasília',
    file: 'src/modulos/SCL/InfoOnibus/ (types, services, hooks, components & InfoOnibus.tsx)',
    title: 'Construir os Micro-Hooks, o Mapa Espacial de Brasília e o Compilador Final',
    desc: 'Crie a pasta src/modulos/SCL/InfoOnibus/ seguindo a modularização máxima: types/, services/infoOnibusService.ts (consumindo todas as APIs do Back-end conectado ao bdg), hooks/ e components/ (incluindo o Mapa de Brasília renderizando a geometria espacial da linha, a aba de Itinerário Descritivo e a aba de Tabela Horária com Dias de Operação), fechando com o compilador InfoOnibus.tsx!',
  },
];

export const FullStackChallengeScreen: React.FC<FullStackChallengeScreenProps> = ({
  completedItems,
  onToggleItem,
  submission,
  onSaveSubmission,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sentidoFilter, setSentidoFilter] = useState<'TODOS' | 'IDA' | 'VOLTA' | 'CIRCULAR'>('TODOS');
  const [selectedLine, setSelectedLine] = useState<MockFullBusLine>(INFO_ONIBUS_FULL_MOCK[0]);
  const [activeDetailTab, setActiveDetailTab] = useState<'mapa' | 'descritivo' | 'horarios'>('mapa');

  const filteredLines = useMemo(() => {
    return INFO_ONIBUS_FULL_MOCK.filter((line) => {
      const matchesSentido = sentidoFilter === 'TODOS' || line.sentido === sentidoFilter;
      const matchesSearch =
        line.cd_linha.toLowerCase().includes(searchQuery.toLowerCase()) ||
        line.tx_linha.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSentido && matchesSearch;
    });
  }, [searchQuery, sentidoFilter]);

  return (
    <div className="screen-container">
      {/* Hero Banner */}
      <section className="hero-banner">
        <div className="hero-content">
          <span className="hero-badge">
            <Rocket size={14} /> Etapa 4 (Desafio Final Full-Stack) • Banco BDG + Back-end + SCL Front-end
          </span>
          <h1>Desafio Final: O Sistema "InfoÔnibus" Completo no Módulo SCL</h1>
          <p>
            No desafio final, você dará o passo definitivo como desenvolvedor da SEMOB: vai{' '}
            <strong>desconectar o seu BoilerPlate_Back_end do Docker local</strong>, conectá-lo com as suas
            credenciais no <strong>banco oficial `bdg`</strong>, criar as APIs complementares (incluindo o{' '}
            <strong>traçado espacial `geo_linhas_lin`</strong>) e construir o submódulo completo{' '}
            <code>src/modulos/SCL/InfoOnibus/</code> com o <strong>Mapa de Brasília</strong>!
          </p>
        </div>
      </section>

      {/* Arquitetura do Desafio Final: Banco BDG + APIs + SCL */}
      <section className="section-card">
        <h2>
          <Compass size={20} style={{ display: 'inline', marginRight: '0.5rem' }} />
          O Que Muda neste Desafio Final? (Os 3 Pilares do InfoÔnibus)
        </h2>

        <div className="cards-grid three-cols" style={{ marginTop: '1rem' }}>
          {/* Pilar 1: Banco BDG */}
          <div className="glass-card" style={{ padding: '1.2rem', borderLeft: '4px solid #f59e0b' }}>
            <strong style={{ color: '#f59e0b', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.92rem' }}>
              <Database size={16} /> 1. Conexão Real ao Banco BDG
            </strong>
            <p className="text-muted" style={{ fontSize: '0.83rem', marginTop: '0.45rem', lineHeight: 1.6 }}>
              Chega de banco local de teste! No <code>.env</code> do seu <strong>BoilerPlate_Back_end</strong>, você vai desconectar do Docker local e configurar a conexão apontando para o banco <strong><code>bdg</code></strong> com o seu usuário e senha da SEMOB.
            </p>
            <pre className="code-block" style={{ marginTop: '0.6rem', fontSize: '0.73rem' }}>
              <code>{`# .env no BoilerPlate_Back_end:
DB_HOST=<ip-do-servidor-bdg>
DB_DATABASE=bdg
DB_SCHEMA=dados_mobilidade
DB_USERNAME=seu_usuario_semob
DB_PASSWORD=sua_senha
DB_SYNCHRONIZE=false`}</code>
            </pre>
          </div>

          {/* Pilar 2: Reaproveitamento + Novas APIs */}
          <div className="glass-card" style={{ padding: '1.2rem', borderLeft: '4px solid #38bdf8' }}>
            <strong style={{ color: '#38bdf8', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.92rem' }}>
              <Server size={16} /> 2. Suas APIs + Novas Rotas no Back
            </strong>
            <p className="text-muted" style={{ fontSize: '0.83rem', marginTop: '0.45rem', lineHeight: 1.6 }}>
              Você <strong>reaproveita</strong> as 2 APIs que criou na etapa anterior e adiciona as APIs restantes para alimentar o InfoÔnibus completo:
            </p>
            <ul style={{ fontSize: '0.78rem', fontFamily: 'monospace', paddingLeft: '1.1rem', marginTop: '0.5rem', lineHeight: 1.65 }}>
              <li>✅ GET /linhas/:codigo/itinerario (Já feita!)</li>
              <li>✅ GET /linhas/:codigo/horarios (Já feita!)</li>
              <li style={{ color: '#38bdf8', fontWeight: 700 }}>➕ GET /linhas?busca= (Pesquisa Geral)</li>
              <li style={{ color: '#38bdf8', fontWeight: 700 }}>➕ GET /linhas/:codigo/detalhes (Tarifa, Extensão, Operadora)</li>
              <li style={{ color: '#38bdf8', fontWeight: 700 }}>➕ GET /linhas/:codigo/espacial (Geometria geo_linhas_lin p/ Mapa)</li>
            </ul>
          </div>

          {/* Pilar 3: InfoÔnibus dentro do SCL */}
          <div className="glass-card" style={{ padding: '1.2rem', borderLeft: '4px solid #10b981' }}>
            <strong style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.92rem' }}>
              <Layout size={16} /> 3. Novo Padrão dentro do Módulo SCL
            </strong>
            <p className="text-muted" style={{ fontSize: '0.83rem', marginTop: '0.45rem', lineHeight: 1.6 }}>
              O <strong>InfoÔnibus</strong> vive dentro do módulo <strong>SCL (<code>src/modulos/SCL/InfoOnibus/</code>)</strong> seguindo as 7 Estações (<code>modules.ts</code> ➔ <code>SCLMenu.tsx</code> ➔ <code>types/</code>, <code>services/</code>, <code>hooks/</code>, <code>components/</code> e o compilador <code>InfoOnibus.tsx</code>).
            </p>
          </div>
        </div>
      </section>

      {/* Protótipo Interativo Completo: Mapa de Brasília + Itinerário Espacial + Descritivo + Horários */}
      <section className="section-card">
        <div className="section-header-row">
          <div>
            <h2>
              <Sparkles size={20} style={{ display: 'inline', marginRight: '0.5rem' }} />
              Guia Visual Definitivo: Como o seu "InfoÔnibus" no SCL deve funcionar
            </h2>
            <p className="text-muted">
              Pesquise uma linha abaixo, clique sobre ela e alterne entre as 3 abas à direita (<strong>1. Mapa de Brasília & Traçado Espacial</strong>, <strong>2. Itinerário Descritivo</strong> e <strong>3. Tabela Horária & Dias de Operação</strong>):
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
          {/* Barra Superior do Browser */}
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
              http://localhost:5173/scl/infoonibus (src/modulos/SCL/InfoOnibus/InfoOnibus.tsx • Conectado ao BDG)
            </div>
          </div>

          <div style={{ padding: '1.5rem' }}>
            {/* Barra de Pesquisa e Filtro de Sentido */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.75rem',
                justifyContent: 'space-between',
                marginBottom: '1.25rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: '1 1 260px' }}>
                <Search size={18} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Pesquisar linha por código (0.111, 0.170, 2204) ou denominação..."
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

            {/* Layout Mestre-Detalhe do InfoÔnibus */}
            <div className="cards-grid two-cols" style={{ alignItems: 'start' }}>
              {/* Coluna Esquerda: Lista de Linhas + Resumo Operacional */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {filteredLines.map((line) => {
                  const isSelected = selectedLine.cd_linha === line.cd_linha;
                  return (
                    <div
                      key={line.cd_linha}
                      onClick={() => setSelectedLine(line)}
                      className="glass-card io-bus-card"
                      style={{
                        cursor: 'pointer',
                        border: isSelected ? '2px solid #38bdf8' : undefined,
                        padding: '1rem',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem' }}>
                        <span className="status-pill passed" style={{ fontWeight: 800 }}>
                          <Bus size={14} style={{ display: 'inline', marginRight: 4 }} />
                          Linha {line.cd_linha}
                        </span>
                        <div style={{ display: 'flex', gap: '0.35rem' }}>
                          <span className="status-pill pending" style={{ fontSize: '0.72rem' }}>
                            {line.sentido}
                          </span>
                          <span className="status-pill passed" style={{ fontSize: '0.72rem' }}>
                            R$ {line.vl_tarifa.toFixed(2)}
                          </span>
                          <span className="status-pill pending" style={{ fontSize: '0.72rem' }}>
                            {line.lin_extensao} km
                          </span>
                        </div>
                      </div>
                      <h4 style={{ marginTop: '0.5rem', fontSize: '0.94rem' }}>{line.tx_linha}</h4>
                      <p className="text-muted" style={{ fontSize: '0.78rem', marginTop: '0.25rem' }}>
                        Permissionária: <strong>{line.nm_operadora}</strong>
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Coluna Direita: Painel Completo da Linha (Mapa Espacial + Itinerário Descritivo + Horários) */}
              <div className="glass-card" style={{ padding: '1.25rem' }}>
                {/* Cabeçalho Consolidado da Linha */}
                <div
                  style={{
                    borderBottom: '1px solid rgba(148,163,184,0.2)',
                    paddingBottom: '0.85rem',
                    marginBottom: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <span className="status-pill passed" style={{ fontSize: '0.72rem' }}>
                      Linha {selectedLine.cd_linha} • {selectedLine.sentido}
                    </span>
                    <span className="text-muted" style={{ fontSize: '0.76rem', fontFamily: 'monospace' }}>
                      Extensão: {selectedLine.lin_extensao} km • Tarifa: R$ {selectedLine.vl_tarifa.toFixed(2)}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.1rem', marginTop: '0.4rem' }}>{selectedLine.tx_linha}</h3>
                  <p className="text-muted" style={{ fontSize: '0.8rem', marginTop: '0.15rem' }}>
                    Operadora (tab_operadora): <strong>{selectedLine.nm_operadora}</strong>
                  </p>
                </div>

                {/* Abas Internas: 1. Mapa Espacial | 2. Itinerário Descritivo | 3. Horários & Dias */}
                <div className="sql-filter-buttons" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginBottom: '1rem' }}>
                  <button
                    type="button"
                    onClick={() => setActiveDetailTab('mapa')}
                    className={`sql-filter-btn ${activeDetailTab === 'mapa' ? 'active' : ''}`}
                  >
                    <Map size={14} style={{ display: 'inline', marginRight: 4 }} />
                    1. Mapa de Brasília (geo_linhas_lin)
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveDetailTab('descritivo')}
                    className={`sql-filter-btn ${activeDetailTab === 'descritivo' ? 'active' : ''}`}
                  >
                    <MapPin size={14} style={{ display: 'inline', marginRight: 4 }} />
                    2. Itinerário Descritivo ({selectedLine.itinerarioDescritivo.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveDetailTab('horarios')}
                    className={`sql-filter-btn ${activeDetailTab === 'horarios' ? 'active' : ''}`}
                  >
                    <Clock size={14} style={{ display: 'inline', marginRight: 4 }} />
                    3. Tabela Horária & Dias ({selectedLine.horarios.length})
                  </button>
                </div>

                {/* CONTEÚDO ABA 1: MAPA DE BRASÍLIA COM GEOMETRIA ESPACIAL */}
                {activeDetailTab === 'mapa' && (
                  <div>
                    <div
                      style={{
                        background: '#0f172a',
                        borderRadius: '12px',
                        border: '1px solid rgba(56, 189, 248, 0.3)',
                        padding: '0.75rem',
                        position: 'relative',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#94a3b8', marginBottom: '0.4rem', fontFamily: 'monospace' }}>
                        <span>🗺️ Mapa Vetorial — Distrito Federal (SIRGAS 2000 / EPSG:4326)</span>
                        <span style={{ color: '#38bdf8' }}>Coluna: ti.geo_linhas_lin</span>
                      </div>

                      <svg viewBox="0 0 400 290" style={{ width: '100%', height: '220px', background: '#090d16', borderRadius: '8px' }}>
                        {/* Grade geográfica de Brasília */}
                        <line x1="0" y1="70" x2="400" y2="70" stroke="#1e293b" strokeWidth="1" />
                        <line x1="0" y1="155" x2="400" y2="155" stroke="#1e293b" strokeWidth="1" />
                        <line x1="0" y1="230" x2="400" y2="230" stroke="#1e293b" strokeWidth="1" />
                        <line x1="120" y1="0" x2="120" y2="290" stroke="#1e293b" strokeWidth="1" />
                        <line x1="260" y1="0" x2="260" y2="290" stroke="#1e293b" strokeWidth="1" />

                        {/* Lago Paranoá estilizado */}
                        <path
                          d="M 295 95 Q 325 145, 295 205 Q 280 180, 290 150 Z"
                          fill="rgba(56, 189, 248, 0.12)"
                          stroke="rgba(56, 189, 248, 0.25)"
                        />

                        {/* Rótulos de Regiões Administrativas do DF */}
                        <text x="275" y="152" fill="#64748b" fontSize="9" fontFamily="sans-serif">Plano Piloto</text>
                        <text x="65" y="168" fill="#64748b" fontSize="9" fontFamily="sans-serif">Taguatinga</text>
                        <text x="115" y="272" fill="#64748b" fontSize="9" fontFamily="sans-serif">Gama</text>
                        <text x="290" y="60" fill="#64748b" fontSize="9" fontFamily="sans-serif">Asa Norte / UnB</text>

                        {/* Traçado Espacial (LINESTRING) da Linha Selecionada */}
                        <path
                          d={selectedLine.svgPath}
                          fill="none"
                          stroke="#38bdf8"
                          strokeWidth="4"
                          strokeLinecap="round"
                        />

                        {/* Ponto de Origem e Destino */}
                        <circle cx={selectedLine.originCoords.x} cy={selectedLine.originCoords.y} r="6" fill="#10b981" />
                        <circle cx={selectedLine.destCoords.x} cy={selectedLine.destCoords.y} r="6" fill="#f59e0b" />
                      </svg>

                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginTop: '0.5rem', color: '#cbd5e1' }}>
                        <span>🟢 Origem: <strong>{selectedLine.originLabel}</strong></span>
                        <span>🟠 Destino: <strong>{selectedLine.destLabel}</strong></span>
                      </div>
                    </div>
                  </div>
                )}

                {/* CONTEÚDO ABA 2: ITINERÁRIO DESCRITIVO */}
                {activeDetailTab === 'descritivo' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                    {selectedLine.itinerarioDescritivo.map((item) => (
                      <div
                        key={item.seq}
                        className="glass-card"
                        style={{ padding: '0.65rem 0.9rem', display: 'flex', alignItems: 'center', gap: '0.65rem' }}
                      >
                        <span className="status-pill passed" style={{ fontSize: '0.72rem' }}>
                          {item.seq}º
                        </span>
                        <span style={{ fontSize: '0.84rem', fontWeight: 600 }}>{item.via}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* CONTEÚDO ABA 3: TABELA HORÁRIA E DIAS DE OPERAÇÃO */}
                {activeDetailTab === 'horarios' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                    {selectedLine.horarios.map((h, i) => (
                      <div
                        key={i}
                        className="glass-card"
                        style={{
                          padding: '0.65rem 0.9rem',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <span className="status-pill passed" style={{ fontFamily: 'monospace', fontWeight: 700 }}>
                          🕒 {h.hr}
                        </span>
                        <span className="status-pill pending" style={{ fontSize: '0.75rem' }}>
                          📅 {h.dias}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Roteiro das 4 Etapas do Desafio Final */}
      <section className="section-card">
        <h2>
          <Layers size={20} style={{ display: 'inline', marginRight: '0.5rem' }} />
          Roteiro de Execução do Desafio Final (InfoÔnibus no SCL)
        </h2>
        <div className="checklist-box" style={{ marginTop: '1rem' }}>
          {INFO_ONIBUS_STATIONS.map((step) => {
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
                      {step.phase}
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

      {/* Submissão do Desafio Final */}
      <ChallengeSubmissionPanel
        challengeId="challenge-fullstack-infoonibus"
        title="Entrega Final: Projeto InfoÔnibus (Banco BDG + Back-end + SCL Front-end)"
        subtitle="Confirme o cumprimento de todos os requisitos técnicos e envie o link do repositório Git para revisão do supervisor."
        requireRepoUrl={true}
        existingSubmission={submission}
        onSaveSubmission={onSaveSubmission}
        prChecklist={[
          'Desconectei o BoilerPlate_Back_end do Docker local e vinculei o .env ao banco bdg com minhas credenciais (mantendo DB_SYNCHRONIZE=false)?',
          'Reaproveitei as APIs de Itinerário Descritivo e Horários e criei as novas rotas (Pesquisa de Linha, Detalhes com Operadora e Geometria Espacial geo_linhas_lin)?',
          'Registei o InfoÔnibus dentro do módulo SCL (src/config/modules.ts, SCLMenu.tsx e src/modulos/SCL/InfoOnibus/) seguindo a arquitetura de 5 camadas?',
          'A interface exibe todas as informações da linha, o Mapa de Brasília com o traçado espacial, o Itinerário Descritivo e a Tabela Horária com os dias de operação?',
        ]}
      />
    </div>
  );
};
