import { LearningModule } from '../../types';

export const mod05Frontend: LearningModule = {
  id: 'mod-5-frontend',
  order: 5,
  title: 'Guia Prático de Arquitetura Front-end (React • TypeScript • Tailwind)',
  category: 'frontend',
  estimatedTime: '3h 00min',
  description:
    'Do zero à tela completa: o modelo mental das 5 camadas unidirecionais (Types, Services, Hooks, Smart UI e Dumb UI), a analogia do restaurante, as 4 regras de ouro e tutorial prático passo a passo.',
  objectives: [
    'Dominar a separação estrita em 5 camadas unidirecionais (Types, Services, Hooks, Smart UI e Dumb UI)',
    'Isolar chamadas HTTP na camada de Services sem acoplar Axios/Fetch aos componentes visuais',
    'Centralizar estados reativos (useState, loading, erro) e regras de tela em Custom Hooks',
    'Construir Dumb Components puramente visuais orientados a props e registar rotas com Lazy Loading',
  ],
  sections: [
    {
      heading: '1. A Filosofia e o Modelo Mental da Arquitetura em 5 Camadas',
      body: 'No desenvolvimento front-end moderno, o erro mais frequente de quem está a iniciar é colocar todo o código no mesmo ficheiro: requisições de API, estados locais do formulário, validações de texto, formatação de datas, JSX e estilos CSS. Quando esse ficheiro atinge centenas de linhas, qualquer pequena alteração quebra a tela inteira. Nossa arquitetura resolve isso através da Separação Estrita de Responsabilidades em Camadas Unidirecionais.',
      tables: [
        {
          headers: ['Camada', 'Papel Arquitetural', 'Responsabilidade Principal'],
          rows: [
            [
              '1. Types',
              'O Contrato',
              'Define as regras e interfaces estruturais dos dados (entidades, DTOs e props de componentes).',
            ],
            [
              '2. Services',
              'O Mensageiro',
              'Executa as requisições HTTP (GET, POST, PUT, PATCH, DELETE) com os microsserviços do backend.',
            ],
            [
              '3. Hooks',
              'O Cérebro',
              'Gere o estado reativo (useState), aciona o Service, orquestra loadings, erros e regras de tela.',
            ],
            [
              '4. Smart UI',
              'O Maestro',
              'A página/container principal (Index.tsx). Conecta o Hook aos componentes visuais, controlando layout e permissões.',
            ],
            [
              '5. Dumb UI',
              'Os Operários',
              'Componentes puramente visuais (cards, formulários, modais). Apenas renderizam dados e repassam eventos via props.',
            ],
          ],
        },
      ],
      callouts: [
        {
          type: 'important',
          title: '🛡️ REGRA DE OURO DO ISOLAMENTO FRONT-END',
          content: 'Nenhum componente visual deve saber como os dados foram obtidos:',
          bullets: [
            'O componente visual (components/*) nunca importa a biblioteca axios nem sabe qual endpoint foi chamado;',
            'O serviço HTTP (services/*) é agnóstico à interface: não utiliza useState, useEffect nem JSX;',
            'O Hook customizado (hooks/*) concentra toda a reatividade e regras da tela. Se mudar o visual amanhã, o hook permanece intacto.',
          ],
        },
        {
          type: 'info',
          title: '🍽️ A Analogia Didática do Restaurante',
          content: 'Compare o funcionamento das 5 camadas com um restaurante de alto padrão:',
          bullets: [
            'types/ (O Cardápio e as Fichas Técnicas): Define o que existe no restaurante. Ex: "Uma Refeição tem nome (texto), preço (número) e acompanhamentos". Nada vai para o fogo sem receita prévia.',
            'services/ (O Fornecedor / Entregador): É o veículo de logística que busca insumos no mercado externo (o servidor backend). Ele não cozinha nada e não sabe quem vai comer; apenas entrega e recolhe pacotes íntegros.',
            'hooks/ (A Cozinha e o Chef): Onde o prato é preparado. O Chef sabe quando o forno está a assar (isLoading = true), sabe se faltou gás (erro de rede) e organiza os pratos prontos à espera do empregado de mesa.',
            'components/ (Os Empregados de Mesa — Dumb Components): Eles não cozinham. Pegam no prato já finalizado e apresentam-no com elegância ao cliente. Se o cliente pede a conta (clica num botão), apenas repassam o aviso à cozinha.',
            'Index.tsx (O Gerente do Salão — Smart Component): O maestro que certifica que a cozinha (hook) atenda à mesa certa e distribua os pedidos com harmonia.',
          ],
        },
      ],
    },
    {
      heading: '2. Estrutura de Pastas e Matriz de Responsabilidades',
      body: 'Toda nova funcionalidade dentro do ecossistema front-end (ex: Tarefas, Linhas, Veículos) deve habitar um diretório dedicado contendo a estrutura padronizada abaixo:',
      codeBlocks: [
        {
          title: 'Mapeamento Canónico de uma Feature Front-end',
          language: 'text',
          code: `src/features/ (ou src/modulos/)
└── Tarefas/
    ├── types/
    │   └── tarefa.ts         ← Contratos TypeScript (Entidades, DTOs e Props)
    ├── services/
    │   └── tarefasService.ts ← Camada de comunicação HTTP com o Backend
    ├── hooks/
    │   └── useTarefas.ts     ← Lógica de negócio, loading, validações e estado
    ├── components/
    │   ├── TarefaCard.tsx    ← Dumb Component: card visual de exibição
    │   └── TarefaForm.tsx    ← Dumb Component: formulário de registo/edição
    └── TarefasIndex.tsx      ← Smart Component: container principal da tela`,
        },
      ],
      tables: [
        {
          headers: ['Pasta / Camada', 'O QUE DEVE SER FEITO AQUI ✅', 'O QUE NUNCA DEVE SER FEITO AQUI ❌'],
          rows: [
            [
              'types/',
              '• Declarar interfaces das entidades do banco/API.\n• Declarar DTOs para envio de dados (Create/Update).\n• Tipar explicitamente as Props de cada componente visual.',
              '• NUNCA use o tipo genérico any.\n• NUNCA crie funções com lógica executável aqui (apenas declarações de tipos).',
            ],
            [
              'services/',
              '• Declarar funções assíncronas que utilizam a instância global do Axios (api.get, api.post).\n• Retornar tipagens estritas em Promises (Promise<T>).',
              '• NUNCA utilize hooks do React (useState, useEffect).\n• NUNCA monte elementos JSX ou manipule o DOM.\n• NUNCA exiba alertas diretamente aqui.',
            ],
            [
              'hooks/',
              '• Armazenar estados locais da tela (useState).\n• Acionar os services e manipular flags de carregamento (isLoading).\n• Tratar erros, validar regras e limpar formulários após o sucesso.',
              '• NUNCA monte código HTML ou retorne tags JSX.\n• NUNCA aceda a propriedades do DOM nativo sem useRef.',
            ],
            [
              'components/',
              '• Renderizar JSX limpo, semântico e estilizado.\n• Receber dados e funções exclusivamente por meio de props.\n• Disparar callbacks (onClick, onSubmit) repassando eventos ao pai.',
              '• NUNCA faça chamadas de API diretamente.\n• NUNCA importe ficheiros da pasta services/.\n• NUNCA aceda a localStorage ou sessionStorage.',
            ],
            [
              'Index.tsx',
              '• Invocar o Custom Hook principal da tela.\n• Compor a hierarquia visual alimentando os Dumb Components.\n• Controlar permissões de acesso (RBAC).',
              '• NUNCA declare lógica complexa de formulário diretamente no ficheiro da tela (delegue para o Hook).',
            ],
          ],
        },
      ],
    },
    {
      heading: '3. As 4 Regras de Ouro (Anti-patterns e Erros Críticos)',
      body: 'Evite os 4 erros clássicos que reprovam Pull Requests na revisão de arquitetura front-end:',
      callouts: [
        {
          type: 'danger',
          title: '🚨 REGRA DE OURO 1: Nenhuma Chamada de API Dentro de Componentes Visuais',
          content:
            'É expressamente proibido fazer axios.get() ou fetch() diretamente no corpo de um componente visual ou dentro de um onClick. Toda comunicação com a rede pertence exclusivamente à pasta services/.',
        },
        {
          type: 'danger',
          title: '🚨 REGRA DE OURO 2: Proibido o Uso do Tipo "any"',
          content:
            'Usar any inutiliza o compilador do TypeScript e mascara erros em tempo de desenvolvimento. Se não sabe a estrutura do dado vindo da API, inspecione a rota no Swagger e crie a interface em types/.',
        },
        {
          type: 'warning',
          title: '⚠️ REGRA DE OURO 3: Componentes em components/ Devem Ser "Puros / Burros"',
          content:
            'Cards, tabelas, inputs e modais devem ser previsíveis: recebem props e produzem visual. Não devem conter regras de sincronização com o banco de dados.',
        },
        {
          type: 'warning',
          title: '⚠️ REGRA DE OURO 4: Nunca Deixe Blocos catch {} em Silêncio',
          content:
            'Nunca capture um erro num bloco try/catch sem apresentar feedback para o utilizador e registar no console.error. Falhas silenciosas fazem o utilizador clicar compulsivamente achando que a aplicação travou.',
        },
      ],
    },
    {
      heading: '4. Tutorial Prático Completo: Do Zero à Tela de Gestão de Tarefas (6 Passos)',
      body: 'Acompanhe o desenvolvimento prático de uma funcionalidade completa contendo listagem via API, loading spinner, formulário com validação, alternância de status, exclusão com confirmação e Lazy Loading:',
      codeBlocks: [
        {
          title: 'Passo 1: Modelagem e Contratos de Tipagem (src/features/Tarefas/types/tarefa.ts)',
          language: 'typescript',
          code: `// 1. A entidade completa retornada pelo Backend
export interface Tarefa {
  id: number;
  titulo: string;
  descricao: string;
  prioridade: 'BAIXA' | 'MEDIA' | 'ALTA';
  concluida: boolean;
  dataCriacao: string;
}

// 2. DTO para envio de dados na criação
export interface CreateTarefaDTO {
  titulo: string;
  descricao: string;
  prioridade: 'BAIXA' | 'MEDIA' | 'ALTA';
}

// 3. Tipagem das Props do Card
export interface TarefaCardProps {
  tarefa: Tarefa;
  onExcluir: (id: number) => void;
  onAlternarConcluida: (id: number) => void;
}

// 4. Tipagem das Props do Formulário
export interface TarefaFormProps {
  titulo: string;
  setTitulo: (valor: string) => void;
  descricao: string;
  setDescricao: (valor: string) => void;
  prioridade: 'BAIXA' | 'MEDIA' | 'ALTA';
  setPrioridade: (valor: 'BAIXA' | 'MEDIA' | 'ALTA') => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}`,
        },
        {
          title: 'Passo 2: Camada de Comunicação HTTP (src/features/Tarefas/services/tarefasService.ts)',
          language: 'typescript',
          code: `import api from '../../../services/api'; // Singleton configurado do Axios
import { Tarefa, CreateTarefaDTO } from '../types/tarefa';

const RECURSO_URL = '/tarefas';

export const tarefasService = {
  async listar(): Promise<Tarefa[]> {
    const response = await api.get<Tarefa[]>(RECURSO_URL);
    return Array.isArray(response.data) ? response.data : [];
  },

  async criar(dados: CreateTarefaDTO): Promise<Tarefa> {
    const response = await api.post<Tarefa>(RECURSO_URL, dados);
    return response.data;
  },

  async atualizarStatus(id: number, concluida: boolean): Promise<Tarefa> {
    const response = await api.patch<Tarefa>(\`\${RECURSO_URL}/\${id}\`, { concluida });
    return response.data;
  },

  async excluir(id: number): Promise<void> {
    await api.delete(\`\${RECURSO_URL}/\${id}\`);
  }
};`,
        },
        {
          title: 'Passo 3: O Cérebro da Tela — Custom Hook (src/features/Tarefas/hooks/useTarefas.ts)',
          language: 'typescript',
          code: `import { useState, useEffect, useCallback } from 'react';
import { tarefasService } from '../services/tarefasService';
import { Tarefa, CreateTarefaDTO } from '../types/tarefa';

export function useTarefas() {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [erro, setErro] = useState<string | null>(null);

  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [prioridade, setPrioridade] = useState<'BAIXA' | 'MEDIA' | 'ALTA'>('MEDIA');

  const carregarTarefas = useCallback(async () => {
    setIsLoading(true);
    setErro(null);
    try {
      const dados = await tarefasService.listar();
      setTarefas(dados);
    } catch (err: unknown) {
      console.error('Falha ao carregar tarefas:', err);
      setErro('Não foi possível carregar as tarefas. Verifique a sua ligação.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarTarefas();
  }, [carregarTarefas]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim() || !descricao.trim()) return;

    setIsLoading(true);
    try {
      const dto: CreateTarefaDTO = {
        titulo: titulo.trim(),
        descricao: descricao.trim(),
        prioridade,
      };
      await tarefasService.criar(dto);
      setTitulo('');
      setDescricao('');
      setPrioridade('MEDIA');
      await carregarTarefas();
    } catch (err: unknown) {
      console.error('Erro ao criar tarefa:', err);
      setErro('Erro ao registar tarefa.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAlternarConcluida = async (id: number) => {
    const item = tarefas.find((t) => t.id === id);
    if (!item) return;
    await tarefasService.atualizarStatus(id, !item.concluida);
    await carregarTarefas();
  };

  const handleExcluir = async (id: number) => {
    if (!window.confirm('Tem a certeza que deseja remover esta tarefa?')) return;
    await tarefasService.excluir(id);
    await carregarTarefas();
  };

  return {
    tarefas,
    isLoading,
    erro,
    titulo, setTitulo,
    descricao, setDescricao,
    prioridade, setPrioridade,
    handleSubmit,
    handleAlternarConcluida,
    handleExcluir,
    recarregarTarefas: carregarTarefas,
  };
}`,
        },
        {
          title: 'Passo 4 & 5: Dumb Components e Smart Component (TarefasIndex.tsx)',
          language: 'tsx',
          code: `import React from 'react';
import { useTarefas } from './hooks/useTarefas';
import { TarefaForm } from './components/TarefaForm';
import { TarefaCard } from './components/TarefaCard';

export default function TarefasIndex() {
  const {
    tarefas,
    isLoading,
    erro,
    titulo, setTitulo,
    descricao, setDescricao,
    prioridade, setPrioridade,
    handleSubmit,
    handleAlternarConcluida,
    handleExcluir,
  } = useTarefas();

  return (
    <div className="max-w-5xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-5">
        <TarefaForm
          titulo={titulo}
          setTitulo={setTitulo}
          descricao={descricao}
          setDescricao={setDescricao}
          prioridade={prioridade}
          setPrioridade={setPrioridade}
          isLoading={isLoading}
          onSubmit={handleSubmit}
        />
      </div>
      <div className="lg:col-span-7 space-y-3">
        {erro && <div className="p-4 bg-rose-50 text-rose-700 rounded-xl">{erro}</div>}
        {tarefas.map((tarefa) => (
          <TarefaCard
            key={tarefa.id}
            tarefa={tarefa}
            onExcluir={handleExcluir}
            onAlternarConcluida={handleAlternarConcluida}
          />
        ))}
      </div>
    </div>
  );
}`,
        },
        {
          title: 'Passo 6: Registo da Rota e Lazy Loading (Code-Splitting)',
          language: 'typescript',
          code: `import { lazy } from 'react';

// 1. Carregamento sob demanda para não pesar o bundle inicial
const TarefasIndex = lazy(() => import('../features/Tarefas/TarefasIndex'));

// 2. Registo no catálogo de rotas
export const routes = [
  {
    path: '/tarefas',
    component: TarefasIndex,
    title: 'Gestão de Tarefas',
  },
];`,
        },
      ],
    },
    {
      heading: '5. Dicionário Rápido & Guia de Bolso Front-end',
      body: 'Resumo rápido para consulta antes de abrir um Pull Request / Merge Request:',
      tables: [
        {
          headers: ['Conceito', 'Como Fazer do Jeito Certo ✅', 'O Que Evitar a Todo Custo ❌'],
          rows: [
            ['Chamadas HTTP', 'Invocar o método do service (ex: tarefasService.listar()).', 'Fazer axios.get() solto dentro de componente ou hook aleatório.'],
            ['Loading State', 'Desabilitar botões (disabled={isLoading}) e exibir spinner animado.', 'Permitir múltiplos cliques salvando registos duplicados.'],
            ['Tipagem', 'Criar interfaces detalhadas e DTOs no diretório types/.', 'Usar any para burlar avisos do compilador TypeScript.'],
            ['Tratamento de Erros', 'Notificar o utilizador de forma amigável e registar via console.error.', 'Deixar blocos catch {} vazios em silêncio.'],
            ['Desacoplamento', 'Manter componentes em components/ puros e reativos apenas a props.', 'Aceder a localStorage ou invocar regras de negócio no componente visual.'],
          ],
        },
      ],
    },
  ],
  checklist: [
    'Criei a estrutura da funcionalidade separada em types/, services/, hooks/, components/ e Index.tsx',
    'Garanti que o ficheiro types/*.ts não possui nenhum uso do tipo any',
    'Verifiquei que nenhum componente visual em components/ realiza chamadas HTTP diretamente',
    'Tratei os estados de Loading (desabilitando botão de submit), Erro e Empty State na interface',
    'Validei o projeto com npm run typecheck sem erros de compilação',
  ],
};
