import { Track } from '../types/lms';

export const INITIAL_TRACKS: Track[] = [
  {
    id: 'track-dev-junior',
    title: 'Desenvolvedor do Zero ao Júnior',
    slug: 'dev-do-zero-ao-junior',
    category: 'Fullstack',
    level: 'Iniciante',
    description: 'Trilha completa que guia o estudante desde os fundamentos de algoritmos até o desenvolvimento de aplicações completas fullstack prontas para o mercado de trabalho.',
    totalModules: 8,
    totalHours: 120,
    enrolled: true,
    featured: true,
    modules: [
      {
        id: 'mod-1',
        trackId: 'track-dev-junior',
        title: 'Lógica de Programação & Algoritmos',
        description: 'Fundamentos de pensamento computacional, estruturas condicionais, laços de repetição, arrays e decomposição de problemas.',
        tier: 'basic',
        order: 1,
        prerequisiteModuleIds: [],
        estimatedHours: 12,
        iconName: 'Terminal',
        skillsAcquired: ['Lógica de Programação', 'Pensamento Computacional', 'Algoritmos Básicos'],
        lessons: [
          {
            id: 'les-1-1',
            moduleId: 'mod-1',
            title: 'Como computadores pensam: Variáveis e Memória',
            durationMinutes: 18,
            type: 'video',
            completed: true,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            contentMarkdown: `### Bem-vindo aos Fundamentos da Computação!

Nesta aula introdutória, exploramos como as informações são alocadas na memória volátil (RAM) e como as linguagens de programação abstraem esses endereços através de identificadores chamados **variáveis**.

#### Pontos Principais:
1. **Espaço de Endereçamento**: Cada variável reserva uma fatia na memória.
2. **Tipos Primitivos**: Números, textos (strings), booleanos e valores nulos.
3. **Imutabilidade vs Mutabilidade**: Por que constantes (\`const\`) tornam nosso código mais previsível e menos propenso a bugs.

\`\`\`javascript
// Exemplo prático de declaração
const nomeDev = "Ana Paula";
let anosExperiencia = 0;
const metaSalarial = 4500;

console.log(\`Desenvolvedora \${nomeDev} iniciando a jornada com \${anosExperiencia} anos de experiência.\`);
\`\`\`
`,
            codeSnippet: {
              language: 'javascript',
              filename: 'variaveis.js',
              code: `const aluno = "Lucas Silva";\nlet horasEstudo = 15;\nconsole.log(\`Aluno \${aluno} já dedicou \${horasEstudo}h aos estudos.\`);`
            }
          },
          {
            id: 'les-1-2',
            moduleId: 'mod-1',
            title: 'Controle de Fluxo: Condicionais e Operadores Lógicos',
            durationMinutes: 22,
            type: 'video',
            completed: true,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            contentMarkdown: `### Decisões no Código: Condicionais

Computadores são máquinas determinísticas que executam passos baseados em condições booleanas (\`true\` ou \`false\`).

#### Tabela da Verdade Básica:
- Operador \`&&\` (AND): Retorna verdadeiro apenas se ambos os lados forem verdadeiros.
- Operador \`||\` (OR): Retorna verdadeiro se pelo menos um dos lados for verdadeiro.
- Operador \`!\` (NOT): Inverte o valor lógico.

\`\`\`javascript
const mediaFinal = 8.5;
const presencaPercent = 80;

if (mediaFinal >= 7.0 && presencaPercent >= 75) {
  console.log("Parabéns! Módulo aprovado com sucesso.");
} else {
  console.log("Necessário reforço ou recuperação.");
}
\`\`\`
`
          },
          {
            id: 'les-1-3',
            moduleId: 'mod-1',
            title: 'Laços de Repetição: For, While e Iteradores',
            durationMinutes: 25,
            type: 'exercise',
            completed: true,
            contentMarkdown: `### Dominando Estruturas de Repetição

A capacidade de automatizar tarefas repetitivas é o verdadeiro superpoder da programação. Nesta aula prática, analisamos os laços \`for\`, \`while\` e os métodos de iteração funcional moderna como \`.map()\`, \`.filter()\` e \`.reduce()\`.

#### Dica de Ouro:
Evite loops infinitos sempre garantindo que a condição de parada seja alcançada a cada iteração!
`
          }
        ],
        quiz: {
          id: 'quiz-mod-1',
          moduleId: 'mod-1',
          title: 'Avaliação de Lógica & Algoritmos',
          description: 'Teste seus conhecimentos em variáveis, estruturas de controle e laços de repetição.',
          passingScorePercent: 70,
          rewardXP: 150,
          questions: [
            {
              id: 'q-1-1',
              question: 'Qual é o resultado da expressão lógica (true && !false) || false em JavaScript?',
              type: 'multiple_choice',
              options: [
                { id: 'opt-a', text: 'true' },
                { id: 'opt-b', text: 'false' },
                { id: 'opt-c', text: 'undefined' },
                { id: 'opt-d', text: 'null' }
              ],
              correctOptionId: 'opt-a',
              explanation: '!false se torna true. Em seguida, (true && true) resulta em true. Finalmente, true || false resulta em true.'
            },
            {
              id: 'q-1-2',
              question: 'Em JavaScript, a declaração "const" garante que os valores internos de um array ou objeto nunca possam ser alterados.',
              type: 'true_false',
              options: [
                { id: 'opt-true', text: 'Verdadeiro' },
                { id: 'opt-false', text: 'Falso' }
              ],
              correctOptionId: 'opt-false',
              explanation: 'Falso! "const" impede a reatribuição da variável (o ponteiro de memória), mas as propriedades de objetos e elementos de arrays continuam mutáveis.'
            },
            {
              id: 'q-1-3',
              question: 'Analise o trecho de código abaixo. Quantas vezes a mensagem será exibida?',
              type: 'code_analysis',
              codeSnippet: `let contador = 1;
while (contador < 5) {
  console.log("Processando item", contador);
  contador += 2;
}`,
              options: [
                { id: 'opt-a', text: '2 vezes (para contador = 1 e 3)' },
                { id: 'opt-b', text: '4 vezes' },
                { id: 'opt-c', text: '5 vezes' },
                { id: 'opt-d', text: 'Infinitas vezes' }
              ],
              correctOptionId: 'opt-a',
              explanation: 'Na 1ª iteração: contador é 1 (<5), imprime e soma 2 (vira 3). Na 2ª iteração: contador é 3 (<5), imprime e soma 2 (vira 5). Na 3ª checagem: 5 < 5 é falso, encerrando o laço. Total: 2 vezes.'
            }
          ]
        }
      },
      {
        id: 'mod-2',
        trackId: 'track-dev-junior',
        title: 'Git, GitHub & Versionamento em Time',
        description: 'Fluxo de trabalho profissional com Git: commits semânticos, ramificações (branches), merge, rebase, resolução de conflitos e boas práticas no GitHub.',
        tier: 'basic',
        order: 2,
        prerequisiteModuleIds: ['mod-1'],
        estimatedHours: 10,
        iconName: 'GitBranch',
        skillsAcquired: ['Git CLI', 'GitHub Workflows', 'Commits Semânticos', 'Code Review'],
        lessons: [
          {
            id: 'les-2-1',
            moduleId: 'mod-2',
            title: 'Fundamentos de Snapshot: Como o Git grava o tempo',
            durationMinutes: 20,
            type: 'video',
            completed: true,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            contentMarkdown: `### O que torna o Git diferente de outros VCS?

O Git não armazena diferenças linha a linha clássicas, mas sim uma série de **snapshots** criptograficamente assinados com hashes SHA-1/SHA-256.

\`\`\`bash
# Inicializando e inspecionando
git init
git status
git add .
git commit -m "feat(auth): implementar formulário de login com validação"
\`\`\`
`
          },
          {
            id: 'les-2-2',
            moduleId: 'mod-2',
            title: 'Branches e Pull Requests sem Medo',
            durationMinutes: 26,
            type: 'video',
            completed: true,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
            contentMarkdown: `### Trabalho em Equipe no GitHub

Aprenda o fluxo padrão da indústria:
1. Criar branch a partir da \`main\` (ex: \`git checkout -b feature/sistema-quiz\`)
2. Fazer alterações atômicas com mensagens claras
3. Subir para o repositório remoto (\`git push origin feature/sistema-quiz\`)
4. Abrir Pull Request com descrição contextualizada e capturas de tela
`
          }
        ],
        quiz: {
          id: 'quiz-mod-2',
          moduleId: 'mod-2',
          title: 'Quiz: Git & GitHub na Prática',
          description: 'Avalie sua capacidade de resolver conflitos e operar branches com segurança.',
          passingScorePercent: 70,
          rewardXP: 150,
          questions: [
            {
              id: 'q-2-1',
              question: 'Qual comando cria uma nova branch chamada "feat/checkout" e já altera para ela imediatamente?',
              type: 'multiple_choice',
              options: [
                { id: 'opt-a', text: 'git branch feat/checkout --now' },
                { id: 'opt-b', text: 'git checkout -b feat/checkout' },
                { id: 'opt-c', text: 'git switch --create-only feat/checkout' },
                { id: 'opt-d', text: 'git merge feat/checkout' }
              ],
              correctOptionId: 'opt-b',
              explanation: '"git checkout -b <nome>" cria a branch e muda para ela em um único comando (o equivalente moderno também é "git switch -c <nome>").'
            },
            {
              id: 'q-2-2',
              question: 'Commits semânticos no padrão Conventional Commits ajudam a gerar changelogs automatizados e melhoram a leitura do histórico do projeto.',
              type: 'true_false',
              options: [
                { id: 'opt-true', text: 'Verdadeiro' },
                { id: 'opt-false', text: 'Falso' }
              ],
              correctOptionId: 'opt-true',
              explanation: 'Verdadeiro! Padrões como feat:, fix:, refactor:, chore: padronizam a comunicação em times de engenharia.'
            }
          ]
        }
      },
      {
        id: 'mod-3',
        trackId: 'track-dev-junior',
        title: 'HTML Semântico & CSS Moderno Responsivo',
        description: 'Estruturação semântica acessível (WCAG AA), layouts modernos com Flexbox e CSS Grid, variáveis CSS, Tailwind CSS e design responsivo mobile-first.',
        tier: 'basic',
        order: 3,
        prerequisiteModuleIds: ['mod-2'],
        estimatedHours: 16,
        iconName: 'Layout',
        skillsAcquired: ['HTML5 Semântico', 'CSS Grid & Flexbox', 'Tailwind CSS', 'Acessibilidade'],
        lessons: [
          {
            id: 'les-3-1',
            moduleId: 'mod-3',
            title: 'HTML Semântico: Por que evitar a div-soup?',
            durationMinutes: 24,
            type: 'video',
            completed: true,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
            contentMarkdown: `### Estrutura Semântica para Acessibilidade e SEO

Usar tags como \`<main>\`, \`<nav>\`, \`<header>\`, \`<article>\`, \`<section>\` e \`<aside>\` permite que leitores de tela e motores de busca compreendam a hierarquia real do documento.

\`\`\`html
<!-- Exemplo Semântico Correto -->
<article class="card-noticia">
  <header>
    <h2>Nova versão do React é lançada</h2>
    <time datetime="2026-10-05">05 de Outubro de 2026</time>
  </header>
  <p>Novos recursos de renderização e hooks nativos...</p>
</article>
\`\`\`
`
          },
          {
            id: 'les-3-2',
            moduleId: 'mod-3',
            title: 'Flexbox vs CSS Grid: Quando usar cada um?',
            durationMinutes: 28,
            type: 'video',
            completed: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
            contentMarkdown: `### Flexbox (1D) vs Grid (2D)

- **Flexbox**: Ideal para componentes unidimensionais (uma linha ou uma coluna), como barras de navegação, grupos de botões e alinhamentos centrados.
- **CSS Grid**: Projetado para grids bidimensionais (linhas e colunas simultâneas), como painéis de dashboard, galerias de imagens e layouts de páginas completas.
`
          },
          {
            id: 'les-3-3',
            moduleId: 'mod-3',
            title: 'Design Responsivo Mobile-First com Tailwind CSS',
            durationMinutes: 30,
            type: 'exercise',
            completed: false,
            contentMarkdown: `### O Conceito Mobile-First

Desenvolvemos primeiro para telas pequenas sem media queries e adicionamos breakpoints progressivamente (\`sm:\`, \`md:\`, \`lg:\`, \`xl:\`). Isso garante velocidade e foco no essencial.`
          }
        ],
        quiz: {
          id: 'quiz-mod-3',
          moduleId: 'mod-3',
          title: 'Quiz: HTML & CSS Moderno',
          description: 'Teste sua proficiência em layout responsivo, flexibilidade e boas práticas.',
          passingScorePercent: 70,
          rewardXP: 180,
          questions: [
            {
              id: 'q-3-1',
              question: 'Em CSS Flexbox, qual propriedade alinha os itens no eixo transversal (cross axis)?',
              type: 'multiple_choice',
              options: [
                { id: 'opt-a', text: 'justify-content' },
                { id: 'opt-b', text: 'align-items' },
                { id: 'opt-c', text: 'flex-direction' },
                { id: 'opt-d', text: 'place-items' }
              ],
              correctOptionId: 'opt-b',
              explanation: '"align-items" controla o alinhamento no eixo perpendicular (cross axis), enquanto "justify-content" controla no eixo principal.'
            },
            {
              id: 'q-3-2',
              question: 'No paradigma Mobile-First, as media queries geralmente usam "min-width" ao invés de "max-width".',
              type: 'true_false',
              options: [
                { id: 'opt-true', text: 'Verdadeiro' },
                { id: 'opt-false', text: 'Falso' }
              ],
              correctOptionId: 'opt-true',
              explanation: 'Verdadeiro! O estilo base se aplica a telas pequenas, e estilos adicionais são ativados a partir de larguras mínimas (ex: min-width: 768px).'
            }
          ]
        }
      },
      {
        id: 'mod-4',
        trackId: 'track-dev-junior',
        title: 'JavaScript Moderno (ES6+) & TypeScript',
        description: 'Desestruturação, closures, escopo léxico, promises, async/await, manipulação de DOM, e introdução a tipos estáticos com TypeScript.',
        tier: 'intermediate',
        order: 4,
        prerequisiteModuleIds: ['mod-1', 'mod-3'],
        estimatedHours: 20,
        iconName: 'Code2',
        skillsAcquired: ['JavaScript ES6+', 'TypeScript', 'Assincronismo', 'Manipulação do DOM'],
        lessons: [
          {
            id: 'les-4-1',
            moduleId: 'mod-4',
            title: 'Assincronismo Profundo: Event Loop, Promises e Async/Await',
            durationMinutes: 32,
            type: 'video',
            completed: false,
            contentMarkdown: `Entendendo a fila de microtarefas e o ciclo de eventos no motor V8...`
          },
          {
            id: 'les-4-2',
            moduleId: 'mod-4',
            title: 'TypeScript: Tipos Primitivos, Interfaces e Generics Básicos',
            durationMinutes: 35,
            type: 'exercise',
            completed: false,
            contentMarkdown: `Por que empresas preferem TypeScript para escalabilidade de projetos...`
          }
        ],
        quiz: {
          id: 'quiz-mod-4',
          moduleId: 'mod-4',
          title: 'Quiz de JavaScript Avançado & TS',
          description: 'Teste sua compreensão do Event Loop e do sistema de tipos do TypeScript.',
          passingScorePercent: 70,
          rewardXP: 200,
          questions: [
            {
              id: 'q-4-1',
              question: 'O que o operador "async" antes de uma função garante em JavaScript?',
              type: 'multiple_choice',
              options: [
                { id: 'opt-a', text: 'Que a função será executada em uma thread paralela do SO' },
                { id: 'opt-b', text: 'Que o retorno da função será sempre envelopado em uma Promise' },
                { id: 'opt-c', text: 'Que a função bloqueia a thread até terminar' },
                { id: 'opt-d', text: 'Que nenhum erro poderá ser lançado' }
              ],
              correctOptionId: 'opt-b',
              explanation: 'Funções marcadas com "async" sempre retornam uma Promise implicitamente, permitindo o uso do operador "await".'
            }
          ]
        }
      },
      {
        id: 'mod-5',
        trackId: 'track-dev-junior',
        title: 'React: Componentes, Hooks & Estado Global',
        description: 'Construção de SPAs modernas: JSX, ciclo de vida com useEffect, memoização, Context API e boas práticas de arquitetura de componentes.',
        tier: 'intermediate',
        order: 5,
        prerequisiteModuleIds: ['mod-4'],
        estimatedHours: 24,
        iconName: 'Boxes',
        skillsAcquired: ['React Hooks', 'Context API', 'State Management', 'Tailwind Integration'],
        lessons: [
          {
            id: 'les-5-1',
            moduleId: 'mod-5',
            title: 'Mentalidade Reativa: Estado x Props e Renderização',
            durationMinutes: 28,
            type: 'video',
            completed: false,
            contentMarkdown: `Como o Virtual DOM reconcilia alterações e otimiza atualizações na tela.`
          }
        ],
        quiz: {
          id: 'quiz-mod-5',
          moduleId: 'mod-5',
          title: 'Quiz de React & Gestão de Estado',
          description: 'Validação de conceitos essenciais de hooks e renderização no React.',
          passingScorePercent: 70,
          rewardXP: 220,
          questions: [
            {
              id: 'q-5-1',
              question: 'Quando um componente React re-renderiza por padrão?',
              type: 'multiple_choice',
              options: [
                { id: 'opt-a', text: 'Apenas a cada 1 segundo' },
                { id: 'opt-b', text: 'Quando seu estado ou suas props sofrem alteração' },
                { id: 'opt-c', text: 'Apenas quando o usuário clica em um botão' },
                { id: 'opt-d', text: 'Quando o arquivo é salvo no disco' }
              ],
              correctOptionId: 'opt-b',
              explanation: 'Componentes re-renderizam sempre que seu estado interno muda ou suas props de entrada são atualizadas pelo componente pai.'
            }
          ]
        }
      },
      {
        id: 'mod-6',
        trackId: 'track-dev-junior',
        title: 'Node.js, Express & Construção de APIs RESTful',
        description: 'Desenvolvimento backend com JavaScript/TypeScript: rotas, middlewares, controllers, validação com Zod, autenticação JWT e status codes HTTP.',
        tier: 'intermediate',
        order: 6,
        prerequisiteModuleIds: ['mod-4'],
        estimatedHours: 18,
        iconName: 'Server',
        skillsAcquired: ['Node.js', 'Express', 'APIs RESTful', 'Autenticação JWT'],
        lessons: [
          {
            id: 'les-6-1',
            moduleId: 'mod-6',
            title: 'Estruturando um servidor Express com TypeScript',
            durationMinutes: 30,
            type: 'video',
            completed: false,
            contentMarkdown: `Arquitetura em camadas: rotas, serviços, repositórios e tratamento global de erros.`
          }
        ],
        quiz: {
          id: 'quiz-mod-6',
          moduleId: 'mod-6',
          title: 'Quiz: APIs RESTful & HTTP',
          description: 'Verifique se você domina códigos de status e métodos HTTP.',
          passingScorePercent: 70,
          rewardXP: 200,
          questions: [
            {
              id: 'q-6-1',
              question: 'Qual código de status HTTP representa a criação bem-sucedida de um novo recurso no servidor?',
              type: 'multiple_choice',
              options: [
                { id: 'opt-a', text: '200 OK' },
                { id: 'opt-b', text: '201 Created' },
                { id: 'opt-c', text: '204 No Content' },
                { id: 'opt-d', text: '304 Not Modified' }
              ],
              correctOptionId: 'opt-b',
              explanation: '201 Created é a resposta padrão em APIs REST para requisições POST que resultam na criação de um recurso.'
            }
          ]
        }
      },
      {
        id: 'mod-7',
        trackId: 'track-dev-junior',
        title: 'Bancos de Dados Relacionais & SQL',
        description: 'Modelagem entidade-relacionamento (DER), tabelas, chaves primárias e estrangeiras, joins, transações ACID e integração com ORM moderno.',
        tier: 'advanced',
        order: 7,
        prerequisiteModuleIds: ['mod-6'],
        estimatedHours: 16,
        iconName: 'Database',
        skillsAcquired: ['PostgreSQL', 'SQL Joins', 'Modelagem Relacional', 'ORMs'],
        lessons: [
          {
            id: 'les-7-1',
            moduleId: 'mod-7',
            title: 'Consultas Poderosas com INNER JOIN, LEFT JOIN e Agregações',
            durationMinutes: 35,
            type: 'video',
            completed: false,
            contentMarkdown: `Unindo tabelas de usuários, matrículas e certificados com performance e índices adequados.`
          }
        ],
        quiz: {
          id: 'quiz-mod-7',
          moduleId: 'mod-7',
          title: 'Quiz: Bancos de Dados & SQL',
          description: 'Teste sua capacidade de formular consultas relacionais.',
          passingScorePercent: 70,
          rewardXP: 220,
          questions: [
            {
              id: 'q-7-1',
              question: 'Qual tipo de JOIN retorna todos os registros da tabela da esquerda, mesmo que não haja correspondência na tabela da direita?',
              type: 'multiple_choice',
              options: [
                { id: 'opt-a', text: 'INNER JOIN' },
                { id: 'opt-b', text: 'LEFT JOIN' },
                { id: 'opt-c', text: 'RIGHT JOIN' },
                { id: 'opt-d', text: 'CROSS JOIN' }
              ],
              correctOptionId: 'opt-b',
              explanation: 'O LEFT JOIN preserva todas as tuplas da tabela esquerda e preenche com NULL onde não houver casamento na direita.'
            }
          ]
        }
      },
      {
        id: 'mod-8',
        trackId: 'track-dev-junior',
        title: 'Projeto Integrador & Boas Práticas Profissionais',
        description: 'Desenvolvimento do projeto final completo, testes unitários com Vitest/Jest, automação CI/CD com GitHub Actions, deploy em nuvem e portfólio.',
        tier: 'advanced',
        order: 8,
        prerequisiteModuleIds: ['mod-5', 'mod-7'],
        estimatedHours: 24,
        iconName: 'Rocket',
        skillsAcquired: ['Testes Automatizados', 'CI/CD Pipelines', 'Deploy em Nuvem', 'Clean Code'],
        lessons: [
          {
            id: 'les-8-1',
            moduleId: 'mod-8',
            title: 'Arquitetura do Projeto Final: Do Wireframe ao Deploy',
            durationMinutes: 40,
            type: 'video',
            completed: false,
            contentMarkdown: `Apresentação dos requisitos do MVP que consolidará seu portfólio para entrevistas técnicas de Júnior.`
          }
        ],
        quiz: {
          id: 'quiz-mod-8',
          moduleId: 'mod-8',
          title: 'Desafio Final & Certificação Júnior',
          description: 'Avaliação abrangente para desbloqueio do Certificado Profissional de Desenvolvedor Júnior.',
          passingScorePercent: 70,
          rewardXP: 500,
          questions: [
            {
              id: 'q-8-1',
              question: 'Qual é o principal objetivo dos testes de integração em um projeto fullstack?',
              type: 'multiple_choice',
              options: [
                { id: 'opt-a', text: 'Verificar se o código tem indentação bonita' },
                { id: 'opt-b', text: 'Validar a comunicação e funcionamento conjunto entre diferentes módulos e camadas da aplicação' },
                { id: 'opt-c', text: 'Substituir a necessidade de testes manuais em 100%' },
                { id: 'opt-d', text: 'Medir a velocidade da CPU do desenvolvedor' }
              ],
              correctOptionId: 'opt-b',
              explanation: 'Testes de integração garantem que banco de dados, API e lógica de negócio funcionam de forma coesa juntos.'
            }
          ]
        }
      }
    ]
  },
  {
    id: 'track-frontend-expert',
    title: 'Frontend Moderno com React & Next.js',
    slug: 'frontend-moderno-react-nextjs',
    category: 'Frontend',
    level: 'Intermediário',
    description: 'Aprofunde-se no ecossistema do React 19, Server Components, SSR, otimização de performance (Core Web Vitals) e design systems.',
    totalModules: 6,
    totalHours: 85,
    enrolled: false,
    featured: false,
    modules: []
  },
  {
    id: 'track-backend-apis',
    title: 'Backend Escalável com Node, Go & Microserviços',
    slug: 'backend-escalavel-node-go',
    category: 'Backend',
    level: 'Avançado',
    description: 'Arquitetura de software moderna, filas assíncronas com Redis/RabbitMQ, concorrência, microsserviços e comunicação gRPC.',
    totalModules: 7,
    totalHours: 95,
    enrolled: false,
    featured: false,
    modules: []
  },
  {
    id: 'track-devops-cloud',
    title: 'DevOps & Infraestrutura Cloud na Prática',
    slug: 'devops-infraestrutura-cloud',
    category: 'DevOps',
    level: 'Iniciante',
    description: 'Aprenda Docker, orquestração de containers, infraestrutura como código (Terraform), pipelines de CI/CD e monitoramento.',
    totalModules: 5,
    totalHours: 60,
    enrolled: false,
    featured: false,
    modules: []
  }
];
