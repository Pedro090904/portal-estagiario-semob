import { LearningModule } from '../types';

export const MODULES_DATA: LearningModule[] = [
  {
    id: 'git',
    order: 1,
    screenKey: 'modulo-git',
    title: 'Manual Oficial de Git & Engenharia Colaborativa',
    shortTitle: 'Git & DevSecOps',
    subtitle: 'Do Zero à Produção: GitLab Flow, CI/CD, Políticas de Branches e Segurança Governamental',
    category: 'Fundamental',
    estimatedTime: '2 horas de estudo',
    duration: '2h de estudo',
    iconName: 'GitBranch',
    quizId: 'quiz-git',
    description:
      'Aprenda a mecânica do Git, a arquitetura das 4 zonas de trabalho, comandos diários essenciais, convenções de commits, pipelines automatizadas de CI/CD e a regra de ouro: a branch principal é sagrada!',
    topics: [
      'Arquitetura das 4 Zonas',
      'GitLab Flow na SEMOB',
      'Merge Requests & Code Review',
      'CI/CD Pipelines (.gitlab-ci.yml)',
      'Viagem no Tempo e Resolução de Conflitos',
    ],
    objectives: [
      'Dominar as 4 zonas de trabalho do Git (Working, Staging, Local, Remoto)',
      'Aplicar o fluxo colaborativo de branches e Merge Requests',
      'Blindar segredos e senhas com .gitignore',
      'Compreender a automação de testes e deploys via CI/CD Runners',
    ],
    checklist: [
      'Configurar nome e e-mail institucional no git config global',
      'Criar uma branch de tarefa a partir de homologacao (ex: feature/nova-rota)',
      'Verificar se arquivos sensíveis (.env) estão devidamente ignorados',
      'Simular a abertura de um Merge Request com descrição clara',
      'Executar git status antes de qualquer commit para revisar as alterações',
    ],
    sections: [
      {
        heading: '1. A Arquitetura das 4 Zonas de Trabalho do Git',
        body: 'O Git não é apenas um sistema de backup, mas um grafo direcionado acíclico (DAG) que rastreia instantâneos (snapshots) do seu projeto. Para utilizá-lo com total controle, você precisa compreender a transição de arquivos entre as quatro zonas de trabalho fundamentais.',
        bullets: [
          'Working Directory (Diretório de Trabalho): Seus arquivos locais sendo editados no VS Code.',
          'Staging Area (Index): A área de preparação onde você seleciona quais alterações farão parte do próximo commit.',
          'Local Repository (.git): O histórico definitivo de commits armazenado na sua própria máquina.',
          'Remote Repository (GitLab da SEMOB): O repositório central que sincroniza o trabalho de toda a equipe de engenharia.',
        ],
        codeLanguage: 'bash',
        codeExample: `# 1. Verificar em qual estado os seus arquivos se encontram
git status

# 2. Mover arquivos editados para a Staging Area
git add src/services/api.ts

# 3. Selar as alterações no repositório local com mensagem semântica
git commit -m "feat(api): adiciona timeout e interceptor de autenticacao"

# 4. Enviar a sua branch para o GitLab corporativo
git push -u origin feature/sua-tarefa`,
        tip: 'Nunca use git add . sem antes executar git status para revisar o que realmente foi alterado.',
      },
      {
        heading: '2. GitLab Flow e Políticas de Branches Governamentais',
        body: 'Na SEMOB-DF, lidamos com sistemas que sustentam a mobilidade de milhares de cidadãos diariamente. Por isso, a estabilidade é inegociável: a branch principal é estritamente protegida.',
        bullets: [
          'A branch main/production é sagrada: É estritamente proibido realizar commits diretos nela.',
          'Isolamento em Branches: Todo trabalho nasce em branches temporárias (feature/, fix/, chore/).',
          'Merge Requests (MR): Nenhuma linha de código entra em produção sem revisão por pares (Code Review).',
          'Pipeline Verde Obrigatório: O MR só pode ser mesclado se todos os testes automatizados passarem.',
        ],
        codeLanguage: 'bash',
        codeExample: `# Criando e alternando para uma branch isolada a partir da base atualizada
git fetch origin
git checkout -b feature/card-info-onibus origin/homologacao

# Trabalhe normalmente, comitando com frequência
git commit -m "feat(ui): cria componente de visualizacao de itinerario"`,
        tip: 'Mantenha suas branches curtas e com foco em apenas um objetivo para facilitar a revisão dos seus colegas.',
      },
      {
        heading: '3. Convenções de Commits e Blindagem com .gitignore',
        body: 'Commits claros transformam o histórico do Git em uma documentação viva da evolução técnica. Adotamos o padrão Conventional Commits associado à blindagem rigorosa de credenciais.',
        bullets: [
          'feat: Adiciona uma nova funcionalidade ao sistema.',
          'fix: Corrige um defeito ou bug identificado.',
          'refactor: Modificação interna que não altera o comportamento externo.',
          'test: Adiciona ou corrige testes automatizados.',
          'chore: Tarefas de manutenção de build, scripts ou dependências.',
        ],
        codeLanguage: 'gitignore',
        codeExample: `# NUNCA envie estes arquivos ao GitLab:
.env
.env.local
node_modules/
dist/
coverage/
*.log`,
        tip: 'Se você comitar uma senha ou chave de API por engano, considere-a comprometida imediatamente.',
      },
      {
        heading: '4. Integração Contínua (CI/CD) com GitLab Runners',
        body: 'O arquivo .gitlab-ci.yml na raiz do repositório define a esteira automatizada que garante a qualidade do código antes que qualquer entrega chegue aos servidores de homologação ou produção.',
        bullets: [
          'Etapa de Lint: Garante conformidade com o guia de estilo TypeScript/ESLint.',
          'Etapa de Testes: Executa a suíte de testes unitários e de integração.',
          'Etapa de Build: Valida a compilação de produção sem erros de tipos.',
          'Etapa de Deploy: Publica os artefatos nos servidores de forma previsível e auditável.',
        ],
        codeLanguage: 'yaml',
        codeExample: `# Exemplo conceitual do pipeline corporativo .gitlab-ci.yml
stages:
  - lint
  - test
  - build

test_job:
  stage: test
  script:
    - npm ci
    - npm run test`,
        tip: 'Antes de abrir o seu Merge Request, execute npm run test e npm run build localmente para garantir aprovação no CI.',
      },
      {
        heading: '5. Resolução Segura de Conflitos e Sincronização',
        body: 'Conflitos ocorrem naturalmente quando dois desenvolvedores alteram as mesmas linhas de um arquivo. Lidar com eles exige calma, leitura atenta dos marcadores do Git e validação técnica.',
        bullets: [
          'Atualize sua branch base frequentemente com git fetch origin.',
          'Resolva conflitos no editor escolhendo a versão correta ou combinando ambas.',
          'Após resolver, remova os marcadores <<<<<<< e >>>>>>> e teste o build.',
          'Nunca utilize git push --force em branches compartilhadas.',
        ],
        codeLanguage: 'bash',
        codeExample: `# Fluxo seguro de sincronização com a branch homologacao
git fetch origin
git merge origin/homologacao

# Caso haja conflitos, edite os arquivos, salve e confirme:
git add .
git commit -m "chore: resolve conflitos com branch homologacao"
git push origin feature/sua-tarefa`,
        tip: 'Em caso de dúvida durante um conflito, converse com o colega que editou as linhas para decidir a melhor solução conjunta.',
      },
    ],
  },
  {
    id: 'sql',
    order: 2,
    screenKey: 'modulo-sql',
    title: 'Manual de Engenharia de Dados & Tutorial SQL',
    shortTitle: 'Bancos de Dados & SQL',
    subtitle: 'PostgreSQL, PostGIS, Ambientes bdg vs. dados_mobilidade e Boas Práticas',
    category: 'Dados',
    estimatedTime: '3 horas de estudo',
    duration: '3h de estudo',
    iconName: 'Database',
    quizId: 'quiz-sql',
    description:
      'Compreenda a diferença entre o ambiente de homologação (bdg) e produção em tempo real (dados_mobilidade). Domine consultas seguras, filtros, agregações e geometrias espaciais PostGIS.',
    topics: [
      'Ambientes bdg vs dados_mobilidade',
      'Comandos SELECT, WHERE e LIKE %',
      'Agrupamentos, Ordenações e Funções de Agregação',
      'Dados Espaciais (PostGIS: ST_AsText, ST_Length)',
      'Regras de Segurança e Cuidados em Produção',
    ],
    objectives: [
      'Diferenciar o banco bdg (testes) do banco dados_mobilidade (produção)',
      'Escrever consultas seguras e performáticas sempre com cláusula WHERE',
      'Agrupar e resumir dados operacionais com GROUP BY e HAVING',
      'Manipular geometrias espaciais no PostGIS com funções nativas',
    ],
    checklist: [
      'Validar se toda consulta de escrita (UPDATE/DELETE) possui WHERE restritivo',
      'Evitar SELECT * projetando apenas as colunas solicitadas',
      'Utilizar aliases curtos e claros para tabelas e colunas agregadas',
      'Testar conversão de geometrias espaciais com ST_AsText',
    ],
    sections: [
      {
        heading: '1. Ambientes de Banco de Dados: bdg vs. dados_mobilidade',
        body: 'Na SEMOB-DF, a infraestrutura de dados é dividida em dois bancos PostgreSQL distintos com papéis muito bem definidos para proteger a integridade operacional da capital.',
        bullets: [
          'bdg (Desenvolvimento & Homologação): Laboratório seguro da equipe para criação de tabelas, testes e novos relatórios.',
          'dados_mobilidade (Produção em Tempo Real): O coração pulsante dos transportes do DF, recebendo pacotes de telemetria GPS e bilhetagem a cada segundo.',
        ],
        codeLanguage: 'sql',
        codeExample: `-- Regra de ouro: Em produção, nunca execute comandos sem WHERE!
-- Consulta no banco de dados de mobilidade:
SELECT cd_linha, nm_linha, vl_tarifa
FROM semob.linhas
WHERE st_ativa = true;`,
        tip: 'Uma consulta sem WHERE ou com múltiplos JOINs não indexados no banco de produção pode travar a recepção de GPS da frota!',
      },
      {
        heading: '2. Projeção Estrita e Filtros com WHERE',
        body: 'A cláusula WHERE é a primeira linha de defesa da performance e da segurança do banco de dados. Ela reduz a quantidade de blocos de disco que o PostgreSQL precisa ler.',
        bullets: [
          'Evite SELECT *: Transfere dados desnecessários pela rede e impede o uso de índices cobridores (Covering Indexes).',
          'Filtros Booleanos Explícitos: Use st_ativa = true em vez de confiar em valores implícitos.',
          'Operador ILIKE: Busca textual no PostgreSQL sem diferenciar maiúsculas de minúsculas.',
          'Operador IN e BETWEEN: Tornam a cláusula WHERE limpa e eficiente para conjuntos e faixas de valores.',
        ],
        codeLanguage: 'sql',
        codeExample: `-- Busca otimizada de linhas ativas com destino ao Plano Piloto
SELECT cd_linha, nm_linha, vl_tarifa
FROM semob.linhas
WHERE st_ativa = true
  AND nm_linha ILIKE '%Plano Piloto%'
ORDER BY vl_tarifa DESC;`,
        tip: 'Ao combinar AND e OR no WHERE, utilize sempre parênteses para definir a precedência lógica correta.',
      },
      {
        heading: '3. Agrupamentos com GROUP BY e Filtros de Agregação com HAVING',
        body: 'Para gerar relatórios executivos, agrupamos dados de viagens e passageiros. É fundamental distinguir a função do WHERE da função do HAVING.',
        bullets: [
          'WHERE: Filtra registros individuais ANTES de qualquer agrupamento.',
          'GROUP BY: Agrupa as linhas filtradas com base em uma ou mais colunas.',
          'HAVING: Filtra os resultados agregados DEPOIS que o agrupamento foi realizado.',
          'Funções Comuns: COUNT(), SUM(), AVG(), MIN(), MAX().',
        ],
        codeLanguage: 'sql',
        codeExample: `-- Linhas com média de passageiros superior a 40 por viagem concluída
SELECT
  l.cd_linha,
  l.nm_linha,
  ROUND(AVG(v.qt_passageiros), 2) AS media_passageiros
FROM semob.linhas l
INNER JOIN semob.viagens v ON v.id_linha = l.id_linha
WHERE v.st_viagem = 'CONCLUIDA'
GROUP BY l.id_linha, l.cd_linha, l.nm_linha
HAVING AVG(v.qt_passageiros) > 40
ORDER BY media_passageiros DESC;`,
        tip: 'Nunca coloque funções de agregação (como AVG ou COUNT) no WHERE; elas pertencem exclusivamente ao HAVING.',
      },
      {
        heading: '4. Relacionamentos Relacionais: INNER JOIN e LEFT JOIN',
        body: 'O modelo relacional organiza os dados em tabelas normalizadas. As junções permitem reconstruir a visão completa do sistema de transporte.',
        bullets: [
          'INNER JOIN: Retorna registros que possuem correspondência exata em ambas as tabelas.',
          'LEFT JOIN: Preserva todos os registros da tabela da esquerda, trazendo nulos para os não correspondidos.',
          'Detecção de Órfãos: LEFT JOIN combinado com IS NULL no WHERE localiza veículos ou linhas sem viagens.',
        ],
        codeLanguage: 'sql',
        codeExample: `-- Identificando veículos ativos que nunca realizaram viagens
SELECT ve.nr_prefixo, ve.nr_placa, ve.nm_modelo
FROM semob.veiculos ve
LEFT JOIN semob.viagens vi ON vi.id_veiculo = ve.id_veiculo
WHERE ve.st_status = 'ATIVO'
  AND vi.id_viagem IS NULL
ORDER BY ve.nr_prefixo;`,
        tip: 'Utilize aliases curtos (ex: ve, vi, l) para deixar suas junções legíveis e evitar erros de ambiguidade de colunas.',
      },
      {
        heading: '5. Dados Espaciais e Georreferenciamento com PostGIS',
        body: 'A extensão PostGIS transforma o PostgreSQL em um potente banco geográfico capaz de calcular rotas, distâncias reais e interseções espaciais.',
        bullets: [
          'Armazenamento WKB: O PostGIS armazena coordenadas em formato binário compacto.',
          'ST_AsText(geom): Converte o binário em texto geométrico legível (Point, LineString, Polygon).',
          'ST_Length(geom::geography): Calcula o comprimento real de um itinerário em metros na superfície elipsoidal da Terra.',
        ],
        codeLanguage: 'sql',
        codeExample: `-- Consultando traçado espacial de uma linha para visualização cartográfica
SELECT
  numero_linha,
  ST_AsText(geometria) AS wkt_tracado,
  ROUND((ST_Length(geometria::geography) / 1000.0)::numeric, 2) AS extensao_km
FROM semob.linhas_geometria
WHERE numero_linha = '0.110';`,
        tip: 'Para cálculos de distância na escala do Distrito Federal, converta o tipo geometry para geography para considerar a curvatura da Terra.',
      },
    ],
  },
  {
    id: 'gabarito-sql',
    order: 3,
    screenKey: 'modulo-gabarito',
    title: 'Gabarito Oficial & Análise Lógica — Desafio SQL',
    shortTitle: 'Gabarito Desafio SQL',
    subtitle: 'Resoluções Passo a Passo das 25 Questões Práticas com Foco em Performance',
    category: 'Dados',
    estimatedTime: '2 horas de consulta',
    duration: '2h de consulta',
    iconName: 'CheckCircle2',
    quizId: 'quiz-sql',
    description:
      'Análise profunda e gabarito comentado das questões do desafio prático (Linha 0.111, Linha 0.170 por sentido e cruzamentos gerais de mobilidade urbana do DF).',
    topics: [
      'Investigação Detalhada da Linha 0.111',
      'Compreensão de Sentidos (Ida/Volta na 0.170)',
      'Cruzamentos de Business Intelligence',
      'Dicas de Performance e Índices B-Tree/GiST',
    ],
    objectives: [
      'Compreender o raciocínio por trás de cada consulta operacional',
      'Aprender a diagnosticar consultas lentas e aplicar boas práticas',
      'Dominar ordenação customizada e tratamento de valores nulos',
    ],
    checklist: [
      'Comparar os rascunhos de queries com a solução de referência',
      'Validar o uso correto de parênteses em condições compostas',
      'Verificar o impacto de ordenações complexas no plano de execução',
    ],
    sections: [
      {
        heading: '1. Parte I: Análise Estrutural da Linha 0.111',
        body: 'A Linha 0.111 é um exemplo clássico de linha circular de alta densidade no Plano Piloto. As consultas desse bloco focam em levantamento cadastral, operador permissionário e horários.',
        bullets: [
          'Projeção Seletiva: Selecionar apenas código, nome e tarifa reduz tráfego e acelera a API.',
          'Ordenação Alfanumérica: O código da linha é um VARCHAR; ordenações devem levar em consideração prefixos com zeros.',
          'Horários de Partida: Devem ser ordenados primeiro por dia da semana e depois por horário de saída.',
        ],
        codeLanguage: 'sql',
        codeExample: `-- Solução oficial para listagem de horários da Linha 0.111
SELECT dia_semana, ordem_partida, horario_saida
FROM quadro_horarios
WHERE numero_linha = '0.111'
ORDER BY
  CASE dia_semana
    WHEN 'DIAS ÚTEIS' THEN 1
    WHEN 'SÁBADO' THEN 2
    WHEN 'DOMINGO' THEN 3
    ELSE 4
  END,
  horario_saida ASC;`,
        tip: 'Ordenar strings de dias da semana em ordem alfabética bagunça o calendário. Use CASE WHEN para definir a sequência cronológica.',
      },
      {
        heading: '2. Parte II: Sentidos e Trajetos da Linha 0.170',
        body: 'Linhas troncais que conectam Regiões Administrativas ao Plano Piloto (como a 0.170 ligando o Gama) possuem trajetos assimétricos entre a ida e a volta.',
        bullets: [
          'Diferença de Quilometragem: A ida pelo Eixo Sul frequentemente possui extensão diferente da volta pela W3.',
          'Segmentação de Geometria: Cada sentido possui sua própria LINESTRING no PostGIS.',
          'Visualização no Mapa: No InfoÔnibus, cada sentido deve ser renderizado com cores contrastantes.',
        ],
        codeLanguage: 'sql',
        codeExample: `-- Consulta dos trajetos segmentados por sentido
SELECT sentido, extensao_km, ST_AsText(geometria) AS wkt_tracado
FROM trajetos_linha
WHERE numero_linha = '0.170'
ORDER BY sentido ASC;`,
        tip: 'Nunca assuma que a distância de ida é idêntica à volta em linhas metropolitanas.',
      },
      {
        heading: '3. Parte III: Cruzamentos Gerais e Business Intelligence',
        body: 'Consultas analíticas cruzam dados de todo o sistema para alimentar painéis executivos e decisões de planejamento viário.',
        bullets: [
          'Linhas Longas (> 70 km): Identificam necessidade de paradas de descanso e dimensionamento especial de motoristas.',
          'Operação Compartilhada: Linhas com mais de uma operadora exigem divisão rigorosa de receita por bilhetagem.',
          'Sistema Noturno (Corujão): Viagens entre 00h00 e 04h00 atendem a trabalhadores de turnos específicos.',
        ],
        codeLanguage: 'sql',
        codeExample: `-- Identificando linhas com operação compartilhada por mais de uma empresa
SELECT numero_linha, COUNT(DISTINCT id_operadora) AS total_empresas
FROM linhas_operacao
GROUP BY numero_linha
HAVING COUNT(DISTINCT id_operadora) > 1
ORDER BY total_empresas DESC;`,
        tip: 'Sempre utilize COUNT(DISTINCT coluna) quando uma tabela contiver múltiplos registros da mesma entidade.',
      },
    ],
  },
  {
    id: 'backend',
    order: 4,
    screenKey: 'modulo-backend',
    title: 'Manual Oficial de Desenvolvimento Back-end (SISMOB)',
    shortTitle: 'Back-end NestJS',
    subtitle: 'Arquitetura em 3 Camadas, TypeORM, DTOs, JWT e Docker',
    category: 'Back-end',
    estimatedTime: '4 horas de estudo',
    duration: '4h de estudo',
    iconName: 'Server',
    quizId: 'quiz-backend',
    description:
      'Padrão corporativo SISMOB Boilerplate: Controller -> Service -> Repository. Regra de ouro Entity vs. SQL Nativo Parametrizado ($1, $2) contra SQL Injection.',
    topics: [
      'Arquitetura em 3 Camadas',
      'Entity vs. SQL Nativo Parametrizado',
      'Validação com DTOs e class-validator',
      'Segurança, Guards e Autenticação JWT',
      'Tutorial Prático: Criação de Recurso do Zero em 7 Passos',
    ],
    objectives: [
      'Compreender o fluxo HTTP -> Controller -> Service -> Repository -> Banco',
      'Aplicar consultas SQL parametrizadas com $1, $2 no Repository',
      'Validar dados de entrada com DTOs e class-validator',
      'Proteger rotas sensíveis com Guards de autenticação JWT',
    ],
    checklist: [
      'Garantir que nenhum Controller execute regras de negócio ou comandos SQL',
      'Nunca concatenar strings de entrada diretamente em queries de banco',
      'Declarar rotas estáticas antes de rotas dinâmicas no Express/NestJS',
      'Retornar códigos de status HTTP semânticos (200, 201, 204, 400, 404)',
    ],
    sections: [
      {
        heading: '1. Arquitetura em 3 Camadas: O Padrão SISMOB',
        body: 'A separação estrita de responsabilidades é a espinha dorsal dos serviços backend da SEMOB. Cada camada tem uma fronteira delimitada.',
        bullets: [
          'Controller: Porta de entrada HTTP. Recebe a requisição, extrai parâmetros (req.params, req.body), chama o Service e devolve o status HTTP correspondente.',
          'Service: O cérebro da aplicação. Concentra as regras de negócio, cálculos, validações de domínio e orquestra chamadas a múltiplos repositórios.',
          'Repository: Especialista em persistência. O único componente autorizado a se comunicar com o banco de dados via TypeORM ou SQL nativo parametrizado.',
        ],
        codeLanguage: 'typescript',
        codeExample: `// Controller limpo e desacoplado
@Controller('api/linhas')
export class LinhaController {
  constructor(private readonly linhaService: LinhaService) {}

  @Get(':codigo')
  async buscarPorCodigo(@Param('codigo') codigo: string) {
    return await this.linhaService.buscarPorCodigo(codigo);
  }
}`,
        tip: 'Se você encontrar um SELECT dentro de um Controller ou uma chamada a res.status() dentro de um Service, o padrão foi violado.',
      },
      {
        heading: '2. Entity vs. SQL Nativo Parametrizado ($1, $2)',
        body: 'O SISMOB Boilerplate equilibra produtividade e performance com uma regra de decisão clara.',
        bullets: [
          'Entities do TypeORM: Utilizadas para operações de CRUD simples (cadastrar, alterar campo único, listar entidade simples).',
          'SQL Nativo Parametrizado: Obrigatório para relatórios pesados, agregações, múltiplos JOINs e consultas espaciais PostGIS.',
          'Prevenção de SQL Injection: Jamais concatene strings em queries; use sempre placeholders parametrizados ($1, $2).',
        ],
        codeLanguage: 'typescript',
        codeExample: `// Consulta nativa segura com parâmetros no Repository
export class LinhaRepository {
  async buscarComTelemetria(codigoLinha: string) {
    const sql = \`
      SELECT l.cd_linha, l.nm_linha, v.nr_prefixo, v.dt_posicao
      FROM semob.linhas l
      INNER JOIN semob.veiculos v ON v.id_linha = l.id_linha
      WHERE l.cd_linha = $1 AND l.st_ativa = true;
    \`;
    return await this.db.query(sql, [codigoLinha]);
  }
}`,
        tip: 'Placeholders ($1, $2) delegam a sanitização ao driver do PostgreSQL, neutralizando qualquer tentativa de injeção maliciosa.',
      },
      {
        heading: '3. Validação de Entrada com DTOs (Data Transfer Objects)',
        body: 'Nenhum dado externo deve entrar no sistema sem passar por validação prévia. Usamos DTOs com class-validator para blindar as requisições.',
        bullets: [
          'Tipagem Forte: Todo campo esperado no body é declarado explicitamente.',
          'Decorators de Validação: @IsString(), @IsNumber(), @IsPositive(), @IsNotEmpty().',
          'Falha Precoce: Requisições inválidas são rejeitadas com HTTP 400 antes de tocar o Service.',
        ],
        codeLanguage: 'typescript',
        codeExample: `import { IsString, IsNumber, IsPositive, Length } from 'class-validator';

export class CreateLinhaDTO {
  @IsString()
  @Length(3, 10)
  cd_linha: string;

  @IsString()
  @Length(5, 120)
  nm_linha: string;

  @IsNumber()
  @IsPositive()
  vl_tarifa: number;
}`,
        tip: 'Validar dados na borda da aplicação economiza processamento e protege a integridade do banco de dados.',
      },
      {
        heading: '4. Autenticação JWT e Proteção de Endpoints',
        body: 'Rotas administrativas e de escrita exigem autenticação segura baseada em tokens JWT (JSON Web Tokens).',
        bullets: [
          'Stateless: O servidor não armazena sessão; o token assinado carrega as credenciais e permissões.',
          '@UseGuards(JwtAuthGuard): Decorator que intercepta requisições e valida o cabeçalho Authorization: Bearer <token>.',
          'HTTP 401 Unauthorized: Retornado automaticamente caso o token seja inválido ou expirado.',
        ],
        codeLanguage: 'typescript',
        codeExample: `@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Post()
async criarLinha(@Body() dto: CreateLinhaDTO) {
  return await this.linhaService.criar(dto);
}`,
        tip: 'Sempre documente a exigência do token no Swagger com @ApiBearerAuth() para testes rápidos na interface OpenAPI.',
      },
    ],
  },
  {
    id: 'frontend',
    order: 5,
    screenKey: 'modulo-frontend',
    title: 'Guia Prático de Arquitetura Front-end (React + Vite)',
    shortTitle: 'Front-end React',
    subtitle: 'Separação em 5 Camadas, Regra das 50 Linhas, TypeScript Estrito e Desafio InfoÔnibus',
    category: 'Front-end',
    estimatedTime: '4 horas de estudo',
    duration: '4h de estudo',
    iconName: 'Layout',
    quizId: 'quiz-frontend',
    description:
      'Aprenda o modelo mental de 5 camadas (/screens, /hooks, /services, /components, /types), a analogia do restaurante, a Regra das 50 Linhas e a construção do novo InfoÔnibus.',
    topics: [
      'Modelo Mental em 5 Camadas',
      'Regra das 50 Linhas para Hooks',
      'Proibição Absoluta do tipo any',
      'Dumb Components vs Smart Components',
      'Consumo de APIs Reais com Axios/Fetch e Variáveis VITE_',
    ],
    objectives: [
      'Separar o front-end em 5 camadas limpas e desacopladas',
      'Aplicar a Regra das 50 Linhas para extrair estado e lógica para Hooks',
      'Proibir o uso de "any" em favor de contratos estritos em /types',
      'Construir componentes reutilizáveis e tratar todos os estados de UI',
    ],
    checklist: [
      'Isolar todas as chamadas HTTP em services/ fora do JSX das telas',
      'Tratar os 4 estados visuais: Loading, Erro de Rede, Empty State e Sucesso',
      'Garantir compilação com zero erros de TypeScript sem "any"',
      'Utilizar variáveis de ambiente iniciadas com o prefixo VITE_',
    ],
    sections: [
      {
        heading: '1. O Modelo Mental das 5 Camadas (A Analogia do Restaurante)',
        body: 'Para evitar telas gigantes e código espaguete, o padrão da SUTINF divide a aplicação em cinco camadas especializadas.',
        bullets: [
          '/screens (O Salão): Exibe os pratos aos clientes. Apenas renderiza a estrutura visual e repassa eventos.',
          '/hooks (O Garçom): Recebe os pedidos da tela, busca os dados no serviço, controla o estado (carregando, erro) e entrega tudo pronto.',
          '/services (A Cozinha): Especialista em preparar requisições HTTP (Axios/Fetch), autenticação e cabeçalhos.',
          '/components (A Louça e Talheres): Peças de lego reutilizáveis e previsíveis (Dumb Components).',
          '/types (O Cardápio): Contratos estritos que definem o que pode ou não existir em cada mensagem.',
        ],
        codeLanguage: 'typescript',
        codeExample: `// Estrutura oficial de pastas
src/
├── screens/       # Componentes de página (UI pura)
├── hooks/         # Cérebro de estado (Regra das 50 Linhas)
├── services/      # Comunicação de rede (Axios/Fetch)
├── components/    # Componentes reutilizáveis (Dumb)
└── types/         # Tipos TypeScript estritos (Zero Any)`,
        tip: 'Uma Screen nunca deve importar Axios diretamente; ela conversa exclusivamente com o seu Hook!',
      },
      {
        heading: '2. A Regra das 50 Linhas para Custom Hooks',
        body: 'Telas limpas tornam o projeto fácil de ler e manter. Se uma tela começa a acumular useState, useEffect, timers e filtros, essa complexidade deve ser extraída.',
        bullets: [
          'Limite de Responsabilidade: Se a lógica da tela passar de 50 linhas, crie um Custom Hook dedicado.',
          'Desacoplamento: O Hook pode ser testado isoladamente sem precisar renderizar a interface visual.',
          'Clareza Visual: A tela passa a ter menos de 100 linhas focadas puramente em layout e composição.',
        ],
        codeLanguage: 'typescript',
        codeExample: `// Custom Hook limpo: useLinhas.ts
export function useLinhas() {
  const [linhas, setLinhas] = useState<Linha[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    linhasApi.listar()
      .then(setLinhas)
      .catch((err) => setErro('Não foi possível carregar as linhas'))
      .finally(() => setLoading(false));
  }, []);

  return { linhas, loading, erro };
}`,
        tip: 'Ao extrair a lógica para o Hook, a tela se resume a consumir const { linhas, loading } = useLinhas() e renderizar.',
      },
      {
        heading: '3. Tipagem Estrita TypeScript (Proibição Absoluta do "any")',
        body: 'O tipo "any" silencia o compilador e transforma o TypeScript em JavaScript comum, escondendo erros graves de integração.',
        bullets: [
          'Defina Interfaces: Toda resposta de backend deve ter sua interface correspondente em src/types/.',
          'Tipagem de Props: Todos os componentes recebem props tipadas.',
          'Compilação Segura: Com noImplicitAny ativo, o projeto não compila se houver propriedades desconhecidas.',
        ],
        codeLanguage: 'typescript',
        codeExample: `// src/types/linha.ts
export type SentidoLinha = 'IDA' | 'VOLTA' | 'CIRCULAR';

export interface LinhaTransporte {
  id_linha: number;
  cd_linha: string;
  nm_linha: string;
  vl_tarifa: number;
  sentido: SentidoLinha;
  st_ativa: boolean;
}`,
        tip: 'Use tipos literais (ex: "IDA" | "VOLTA") em vez de string genérica para campos com valores fixos.',
      },
      {
        heading: '4. Tratamento dos 4 Estados de Interface (UI)',
        body: 'Uma aplicação robusta nunca deixa o usuário sem resposta. Toda tela que consome dados assíncronos deve tratar quatro cenários.',
        bullets: [
          'Estado de Carregamento (Loading): Skeleton loaders ou spinners informando que os dados estão a caminho.',
          'Estado de Erro (Error State): Mensagem clara com opção de tentar novamente.',
          'Estado Vazio (Empty State): Quando a busca não encontra resultados para o filtro digitado.',
          'Estado de Sucesso (Data Ready): A lista de registros renderizada com perfeição.',
        ],
        codeLanguage: 'tsx',
        codeExample: `{loading && <p>Carregando dados da SEMOB...</p>}
{erro && <div className="alert-error">{erro}</div>}
{!loading && !erro && linhas.length === 0 && (
  <p>Nenhuma linha encontrada para o filtro informado.</p>
)}
{!loading && !erro && linhas.map((l) => <LinhaCard key={l.cd_linha} linha={l} />)}`,
        tip: 'O Empty State deve sempre orientar o usuário sobre o que fazer (ex: "Verifique a digitação ou limpe os filtros").',
      },
    ],
  },
];
