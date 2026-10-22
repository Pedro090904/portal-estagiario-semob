import React, { useState } from 'react';
import {
  ShieldAlert,
  KeyRound,
  FileCog,
  CheckCircle2,
  XCircle,
  Trophy,
  FolderGit2,
  Sparkles,
  RefreshCw,
  ArrowRight,
  Layers,
  GitMerge,
} from 'lucide-react';

// ============================================================================
// 1. SIMULADOR INTERATIVO: FLUXO DE REGISTRO, PONTE BACK <-> FRONT, .ENV E CDP
// ============================================================================
export const FrontendBridgeSimulator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'flow' | 'env' | 'jwt' | 'cdp'>('flow');
  const [simulatedEnvUrl, setSimulatedEnvUrl] = useState('http://localhost:8097/api');
  const [hasToken, setHasToken] = useState(true);
  const [activeProfile, setActiveProfile] = useState<'ADMIN' | 'GESTOR_SCL' | 'SEM_PERMISSAO'>('GESTOR_SCL');

  return (
    <div
      className="glass-card"
      style={{
        marginTop: '1.5rem',
        padding: '1.35rem',
        border: '1px solid rgba(56, 189, 248, 0.35)',
      }}
    >
      <div style={{ marginBottom: '1rem' }}>
        <span className="hero-badge" style={{ marginBottom: '0.35rem' }}>
          🔌 Raio-X Arquitetural • O Fluxo Completo do BoilerPlate_Front_end
        </span>
        <h3 style={{ fontSize: '1.1rem' }}>
          Do Registro em config/modules.ts até a Compilação no .tsx Final
        </h3>
        <p className="text-muted" style={{ fontSize: '0.85rem' }}>
          Navegue pelas 4 abas para visualizar o ciclo de vida completo de um módulo/submódulo e sua integração com o Back-end:
        </p>
      </div>

      {/* Abas de Simulação */}
      <div
        className="sql-filter-buttons"
        style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}
      >
        <button
          type="button"
          onClick={() => setActiveTab('flow')}
          className={`sql-filter-btn ${activeTab === 'flow' ? 'active' : ''}`}
        >
          <GitMerge size={14} style={{ display: 'inline', marginRight: 5 }} />
          1. As 7 Estações (Como RelatorioLinha existe no SCL)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('env')}
          className={`sql-filter-btn ${activeTab === 'env' ? 'active' : ''}`}
        >
          <FileCog size={14} style={{ display: 'inline', marginRight: 5 }} />
          2. Fluxo .env & Docker Runtime
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('jwt')}
          className={`sql-filter-btn ${activeTab === 'jwt' ? 'active' : ''}`}
        >
          <KeyRound size={14} style={{ display: 'inline', marginRight: 5 }} />
          3. Ponte Axios + tokenStore (Porta 8097)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('cdp')}
          className={`sql-filter-btn ${activeTab === 'cdp' ? 'active' : ''}`}
        >
          <ShieldAlert size={14} style={{ display: 'inline', marginRight: 5 }} />
          4. CDP, Segurança & Perfis Simulados
        </button>
      </div>

      {/* ABA 1: AS 7 ESTAÇÕES DO FLUXO COMPLETO */}
      {activeTab === 'flow' && (
        <div className="glass-card" style={{ padding: '1.2rem' }}>
          <h4 style={{ fontSize: '1rem', color: '#38bdf8', marginBottom: '0.5rem' }}>
            Mapa Mental: A Ordem Exata para Criar uma Nova Tela no BoilerPlate_Front_end
          </h4>
          <p className="text-muted" style={{ fontSize: '0.86rem', lineHeight: 1.6 }}>
            Olhando para <code>src/modulos/SCL/RelatorioLinha/</code>, vemos que uma tela profissional nunca começa pelo arquivo visual final. Primeiro registramos a rota no portal, depois criamos as peças atômicas e, <strong>por último</strong>, o arquivo <code>RelatorioLinha.tsx</code> apenas junta (compila) tudo:
          </p>

          <pre className="code-block" style={{ marginTop: '0.9rem', fontSize: '0.78rem' }}>
            <code>{`[ 1º PASSO: REGISTRO NO PORTAL ]
 ├── src/config/modules.ts      ──► Cadastra o Módulo/Submódulo, ícone, rota e permissão
 ├── src/modulos/SCL/SCLMenu.tsx──► Adiciona o Card no submenu visual do SCL
 └── src/App.tsx                ──► Conecta a rota <Route path="/scl/..." /> com ProtectedRoute

[ 2º PASSO: CRIAR A PASTA DA TELA E SUAS 4 SUBPASTAS DE BASE ]
 └── src/modulos/SCL/RelatorioLinha/
      ├── 1. types/             ──► typesRelatorioLinha.ts + index.ts (Contratos puros)
      ├── 2. services/          ──► linhaService.ts (Chama api.get('/linhas'))
      ├── 3. hooks/             ──► Micro-hooks focados:
      │                              • useBuscarLinha.ts & useLinhasList.ts
      │                              • useRelatorioLinhaData.ts
      │                              • useDownloadCSV.ts & useImpressao.ts
      └── 4. components/        ──► Micro-componentes visuais desacoplados:
                                     • UI Base: Button.tsx, Card.tsx, Loading.tsx, ErrorMessage.tsx
                                     • Negócio: FormSearch.tsx, LinhaStatsCards.tsx,
                                                LinhaLista.tsx, DaLinhaDetails.tsx

[ 3º PASSO (POR ÚLTIMO!): O ARQUIVO .TSX ORQUESTRADOR QUE COMPILA TUDO ]
 └── src/modulos/SCL/RelatorioLinha/RelatorioLinha.tsx
      └── Importa os hooks e encaixa <FormSearch />, <Loading />, <LinhaStatsCards /> e <LinhaLista />!`}</code>
          </pre>
        </div>
      )}

      {/* ABA 2: .ENV & RUNTIME */}
      {activeTab === 'env' && (
        <div className="glass-card" style={{ padding: '1.2rem' }}>
          <h4 style={{ fontSize: '1rem', color: '#38bdf8', marginBottom: '0.5rem' }}>
            Como o Front-end descobre o endereço do Back-end? (.env ➔ env.config.ts ➔ public/config.js)
          </h4>
          <p className="text-muted" style={{ fontSize: '0.86rem', lineHeight: 1.6 }}>
            No <strong>BoilerPlate_Front_end</strong>, nunca escrevemos <code>http://localhost:8097</code> fixo num service. O ficheiro <code>src/config/env.config.ts</code> lê primeiro o <code>window.__ENV__</code> (injetado em produção pelo script <code>docker/30-runtime-env.sh</code> e <code>public/config.js</code>, conforme documentado em <code>docs/CONFIG-RUNTIME.md</code>) e, no desenvolvimento local, usa o <code>.env</code>!
          </p>

          <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
              Simule alterar a variável VITE_API_URL no ficheiro .env:
            </label>
            <input
              type="text"
              value={simulatedEnvUrl}
              onChange={(e) => setSimulatedEnvUrl(e.target.value)}
              className="sql-editor-textarea"
              style={{ minHeight: '38px', height: '38px', padding: '0.4rem 0.8rem', fontFamily: 'monospace' }}
            />
          </div>

          <pre className="code-block" style={{ margin: 0, fontSize: '0.8rem' }}>
            <code>{`// 1. No ficheiro .env (Raiz do BoilerPlate_Front_end):
VITE_API_URL=${simulatedEnvUrl}

// 2. Em src/config/env.config.ts (Centralizador seguro):
export const envConfig = {
  apiUrl: window.__ENV__?.VITE_API_URL || import.meta.env.VITE_API_URL || '${simulatedEnvUrl}',
};

// 3. Resultado em src/services/api.ts:
// Todas as chamadas de linhaService.ts irão automaticamente para:
// 👉 ${simulatedEnvUrl}/linhas`}</code>
          </pre>
        </div>
      )}

      {/* ABA 3: PONTE AXIOS + TOKENSTORE */}
      {activeTab === 'jwt' && (
        <div className="glass-card" style={{ padding: '1.2rem' }}>
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
            <h4 style={{ fontSize: '1rem', color: '#10b981' }}>
              A Ponte Automática: Login.tsx ➔ authService.ts ➔ tokenStore.ts ➔ api.ts
            </h4>
            <button
              type="button"
              onClick={() => setHasToken(!hasToken)}
              className={hasToken ? 'btn-primary' : 'btn-secondary'}
            >
              {hasToken ? '🟢 Token Presente no tokenStore' : '🔴 Simular Sem Token (Deslogado)'}
            </button>
          </div>

          <p className="text-muted" style={{ fontSize: '0.86rem', lineHeight: 1.6 }}>
            Quando você cria um service como <code>src/modulos/SCL/RelatorioLinha/services/linhaService.ts</code>, basta importar o <code>api</code> de <code>src/services/api.ts</code>. O interceptor lê o token salvo no <code>tokenStore.ts</code> e anexa o cabeçalho <code>Authorization: Bearer ...</code> automaticamente:
          </p>

          <pre className="code-block" style={{ marginTop: '0.9rem', fontSize: '0.8rem' }}>
            <code>{`// Quando o seu hook chama: await linhaService.listar()
// O ficheiro src/services/api.ts intercepta a requisição:

api.interceptors.request.use((config) => {
  const token = tokenStore.getToken(); // ${hasToken ? '"eyJhbGciOiJIUzI1NiIs..."' : 'null'}
  if (token) {
    config.headers.Authorization = \`Bearer \${token}\`;
  }
  return config;
});

// Resposta do BoilerPlate_Back_end (http://localhost:8097/api/linhas):
${
  hasToken
    ? '// ✅ HTTP 200 OK — JwtAuthGuard validou o Bearer Token e devolveu as linhas do PostgreSQL!'
    : '// ❌ HTTP 401 Unauthorized — O interceptor captura o 401, limpa o tokenStore e redireciona para Login.tsx!'
}`}</code>
          </pre>
        </div>
      )}

      {/* ABA 4: CDP, DEVTOOLS & PERFIS SIMULADOS */}
      {activeTab === 'cdp' && (
        <div className="glass-card" style={{ padding: '1.2rem' }}>
          <h4 style={{ fontSize: '1rem', color: '#f59e0b', marginBottom: '0.5rem' }}>
            CDP (Chrome DevTools Protocol), Guards de Segurança e Perfis Simulados
          </h4>
          <p className="text-muted" style={{ fontSize: '0.86rem', lineHeight: 1.6 }}>
            O <strong>BoilerPlate_Front_end</strong> possui hooks e guardiões globais em <code>src/hooks/</code> e <code>src/components/</code> que protegem a aplicação:
          </p>

          <ul style={{ fontSize: '0.85rem', lineHeight: 1.65, paddingLeft: '1.2rem', margin: '0.75rem 0' }}>
            <li>
              <strong>CDP & Monitorização (<code>useSecurity.ts</code>, <code>useIncognitoBlocker.tsx</code> e <code>auditLogger.ts</code>):</strong> Integra-se com as ferramentas de inspeção e segurança do navegador para auditar acessos, bloquear janelas anónimas não autorizadas (<code>IncognitoBlockScreen.tsx</code>) e validar impressões oficiais (<code>SeloValidacaoImpressao.tsx</code>).
            </li>
            <li>
              <strong>Simulação de Perfis (<code>src/config/simulatedProfiles.ts</code> & <code>DevModal.tsx</code>):</strong> Permite testar instantaneamente como o <code>&lt;Can /&gt;</code>, o <code>&lt;ProtectedRoute /&gt;</code> e o <code>&lt;SemAcessoGuard /&gt;</code> reagem para cada perfil de usuário:
            </li>
          </ul>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
            {(['ADMIN', 'GESTOR_SCL', 'SEM_PERMISSAO'] as const).map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setActiveProfile(role)}
                className={`sql-filter-btn ${activeProfile === role ? 'active' : ''}`}
              >
                Simular Perfil: {role}
              </button>
            ))}
          </div>

          <div
            className="glass-card"
            style={{
              marginTop: '0.85rem',
              padding: '0.85rem 1rem',
              borderLeft: `4px solid ${activeProfile === 'SEM_PERMISSAO' ? '#ef4444' : '#10b981'}`,
            }}
          >
            {activeProfile === 'SEM_PERMISSAO' ? (
              <span style={{ fontSize: '0.85rem', color: '#ef4444' }}>
                🚫 <strong>SemAcessoGuard.tsx acionado:</strong> Este perfil não possui permissão no <code>src/config/modules.ts</code> para abrir o módulo SCL. O portal bloqueia a rota e abre o <code>SemAcessoModal.tsx</code>!
              </span>
            ) : (
              <span style={{ fontSize: '0.85rem', color: '#10b981' }}>
                ✅ <strong>Acesso Liberado ({activeProfile}):</strong> O <code>useModules.tsx</code> e o <code>SemAcessoGuard.tsx</code> validaram a permissão declarada em <code>src/config/modules.ts</code>!
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// 2. MINI-JOGO GAMIFICADO: AS 7 ESTAÇÕES DE CRIAÇÃO DE UMA TELA NO BOILERPLATE
// ============================================================================
interface FolderChallengeQuestion {
  id: number;
  scenario: string;
  correctPath: string;
  options: string[];
  explanation: string;
}

const FOLDER_GAME_QUESTIONS: FolderChallengeQuestion[] = [
  {
    id: 1,
    scenario:
      'Estação 1 (O Ponto de Partida): Antes mesmo de criar a pasta da sua nova tela, onde você deve declarar os metadados do módulo/submódulo (id, nome, rota, ícone e permissões) para que o portal reconheça sua existência?',
    correctPath: 'src/config/modules.ts',
    options: [
      'src/config/modules.ts',
      'src/services/tokenStore.ts',
      'src/utils/formatters.ts',
      'public/config.js',
    ],
    explanation:
      'Exato! Tudo começa em src/config/modules.ts. É ele que alimenta a Sidebar, o Dashboard, os hooks useModules/useNavigation e as permissões de acesso.',
  },
  {
    id: 2,
    scenario:
      'Estação 2 (Submenu Visual do SCL e Rota): Para que a nova tela "Consultar Itinerário" apareça como um Card clicável quando o usuário entra no módulo SCL e tenha sua URL mapeada, quais ficheiros você atualiza?',
    correctPath: 'src/modulos/SCL/SCLMenu.tsx e src/App.tsx',
    options: [
      'src/modulos/SCL/SCLMenu.tsx e src/App.tsx',
      'src/screens/Login.tsx e nginx.conf',
      'src/modulos/Noticias/NoticiasIndex.tsx',
      'src/hooks/useTypewriter.ts',
    ],
    explanation:
      'Perfeito! O SCLMenu.tsx exibe os cartões dos submódulos do SCL (como ConsultaOS e RelatorioLinha) e o App.tsx registra a rota protegida.',
  },
  {
    id: 3,
    scenario:
      'Estação 3 e 4 (Contratos e API): Dentro da nova pasta src/modulos/SCL/ConsultarItinerario/, você precisa declarar as interfaces TypeScript (sem usar any) e a chamada Axios api.get(). Quais subpastas você cria primeiro?',
    correctPath: 'types/ (com index.ts) e services/ (importando o api global)',
    options: [
      'Coloco o axios.get() e as interfaces tudo junto dentro de Button.tsx',
      'types/ (com index.ts) e services/ (importando o api global)',
      'public/images/ e docker/',
      'src/assets/brasaoBase64.ts',
    ],
    explanation:
      'Na mosca! Seguindo o exemplo de RelatorioLinha, criamos types/ para os contratos e services/ para isolar as chamadas HTTP que usam o src/services/api.ts.',
  },
  {
    id: 4,
    scenario:
      'Estação 5 e 6 (Modularização Máxima): Em RelatorioLinha, a lógica é dividida em micro-hooks (useBuscarLinha, useLinhasList, useImpressao) e a UI em micro-componentes (FormSearch, LinhaStatsCards, LinhaLista, Loading, ErrorMessage). Por que fazemos isso antes do arquivo .tsx final?',
    correctPath: 'Para que cada arquivo tenha responsabilidade única e o arquivo .tsx final apenas compile/orquestre tudo limpo!',
    options: [
      'Para deixar o projeto com mais pastas sem motivo.',
      'Para que cada arquivo tenha responsabilidade única e o arquivo .tsx final apenas compile/orquestre tudo limpo!',
      'Porque o React proíbe ter mais de um componente por projeto.',
      'Para não precisar usar TypeScript.',
    ],
    explanation:
      'Exatamente! Quando fatiarmos a lógica em hooks/ e as partes visuais em components/, o arquivo final (ex: RelatorioLinha.tsx ou ConsultarItinerario.tsx) vira apenas um maestro limpo de 40 linhas que conecta os hooks aos componentes!',
  },
];

export const FrontendFolderGame: React.FC = () => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [completedIds, setCompletedIds] = useState<number[]>([]);

  const currentQ = FOLDER_GAME_QUESTIONS[currentQIndex];
  const isCorrect = selectedOption === currentQ.correctPath;

  const handleSelect = (opt: string) => {
    setSelectedOption(opt);
    if (opt === currentQ.correctPath && !completedIds.includes(currentQ.id)) {
      setScore((prev) => prev + 25);
      setCompletedIds((prev) => [...prev, currentQ.id]);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setCurrentQIndex((prev) => (prev + 1) % FOLDER_GAME_QUESTIONS.length);
  };

  const handleReset = () => {
    setSelectedOption(null);
    setCurrentQIndex(0);
    setScore(0);
    setCompletedIds([]);
  };

  return (
    <div
      className="glass-card"
      style={{
        marginTop: '1.5rem',
        padding: '1.4rem',
        border: '1px solid rgba(16, 185, 129, 0.4)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
          marginBottom: '1rem',
        }}
      >
        <div>
          <span className="hero-badge" style={{ marginBottom: '0.35rem' }}>
            🎮 Jogo do Fluxo Real • As Estações do BoilerPlate_Front_end
          </span>
          <h3 style={{ fontSize: '1.1rem' }}>
            Valide a Ordem de Construção de uma Nova Tela ({currentQIndex + 1}/{FOLDER_GAME_QUESTIONS.length})
          </h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span className="status-pill passed" style={{ fontSize: '0.82rem', fontWeight: 700 }}>
            <Trophy size={14} style={{ display: 'inline', marginRight: 4 }} />
            {score} / 100 XP
          </span>
          <button type="button" className="btn-secondary" onClick={handleReset} title="Reiniciar Jogo">
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* Pergunta / Cenário */}
      <div
        className="glass-card"
        style={{
          padding: '1rem 1.2rem',
          borderLeft: '4px solid #38bdf8',
          marginBottom: '1rem',
        }}
      >
        <p style={{ fontSize: '0.94rem', fontWeight: 600, lineHeight: 1.6, margin: 0 }}>
          <FolderGit2 size={17} style={{ display: 'inline', marginRight: 6, color: '#38bdf8' }} />
          {currentQ.scenario}
        </p>
      </div>

      {/* Opções */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {currentQ.options.map((opt) => {
          const isPicked = selectedOption === opt;
          const isRightOption = opt === currentQ.correctPath;

          let borderColor = 'rgba(148, 163, 184, 0.25)';
          let bg = 'rgba(15, 23, 42, 0.45)';
          if (selectedOption) {
            if (isRightOption) {
              borderColor = '#10b981';
              bg = 'rgba(16, 185, 129, 0.14)';
            } else if (isPicked && !isRightOption) {
              borderColor = '#ef4444';
              bg = 'rgba(239, 68, 68, 0.14)';
            }
          }

          return (
            <button
              key={opt}
              type="button"
              onClick={() => handleSelect(opt)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.8rem 1rem',
                borderRadius: '10px',
                border: `1px solid ${borderColor}`,
                background: bg,
                color: 'inherit',
                fontFamily: 'monospace',
                fontSize: '0.84rem',
                textAlign: 'left',
                cursor: 'pointer',
              }}
            >
              <span>{opt}</span>
              {selectedOption && isRightOption && <CheckCircle2 size={18} color="#10b981" />}
              {selectedOption && isPicked && !isRightOption && <XCircle size={18} color="#ef4444" />}
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {selectedOption && (
        <div
          className="glass-card"
          style={{
            marginTop: '1rem',
            padding: '1rem',
            borderLeft: `4px solid ${isCorrect ? '#10b981' : '#f59e0b'}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div style={{ flex: '1 1 300px' }}>
            <strong
              style={{
                color: isCorrect ? '#10b981' : '#f59e0b',
                fontSize: '0.86rem',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
              }}
            >
              <Sparkles size={15} />
              {isCorrect ? 'Resposta Certa (+25 XP)!' : 'Veja como o Boilerplate funciona:'}
            </strong>
            <p className="text-muted" style={{ fontSize: '0.84rem', marginTop: '0.3rem', marginBottom: 0 }}>
              {currentQ.explanation}
            </p>
          </div>

          <button type="button" className="btn-primary" onClick={handleNext}>
            Próxima Estação <ArrowRight size={15} />
          </button>
        </div>
      )}
    </div>
  );
};
