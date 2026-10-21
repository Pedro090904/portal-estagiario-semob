import React, { useState } from 'react';
import {
  Folder,
  FileCode,
  CheckCircle2,
  XCircle,
  Lock,
  Unlock,
  Play,
  KeyRound,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Copy,
  Check,
  Layers,
  AlertTriangle,
  ServerCrash,
} from 'lucide-react';
import { InteractiveFolderItem, GuidedStepItem, HttpStatusCodeItem } from '../types';

// ============================================================================
// 1. EXPLORADOR INTERATIVO DE PASTAS DO SISMOB-BOILERPLATE
// ============================================================================
export const InteractiveFolderExplorer: React.FC<{
  items: InteractiveFolderItem[];
}> = ({ items }) => {
  const [selectedId, setSelectedId] = useState<string>(items[0]?.id || '');
  const active = items.find((i) => i.id === selectedId) || items[0];

  if (!active) return null;

  return (
    <div
      className="glass-card"
      style={{
        marginTop: '1.5rem',
        padding: '1.25rem',
        border: '1px solid rgba(56, 189, 248, 0.3)',
      }}
    >
      <div style={{ marginBottom: '1rem' }}>
        <span className="hero-badge" style={{ marginBottom: '0.4rem' }}>
          🗂️ Explorador Interativo do SISMOB-BOILERPLATE
        </span>
        <p className="text-muted" style={{ fontSize: '0.86rem' }}>
          Clique em cada pasta ou arquivo abaixo para descobrir o que vai dentro dele, sua analogia prática e as regras da equipe:
        </p>
      </div>

      <div className="cards-grid two-cols" style={{ alignItems: 'stretch' }}>
        {/* Coluna Esquerda: Árvore de Pastas tipo VS Code */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.65)',
            borderRadius: '12px',
            padding: '0.85rem',
            border: '1px solid rgba(148, 163, 184, 0.15)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem',
          }}
        >
          <div
            style={{
              fontSize: '0.75rem',
              fontFamily: 'monospace',
              color: '#94a3b8',
              paddingBottom: '0.4rem',
              borderBottom: '1px solid rgba(148,163,184,0.15)',
              marginBottom: '0.3rem',
            }}
          >
            📦 SISMOB-BOILERPLATE/
          </div>

          {items.map((item) => {
            const isSelected = item.id === active.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedId(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  width: '100%',
                  textAlign: 'left',
                  padding: '0.55rem 0.75rem',
                  borderRadius: '8px',
                  fontFamily: 'monospace',
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  border: isSelected
                    ? '1px solid #38bdf8'
                    : '1px solid transparent',
                  background: isSelected
                    ? 'rgba(56, 189, 248, 0.15)'
                    : 'transparent',
                  color: isSelected ? '#38bdf8' : 'inherit',
                  fontWeight: isSelected ? 700 : 500,
                }}
              >
                {item.type === 'folder' ? (
                  <Folder size={16} color={isSelected ? '#38bdf8' : '#f59e0b'} />
                ) : (
                  <FileCode size={16} color="#818cf8" />
                )}
                <span>{item.path}</span>
              </button>
            );
          })}
        </div>

        {/* Coluna Direita: Detalhes Didáticos da Pasta Selecionada */}
        <div
          className="glass-card"
          style={{
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.5rem',
                marginBottom: '0.75rem',
              }}
            >
              <code style={{ fontSize: '1.05rem', fontWeight: 800, color: '#38bdf8' }}>
                {active.path}
              </code>
              <span className="status-pill passed" style={{ fontSize: '0.74rem' }}>
                💡 {active.analogy}
              </span>
            </div>

            <p style={{ fontSize: '0.92rem', lineHeight: 1.65, marginBottom: '1rem' }}>
              {active.purpose}
            </p>

            <div style={{ marginBottom: '1rem' }}>
              <strong style={{ fontSize: '0.8rem', display: 'block', marginBottom: '0.4rem', color: '#94a3b8' }}>
                📄 Arquivos reais no Boilerplate:
              </strong>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {active.filesInside.map((f) => (
                  <code
                    key={f}
                    style={{
                      fontSize: '0.76rem',
                      padding: '0.2rem 0.55rem',
                      borderRadius: '6px',
                      background: 'rgba(56, 189, 248, 0.1)',
                    }}
                  >
                    {f}
                  </code>
                ))}
              </div>
            </div>

            <div className="cards-grid two-cols" style={{ gap: '0.75rem' }}>
              <div
                style={{
                  background: 'rgba(16, 185, 129, 0.08)',
                  borderLeft: '3px solid #10b981',
                  padding: '0.75rem',
                  borderRadius: '6px',
                }}
              >
                <strong
                  style={{
                    fontSize: '0.78rem',
                    color: '#10b981',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    marginBottom: '0.35rem',
                  }}
                >
                  <CheckCircle2 size={14} /> O que VAI aqui:
                </strong>
                <ul style={{ paddingLeft: '1.1rem', fontSize: '0.8rem', lineHeight: 1.55 }}>
                  {active.mustDo.map((m, i) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
              </div>

              <div
                style={{
                  background: 'rgba(239, 68, 68, 0.08)',
                  borderLeft: '3px solid #ef4444',
                  padding: '0.75rem',
                  borderRadius: '6px',
                }}
              >
                <strong
                  style={{
                    fontSize: '0.78rem',
                    color: '#ef4444',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    marginBottom: '0.35rem',
                  }}
                >
                  <XCircle size={14} /> O que NUNCA vai aqui:
                </strong>
                <ul style={{ paddingLeft: '1.1rem', fontSize: '0.8rem', lineHeight: 1.55 }}>
                  {active.mustNotDo.map((m, i) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {active.codePreview && (
            <pre className="code-block" style={{ marginTop: '1rem', fontSize: '0.78rem' }}>
              <code>{active.codePreview}</code>
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 2. SIMULADOR INTERATIVO DO SWAGGER (PORTA 8097/api/docs)
// ============================================================================
export const InteractiveSwaggerSimulator: React.FC = () => {
  const [jwtToken, setJwtToken] = useState<string>('');
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [codigoFiltro, setCodigoFiltro] = useState<string>('0.111');
  const [apiResponse, setApiResponse] = useState<{
    status: number;
    body: string;
  } | null>(null);

  const handleSimulateLogin = () => {
    const fakeJwt =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInVzZXJuYW1lIjoiYWRtaW4iLCJyb2xlIjoiQURNSU4ifQ.sismob_signature_2026';
    setJwtToken(fakeJwt);
    setApiResponse({
      status: 200,
      body: JSON.stringify(
        {
          access_token: fakeJwt,
          token_type: 'Bearer',
          expires_in: '8h',
        },
        null,
        2
      ),
    });
  };

  const handleToggleAuthorize = () => {
    if (!jwtToken) {
      alert('1º Passo: Clique em "Executar POST /api/auth/login" abaixo para gerar o seu token JWT!');
      return;
    }
    setIsAuthorized(!isAuthorized);
  };

  const handleSimulateGetLinhas = () => {
    if (!isAuthorized) {
      setApiResponse({
        status: 401,
        body: JSON.stringify(
          {
            statusCode: 401,
            timestamp: new Date().toISOString(),
            path: `/api/linhas?codigo=${codigoFiltro}`,
            method: 'GET',
            message: 'Unauthorized — Token JWT ausente ou cadeado Authorize fechado!',
          },
          null,
          2
        ),
      });
      return;
    }

    setApiResponse({
      status: 200,
      body: JSON.stringify(
        [
          {
            id: 1,
            codigo: codigoFiltro || '0.111',
            descricao: 'RODOVIÁRIA DO PLANO PILOTO / ASA NORTE (UNB)',
            valorTarifa: 3.8,
            sentido: 'CIRCULAR',
          },
        ],
        null,
        2
      ),
    });
  };

  return (
    <div
      className="glass-card"
      style={{
        marginTop: '1.5rem',
        padding: '1.35rem',
        border: '1px solid rgba(16, 185, 129, 0.35)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
          paddingBottom: '1rem',
          borderBottom: '1px solid rgba(148,163,184,0.2)',
        }}
      >
        <div>
          <span className="hero-badge" style={{ marginBottom: '0.35rem' }}>
            🧪 Simulador Ao Vivo • Swagger UI (http://localhost:8097/api/docs)
          </span>
          <h3 style={{ fontSize: '1.1rem' }}>
            Pratique o Fluxo de Autenticação JWT e Consulta de Linhas
          </h3>
          <p className="text-muted" style={{ fontSize: '0.84rem' }}>
            Tente chamar a rota <code>GET /api/linhas</code> antes e depois de fazer login e destravar o botão <strong>Authorize</strong>:
          </p>
        </div>

        <button
          type="button"
          onClick={handleToggleAuthorize}
          className={isAuthorized ? 'btn-primary' : 'btn-secondary'}
          style={{
            borderColor: '#10b981',
            background: isAuthorized ? '#10b981' : undefined,
            color: isAuthorized ? '#090d16' : undefined,
          }}
        >
          {isAuthorized ? <Unlock size={16} /> : <Lock size={16} />}
          {isAuthorized ? 'Authorized (JWT Ativo ✓)' : 'Authorize (Cadeado Fechado)'}
        </button>
      </div>

      <div className="cards-grid two-cols" style={{ marginTop: '1.15rem' }}>
        {/* Passo A: POST /api/auth/login */}
        <div className="glass-card" style={{ padding: '1rem', borderLeft: '4px solid #38bdf8' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span className="status-pill passed" style={{ fontFamily: 'monospace', fontWeight: 700 }}>
              POST /api/auth/login
            </span>
            <span className="text-muted" style={{ fontSize: '0.75rem' }}>Rota Pública</span>
          </div>
          <p className="text-muted" style={{ fontSize: '0.82rem', marginBottom: '0.75rem' }}>
            1º Passo: Envia <code>username: "admin"</code> e recebe o <code>access_token</code>.
          </p>
          <button type="button" className="btn-primary" onClick={handleSimulateLogin}>
            <KeyRound size={15} /> 1. Executar Login e Gerar Token
          </button>
        </div>

        {/* Passo B: GET /api/linhas */}
        <div className="glass-card" style={{ padding: '1rem', borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span className="status-pill passed" style={{ fontFamily: 'monospace', fontWeight: 700 }}>
              GET /api/linhas
            </span>
            <span className="text-muted" style={{ fontSize: '0.75rem' }}>
              {isAuthorized ? '🔓 JwtAuthGuard Liberado' : '🔒 Protegido por JwtAuthGuard'}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.75rem' }}>
            <label style={{ fontSize: '0.78rem', fontFamily: 'monospace' }}>Query ?codigo=</label>
            <input
              type="text"
              value={codigoFiltro}
              onChange={(e) => setCodigoFiltro(e.target.value)}
              className="sql-editor-textarea"
              style={{ minHeight: '32px', height: '32px', padding: '0.25rem 0.6rem', width: '110px' }}
            />
          </div>
          <button type="button" className="btn-primary" onClick={handleSimulateGetLinhas}>
            <Play size={15} /> 3. Executar GET /api/linhas
          </button>
        </div>
      </div>

      {apiResponse && (
        <div style={{ marginTop: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
            <strong style={{ fontSize: '0.8rem', fontFamily: 'monospace' }}>
              Resposta do Servidor SISMOB:
            </strong>
            <span
              className={`status-pill ${apiResponse.status === 200 ? 'passed' : 'pending'}`}
              style={{ fontFamily: 'monospace' }}
            >
              HTTP {apiResponse.status}
            </span>
          </div>
          <pre className="code-block" style={{ margin: 0 }}>
            <code>{apiResponse.body}</code>
          </pre>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// 3. JORNADA DE CÓDIGO GUIADA PASSO A PASSO (EM VEZ DE PAREDÃO DE TEXTO)
// ============================================================================
export const StepByStepCodeJourney: React.FC<{
  steps: GuidedStepItem[];
}> = ({ steps }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  const step = steps[currentIdx];
  if (!step) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(step.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="glass-card"
      style={{
        marginTop: '1.5rem',
        padding: '1.5rem',
        border: '1px solid rgba(99, 102, 241, 0.35)',
      }}
    >
      {/* Barra de Progresso dos Passos (Stepper) */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '0.75rem',
            flexWrap: 'wrap',
            gap: '0.5rem',
          }}
        >
          <span className="hero-badge">
            <Layers size={14} /> Laboratório Guiado • Passo {step.stepNumber} de {steps.length}
          </span>
          <code style={{ fontSize: '0.82rem', color: '#38bdf8' }}>
            Ficheiro alvo: {step.fileTarget}
          </code>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
          {steps.map((s, idx) => (
            <button
              key={s.stepNumber}
              type="button"
              onClick={() => setCurrentIdx(idx)}
              className={`sql-filter-btn ${currentIdx === idx ? 'active' : ''}`}
              style={{ fontSize: '0.78rem' }}
            >
              {s.stepNumber}. {s.title}
            </button>
          ))}
        </div>
      </div>

      {/* Pergunta Pedagógica que este Passo Responde */}
      <div
        className="glass-card"
        style={{
          padding: '1rem 1.25rem',
          borderLeft: '4px solid #38bdf8',
          marginBottom: '1.25rem',
        }}
      >
        <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: '#38bdf8', fontWeight: 700 }}>
          🤔 Pergunta que este arquivo responde:
        </div>
        <h3 style={{ fontSize: '1.08rem', marginTop: '0.2rem' }}>{step.questionAnswered}</h3>
        <p className="text-muted" style={{ fontSize: '0.88rem', marginTop: '0.4rem', lineHeight: 1.6 }}>
          {step.whyItMatters}
        </p>
      </div>

      {/* Grid: Código à Esquerda + Explicação Linha a Linha à Direita */}
      <div className="cards-grid two-cols" style={{ alignItems: 'start' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <strong style={{ fontSize: '0.82rem', fontFamily: 'monospace' }}>
              Código para {step.fileTarget}
            </strong>
            <button
              type="button"
              className="btn-secondary"
              style={{ padding: '0.2rem 0.6rem', fontSize: '0.74rem' }}
              onClick={handleCopy}
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}
              {copied ? 'Copiado!' : 'Copiar'}
            </button>
          </div>
          <pre className="code-block" style={{ margin: 0 }}>
            <code>{step.code}</code>
          </pre>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          <strong style={{ fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Sparkles size={15} color="#38bdf8" /> Entendendo cada parte do código (Sem decorar!):
          </strong>
          {step.lineByLineExplanations.map((item, i) => (
            <div
              key={i}
              className="glass-card"
              style={{ padding: '0.8rem 1rem', borderLeft: '3px solid #818cf8' }}
            >
              <code
                style={{
                  display: 'block',
                  fontSize: '0.78rem',
                  color: '#38bdf8',
                  marginBottom: '0.3rem',
                  fontWeight: 700,
                }}
              >
                {item.lineHighlight}
              </code>
              <p className="text-muted" style={{ fontSize: '0.83rem', lineHeight: 1.55, margin: 0 }}>
                {item.explanation}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Navegação entre os Passos do Construtor */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '1.25rem',
          paddingTop: '1rem',
          borderTop: '1px solid rgba(148,163,184,0.15)',
        }}
      >
        <button
          type="button"
          className="btn-secondary"
          disabled={currentIdx === 0}
          onClick={() => setCurrentIdx((p) => Math.max(0, p - 1))}
          style={{ opacity: currentIdx === 0 ? 0.4 : 1 }}
        >
          <ArrowLeft size={15} /> Passo Anterior
        </button>

        <button
          type="button"
          className="btn-primary"
          disabled={currentIdx === steps.length - 1}
          onClick={() => setCurrentIdx((p) => Math.min(steps.length - 1, p + 1))}
          style={{ opacity: currentIdx === steps.length - 1 ? 0.4 : 1 }}
        >
          Próximo Passo ({currentIdx + 2}/{steps.length}) <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// 4. EXPLORADOR INTERATIVO DE CÓDIGOS DE STATUS HTTP (2xx, 4xx, 5xx)
// ============================================================================
export const InteractiveHttpCodesExplorer: React.FC<{
  items: HttpStatusCodeItem[];
}> = ({ items }) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | '2xx' | '4xx' | '5xx'>('all');
  const [selectedCode, setSelectedCode] = useState<number>(items[0]?.code || 200);
  const [copied, setCopied] = useState(false);

  const filteredItems = items.filter(
    (item) => selectedFilter === 'all' || item.category === selectedFilter
  );

  const active = items.find((i) => i.code === selectedCode) || filteredItems[0] || items[0];

  const handleCopy = () => {
    if (active) {
      navigator.clipboard.writeText(active.responsePreview);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getCategoryColor = (category: '2xx' | '4xx' | '5xx') => {
    if (category === '2xx') return '#10b981';
    if (category === '4xx') return '#f59e0b';
    return '#ef4444';
  };

  const getCategoryBadgeClass = (category: '2xx' | '4xx' | '5xx') => {
    if (category === '2xx') return 'passed';
    if (category === '4xx') return 'pending';
    return 'danger';
  };

  if (!active) return null;

  return (
    <div
      className="glass-card"
      style={{
        marginTop: '1.5rem',
        padding: '1.35rem',
        border: '1px solid rgba(56, 189, 248, 0.35)',
      }}
    >
      <div style={{ marginBottom: '1.15rem' }}>
        <span className="hero-badge" style={{ marginBottom: '0.4rem' }}>
          🚦 Painel Interativo de Códigos HTTP • A Linguagem das APIs
        </span>
        <h3 style={{ fontSize: '1.1rem', marginTop: '0.2rem' }}>
          Clique em cada status para ver a analogia, o cenário real no SISMOB e o JSON retornado:
        </h3>
        <p className="text-muted" style={{ fontSize: '0.86rem', marginTop: '0.25rem' }}>
          Entenda por que o Swagger retorna cada um desses números antes de testar os endpoints na prática.
        </p>

        {/* Filtros por Família */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginTop: '0.85rem' }}>
          <button
            type="button"
            className={`sql-filter-btn ${selectedFilter === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedFilter('all')}
          >
            Todos os Códigos ({items.length})
          </button>
          <button
            type="button"
            className={`sql-filter-btn ${selectedFilter === '2xx' ? 'active' : ''}`}
            onClick={() => setSelectedFilter('2xx')}
            style={{ color: selectedFilter === '2xx' ? undefined : '#10b981' }}
          >
            🟢 2xx Sucesso
          </button>
          <button
            type="button"
            className={`sql-filter-btn ${selectedFilter === '4xx' ? 'active' : ''}`}
            onClick={() => setSelectedFilter('4xx')}
            style={{ color: selectedFilter === '4xx' ? undefined : '#f59e0b' }}
          >
            🟡 4xx Erro do Cliente
          </button>
          <button
            type="button"
            className={`sql-filter-btn ${selectedFilter === '5xx' ? 'active' : ''}`}
            onClick={() => setSelectedFilter('5xx')}
            style={{ color: selectedFilter === '5xx' ? undefined : '#ef4444' }}
          >
            🔴 5xx Erro do Servidor
          </button>
        </div>
      </div>

      {/* Lista Horizontal de Códigos Clicáveis */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
          marginBottom: '1.25rem',
          paddingBottom: '0.85rem',
          borderBottom: '1px solid rgba(148, 163, 184, 0.15)',
        }}
      >
        {filteredItems.map((item) => {
          const isSelected = item.code === active.code;
          const color = getCategoryColor(item.category);
          return (
            <button
              key={item.code}
              type="button"
              onClick={() => setSelectedCode(item.code)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.45rem 0.85rem',
                borderRadius: '8px',
                fontFamily: 'monospace',
                fontSize: '0.84rem',
                cursor: 'pointer',
                fontWeight: isSelected ? 800 : 600,
                border: isSelected ? `2px solid ${color}` : '1px solid rgba(148, 163, 184, 0.2)',
                background: isSelected ? `${color}22` : 'rgba(15, 23, 42, 0.5)',
                color: isSelected ? color : '#94a3b8',
                transition: 'all 0.2s ease',
              }}
            >
              <span>{item.code}</span>
              <span style={{ fontSize: '0.78rem', opacity: 0.9 }}>{item.phrase}</span>
            </button>
          );
        })}
      </div>

      {/* Detalhes do Código Ativo: Card Dividido */}
      <div className="cards-grid two-cols" style={{ alignItems: 'start' }}>
        {/* Lado Esquerdo: Conceito, Analogia e Como Disparar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div
            className="glass-card"
            style={{
              padding: '1.1rem 1.25rem',
              borderLeft: `4px solid ${getCategoryColor(active.category)}`,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.5rem',
                flexWrap: 'wrap',
                gap: '0.4rem',
              }}
            >
              <span
                style={{
                  fontSize: '1.4rem',
                  fontWeight: 900,
                  fontFamily: 'monospace',
                  color: getCategoryColor(active.category),
                }}
              >
                HTTP {active.code} {active.phrase}
              </span>
              <span className={`status-pill ${getCategoryBadgeClass(active.category)}`}>
                Família {active.category}
              </span>
            </div>

            <div style={{ marginTop: '0.65rem' }}>
              <div
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: '#38bdf8',
                  textTransform: 'uppercase',
                  marginBottom: '0.2rem',
                }}
              >
                💡 Analogia Prática da Vida Real:
              </div>
              <p style={{ fontSize: '0.88rem', lineHeight: 1.55, margin: 0 }}>
                {active.analogy}
              </p>
            </div>
          </div>

          {/* Cenário no SISMOB */}
          <div
            className="glass-card"
            style={{ padding: '1rem 1.2rem', borderLeft: '3px solid #38bdf8' }}
          >
            <strong style={{ fontSize: '0.8rem', color: '#38bdf8', display: 'block', marginBottom: '0.3rem' }}>
              🏢 Quando acontece no SISMOB-BOILERPLATE:
            </strong>
            <p className="text-muted" style={{ fontSize: '0.85rem', lineHeight: 1.55, margin: 0 }}>
              {active.realWorldScenario}
            </p>
          </div>

          {/* Como Disparar no NestJS */}
          <div
            className="glass-card"
            style={{ padding: '1rem 1.2rem', borderLeft: '3px solid #818cf8' }}
          >
            <strong style={{ fontSize: '0.8rem', color: '#818cf8', display: 'block', marginBottom: '0.3rem' }}>
              ⚙️ Como o NestJS produz esse código:
            </strong>
            <code style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.5, display: 'block' }}>
              {active.howToTriggerNest}
            </code>
          </div>
        </div>

        {/* Lado Direito: Preview da Resposta JSON no Padrão SISMOB */}
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.4rem',
            }}
          >
            <strong style={{ fontSize: '0.82rem', fontFamily: 'monospace' }}>
              Corpo da Resposta (AllExceptionsFilter / NestJS)
            </strong>
            <button
              type="button"
              className="btn-secondary"
              style={{ padding: '0.2rem 0.6rem', fontSize: '0.74rem' }}
              onClick={handleCopy}
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}
              {copied ? 'Copiado!' : 'Copiar JSON'}
            </button>
          </div>
          <pre className="code-block" style={{ margin: 0, minHeight: '260px' }}>
            <code>{active.responsePreview}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};

