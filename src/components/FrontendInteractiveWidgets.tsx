import React, { useState } from 'react';
import {
  Database,
  CheckCircle2,
  AlertCircle,
  Wifi,
  WifiOff,
  ShieldCheck,
  AlertTriangle,
  Lock,
  Unlock,
  Sparkles,
  RefreshCw,
  UserCheck,
  KeyRound,
  Eye,
  PlusCircle,
  Shield,
  Layers,
} from 'lucide-react';

// ============================================================================
// 1. SIMULADOR DO MODO DUPLO (DUAL-MODE: BACKEND ONLINE VS MOCK OFFLINE)
// ============================================================================
export const InteractiveDualModeSimulator: React.FC = () => {
  const [backendAtivo, setBackendAtivo] = useState<boolean>(true);
  const [testando, setTestando] = useState<boolean>(false);
  const [latencia, setLatencia] = useState<number>(38);
  const [dadosSimulados, setDadosSimulados] = useState<any[]>([
    { id: 801, codigo: '0.317', descricao: 'SETOR M NORTE / GUARÁ I-II / NÚCLEO BANDEIRANTE', tarifa: 3.8, origem: 'PostgreSQL (tab_linha)' },
    { id: 948, codigo: '335.1', descricao: 'Setor "O" Norte/W3 Sul (SIG - Qd. 716 Sul)', tarifa: 5.5, origem: 'PostgreSQL (tab_linha)' },
    { id: 187, codigo: '0.355', descricao: 'TAGUATINGA SUL / TAGUATINGA NORTE', tarifa: 2.7, origem: 'PostgreSQL (tab_linha)' },
  ]);

  const handleTestarConexao = () => {
    setTestando(true);
    setTimeout(() => {
      setTestando(false);
      if (backendAtivo) {
        setLatencia(Math.floor(Math.random() * 25) + 20);
        setDadosSimulados([
          { id: 801, codigo: '0.317', descricao: 'SETOR M NORTE / GUARÁ I-II / NÚCLEO BANDEIRANTE', tarifa: 3.8, origem: 'PostgreSQL (tab_linha)' },
          { id: 948, codigo: '335.1', descricao: 'Setor "O" Norte/W3 Sul (SIG - Qd. 716 Sul)', tarifa: 5.5, origem: 'PostgreSQL (tab_linha)' },
          { id: 187, codigo: '0.355', descricao: 'TAGUATINGA SUL / TAGUATINGA NORTE', tarifa: 2.7, origem: 'PostgreSQL (tab_linha)' },
        ]);
      } else {
        setLatencia(0);
        setDadosSimulados([
          { id: 2842, codigo: '0.108', descricao: 'ROD. PLANO PILOTO / QGEX / SMU / RODOFERROVIÁRIA', tarifa: 2.7, origem: 'MOCK_LINHAS_FALLBACK' },
          { id: 1657, codigo: '181.1', descricao: 'SÃO SEBASTIÃO (RES. BOSQUE) / PARANOÁ / ITAPOÃ', tarifa: 3.8, origem: 'MOCK_LINHAS_FALLBACK' },
          { id: 2692, codigo: '0.049', descricao: 'M NORTE / TAG. CENTRO / COLÔNIA AGRÍCOLA', tarifa: 3.8, origem: 'MOCK_LINHAS_FALLBACK' },
        ]);
      }
    }, 400);
  };

  const handleToggleBackend = (ativo: boolean) => {
    setBackendAtivo(ativo);
    if (!ativo) {
      setDadosSimulados([
        { id: 2842, codigo: '0.108', descricao: 'ROD. PLANO PILOTO / QGEX / SMU / RODOFERROVIÁRIA', tarifa: 2.7, origem: 'MOCK_LINHAS_FALLBACK' },
        { id: 1657, codigo: '181.1', descricao: 'SÃO SEBASTIÃO (RES. BOSQUE) / PARANOÁ / ITAPOÃ', tarifa: 3.8, origem: 'MOCK_LINHAS_FALLBACK' },
        { id: 2692, codigo: '0.049', descricao: 'M NORTE / TAG. CENTRO / COLÔNIA AGRÍCOLA', tarifa: 3.8, origem: 'MOCK_LINHAS_FALLBACK' },
      ]);
    } else {
      setDadosSimulados([
        { id: 801, codigo: '0.317', descricao: 'SETOR M NORTE / GUARÁ I-II / NÚCLEO BANDEIRANTE', tarifa: 3.8, origem: 'PostgreSQL (tab_linha)' },
        { id: 948, codigo: '335.1', descricao: 'Setor "O" Norte/W3 Sul (SIG - Qd. 716 Sul)', tarifa: 5.5, origem: 'PostgreSQL (tab_linha)' },
        { id: 187, codigo: '0.355', descricao: 'TAGUATINGA SUL / TAGUATINGA NORTE', tarifa: 2.7, origem: 'PostgreSQL (tab_linha)' },
      ]);
    }
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
      {/* Cabeçalho */}
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
            ⚡ Simulador Ao Vivo • Arquitetura Dual-Mode do Boilerplate_Front
          </span>
          <h3 style={{ fontSize: '1.1rem' }}>
            Zero Dependência: O Front Não Quebra Mesmo Sem o Backend Ligado
          </h3>
          <p className="text-muted" style={{ fontSize: '0.84rem' }}>
            Simule o que acontece na tela do estagiário quando o <code>Boilerplate_Back</code> está rodando ou desligado:
          </p>
        </div>

        {/* Chave de Controle */}
        <div style={{ display: 'flex', gap: '0.4rem', background: 'rgba(15, 23, 42, 0.6)', padding: '0.3rem', borderRadius: '10px' }}>
          <button
            type="button"
            onClick={() => handleToggleBackend(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.4rem 0.8rem',
              borderRadius: '7px',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: backendAtivo ? '1px solid #10b981' : '1px solid transparent',
              background: backendAtivo ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
              color: backendAtivo ? '#10b981' : '#94a3b8',
            }}
          >
            <Wifi size={14} /> Backend Ligado (:8097)
          </button>
          <button
            type="button"
            onClick={() => handleToggleBackend(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.4rem 0.8rem',
              borderRadius: '7px',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: !backendAtivo ? '1px solid #f59e0b' : '1px solid transparent',
              background: !backendAtivo ? 'rgba(245, 158, 11, 0.2)' : 'transparent',
              color: !backendAtivo ? '#f59e0b' : '#94a3b8',
            }}
          >
            <WifiOff size={14} /> Backend Desligado (Offline)
          </button>
        </div>
      </div>

      {/* Réplica Exata do Componente StatusIntegracaoBackend.tsx */}
      <div style={{ marginTop: '1.25rem' }}>
        <strong style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '0.45rem', textTransform: 'uppercase' }}>
          Visual do Componente Real (`src/modulos/SCL/Linhas/components/StatusIntegracaoBackend.tsx`):
        </strong>

        <div
          style={{
            padding: '1rem 1.25rem',
            borderRadius: '12px',
            border: backendAtivo
              ? '1px solid rgba(16, 185, 129, 0.4)'
              : '1px solid rgba(245, 158, 11, 0.4)',
            background: backendAtivo
              ? 'rgba(16, 185, 129, 0.08)'
              : 'rgba(245, 158, 11, 0.08)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: backendAtivo ? '#10b981' : '#f59e0b',
                color: '#090d16',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
              }}
            >
              {backendAtivo ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            </div>
            <div>
              <strong
                style={{
                  fontSize: '0.88rem',
                  display: 'block',
                  color: backendAtivo ? '#10b981' : '#f59e0b',
                }}
              >
                {backendAtivo
                  ? '🟢 CONEXÃO ATIVA COM O BOILERPLATE BACKEND'
                  : '🟡 MODO CONTINGÊNCIA (MOCK OFFLINE)'}
              </strong>
              <span style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
                {backendAtivo
                  ? `Os dados desta tela estão sendo servidos pela API NestJS (porta 8097) conectada ao PostgreSQL (${latencia}ms).`
                  : 'O front está exibindo linhas simuladas. Inicie o Boilerplate_Back (npm run start:dev) para ver os dados reais!'}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span
              style={{
                fontFamily: 'monospace',
                fontSize: '0.72rem',
                padding: '0.25rem 0.6rem',
                borderRadius: '6px',
                fontWeight: 800,
                background: backendAtivo ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                color: backendAtivo ? '#10b981' : '#f59e0b',
                border: backendAtivo ? '1px solid #10b981' : '1px solid #f59e0b',
              }}
            >
              {backendAtivo ? 'API POSTGRESQL' : 'MOCK LOCAL'}
            </span>
            <button
              type="button"
              className="btn-secondary"
              style={{ padding: '0.25rem 0.65rem', fontSize: '0.74rem' }}
              onClick={handleTestarConexao}
              disabled={testando}
            >
              <RefreshCw size={13} className={testando ? 'animate-spin' : ''} />
              {testando ? 'Testando...' : 'Diagnosticar'}
            </button>
          </div>
        </div>
      </div>

      {/* Explicação dos Bastidores e Tabela de Dados */}
      <div className="cards-grid two-cols" style={{ marginTop: '1.15rem', alignItems: 'start' }}>
        {/* Bastidores do linhaService.ts */}
        <div className="glass-card" style={{ padding: '1rem', borderLeft: '3px solid #38bdf8' }}>
          <strong style={{ fontSize: '0.8rem', color: '#38bdf8', display: 'block', marginBottom: '0.4rem' }}>
            ⚙️ O que acontece nos bastidores (`linhaService.ts`):
          </strong>
          {backendAtivo ? (
            <ul style={{ fontSize: '0.8rem', lineHeight: 1.6, paddingLeft: '1.1rem', margin: 0 }}>
              <li>1. O front chama <code>api.get('/api/linhas')</code> via proxy Vite.</li>
              <li>2. O <code>tokenStore</code> envia o cabeçalho <code>Authorization: Bearer &lt;token&gt;</code>.</li>
              <li>3. O NestJS processa com o <code>LinhaRepository</code> no PostgreSQL local.</li>
              <li>4. O hook <code>useLinhas</code> recebe <code>origem: "backend"</code> e exibe o badge verde.</li>
            </ul>
          ) : (
            <ul style={{ fontSize: '0.8rem', lineHeight: 1.6, paddingLeft: '1.1rem', margin: 0 }}>
              <li>1. O front tenta bater em <code>/api/linhas</code>, mas a conexão falha (ECONNREFUSED).</li>
              <li>2. O bloco <code>catch</code> do <code>linhaService.ts</code> captura o erro sem travar a tela.</li>
              <li>3. Ele retorna automaticamente o dataset <code>MOCK_LINHAS_FALLBACK</code> em memória.</li>
              <li>4. O estagiário continua programando o front normalmente sem depender de Docker!</li>
            </ul>
          )}
        </div>

        {/* Amostra dos Dados Carregados */}
        <div className="glass-card" style={{ padding: '1rem' }}>
          <strong style={{ fontSize: '0.8rem', display: 'block', marginBottom: '0.4rem', color: '#cbd5e1' }}>
            📦 Dados entregues ao componente `TabelaLinhas.tsx`:
          </strong>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {dadosSimulados.map((item) => (
              <div
                key={item.codigo}
                style={{
                  padding: '0.45rem 0.65rem',
                  borderRadius: '6px',
                  background: 'rgba(15, 23, 42, 0.5)',
                  fontSize: '0.78rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <strong style={{ color: '#38bdf8', fontFamily: 'monospace' }}>{item.codigo}</strong>{' '}
                  <span style={{ color: '#cbd5e1' }}>{item.descricao}</span>
                </div>
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '0.7rem',
                    color: backendAtivo ? '#10b981' : '#f59e0b',
                  }}
                >
                  {item.origem}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 2. SIMULADOR DE PERMISSÕES CDP (<Can> E <ProtectedRoute>)
// ============================================================================
export const InteractiveCdpPermissionsSimulator: React.FC = () => {
  type PerfilSimulado = 'aluno' | 'operador' | 'admin';
  const [perfilAtivo, setPerfilAtivo] = useState<PerfilSimulado>('aluno');

  const permissoes: Record<
    PerfilSimulado,
    { nome: string; rotas: string[]; acoes: string[]; badge: string }
  > = {
    aluno: {
      nome: 'Estagiário (Aluno)',
      rotas: ['dashboard', 'scl-menu', 'linhas', 'infoonibus'],
      acoes: ['linhas:LEITURA', 'vol:LEITURA'],
      badge: 'passed',
    },
    operador: {
      nome: 'Operador de Tráfego',
      rotas: ['dashboard', 'scl-menu', 'linhas', 'infoonibus'],
      acoes: ['linhas:LEITURA', 'linhas:ESCRITA', 'vol:LEITURA'],
      badge: 'pending',
    },
    admin: {
      nome: 'Administrador / Supervisor',
      rotas: ['dashboard', 'scl-menu', 'linhas', 'infoonibus', 'admin-painel'],
      acoes: ['linhas:LEITURA', 'linhas:ESCRITA', 'admin:TOTAL'],
      badge: 'danger',
    },
  };

  const current = permissoes[perfilAtivo];
  const podeAcessarTelaAdmin = current.rotas.includes('admin-painel');
  const podeCadastrarLinha = current.acoes.includes('linhas:ESCRITA');

  return (
    <div
      className="glass-card"
      style={{
        marginTop: '1.5rem',
        padding: '1.35rem',
        border: '1px solid rgba(99, 102, 241, 0.35)',
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
            🛡️ Simulador de Permissões CDP • Controle Granular no Front-end
          </span>
          <h3 style={{ fontSize: '1.1rem' }}>
            Como os Componentes `&lt;ProtectedRoute&gt;` e `&lt;Can&gt;` Blindam a Interface
          </h3>
          <p className="text-muted" style={{ fontSize: '0.84rem' }}>
            Alterne entre os perfis de usuário abaixo para ver botões administrativos sumirem e rotas serem bloqueadas:
          </p>
        </div>

        {/* Seletor de Perfil do CDP */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {(['aluno', 'operador', 'admin'] as PerfilSimulado[]).map((p) => {
            const isSel = perfilAtivo === p;
            return (
              <button
                key={p}
                type="button"
                onClick={() => setPerfilAtivo(p)}
                className={`sql-filter-btn ${isSel ? 'active' : ''}`}
                style={{ fontSize: '0.78rem' }}
              >
                <UserCheck size={13} /> {permissoes[p].nome}
              </button>
            );
          })}
        </div>
      </div>

      <div className="cards-grid two-cols" style={{ marginTop: '1.25rem', alignItems: 'start' }}>
        {/* Caso A: Controle Granular com <Can action="ESCRITA"> */}
        <div className="glass-card" style={{ padding: '1.15rem', borderLeft: '4px solid #38bdf8' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <strong style={{ fontSize: '0.86rem' }}>1. Visibilidade de Botões com `&lt;Can&gt;`</strong>
            <span
              className={`status-pill ${podeCadastrarLinha ? 'passed' : 'pending'}`}
              style={{ fontSize: '0.72rem' }}
            >
              {podeCadastrarLinha ? 'Ação Liberada' : 'Ação Oculta'}
            </span>
          </div>

          <p className="text-muted" style={{ fontSize: '0.82rem', lineHeight: 1.55 }}>
            O componente <code>&lt;Can endpoint="linhas" action="ESCRITA"&gt;</code> só renderiza botões administrativos se o usuário tiver permissão de escrita.
          </p>

          <div
            style={{
              marginTop: '0.85rem',
              padding: '0.85rem',
              borderRadius: '8px',
              background: 'rgba(15, 23, 42, 0.65)',
              border: '1px solid rgba(148,163,184,0.15)',
            }}
          >
            <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginBottom: '0.45rem' }}>
              Interface renderizada para {current.nome}:
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <button type="button" className="btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.76rem' }}>
                <Eye size={13} /> Consultar Linhas (Leitura)
              </button>

              {podeCadastrarLinha ? (
                <button type="button" className="btn-primary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.76rem' }}>
                  <PlusCircle size={13} /> + Cadastrar Nova Linha (Escrita)
                </button>
              ) : (
                <span
                  style={{
                    fontSize: '0.74rem',
                    color: '#94a3b8',
                    fontStyle: 'italic',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <Lock size={12} color="#f59e0b" /> [Botão oculto pelo &lt;Can&gt; para perfil Aluno]
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Caso B: Bloqueio de Rota Inteira com <ProtectedRoute> */}
        <div className="glass-card" style={{ padding: '1.15rem', borderLeft: '4px solid #818cf8' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <strong style={{ fontSize: '0.86rem' }}>2. Bloqueio de Tela com `&lt;ProtectedRoute&gt;`</strong>
            <span
              className={`status-pill ${podeAcessarTelaAdmin ? 'passed' : 'danger'}`}
              style={{ fontSize: '0.72rem' }}
            >
              {podeAcessarTelaAdmin ? 'Rota Liberada' : 'Acesso Negado (403)'}
            </span>
          </div>

          <p className="text-muted" style={{ fontSize: '0.82rem', lineHeight: 1.55 }}>
            O <code>&lt;ProtectedRoute endpoint="admin-painel"&gt;</code> impede o acesso à tela inteira e exibe o cartão amigável do CDP se o estagiário tentar abrir uma rota restrita.
          </p>

          <div
            style={{
              marginTop: '0.85rem',
              padding: '0.85rem',
              borderRadius: '8px',
              background: podeAcessarTelaAdmin ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
              border: podeAcessarTelaAdmin ? '1px solid #10b981' : '1px solid #ef4444',
            }}
          >
            {podeAcessarTelaAdmin ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={18} color="#10b981" />
                <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 700 }}>
                  Acesso Autorizado: Painel Administrativo do SISMOB liberado!
                </span>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertTriangle size={18} color="#ef4444" />
                <span style={{ fontSize: '0.8rem', color: '#ef4444', fontWeight: 700 }}>
                  Acesso Restrito pelo CDP: Seu perfil atual não tem permissão para esta rota.
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 3. SIMULADOR DE VARIÁVEIS DE AMBIENTE (.env & env.config.ts)
// ============================================================================
export const InteractiveEnvSimulator: React.FC = () => {
  const [usarPrefixoVite, setUsarPrefixoVite] = useState<boolean>(true);
  const [ambiente, setAmbiente] = useState<'local' | 'k8s'>('local');

  const varName = usarPrefixoVite ? 'VITE_API_HOST' : 'API_HOST';
  const varValue = 'http://localhost:8097/api';

  return (
    <div
      className="glass-card"
      style={{
        marginTop: '1.5rem',
        padding: '1.35rem',
        border: '1px solid rgba(245, 158, 11, 0.35)',
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
            ⚙️ Simulador de Variáveis de Ambiente • .env no Vite & SEMOB
          </span>
          <h3 style={{ fontSize: '1.1rem' }}>
            A Regra de Ouro do Prefixo `VITE_` e a Resolução Centralizada
          </h3>
          <p className="text-muted" style={{ fontSize: '0.84rem' }}>
            Descubra por que variáveis sem <code>VITE_</code> desaparecem no navegador e como o <code>env.config.ts</code> unifica ambiente local e nuvem:
          </p>
        </div>

        {/* Controles do Simulador */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setUsarPrefixoVite(!usarPrefixoVite)}
            className={`sql-filter-btn ${usarPrefixoVite ? 'active' : ''}`}
            style={{ fontSize: '0.78rem' }}
          >
            {usarPrefixoVite ? '✅ Com Prefixo VITE_' : '❌ Sem Prefixo VITE_'}
          </button>

          <button
            type="button"
            onClick={() => setAmbiente(ambiente === 'local' ? 'k8s' : 'local')}
            className="btn-secondary"
            style={{ padding: '0.3rem 0.75rem', fontSize: '0.78rem' }}
          >
            Ambiente: {ambiente === 'local' ? '💻 Local (.env)' : '☸️ Kubernetes (window.__ENV__)'}
          </button>
        </div>
      </div>

      <div className="cards-grid two-cols" style={{ marginTop: '1.25rem', alignItems: 'start' }}>
        {/* Painel Esquerdo: O arquivo .env ou injeção em runtime */}
        <div className="glass-card" style={{ padding: '1.1rem', borderLeft: '4px solid #f59e0b' }}>
          <strong style={{ fontSize: '0.84rem', display: 'block', marginBottom: '0.4rem', color: '#f59e0b' }}>
            📄 Arquivo <code>.env</code> ou Runtime Injection:
          </strong>

          <pre className="code-block" style={{ fontSize: '0.78rem', margin: 0 }}>
            <code>
              {ambiente === 'local'
                ? `# Configuração Local no Vite
${varName}="${varValue}"
VITE_MOCK_AUTH="true"
VITE_MOCK_DATA="true"
APP_TITLE="SISMOB - Boilerplate Frontend"`
                : `// Injeção Dinâmica em Produção (Kubernetes)
window.__ENV__ = {
  ${varName}: "${varValue}",
  APP_TITLE: "SISMOB - Produção SEMOB"
};`}
            </code>
          </pre>

          <p className="text-muted" style={{ fontSize: '0.8rem', marginTop: '0.65rem', lineHeight: 1.55 }}>
            {usarPrefixoVite
              ? '✅ Como a variável começa com VITE_, o compilador do Vite autoriza a exposição pública para o bundle do navegador.'
              : '⚠️ ATENÇÃO: Sem o prefixo VITE_, o Vite bloqueia a variável por segurança! No navegador ela virará undefined.'}
          </p>
        </div>

        {/* Painel Direito: O que o código enxerga */}
        <div className="glass-card" style={{ padding: '1.1rem', borderLeft: '4px solid #38bdf8' }}>
          <strong style={{ fontSize: '0.84rem', display: 'block', marginBottom: '0.4rem', color: '#38bdf8' }}>
            🔍 Leitura no Código TypeScript (`src/config/env.config.ts`):
          </strong>

          <div
            style={{
              padding: '0.85rem',
              borderRadius: '8px',
              background: 'rgba(15, 23, 42, 0.65)',
              fontFamily: 'monospace',
              fontSize: '0.82rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.45rem',
            }}
          >
            <div>
              <span style={{ color: '#94a3b8' }}>// Chamada direta:</span>
              <br />
              <code>import.meta.env.{varName}</code>
              <br />
              <span style={{ color: usarPrefixoVite ? '#10b981' : '#ef4444', fontWeight: 800 }}>
                ➔ {usarPrefixoVite ? `"${varValue}"` : 'undefined'}
              </span>
            </div>

            <div style={{ borderTop: '1px solid rgba(148,163,184,0.15)', paddingTop: '0.45rem' }}>
              <span style={{ color: '#94a3b8' }}>// Via env.config.ts da SEMOB:</span>
              <br />
              <code>env.{usarPrefixoVite ? 'API_HOST' : 'API_HOST'}</code>
              <br />
              <span style={{ color: '#10b981', fontWeight: 800 }}>
                ➔ {ambiente === 'k8s' ? `"${varValue}" (lido de window.__ENV__)` : (usarPrefixoVite ? `"${varValue}"` : '"" (fallback seguro)')}
              </span>
            </div>
          </div>

          <div
            style={{
              marginTop: '0.85rem',
              padding: '0.75rem',
              borderRadius: '8px',
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              fontSize: '0.78rem',
              color: '#f87171',
              lineHeight: 1.5,
            }}
          >
            🔒 <strong>Regra de Segurança:</strong> Nunca coloque senhas de banco ou chaves secretas no <code>.env</code> do Front! Qualquer variável exposta via <code>VITE_</code> pode ser lida por qualquer pessoa inspecionando o código no navegador (F12).
          </div>
        </div>
      </div>
    </div>
  );
};

