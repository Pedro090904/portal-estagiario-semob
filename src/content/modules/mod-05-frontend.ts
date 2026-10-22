import { LearningModule } from '../../types';

export const mod05Frontend: LearningModule = {
  id: 'mod-5-frontend',
  order: 5,
  title: 'Manual Prático de Front-end: Dominando o BoilerPlate_Front_end e o Fluxo do SCL',
  category: 'frontend',
  estimatedTime: '3h 45min',
  version: '2.1.0',
  updatedAt: '2026-10-22',
  workloadHours: 12,
  description:
    'Do git clone ao domínio completo do BoilerPlate_Front_end: entenda o .env e Runtime Config, o CDP/Segurança, como a tela RelatorioLinha existe dentro do módulo SCL e o fluxo completo de 7 estações (de src/config/modules.ts até o arquivo .tsx final que compila os micro-componentes e hooks).',
  objectives: [
    'Subir o BoilerPlate_Front_end conectado ao BoilerPlate_Back_end via .env, env.config.ts e public/config.js',
    'Compreender a ponte automática de autenticação (Login.tsx ➔ tokenStore.ts ➔ api.ts) e os hooks de CDP/Segurança',
    'Entender na prática como a tela RelatorioLinha existe dentro do módulo SCL (modules.ts ➔ SCLMenu.tsx ➔ App.tsx ➔ Pasta da Tela)',
    'Aplicar a modularização máxima (types, services, micro-hooks e micro-componentes) para que o arquivo .tsx final apenas compile e orquestre tudo',
  ],
  sections: [
    // ========================================================================
    // CAPÍTULO 1: DO CLONE AO AR (CONECTANDO FRONT E BACK)
    // ========================================================================
    {
      heading: '1. O Que é o BoilerPlate_Front_end e Como Colocá-lo no Ar',
      body: 'O BoilerPlate_Front_end é a nossa plataforma base de interfaces da SEMOB. Ele já vem com Login integrado ao Back-end, Dashboard de sistemas, Sidebar inteligente, controle de acesso por perfil (Can.tsx, ProtectedRoute.tsx, SemAcessoGuard.tsx), suporte a PWA (public/manifests/) e um módulo real já construído para servir de referência: o SCL (Sistema de Controle de Linhas), contendo ConsultaOS e RelatorioLinha.',
      commandCards: [
        {
          name: 'Passo 1: Clonar o Repositório e Abrir no VS Code',
          role: 'Terminal Git',
          concept:
            'Com o seu BoilerPlate_Back_end rodando na porta 8097 (e o banco PostgreSQL ativo no Rancher Desktop), abra um novo terminal para o Front-end:',
          code: `git clone https://github.com/pedro090904/BoilerPlate_Front_end.git
cd BoilerPlate_Front_end
code .`,
        },
        {
          name: 'Passo 2: Configurar o .env na Raiz do Projeto',
          role: 'Variáveis de Ambiente',
          concept:
            'O ficheiro .env na raiz informa ao Vite onde o Back-end está rodando. O ficheiro src/config/env.config.ts lê essa variável e alimenta o cliente HTTP src/services/api.ts:',
          code: `# No ficheiro .env da raiz:
VITE_API_URL=http://localhost:8097/api`,
        },
        {
          name: 'Passo 3: Instalar Dependências (.npmrc) e Iniciar com Vite',
          role: 'NPM & Vite',
          concept:
            'O projeto possui um ficheiro .npmrc configurado com legacy-peer-deps=true para garantir instalação limpa de todos os pacotes gráficos. Basta rodar:',
          code: `npm install
npm run dev

# Acesse no navegador: http://localhost:5173`,
        },
      ],
    },

    // ========================================================================
    // CAPÍTULO 2: .ENV RUNTIME, PONTE JWT, CDP E AS 7 ESTAÇÕES
    // ========================================================================
    {
      heading: '2. Engrenagens Internas: .env Runtime, Ponte JWT (api.ts) e CDP / Segurança',
      body: 'Antes de criarmos uma tela nova, precisamos entender como o BoilerPlate_Front_end resolve autenticação, variáveis de ambiente em produção (Docker) e segurança de sessão automaticamente para você. Interaja com o painel abaixo:',
      enableFrontendBridgeSimulator: true,
      callouts: [
        {
          type: 'info',
          title: '🐳 Por que existem .env, src/config/env.config.ts e public/config.js?',
          content:
            'Conforme documentado em docs/CONFIG-RUNTIME.md, aplicações React compiladas viram arquivos estáticos. Para permitir trocar a URL do Back-end quando o container Docker sobe em Homologação ou Produção sem precisar rodar "npm run build" de novo:',
          bullets: [
            '1. O script docker/30-runtime-env.sh lê as variáveis do servidor quando o container inicia e gera o arquivo public/config.js (window.__ENV__).',
            '2. O arquivo src/config/env.config.ts lê primeiro o window.__ENV__ e, se não existir (como no seu npm run dev local), usa o .env!',
            '3. Regra prática: Nos seus services ou componentes, NUNCA use import.meta.env direto; importe sempre de src/config/env.config.ts.',
          ],
        },
        {
          type: 'important',
          title: '🕵️ O que é o CDP, Proxy e a Camada de Segurança do Boilerplate?',
          content:
            'O boilerplate traz ferramentas nativas de proteção e depuração que rodam automaticamente no AppLayout:',
          bullets: [
            'Inspeção via CDP (Chrome DevTools Protocol) & Network: Permite auditar as chamadas que saem do front para a porta 8097 e verificar o cabeçalho Authorization: Bearer.',
            'Hooks de Proteção (useSecurity.ts, useIncognitoBlocker.tsx, auditLogger.ts): Bloqueiam uso em guias anônimas não autorizadas (IncognitoBlockScreen.tsx), bloqueiam telas exclusivas de desktop quando abertas em telas incompatíveis (ApenasDesktopModal.tsx) e geram o selo criptográfico em relatórios impressos (useSeloImpressao.ts / SeloValidacaoImpressao.tsx).',
            'Simulação de Perfis (src/config/simulatedProfiles.ts e DevModal.tsx): Permite testar em tempo real se um perfil tem ou não acesso a um módulo sem precisar trocar de usuário no banco.',
          ],
        },
      ],
    },

    // ========================================================================
    // CAPÍTULO 3: ESTUDO DE CASO REAL — COMO "RELATORIOLINHA" EXISTE NO SCL
    // ========================================================================
    {
      heading: '3. Estudo de Caso Real: Como a Tela "RelatorioLinha" Existe Dentro do Módulo SCL?',
      body: 'Para entender como criar qualquer tela nova no BoilerPlate_Front_end, basta observar como a tela "RelatorioLinha" foi construída dentro do módulo SCL. Ela não é um arquivo solto: ela segue um fluxo completo que começa na pasta src/config/modules.ts e termina no arquivo compilador RelatorioLinha.tsx!',
      paragraphs: [
        'Por que não escrevemos tudo dentro de um único arquivo gigante? Porque a boa prática de engenharia adotada no boilerplate é a MODULARIZAÇÃO MÁXIMA: nós quebramos tipagens, chamadas de API, buscas, exportação CSV, impressão e cada pedaço visual (formulário de filtro, cards de estatística, lista de linhas, detalhes da linha) em arquivos pequenos e independentes. Assim, o último arquivo (.tsx) na raiz da pasta da tela serve apenas para importar e conectar (compilar) essas peças!',
      ],
      folderExplorer: [
        {
          id: 'step-config-modules',
          path: '1º src/config/modules.ts',
          type: 'file',
          analogy: 'A Certidão de Nascimento do Módulo/Submódulo',
          purpose:
            'É o primeiro lugar onde você mexe! Aqui ficam declarados todos os módulos do sistema (como SCL e Noticias), seus ícones (logo_scl.webp), suas rotas, permissões e seus submódulos filhos. Se não estiver registrado aqui, ele não aparece na Sidebar nem no Dashboard!',
          filesInside: ['src/config/modules.ts', 'src/hooks/useModules.tsx', 'src/hooks/useNavigation.tsx'],
          mustDo: [
            'Cadastrar os metadados do módulo ou adicionar a nova opção dentro do grupo do módulo pai (ex: SCL)',
            'Definir o id, título, caminho da rota (path) e ícone correspondente',
          ],
          mustNotDo: [
            'Nunca criar uma rota secreta no App.tsx sem declará-la na estrutura de módulos quando ela fizer parte do menu',
          ],
          codePreview: `// Em src/config/modules.ts:
{
  id: 'scl',
  title: 'SCL - Controle de Linhas',
  icon: '/images/logo_scl.webp',
  path: '/scl',
  submodules: [
    { id: 'consulta-os', title: 'Consulta de OS', path: '/scl/consulta-os' },
    { id: 'relatorio-linha', title: 'Relatório de Linhas', path: '/scl/relatorio-linha' },
    // 👉 É aqui que você registrará "Consultar Itinerário" e "Consultar Horários"!
  ]
}`,
        },
        {
          id: 'step-scl-menu-app',
          path: '2º src/modulos/SCL/SCLMenu.tsx & src/App.tsx',
          type: 'file',
          analogy: 'O Hall de Entrada do SCL e o Mapa de Rotas',
          purpose:
            'Quando o usuário clica em SCL no Dashboard, o App.tsx abre o SCLMenu.tsx. O SCLMenu.tsx exibe os cards dos submódulos (ConsultaOS, RelatorioLinha). Ao clicar no card de Relatório de Linha, o React Router navega para a rota registrada no src/App.tsx!',
          filesInside: ['src/modulos/SCL/SCLMenu.tsx', 'src/App.tsx', 'src/components/ProtectedRoute.tsx'],
          mustDo: [
            'Adicionar o Card/Botão do novo submódulo no SCLMenu.tsx',
            'Declarar a <Route path="/scl/minha-nova-tela" element={<MinhaTela />} /> dentro da área autenticada do src/App.tsx',
          ],
          mustNotDo: [
            'Nunca colocar a lógica da tela dentro do SCLMenu.tsx (ele é apenas o menu de entrada do módulo SCL)',
          ],
        },
        {
          id: 'step-types-services',
          path: '3º RelatorioLinha/types/ & services/',
          type: 'folder',
          analogy: 'Os Contratos e o Mensageiro HTTP',
          purpose:
            'Agora entramos em src/modulos/SCL/RelatorioLinha/. Primeiro criamos a pasta types/ (com typesRelatorioLinha.ts e o reexportador index.ts) e depois a pasta services/ (com linhaService.ts, que importa o api global e conversa com o BoilerPlate_Back_end).',
          filesInside: [
            'src/modulos/SCL/RelatorioLinha/types/typesRelatorioLinha.ts',
            'src/modulos/SCL/RelatorioLinha/types/index.ts',
            'src/modulos/SCL/RelatorioLinha/services/linhaService.ts',
          ],
          mustDo: [
            'Criar um arquivo index.ts dentro de types/ exportando todas as interfaces para facilitar os imports',
            'Usar o api de src/services/api.ts dentro de linhaService.ts',
          ],
          mustNotDo: [
            'Proibido usar "any" em typesRelatorioLinha.ts ou chamar hooks React dentro de linhaService.ts',
          ],
        },
        {
          id: 'step-micro-hooks',
          path: '4º RelatorioLinha/hooks/ (Micro-Hooks)',
          type: 'folder',
          analogy: 'Os Cérebros Especializados da Tela',
          purpose:
            'Veja como o RelatorioLinha NÃO joga 500 linhas de lógica num arquivo só! Ele divide a inteligência em micro-hooks na pasta hooks/: um para buscar linha específica, um para listar todas, um para consolidar dados, um para baixar CSV e um para impressão!',
          filesInside: [
            'hooks/useBuscarLinha.ts',
            'hooks/useLinhasList.ts',
            'hooks/useRelatorioLinhaData.ts',
            'hooks/useDownloadCSV.ts',
            'hooks/useImpressao.ts',
            'hooks/useTour.ts',
          ],
          mustDo: [
            'Separar responsabilidades: um hook para busca/estado da API e hooks auxiliares para ações como exportação ou filtros',
          ],
          mustNotDo: ['Nunca retornar JSX/HTML de dentro de um arquivo da pasta hooks/'],
        },
        {
          id: 'step-micro-components',
          path: '5º RelatorioLinha/components/ (Decomposição UI)',
          type: 'folder',
          analogy: 'As Peças de Lego Visuais',
          purpose:
            'Cada pedaço visual da tela vira um componente pequeno e focado dentro de components/: FormSearch.tsx (formulário de filtro), LinhaStatsCards.tsx (indicadores no topo), LinhaLista.tsx (tabela/lista), DaLinhaDetails.tsx (modal/painel de detalhes), além de Loading.tsx, ErrorMessage.tsx, Button.tsx e Card.tsx.',
          filesInside: [
            'components/FormSearch.tsx',
            'components/LinhaStatsCards.tsx',
            'components/LinhaLista.tsx',
            'components/DaLinhaDetails.tsx',
            'components/RelatorioLinhas.tsx',
            'components/Loading.tsx & ErrorMessage.tsx',
          ],
          mustDo: [
            'Receber dados e funções exclusivamente via props tipadas em types/',
            'Manter cada componente focado em desenhar apenas a sua parte da tela',
          ],
          mustNotDo: [
            'Nunca importar linhaService.ts direto dentro de FormSearch.tsx ou LinhaLista.tsx',
          ],
        },
        {
          id: 'step-final-compiler-tsx',
          path: '6º RelatorioLinha/RelatorioLinha.tsx (O Compilador Final)',
          type: 'file',
          analogy: 'O Maestro que Apenas Junta Tudo',
          purpose:
            'Por último, na raiz da pasta da tela, criamos o arquivo principal RelatorioLinha.tsx! Como você já modularizou tudo em types/, services/, hooks/ e components/, este arquivo final fica extremamente limpo: ele apenas chama os hooks e encaixa os componentes visuais na ordem certa!',
          filesInside: ['src/modulos/SCL/RelatorioLinha/RelatorioLinha.tsx'],
          mustDo: [
            'Ser o último arquivo a ser fechado, atuando apenas como orquestrador/compilador das peças criadas nas outras pastas',
          ],
          mustNotDo: [
            'Nunca escrever chamadas axios, lógica complexa de negócio ou tabelas gigantes diretamente aqui dentro',
          ],
          codePreview: `// Veja como o arquivo final RelatorioLinha.tsx apenas compila as peças:
export const RelatorioLinha: React.FC = () => {
  const { linhas, stats, isLoading, erro, filtros, buscar } = useRelatorioLinhaData();
  const { exportarCSV } = useDownloadCSV(linhas);

  return (
    <div className="space-y-6">
      <FormSearch filtros={filtros} onSearch={buscar} onExport={exportarCSV} />
      {erro && <ErrorMessage message={erro} />}
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <LinhaStatsCards stats={stats} />
          <LinhaLista linhas={linhas} />
        </>
      )}
    </div>
  );
};`,
        },
      ],
      enableFrontendFolderGame: true,
    },

    // ========================================================================
    // CAPÍTULO 4: TUTORIAL GUIADO DAS 7 ESTAÇÕES (DO CONFIG/MODULES AO .TSX FINAL)
    // ========================================================================
    {
      heading: '4. Laboratório Guiado Completo: As 7 Estações para Criar uma Nova Tela no SCL',
      body: 'Agora vamos percorrer juntos as 7 estações exatas para criar uma nova funcionalidade dentro do módulo SCL (por exemplo: ConsultarItinerario), seguindo 100% a arquitetura real do BoilerPlate_Front_end:',
      guidedTutorialSteps: [
        {
          stepNumber: 1,
          title: '1ª Estação: Registrar em src/config/modules.ts',
          fileTarget: 'src/config/modules.ts',
          questionAnswered:
            'Como avisamos ao BoilerPlate_Front_end que o módulo SCL ganhou uma nova sub-tela (ou que existe um módulo novo)?',
          whyItMatters:
            'Tudo começa em src/config/modules.ts! É aqui que declaramos os módulos principais e os submódulos. Os hooks useModules.tsx, useSidebarLogic.ts e o SemAcessoGuard.tsx leem esta lista automaticamente.',
          language: 'typescript',
          code: `// Em src/config/modules.ts, localize a definição do módulo SCL:
export const MODULES_CONFIG = [
  {
    id: 'scl',
    name: 'SCL',
    description: 'Sistema de Controle de Linhas Operacionais',
    icon: '/images/logo_scl.webp',
    route: '/scl',
    allowedRoles: ['ADMIN', 'GESTOR_SCL', 'ESTAGIARIO_DEV'],
    submodules: [
      {
        id: 'scl-consulta-os',
        name: 'Consulta de OS',
        route: '/scl/consulta-os',
      },
      {
        id: 'scl-relatorio-linha',
        name: 'Relatório de Linhas',
        route: '/scl/relatorio-linha',
      },
      // 👇 ADICIONE O NOVO SUBMÓDULO AQUI:
      {
        id: 'scl-consultar-itinerario',
        name: 'Consultar Itinerário',
        description: 'Sequência de vias e localidades por sentido da linha',
        route: '/scl/consultar-itinerario',
      },
    ],
  },
];`,
          lineByLineExplanations: [
            {
              lineHighlight: `id: 'scl-consultar-itinerario'`,
              explanation:
                'Identificador único do submódulo usado pelo controle de navegação (useEstadoModulo / useNavigation) e permissões.',
            },
            {
              lineHighlight: `route: '/scl/consultar-itinerario'`,
              explanation:
                'Define o endereço oficial da nova tela dentro do ecossistema do módulo SCL.',
            },
          ],
        },
        {
          stepNumber: 2,
          title: '2ª Estação: Adicionar no SCLMenu.tsx e App.tsx',
          fileTarget: 'src/modulos/SCL/SCLMenu.tsx & src/App.tsx',
          questionAnswered:
            'Como fazemos o card aparecer dentro da tela inicial do SCL e ligamos a rota protegida?',
          whyItMatters:
            'Quando o usuário entra em /scl, ele vê o componente SCLMenu.tsx. Adicionamos o atalho visual lá e registramos a rota no src/App.tsx apontando para a pasta que vamos criar no próximo passo.',
          language: 'tsx',
          code: `// 1. Em src/modulos/SCL/SCLMenu.tsx, adicione o card na lista de opções do SCL:
const opcoesSCL = [
  {
    titulo: 'Consulta de OS',
    descricao: 'Ordens de serviço e frota associada',
    rota: '/scl/consulta-os',
  },
  {
    titulo: 'Relatório de Linhas',
    descricao: 'Listagem geral, tarifas e exportação CSV',
    rota: '/scl/relatorio-linha',
  },
  // 👇 NOVO CARD ADICIONADO NO SUBMENU DO SCL:
  {
    titulo: 'Consultar Itinerário',
    descricao: 'Vias percorridas em sequência por sentido (Ida/Volta/Circular)',
    rota: '/scl/consultar-itinerario',
  },
];

// 2. Em src/App.tsx, dentro das rotas protegidas por <ProtectedRoute />:
<Route
  path="/scl/consultar-itinerario"
  element={<ConsultarItinerario />}
/>`,
          lineByLineExplanations: [
            {
              lineHighlight: `opcoesSCL em src/modulos/SCL/SCLMenu.tsx`,
              explanation:
                'Cria o botão/card visual dentro do menu do SCL ao lado de ConsultaOS e RelatorioLinha.',
            },
            {
              lineHighlight: `<Route path="/scl/consultar-itinerario" ... />`,
              explanation:
                'Conecta a URL no roteador principal dentro da moldura AppLayout.tsx.',
            },
          ],
        },
        {
          stepNumber: 3,
          title: '3ª Estação: Criar a Pasta da Tela e types/',
          fileTarget: 'src/modulos/SCL/ConsultarItinerario/types/index.ts',
          questionAnswered:
            'Agora que criamos a pasta src/modulos/SCL/ConsultarItinerario/, qual é a primeira subpasta que construímos?',
          whyItMatters:
            'Seguindo exatamente o modelo de RelatorioLinha (types/typesRelatorioLinha.ts + types/index.ts), começamos sempre definindo as interfaces dos dados que vêm da API e as Props de cada micro-componente.',
          language: 'typescript',
          code: `// Em src/modulos/SCL/ConsultarItinerario/types/typesItinerario.ts:
export interface ViaItinerario {
  cd_linha: string;
  lin_sentido: string;
  nm_sequencia: number;
  nm_via: string;
  localidade: string;
}

export interface FormSearchItinerarioProps {
  codigo: string;
  onChangeCodigo: (val: string) => void;
  sentido: string;
  onChangeSentido: (val: string) => void;
  onSearch: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export interface ResultViasListProps {
  vias: ViaItinerario[];
}

// Em src/modulos/SCL/ConsultarItinerario/types/index.ts:
export * from './typesItinerario';`,
          lineByLineExplanations: [
            {
              lineHighlight: `typesItinerario.ts + index.ts`,
              explanation:
                'Mantém o padrão idêntico ao de RelatorioLinha: um arquivo detalhado de tipos e um index.ts que exporta tudo de forma limpa.',
            },
          ],
        },
        {
          stepNumber: 4,
          title: '4ª Estação: Criar a Camada HTTP (services/)',
          fileTarget: 'src/modulos/SCL/ConsultarItinerario/services/itinerarioService.ts',
          questionAnswered:
            'Como conectamos esta sub-tela do SCL com a API criada lá no BoilerPlate_Back_end?',
          whyItMatters:
            'Criamos a subpasta services/ e importamos o "api" global de src/services/api.ts. Ele já usa a URL do env.config.ts e o Bearer Token do tokenStore.ts!',
          language: 'typescript',
          code: `import api from '../../../../services/api';
import { ViaItinerario } from '../types';

export const itinerarioService = {
  async buscarItinerarioDaLinha(
    codigoLinha: string,
    sentido?: string,
  ): Promise<ViaItinerario[]> {
    const codigoFormatado = encodeURIComponent(codigoLinha.trim());
    const { data } = await api.get<ViaItinerario[]>(
      \`/linhas/\${codigoFormatado}/itinerario\`,
      {
        params: sentido && sentido !== 'TODOS' ? { sentido } : undefined,
      },
    );
    return Array.isArray(data) ? data : [];
  },
};`,
          lineByLineExplanations: [
            {
              lineHighlight: `import api from '../../../../services/api';`,
              explanation:
                'Nunca usamos fetch() puro ou criamos outro axios; usamos sempre a instância central configurada do boilerplate.',
            },
          ],
        },
        {
          stepNumber: 5,
          title: '5ª Estação: Criar os Micro-Hooks (hooks/)',
          fileTarget: 'src/modulos/SCL/ConsultarItinerario/hooks/useItinerarioData.ts',
          questionAnswered:
            'Onde ficam os estados (useState), o disparo da busca e os cálculos derivados?',
          whyItMatters:
            'Na subpasta hooks/! Assim como RelatorioLinha tem useBuscarLinha.ts e useRelatorioLinhaData.ts, isolamos aqui toda a lógica reativa para que os componentes visuais não tenham uma única linha de regra de negócio.',
          language: 'typescript',
          code: `import { useState, useCallback, useMemo } from 'react';
import { itinerarioService } from '../services/itinerarioService';
import { ViaItinerario } from '../types';

export function useItinerarioData() {
  const [codigo, setCodigo] = useState('0.111');
  const [sentido, setSentido] = useState('TODOS');
  const [vias, setVias] = useState<ViaItinerario[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const handleBuscar = useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      if (!codigo.trim()) {
        setErro('Digite o código de uma linha (ex: 0.111 ou 0.170).');
        return;
      }

      setIsLoading(true);
      setErro(null);
      try {
        const resultado = await itinerarioService.buscarItinerarioDaLinha(
          codigo,
          sentido,
        );
        setVias(resultado);
      } catch (err: unknown) {
        console.error(err);
        setErro('Falha ao buscar o itinerário no servidor SISMOB.');
        setVias([]);
      } finally {
        setIsLoading(false);
      }
    },
    [codigo, sentido],
  );

  const totalLocalidades = useMemo(
    () => new Set(vias.map((v) => v.localidade)).size,
    [vias],
  );

  return {
    codigo,
    setCodigo,
    sentido,
    setSentido,
    vias,
    totalLocalidades,
    isLoading,
    erro,
    handleBuscar,
  };
}`,
          lineByLineExplanations: [
            {
              lineHighlight: `totalLocalidades = useMemo(...)`,
              explanation:
                'Qualquer estatística ou resumo para exibir nos cards do topo já é calculada dentro do hook e entregue pronta!',
            },
          ],
        },
        {
          stepNumber: 6,
          title: '6ª Estação: Decompor tudo em components/',
          fileTarget: 'src/modulos/SCL/ConsultarItinerario/components/*',
          questionAnswered:
            'Como dividimos a interface em vários componentes pequenos dentro de components/ igual ao RelatorioLinha?',
          whyItMatters:
            'Olhe para src/modulos/SCL/RelatorioLinha/components/: temos FormSearch.tsx, Loading.tsx, ErrorMessage.tsx, LinhaStatsCards.tsx e LinhaLista.tsx. Fazemos exatamente o mesmo aqui para que cada arquivo cuide de apenas um bloco visual!',
          language: 'tsx',
          code: `// 1. components/FormSearch.tsx (Apenas a barra de filtro):
export const FormSearch: React.FC<FormSearchItinerarioProps> = ({
  codigo,
  onChangeCodigo,
  sentido,
  onChangeSentido,
  onSearch,
  isLoading,
}) => (
  <form onSubmit={onSearch} className="bg-white p-4 rounded-2xl border flex gap-3">
    <input
      value={codigo}
      onChange={(e) => onChangeCodigo(e.target.value)}
      placeholder="Código da linha (ex: 0.111)"
      className="border rounded-xl px-3 py-2 text-sm"
    />
    <select
      value={sentido}
      onChange={(e) => onChangeSentido(e.target.value)}
      className="border rounded-xl px-3 py-2 text-sm"
    >
      <option value="TODOS">Todos os Sentidos</option>
      <option value="I">Ida (I)</option>
      <option value="V">Volta (V)</option>
      <option value="C">Circular (C)</option>
    </select>
    <button type="submit" disabled={isLoading} className="bg-sky-600 text-white px-4 py-2 rounded-xl text-sm font-bold">
      {isLoading ? 'Buscando...' : 'Consultar'}
    </button>
  </form>
);

// 2. components/ResultViasList.tsx (Apenas a listagem sequencial de vias):
export const ResultViasList: React.FC<ResultViasListProps> = ({ vias }) => (
  <div className="bg-white rounded-2xl border p-4 space-y-2">
    {vias.map((v) => (
      <div key={\`\${v.lin_sentido}-\${v.nm_sequencia}\`} className="p-3 bg-slate-50 rounded-xl flex justify-between">
        <span><strong>{v.nm_sequencia}º</strong> — {v.nm_via}</span>
        <span className="text-xs text-slate-500">{v.localidade} ({v.lin_sentido})</span>
      </div>
    ))}
  </div>
);`,
          lineByLineExplanations: [
            {
              lineHighlight: `FormSearch.tsx + ResultViasList.tsx + Loading.tsx + ErrorMessage.tsx`,
              explanation:
                'Cada arquivo dentro de components/ tem entre 20 e 40 linhas, recebe props tipadas e é super fácil de dar manutenção.',
            },
          ],
        },
        {
          stepNumber: 7,
          title: '7ª Estação (Final): O Arquivo .tsx que Compila Tudo!',
          fileTarget: 'src/modulos/SCL/ConsultarItinerario/ConsultarItinerario.tsx',
          questionAnswered:
            'Por que o arquivo ConsultarItinerario.tsx na raiz da pasta da tela é o ÚLTIMO a ser construído?',
          whyItMatters:
            'Porque ele é o maestro/compilador! Como já criamos types/, services/, hooks/ e todos os blocos visuais em components/, este arquivo final apenas importa o hook useItinerarioData() e monta a página encaixando <FormSearch />, <ErrorMessage />, <Loading /> e <ResultViasList />!',
          language: 'tsx',
          code: `// Em src/modulos/SCL/ConsultarItinerario/ConsultarItinerario.tsx:
import React from 'react';
import { VoltarButton } from '../../../components/ui/VoltarButton';
import { useItinerarioData } from './hooks/useItinerarioData';
import { FormSearch } from './components/FormSearch';
import { ResultViasList } from './components/ResultViasList';
import { Loading } from '../RelatorioLinha/components/Loading';
import { ErrorMessage } from '../RelatorioLinha/components/ErrorMessage';

export const ConsultarItinerario: React.FC = () => {
  // 1. Invoca o cérebro da tela (Custom Hook)
  const {
    codigo,
    setCodigo,
    sentido,
    setSentido,
    vias,
    totalLocalidades,
    isLoading,
    erro,
    handleBuscar,
  } = useItinerarioData();

  // 2. Apenas compila/orquestra os componentes visuais da pasta components/!
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800">
            Consultar Itinerário da Linha
          </h1>
          <p className="text-xs text-slate-500">
            Módulo SCL • Total de localidades no percurso: {totalLocalidades}
          </p>
        </div>
        <VoltarButton to="/scl" />
      </div>

      <FormSearch
        codigo={codigo}
        onChangeCodigo={setCodigo}
        sentido={sentido}
        onChangeSentido={setSentido}
        onSearch={handleBuscar}
        isLoading={isLoading}
      />

      {erro && <ErrorMessage message={erro} />}

      {isLoading ? <Loading /> : <ResultViasList vias={vias} />}
    </div>
  );
};`,
          lineByLineExplanations: [
            {
              lineHighlight: `ConsultarItinerario.tsx (Apenas 45 linhas!)`,
              explanation:
                'Repare na beleza arquitetural: zero axios, zero regras de negócio complexas, zero HTML bagunçado. O arquivo final apenas junta os hooks e os componentes que criamos nos passos anteriores!',
            },
          ],
        },
      ],
    },
  ],
  checklist: [
    'Configurei o .env apontando para a porta 8097 e entendi o fluxo env.config.ts + public/config.js',
    'Compreendi como a tela RelatorioLinha existe no SCL desde o registro em src/config/modules.ts até o SCLMenu.tsx',
    'Entendi por que modularizamos types/, services/, micro-hooks/ e micro-components/ ANTES de fechar o arquivo .tsx compilador final',
    'Completei o jogo das Estações de Arquitetura acertando 100 XP',
    'Estou pronto para encarar os Desafios Encadeados (APIs no Back ➔ Telas no SCL ➔ Desafio Final InfoÔnibus)',
  ],
};
