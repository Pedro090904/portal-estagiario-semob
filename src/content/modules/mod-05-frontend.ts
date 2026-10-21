import { LearningModule } from '../../types';

export const mod05Frontend: LearningModule = {
  id: 'mod-5-frontend',
  order: 5,
  title: 'Manual Prático de Front-end: Da Arquitetura SISMOB e Dual-Mode à Criação de Módulos SCL',
  category: 'frontend',
  estimatedTime: '3h 30min',
  version: '2.0.0',
  updatedAt: '2026-10-21',
  workloadHours: 12,
  description:
    'Guia completo do zero à tela funcional: como clonar e rodar o Boilerplate_Front, o papel do .env no Vite, a separação em 5 camadas, o funcionamento do modo duplo (Dual-Mode), dissecção da tela real de Linhas (SCL), segurança com CDP (<ProtectedRoute> e <Can>) e o passo a passo para construir uma nova tela consumindo uma API.',
  objectives: [
    'Compreender o setup local do front-end com Vite e a regra do prefixo VITE_ nas variáveis de ambiente (.env)',
    'Dominar a arquitetura modular SISMOB e a esteira em 5 camadas (Types ➔ Services ➔ Hooks ➔ Smart UI ➔ Dumb UI)',
    'Entender o Dual-Mode com proxy reverso (/api) e auto-login JWT transparente com o Boilerplate_Back',
    'Conhecer a anatomia interna da pasta src/modulos/ e como a tela real de Linhas (SCL) foi implementada',
    'Aplicar controle granular de acesso e blindagem de telas utilizando o padrão CDP com <ProtectedRoute> e <Can>',
    'Criar uma nova tela completa no SCL do zero até o consumo funcional de uma API registrada no menu',
  ],
  sections: [
    // ========================================================================
    // CAPÍTULO 1: O MODELO MENTAL DAS 5 CAMADAS FRONT-END
    // ========================================================================
    {
      heading: '1. O que é o SISMOB-BOILERPLATE Front e o Modelo Mental das 5 Camadas',
      body: 'No desenvolvimento front-end moderno da SEMOB, o maior erro de quem está começando é misturar tudo num único arquivo: chamadas Axios, estados do React (useState), validações de formulário e código visual (JSX). Quando esse arquivo passa de 300 linhas, qualquer ajuste quebra a tela inteira. No SISMOB-BOILERPLATE Front, nós resolvemos isso com a Arquitetura em 5 Camadas Unidirecionais.',
      paragraphs: [
        'Cada camada tem uma única responsabilidade e conversa exclusivamente com a camada imediatamente vizinha. O fluxo dos dados desce de forma limpa, garantindo que componentes visuais nunca fiquem acoplados a chamadas HTTP.',
      ],
      codeBlocks: [
        {
          title: 'A Esteira Unidirecional de 5 Camadas do Front-end SISMOB',
          language: 'text',
          code: `[ API NestJS / Servidor SISMOB (:8097) ]
               │
               ▼
1. TYPES (types/index.ts) ────────► "O Contrato"
       │  Define as interfaces TypeScript (Linha, Itinerario, Filtros).
       ▼
2. SERVICES (services/*.ts) ──────► "O Mensageiro HTTP"
       │  Usa Axios para chamar a API e aplica contingência mock se o back cair.
       ▼
3. HOOKS (hooks/useLinhas.ts) ────► "O Cérebro Reativo"
       │  Gere useState, loading, erro, dados e dispara os Services.
       ▼
4. SMART UI (LinhasIndex.tsx) ────► "O Maestro da Página"
       │  Recebe os dados do Hook e orquestra layout, alertas e navegação.
       ▼
5. DUMB UI (components/*.tsx) ────► "Os Operários Visuais"
          Apenas recebem props (linhas, onBuscar) e desenham botões e tabelas.`,
        },
      ],
      tables: [
        {
          headers: ['Camada', 'Papel Arquitetural', 'Responsabilidade Principal'],
          rows: [
            [
              '1. Types',
              'O Contrato',
              'Define as regras e interfaces estruturais dos dados (entidades, filtros e props de componentes).',
            ],
            [
              '2. Services',
              'O Mensageiro',
              'Executa requisições HTTP (GET, POST) com Axios, gerencia tokens e fornece dados de contingência.',
            ],
            [
              '3. Hooks',
              'O Cérebro',
              'Gerencia o estado reativo (useState), aciona o Service, orquestra loadings, erros e regras de tela.',
            ],
            [
              '4. Smart UI',
              'O Maestro',
              'A página/container principal (Index.tsx). Conecta o Hook aos componentes visuais, controlando layout e permissões.',
            ],
            [
              '5. Dumb UI',
              'Os Operários',
              'Componentes puramente visuais (cards, formulários, tabelas). Apenas renderizam dados e repassam eventos via props.',
            ],
          ],
        },
      ],
      callouts: [
        {
          type: 'important',
          title: '🛡️ As 4 Leis Inegociáveis do Front-end SISMOB',
          content: 'Para o seu código ser aprovado na revisão da equipe, nunca quebre estas 4 fronteiras:',
          bullets: [
            '1. Nenhum componente visual em components/ pode importar axios nem fazer chamadas HTTP diretas.',
            '2. Nenhum serviço em services/ pode usar useState, useEffect ou retornar tags JSX (ele é TypeScript puro).',
            '3. Os componentes Dumb em components/ devem ser puros: recebem dados via props e emitem eventos via callbacks (onBuscar, onSelecionar).',
            '4. Toda tipagem deve ser declarada estritamente no types/index.ts — o uso do tipo "any" é proibido.',
          ],
        },
      ],
    },

    // ========================================================================
    // CAPÍTULO 2: VARIÁVEIS DE AMBIENTE (.env, env.config.ts E PREFIXO VITE_)
    // ========================================================================
    {
      heading: '2. Configurando o Ambiente e as Variáveis de Ambiente (.env & env.config.ts)',
      body: 'Para colocar o Boilerplate Front para rodar na sua máquina, o primeiro passo após clonar o repositório é entender como as Variáveis de Ambiente funcionam no ecossistema Vite e na infraestrutura da SEMOB.',
      paragraphs: [
        'Diferente do Node.js tradicional (que usa process.env), o Vite roda dentro do navegador e exige que toda variável exposta publicamente comece obrigatoriamente com o prefixo VITE_ (ex: VITE_MOCK_DATA, VITE_API_HOST). Se você esquecer esse prefixo, a variável virará undefined no código!',
        'No SISMOB, nós usamos um padrão de nível corporativo no arquivo src/config/env.config.ts: ele unifica as variáveis de desenvolvimento (.env lido por import.meta.env) e as variáveis de produção (injetadas dinamicamente no container Docker/Kubernetes via window.__ENV__). Veja no simulador interativo abaixo:',
      ],
      enableEnvSimulator: true,
      commandCards: [
        {
          name: 'Comandos para Iniciar o Front-end',
          role: 'Terminal Bash / PowerShell',
          concept: 'Na pasta do Boilerplate_Front, clonamos, instalamos e subimos o servidor Vite:',
          code: `# 1. Entrar na pasta do front
cd Boilerplate_Front

# 2. Copiar o arquivo de exemplo de variáveis de ambiente
cp .env.example .env

# 3. Baixar os pacotes (React, Tailwind, Lucide, Axios)
npm install

# 4. Iniciar o servidor local (porta 5173)
npm run dev`,
        },
      ],
      tables: [
        {
          headers: ['Variável no .env', 'Valor Padrão', 'O que ela controla no SISMOB?'],
          rows: [
            [
              'VITE_MOCK_AUTH',
              'true',
              'Habilita o auto-login mock quando o backend estiver fora, permitindo testar a interface sem travar.',
            ],
            [
              'VITE_MOCK_DATA',
              'true',
              'Permite aos serviços usarem dados de contingência locais se o PostgreSQL não responder.',
            ],
            [
              'APP_TITLE',
              '"SISMOB - Boilerplate Frontend"',
              'Título exibido na aba do navegador e no cabeçalho superior do sistema.',
            ],
            [
              'DEV_PROXY_TARGET',
              '"https://dev-sismob.semob.df.gov.br"',
              'Endereço do servidor remoto de desenvolvimento caso queira apontar para a nuvem da SEMOB.',
            ],
          ],
        },
      ],
    },

    // ========================================================================
    // CAPÍTULO 3: O MODO DUPLO (DUAL-MODE) E CONEXÃO COM O BACKEND
    // ========================================================================
    {
      heading: '3. O Modo Duplo (Dual-Mode) e a Conexão com o Backend NestJS',
      body: 'Ao abrir o Boilerplate_Front, você percebe um recurso fundamental: o front funciona em Modo Duplo (Dual-Mode com Zero Dependência). Ele conversa com a API real do NestJS na porta 8097, mas se o backend estiver desligado, ele não quebra.',
      paragraphs: [
        'Como o navegador impede requisições entre portas diferentes por segurança (CORS), o arquivo vite.config.ts configura um Proxy Reverso: toda chamada que o front faz para /api é redirecionada de forma transparente para http://localhost:8097/api.',
        'Além disso, o linhaService.ts implementa Auto-Login JWT: se o token não existir na tokenStore, ele faz login sozinho com as credenciais padrão (admin / sismob@2026), grava o access_token e anexa o cabeçalho Authorization: Bearer <token>. Veja no simulador como o card de status reage:',
      ],
      enableDualModeSimulator: true,
      callouts: [
        {
          type: 'info',
          title: '🔄 O Papel do StatusIntegracaoBackend.tsx',
          content:
            'Toda tela principal no SISMOB inclui no topo o componente StatusIntegracaoBackend. Ele exibe um badge verde ("CONEXÃO ATIVA COM O BOILERPLATE BACKEND") com a latência em ms quando a API responde, ou um badge âmbar ("MODO CONTINGÊNCIA") quando o front está usando dados simulados. Isso dá total transparência ao estagiário e ao fiscal!',
        },
      ],
    },

    // ========================================================================
    // CAPÍTULO 4: ANATOMIA COMPLETA E A ESTRUTURA DA PASTA SRC/MODULOS/
    // ========================================================================
    {
      heading: '4. Anatomia do Boilerplate e a Estrutura da Pasta src/modulos/',
      body: 'Uma das características mais marcantes da arquitetura front-end da SEMOB é a Modularidade por Sistema dentro de src/modulos/. Em vez de termos pastas genéricas globais, cada grande sistema da secretaria vira um módulo autônomo.',
      paragraphs: [
        'Por exemplo, o SCL (Sistema de Controle de Linhas) fica em src/modulos/SCL/. Ele possui um menu central (SCLMenu.tsx) e submódulos independentes como Linhas/ e Vol/ (o desafio Infoônibus). Navegue pelo explorador abaixo para conhecer cada pasta:',
      ],
      folderExplorer: [
        {
          id: 'front-folder-modulos-scl-linhas',
          path: 'src/modulos/SCL/Linhas/',
          type: 'folder',
          analogy: 'O Buscador Integrado ao NestJS',
          purpose:
            'É o módulo de referência do sistema! Contém o fluxo completo de consulta de linhas conectado à API do backend. É aqui que você deve se inspirar para criar qualquer novo módulo.',
          filesInside: [
            'src/modulos/SCL/Linhas/LinhasIndex.tsx',
            'src/modulos/SCL/Linhas/services/linhaService.ts',
            'src/modulos/SCL/Linhas/hooks/useLinhas.ts',
            'src/modulos/SCL/Linhas/components/FormBuscaLinha.tsx',
            'src/modulos/SCL/Linhas/components/TabelaLinhas.tsx',
            'src/modulos/SCL/Linhas/components/CardLinhaDetalhes.tsx',
            'src/modulos/SCL/Linhas/components/StatusIntegracaoBackend.tsx',
            'src/modulos/SCL/Linhas/types/index.ts',
          ],
          mustDo: [
            'Organizar o módulo nas 5 subpastas (types, services, hooks, components e Index)',
            'Incluir o StatusIntegracaoBackend para dar visibilidade da conexão ao usuário',
          ],
          mustNotDo: [
            'Não misturar regras de outros módulos (ex: frota de veículos) dentro da pasta Linhas',
          ],
          codePreview: `// LinhasIndex.tsx (Smart UI)
export default function LinhasIndex() {
  const { navegarPara } = useNavigation();
  const { carregando, erro, linhas, linhaSelecionada, setLinhaSelecionada, buscarLinhas, origemDados, mensagemStatus } = useLinhas();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <VoltarButton onClick={() => navegarPara('scl-menu')} />
      <StatusIntegracaoBackend origem={origemDados} mensagem={mensagemStatus} />
      <FormBuscaLinha onBuscar={buscarLinhas} carregando={carregando} />
      <TabelaLinhas linhas={linhas} onSelecionar={setLinhaSelecionada} />
    </div>
  );
}`,
        },
        {
          id: 'front-folder-modulos-scl-vol',
          path: 'src/modulos/SCL/Vol/',
          type: 'folder',
          analogy: 'O Embrião do Projeto Final Infoônibus',
          purpose:
            'Contém a tela VolDesafio.tsx registrada na rota /infoonibus. É a área preparada com checklist, dados de telemetria GPS simulados e sandbox para o estagiário desenvolver o rastreamento em mapa!',
          filesInside: ['src/modulos/SCL/Vol/VolDesafio.tsx'],
          mustDo: [
            'Consultar este arquivo para entender os requisitos do projeto final (mapa, GPS, operadoras)',
          ],
          mustNotDo: ['Não apagar a rota infoonibus do modules.ts'],
        },
        {
          id: 'front-folder-modulos-scl',
          path: 'src/modulos/SCL/SCLMenu.tsx',
          type: 'file',
          analogy: 'O Painel de Serviços do SCL',
          purpose:
            'É o menu central do Sistema de Controle de Linhas. Lê as rotas permitidas do usuário (CDP) e desenha os cards dos submódulos (Buscador de Linhas e Desafio VOL). Toda tela nova que você criar no SCL ganha um card aqui!',
          filesInside: ['src/modulos/SCL/SCLMenu.tsx'],
          mustDo: [
            'Adicionar o novo serviço na lista servicos com ícone do Lucide e descrição clara',
          ],
          mustNotDo: ['Não colocar lógica de requisições HTTP dentro do Menu'],
        },
        {
          id: 'front-folder-config',
          path: 'src/config/',
          type: 'folder',
          analogy: 'O Cartório de Rotas e Ambiente',
          purpose:
            'modules.ts registra todas as rotas da aplicação usando lazy loading (lazyWithRetry). env.config.ts lê as variáveis de ambiente e mockUsers.ts define os perfis de teste do CDP.',
          filesInside: [
            'src/config/modules.ts',
            'src/config/env.config.ts',
            'src/config/mockUsers.ts',
          ],
          mustDo: [
            'Usar lazyWithRetry(() => import(...)) para carregar telas sob demanda e manter o bundle leve',
          ],
          mustNotDo: ['Nunca importar telas pesadas de forma síncrona no topo do arquivo'],
        },
        {
          id: 'front-folder-services',
          path: 'src/services/',
          type: 'folder',
          analogy: 'A Infraestrutura de Conexão',
          purpose:
            'api.ts configura a instância global do Axios com baseURL e timeout. tokenStore.ts armazena e lê o token JWT do localStorage e auditLogger.ts registra logs operacionais.',
          filesInside: [
            'src/services/api.ts',
            'src/services/tokenStore.ts',
            'src/services/auditLogger.ts',
          ],
          mustDo: ['Reutilizar a instância api para garantir que o interceptor de token funcione'],
          mustNotDo: ['Não criar instâncias soltas de axios.create() em outros lugares'],
        },
        {
          id: 'front-folder-components-security',
          path: 'src/components/ (Can & ProtectedRoute)',
          type: 'folder',
          analogy: 'A Blindagem de Acesso CDP',
          purpose:
            'ProtectedRoute.tsx barra o acesso a páginas inteiras se o perfil do usuário não tiver permissão. Can.tsx controla a visibilidade de botões (ex: esconde o botão "Cadastrar" para quem só tem leitura).',
          filesInside: [
            'src/components/ProtectedRoute.tsx',
            'src/components/Can.tsx',
            'src/components/DevRoleSwitcher.tsx',
          ],
          mustDo: [
            'Envolver rotas administrativas com <ProtectedRoute endpoint="...">',
            'Envolver botões de escrita com <Can endpoint="..." action="ESCRITA">',
          ],
          mustNotDo: ['Não confiar apenas no front para segurança (o back sempre valida via Guard)'],
        },
        {
          id: 'front-folder-hooks',
          path: 'src/hooks/',
          type: 'folder',
          analogy: 'Os Sensores Globais da Aplicação',
          purpose:
            'useAuth.tsx fornece os dados do usuário logado e método temAcesso(). useNavigation.tsx controla a troca de telas sem recarregar a página e useModules.tsx filtra as rotas liberadas.',
          filesInside: [
            'src/hooks/useAuth.tsx',
            'src/hooks/useNavigation.tsx',
            'src/hooks/useModules.tsx',
            'src/hooks/useResponsive.ts',
          ],
          mustDo: ['Usar useNavigation() para navegar entre telas mantendo o estado reativo'],
          mustNotDo: ['Não usar window.location.href para navegação interna'],
        },
      ],
    },

    // ========================================================================
    // CAPÍTULO 5: ESTUDO DE CASO: COMO A TELA DE LINHAS FOI CONSTRUÍDA
    // ========================================================================
    {
      heading: '5. Estudo de Caso Vivo: Dissecando a Tela Real de Linhas (src/modulos/SCL/Linhas)',
      body: 'Para você entender perfeitamente como uma tela nasce e como as camadas conversam, vamos dissecar arquivo por arquivo a tela oficial de Linhas que já está funcionando no seu Boilerplate:',
      paragraphs: [
        'Observe como cada arquivo resolve apenas um pedaço do problema de forma cirúrgica:',
      ],
      codeBlocks: [
        {
          title: '1. O Contrato (src/modulos/SCL/Linhas/types/index.ts)',
          language: 'typescript',
          code: `// Espelha os dados que o LinhaController do NestJS devolve
export interface Linha {
  id?: number | string;
  codigo: string;          // ex: '0.108'
  descricao: string;       // ex: 'ROD. PLANO PILOTO / QGEX / SMU'
  valorTarifa: number;     // ex: 2.70
  faixaTarifaria?: string; // ex: 'URBANA 1'
  dataInicialTarifa?: string;
  dataFinalTarifa?: string | null;
}

export interface FiltroLinha {
  codigo?: string;
  descricao?: string;
}`,
        },
        {
          title: '2. O Serviço com Auto-Login JWT (src/modulos/SCL/Linhas/services/linhaService.ts)',
          language: 'typescript',
          code: `export const linhaService = {
  async buscarLinhas(filtro: FiltroLinha) {
    try {
      // 1. Garante login automático como "admin" no NestJS
      await this.obterTokenAutenticacao();

      // 2. Chama a API real via proxy Vite (/api -> http://localhost:8097)
      const params: Record<string, string> = {};
      if (filtro.codigo) params.codigo = filtro.codigo;
      if (filtro.descricao) params.descricao = filtro.descricao;

      const response = await api.get('/api/linhas', { params });
      return { linhas: response.data, origem: 'backend' };
    } catch (e) {
      // 3. Backend offline? Retorna os dados mock de contingência!
      return { linhas: MOCK_LINHAS_FALLBACK, origem: 'mock' };
    }
  }
};`,
        },
        {
          title: '3. O Custom Hook Reativo (src/modulos/SCL/Linhas/hooks/useLinhas.ts)',
          language: 'typescript',
          code: `export function useLinhas() {
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [linhas, setLinhas] = useState<Linha[]>([]);
  const [linhaSelecionada, setLinhaSelecionada] = useState<Linha | null>(null);
  const [origemDados, setOrigemDados] = useState<'backend' | 'mock'>('mock');

  const buscarLinhas = useCallback(async (filtro: FiltroLinha) => {
    try {
      setCarregando(true);
      setErro(null);
      const res = await linhaService.buscarLinhas(filtro);
      setLinhas(res.linhas);
      setOrigemDados(res.origem);
      if (res.linhas.length > 0) setLinhaSelecionada(res.linhas[0]);
    } catch (e: any) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => { buscarLinhas({}); }, [buscarLinhas]);

  return { carregando, erro, linhas, linhaSelecionada, setLinhaSelecionada, buscarLinhas, origemDados };
}`,
        },
        {
          title: '4. A Página Principal Smart UI (src/modulos/SCL/Linhas/LinhasIndex.tsx)',
          language: 'typescript',
          code: `export default function LinhasIndex() {
  const { navegarPara } = useNavigation();
  const { carregando, erro, linhas, linhaSelecionada, setLinhaSelecionada, buscarLinhas, origemDados } = useLinhas();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Botão de navegação */}
      <VoltarButton onClick={() => navegarPara('scl-menu')} label="Voltar ao Menu SCL" />

      {/* Indicador de Conexão com o Backend */}
      <StatusIntegracaoBackend origem={origemDados} />

      {/* Formulário Puro (Dumb) */}
      <FormBuscaLinha onBuscar={buscarLinhas} carregando={carregando} />

      {/* Mensagem de Erro se houver */}
      {erro && <div className="p-4 bg-red-50 text-red-700 rounded-2xl">{erro}</div>}

      {/* Tabela Pura (Dumb) */}
      <TabelaLinhas linhas={linhas} linhaSelecionada={linhaSelecionada} onSelecionar={setLinhaSelecionada} />

      {/* Card Dossiê da Linha Clicada (Dumb) */}
      {linhaSelecionada && <CardLinhaDetalhes linha={linhaSelecionada} />}
    </div>
  );
}`,
        },
      ],
      callouts: [
        {
          type: 'success',
          title: '✨ Repare na Elegância da Página LinhasIndex.tsx',
          content:
            'A página LinhasIndex.tsx tem menos de 60 linhas de código! Ela não tem nenhum comando SQL, nenhuma requisição Axios e nenhum if complexo de dados. Ela funciona como um Maestro: junta o Hook com os componentes visuais.',
        },
      ],
    },

    // ========================================================================
    // CAPÍTULO 6: SEGURANÇA E PERFIS CDP NO FRONT-END
    // ========================================================================
    {
      heading: '6. Segurança e Perfis CDP: Blindando Rotas e Botões com <ProtectedRoute> e <Can>',
      body: 'Na SEMOB, os sistemas atendem a diferentes públicos: estagiários, operadores de bacias, fiscais de campo e diretores de mobilidade. Para evitar que um perfil não autorizado execute ações indevidas, nós utilizamos o CDP (Controle de Direitos de Acesso).',
      paragraphs: [
        'No front-end, a segurança atua em dois níveis complementares: no nível de Tela Inteira (usando ProtectedRoute) e no nível Granular de Botões (usando Can).',
        'Use o simulador abaixo para alternar entre os perfis e ver a interface reagir em tempo real:',
      ],
      enableCdpSimulator: true,
      callouts: [
        {
          type: 'important',
          title: '🛡️ A Regra de Ouro da Segurança em Duas Pontas',
          content:
            'O front-end esconde botões e bloqueia telas para oferecer uma boa experiência de uso ao usuário. No entanto, a segurança real e definitiva está sempre no backend (@UseGuards(JwtAuthGuard, RolesGuard)). Mesmo que alguém tente burlar o front, a API devolverá HTTP 401 ou 403!',
        },
      ],
    },

    // ========================================================================
    // CAPÍTULO 7: TUTORIAL GUIADO — CRIANDO UMA NOVA TELA COMPLETA (ITINERÁRIOS)
    // ========================================================================
    {
      heading: '7. Laboratório Guiado: Criando uma Nova Tela do Zero Consumindo uma API',
      body: 'Agora que você conhece todas as peças, vamos ao objetivo principal: você ser capaz de criar uma nova tela sozinho do zero absoluto! Vamos criar o submódulo de Itinerário Descritivo de Linhas em src/modulos/SCL/Itinerarios/ para consumir o endpoint GET /api/linhas/:codigo/itinerario.',
      paragraphs: [
        'Siga os 6 passos sequenciais abaixo. Cada passo responde a uma pergunta e traz o código exato comentado:',
      ],
      guidedTutorialSteps: [
        {
          stepNumber: 1,
          title: 'Criar a Pasta e Definir os Tipos',
          fileTarget: 'src/modulos/SCL/Itinerarios/types/index.ts',
          questionAnswered:
            'Como informamos ao TypeScript quais campos a nova API de itinerário retorna?',
          whyItMatters:
            'Crie a pasta src/modulos/SCL/Itinerarios/types/ e adicione o arquivo index.ts. Nele declaramos a forma dos dados (sequencia, nomeVia, localidade) refletindo a tabela tab_itinerario_descritivo.',
          language: 'typescript',
          code: `export interface ItinerarioVia {
  id?: number;
  sequencia: number;      // nm_sequencia na tabela
  nomeVia: string;        // nm_via na tabela
  localidade: string;     // localidade / bairro
  sentido?: string;       // IDA, VOLTA ou CIRCULAR
}

export interface FiltroItinerario {
  codigoLinha: string;    // ex: "0.111"
  sentido?: string;
}

export interface RespostaItinerario {
  codigoLinha: string;
  denominacao: string;
  vias: ItinerarioVia[];
  origem: 'backend' | 'mock';
  mensagem?: string;
}`,
          lineByLineExplanations: [
            {
              lineHighlight: `export interface ItinerarioVia`,
              explanation:
                'Representa cada ponto do trajeto com a numeração sequencial da parada e o nome da via física.',
            },
            {
              lineHighlight: `origem: 'backend' | 'mock'`,
              explanation:
                'Fundamental para o padrão Dual-Mode: o hook saberá se os dados vieram da API real do NestJS ou do mock local.',
            },
          ],
        },
        {
          stepNumber: 2,
          title: 'Criar o Serviço HTTP com Dual-Mode',
          fileTarget: 'src/modulos/SCL/Itinerarios/services/itinerarioService.ts',
          questionAnswered:
            'Como fazemos a requisição com Axios e garantimos que o front não quebre se o backend estiver desligado?',
          whyItMatters:
            'No arquivo itinerarioService.ts, usamos a instância global api. Se o backend estiver rodando, devolvemos os dados reais. Se estiver fora, retornamos o fallback mock de contingência.',
          language: 'typescript',
          code: `import api from '../../../../services/api';
import { tokenStore } from '../../../../services/tokenStore';
import { ItinerarioVia, RespostaItinerario } from '../types';

const MOCK_ITINERARIO_FALLBACK: ItinerarioVia[] = [
  { sequencia: 1, nomeVia: 'PLATAFORMA E - RODOVIÁRIA DO PLANO PILOTO', localidade: 'PLANO PILOTO', sentido: 'CIRCULAR' },
  { sequencia: 2, nomeVia: 'EIXO RODOVIÁRIO NORTE (ALTURA 106 NORTE)', localidade: 'ASA NORTE', sentido: 'CIRCULAR' },
  { sequencia: 3, nomeVia: 'VIA L2 NORTE (QUADRAS 406/408)', localidade: 'ASA NORTE', sentido: 'CIRCULAR' },
  { sequencia: 4, nomeVia: 'CAMPUS UNIVERSITÁRIO DARCY RIBEIRO (ICC NORTE)', localidade: 'UNB', sentido: 'CIRCULAR' },
  { sequencia: 5, nomeVia: 'RETORNO À RODOVIÁRIA DO PLANO PILOTO', localidade: 'PLANO PILOTO', sentido: 'CIRCULAR' },
];

export const itinerarioService = {
  async buscarPorCodigoLinha(codigoLinha: string): Promise<RespostaItinerario> {
    try {
      const token = tokenStore.getToken();
      const headers = token ? { Authorization: \`Bearer \${token}\` } : {};

      const response = await api.get(\`/api/linhas/\${codigoLinha}/itinerario\`, { headers });

      if (response.data && Array.isArray(response.data)) {
        return {
          codigoLinha,
          denominacao: response.data[0]?.descricao || 'Linha Operacional',
          vias: response.data,
          origem: 'backend',
          mensagem: \`Itinerário carregado com sucesso da API NestJS (\${response.data.length} vias).\`,
        };
      }
    } catch (_error) {
      console.warn('[itinerarioService] Backend offline, usando contingência mock.');
    }

    // Fallback Mock se o backend estiver desligado
    return {
      codigoLinha,
      denominacao: 'Linha 0.110 (Demonstração Mock)',
      vias: MOCK_ITINERARIO_FALLBACK,
      origem: 'mock',
      mensagem: 'Exibindo trajeto de contingência. Suba o Boilerplate_Back para dados do PostgreSQL!',
    };
  },
};`,
          lineByLineExplanations: [
            {
              lineHighlight: `const headers = token ? { Authorization: \`Bearer \${token}\` } : {};`,
              explanation:
                'Anexa automaticamente o token JWT para passar com sucesso pelo JwtAuthGuard do NestJS.',
            },
            {
              lineHighlight: `catch (_error) { ... return fallback; }`,
              explanation:
                'O coração do Dual-Mode: o erro é absorvido com elegância e o aluno continua programando a interface sem travar!',
            },
          ],
        },
        {
          stepNumber: 3,
          title: 'Criar o Cérebro Reativo (Custom Hook)',
          fileTarget: 'src/modulos/SCL/Itinerarios/hooks/useItinerario.ts',
          questionAnswered:
            'Como controlamos carregando, erro e a lista de vias sem poluir os componentes visuais?',
          whyItMatters:
            'O Hook concentra 100% da reatividade do React. Ele expõe variáveis limpas (carregando, erro, vias, buscarItinerario) para a tela consumir em uma única linha.',
          language: 'typescript',
          code: `import { useState, useCallback } from 'react';
import { ItinerarioVia } from '../types';
import { itinerarioService } from '../services/itinerarioService';

export function useItinerario() {
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [vias, setVias] = useState<ItinerarioVia[]>([]);
  const [origemDados, setOrigemDados] = useState<'backend' | 'mock'>('mock');
  const [mensagemStatus, setMensagemStatus] = useState<string>('');

  const buscarItinerario = useCallback(async (codigo: string) => {
    if (!codigo.trim()) return;

    try {
      setCarregando(true);
      setErro(null);

      const res = await itinerarioService.buscarPorCodigoLinha(codigo);
      setVias(res.vias);
      setOrigemDados(res.origem);
      setMensagemStatus(res.mensagem || '');
    } catch (e: any) {
      setErro(e.message || 'Falha ao buscar itinerário da linha.');
      setVias([]);
    } finally {
      setCarregando(false);
    }
  }, []);

  return {
    carregando,
    erro,
    vias,
    origemDados,
    mensagemStatus,
    buscarItinerario,
  };
}`,
          lineByLineExplanations: [
            {
              lineHighlight: `const [carregando, setCarregando] = useState(false);`,
              explanation:
                'Permite à tela desabilitar botões de busca e exibir spinners enquanto a requisição HTTP viaja na rede.',
            },
            {
              lineHighlight: `useCallback(async (codigo: string) => { ... }, []);`,
              explanation:
                'Memoriza a função de busca evitando re-renderizações desnecessárias no React.',
            },
          ],
        },
        {
          stepNumber: 4,
          title: 'Criar o Componente Visual (Dumb UI)',
          fileTarget: 'src/modulos/SCL/Itinerarios/components/TabelaViasItinerario.tsx',
          questionAnswered:
            'Como desenhamos a lista de vias e paradas de forma limpa e modular?',
          whyItMatters:
            'Este componente é puramente visual. Ele não sabe o que é Axios nem o que é banco de dados: apenas recebe vias: ItinerarioVia[] via props e desenha a linha do tempo do trajeto!',
          language: 'typescript',
          code: `import React from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { ItinerarioVia } from '../types';

interface TabelaViasProps {
  vias: ItinerarioVia[];
  carregando: boolean;
}

export const TabelaViasItinerario: React.FC<TabelaViasProps> = ({ vias, carregando }) => {
  if (carregando) {
    return <div className="p-8 text-center text-slate-400 text-sm">Carregando sequência de paradas...</div>;
  }

  if (vias.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-2xl border border-slate-200 text-sm">
        Digite o código de uma linha acima para visualizar o itinerário descritivo de vias.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide flex items-center gap-2">
          <Navigation className="w-4 h-4 text-indigo-600" /> Trajeto Sequencial de Vias ({vias.length} pontos)
        </h3>
      </div>

      <div className="divide-y divide-slate-100">
        {vias.map((item) => (
          <div key={item.sequencia} className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
            <span className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 font-mono font-bold text-xs flex items-center justify-center shrink-0">
              #{item.sequencia}
            </span>
            <div className="flex-1">
              <strong className="text-slate-800 text-sm block">{item.nomeVia}</strong>
              <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3" /> {item.localidade}
              </span>
            </div>
            {item.sentido && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {item.sentido}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};`,
          lineByLineExplanations: [
            {
              lineHighlight: `interface TabelaViasProps { vias: ItinerarioVia[]; carregando: boolean; }`,
              explanation:
                'O contrato do componente Dumb: ele depende exclusivamente dessas duas propriedades.',
            },
            {
              lineHighlight: `vias.map((item) => ( ... ))`,
              explanation:
                'Desenha cada parada numerada com ícone de localização e nome da via.',
            },
          ],
        },
        {
          stepNumber: 5,
          title: 'Criar a Página Principal (Smart UI)',
          fileTarget: 'src/modulos/SCL/Itinerarios/ItinerariosIndex.tsx',
          questionAnswered:
            'Como unimos o cabeçalho, o diagnóstico de conexão, o hook e a tabela em uma única tela?',
          whyItMatters:
            'O ItinerariosIndex é o Maestro! Ele não tem nenhuma lógica de requisição HTTP (o hook resolveu isso) e não se preocupa com o desenho dos pontos da via (o dumb component resolveu isso). Ele apenas une as peças.',
          language: 'typescript',
          code: `import React, { useState } from 'react';
import { useNavigation } from '../../../hooks/useNavigation';
import { VoltarButton } from '../../../components/ui/VoltarButton';
import { StatusIntegracaoBackend } from '../Linhas/components/StatusIntegracaoBackend';
import { TabelaViasItinerario } from './components/TabelaViasItinerario';
import { useItinerario } from './hooks/useItinerario';
import { Route, Search } from 'lucide-react';

export default function ItinerariosIndex() {
  const { navegarPara } = useNavigation();
  const [codigoBusca, setCodigoBusca] = useState('0.110');
  const { carregando, erro, vias, origemDados, mensagemStatus, buscarItinerario } = useItinerario();

  const handleSubmeter = (e: React.FormEvent) => {
    e.preventDefault();
    buscarItinerario(codigoBusca);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 animate-fadeIn">
      <VoltarButton onClick={() => navegarPara('scl-menu')} label="Voltar ao Menu SCL" />

      <div className="flex items-center gap-4">
        <div className="p-3.5 bg-indigo-50 text-indigo-600 rounded-2xl">
          <Route className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-900">Itinerário Descritivo de Linhas</h1>
          <p className="text-slate-500 text-sm font-medium">
            Sequência oficial de vias e paradas integrado com o Boilerplate Backend
          </p>
        </div>
      </div>

      <StatusIntegracaoBackend origem={origemDados} mensagem={mensagemStatus} />

      <form onSubmit={handleSubmeter} className="bg-white p-5 rounded-3xl border border-slate-200 flex gap-3 shadow-sm">
        <input
          type="text"
          value={codigoBusca}
          onChange={(e) => setCodigoBusca(e.target.value)}
          placeholder="Código da Linha (ex: 0.110)"
          className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none focus:border-indigo-600"
        />
        <button type="submit" disabled={carregando} className="btn-primary">
          <Search size={15} /> {carregando ? 'Buscando...' : 'Buscar Trajeto'}
        </button>
      </form>

      {erro && <div className="p-4 bg-red-50 text-red-700 rounded-2xl border border-red-200 text-sm">{erro}</div>}

      <TabelaViasItinerario vias={vias} carregando={carregando} />
    </div>
  );
}`,
          lineByLineExplanations: [
            {
              lineHighlight: `const { navegarPara } = useNavigation();`,
              explanation:
                'Permite que o botão VoltarButton retorne o usuário com segurança ao Menu do SCL.',
            },
            {
              lineHighlight: `<StatusIntegracaoBackend origem={origemDados} mensagem={mensagemStatus} />`,
              explanation:
                'Reutiliza o componente de diagnóstico: o usuário sabe na hora se o trajeto veio do PostgreSQL ou do Mock!',
            },
          ],
        },
        {
          stepNumber: 6,
          title: 'Registrar a Nova Rota no SCL',
          fileTarget: 'src/config/modules.ts & src/modulos/SCL/SCLMenu.tsx',
          questionAnswered:
            'Como fazemos a nova tela aparecer no menu do SCL e ser carregada sob demanda pelo Vite?',
          whyItMatters:
            'O último passo de ouro! No modules.ts, importamos a tela com lazyWithRetry e registramos na lista de subMenus do SCL. Automaticamente, o SCLMenu.tsx desenha o card com o ícone Route e aplica as regras do CDP!',
          language: 'typescript',
          code: `// 1. Em src/config/modules.ts:
const ItinerariosIndex = lazyWithRetry(
  () => import('../modulos/SCL/Itinerarios/ItinerariosIndex')
);

// Dentro de modulos_sistema no item com id: 'scl', adicione aos subMenus:
{
  id: 'itinerarios',
  titulo: 'Itinerário Descritivo',
  icone: 'Route',
  rota: 'itinerarios',
  componente: ItinerariosIndex,
}

// 2. Pronto! O SCLMenu.tsx lê os subMenus automaticamente e desenha o card clicável!`,
          lineByLineExplanations: [
            {
              lineHighlight: `lazyWithRetry(() => import(...))`,
              explanation:
                'Garante que o código desta tela só é baixado pela rede quando o usuário clicar no card, acelerando o carregamento inicial do sistema.',
            },
            {
              lineHighlight: `rota: 'itinerarios'`,
              explanation:
                'Permite que useNavigation().navegarPara("itinerarios") abra a tela instantaneamente.',
            },
          ],
        },
      ],
    },

    // ========================================================================
    // CAPÍTULO 8: GUIA DE BOLSO DO FRONT-END SISMOB
    // ========================================================================
    {
      heading: '8. Guia de Bolso & Checklist de Qualidade Front-end',
      body: 'Antes de abrir um Merge Request para a equipe de desenvolvimento da SEMOB, consulte esta tabela rápida para garantir que seu código segue as melhores práticas:',
      tables: [
        {
          headers: ['Conceito', 'Como Fazer do Jeito Certo ✅', 'O Que Evitar a Todo Custo ❌'],
          rows: [
            [
              'Chamadas HTTP',
              'Invocar o método do service (ex: itinerarioService.buscar()).',
              'Fazer axios.get() solto dentro de componente visual ou hook.',
            ],
            [
              'Loading State',
              'Desabilitar botões (disabled={carregando}) e exibir spinner animado.',
              'Permitir múltiplos cliques enviando requisições duplicadas à API.',
            ],
            [
              'Tipagem',
              'Criar interfaces detalhadas e DTOs no diretório types/.',
              'Usar any para burlar avisos do compilador TypeScript.',
            ],
            [
              'Tratamento de Erros',
              'Notificar o usuário de forma amigável com card de erro estilizado.',
              'Deixar blocos catch {} vazios em silêncio ou travar a tela em branco.',
            ],
            [
              'Controle de Acesso',
              'Usar <ProtectedRoute> para telas e <Can> para botões administrativos.',
              'Deixar rotas de supervisor abertas ou renderizar botões que dão 403.',
            ],
            [
              'Dual-Mode',
              'Implementar fallback em memória no Service para garantir zero dependência.',
              'Fazer o front quebrar com tela preta quando o Docker estiver desligado.',
            ],
            [
              'Variáveis .env',
              'Usar sempre o prefixo VITE_ e centralizar a leitura em env.config.ts.',
              'Colocar senhas no .env do front ou acessar import.meta.env solto nos componentes.',
            ],
          ],
        },
      ],
    },
  ],
  checklist: [
    'Configurei o arquivo .env respeitando o prefixo VITE_ e compreendi a leitura unificada via env.config.ts',
    'Subi o Boilerplate_Front com npm run dev na porta 5173 confirmando a conexão com o backend no badge verde',
    'Compreendi o funcionamento do Dual-Mode com proxy reverso do Vite (/api) e auto-login JWT transparente',
    'Naveguei pela estrutura interna de src/modulos/ e compreendi como a tela real de Linhas (SCL) foi implementada',
    'Testei os perfis do CDP utilizando <ProtectedRoute> para blindar telas e <Can> para ocultar botões de escrita',
    'Pratiquei a construção de novos submódulos no SCL seguindo a esteira Types ➔ Service ➔ Hook ➔ Dumb UI ➔ Smart UI',
  ],
};
