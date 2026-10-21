import { LearningModule } from '../../types';

export const mod04Backend: LearningModule = {
  id: 'mod-4-backend',
  order: 4,
  title: 'Manual Prático de Back-end: Do Rancher & SISMOB-Boilerplate à Criação de APIs',
  category: 'backend',
  estimatedTime: '3h 30min',
  version: '2.0.0',
  updatedAt: '2026-10-21',
  workloadHours: 12,
  description:
    'Aprenda do zero: o que é o SISMOB-BOILERPLATE, como subir o banco com Rancher Desktop e Docker, o que faz cada pasta do projeto, o significado dos Códigos de Status HTTP, como usar o Swagger com token JWT e como construir novas APIs de Linhas passo a passo a partir da tabela tab_linha.',
  objectives: [
    'Entender o que é um Boilerplate e como subir o SISMOB-BOILERPLATE usando Rancher Desktop, Docker e NPM',
    'Navegar com segurança pelas 12 pastas do projeto sabendo exatamente onde colocar cada código',
    'Dominar os Códigos de Status HTTP (2xx, 4xx e 5xx) e o padrão oficial de respostas de erro da SEMOB',
    'Utilizar o Swagger (OpenAPI) para autenticar com JWT (Authorize) e testar os endpoints de Linhas',
    'Compreender o vínculo entre a tabela física dados_mobilidade.tab_linha e a classe Entity/Repository',
    'Criar um novo endpoint completo de Linhas passo a passo (Entity ➔ DTO ➔ Repository SQL com WHERE ➔ Service ➔ Controller)',
  ],
  sections: [
    // ========================================================================
    // CAPÍTULO 1: O QUE É O BOILERPLATE E COMO FUNCIONAM AS CAMADAS
    // ========================================================================
    {
      heading: '1. O que é o SISMOB-BOILERPLATE e o Modelo Mental de Camadas',
      body: 'Quando você entra na equipe de desenvolvimento da SEMOB, você não cria um projeto Node.js em branco do zero. Nós utilizamos o SISMOB-BOILERPLATE. Em engenharia de software, um "Boilerplate" é um projeto-base oficial já configurado com todas as ferramentas de segurança, conexão com banco de dados, tratamento de erros, autenticação JWT e documentação Swagger prontos para uso.',
      paragraphs: [
        'Por que usamos um Boilerplate? Imagine que a SEMOB precisa construir 10 sistemas diferentes (Linhas, Frota, Bilhetagem, Vistoria). Se cada programador inventar sua própria estrutura de pastas, ninguém consegue dar manutenção no código do colega. Com o SISMOB-BOILERPLATE, todos os projetos têm exatamente a mesma anatomia.',
        'Dentro do Boilerplate, o código é dividido em 4 camadas que funcionam como uma linha de montagem de cima para baixo (Fluxo Unidirecional):',
      ],
      codeBlocks: [
        {
          title: 'A Linha de Montagem de uma Requisição no SISMOB-BOILERPLATE',
          language: 'text',
          code: `[ Navegador / Front-end / Swagger ]
       │  (Envia HTTP GET /api/linhas?codigo=0.111)
       ▼
1. CONTROLLER (src/controller/Linha.ts) ──► "O Recepcionista"
       │  Recebe o pedido HTTP, valida o formato com o DTO e chama o Service.
       ▼
2. SERVICE (src/service/Linha.ts) ────────► "O Cérebro / Gerente de Regras"
       │  Aplica as regras de negócio. Se a linha não existir, lança erro 404.
       ▼
3. REPOSITORY (src/repository/Linha.ts) ──► "O Especialista em SQL"
       │  Monta a consulta SQL segura com cláusula WHERE e parâmetros ($1, $2).
       ▼
4. ENTITY & BANCO (src/entity/Linha.ts) ──► "O Espelho da Tabela"
          Conecta na tabela física dados_mobilidade.tab_linha no PostgreSQL.`,
        },
      ],
      callouts: [
        {
          type: 'important',
          title: '🛡️ As 3 Leis Inegociáveis do Boilerplate',
          content: 'Para o seu código ser aprovado na revisão da equipe, nunca quebre estas 3 fronteiras:',
          bullets: [
            '1. O Controller NUNCA conversa direto com o banco de dados (ele sempre chama o Service).',
            '2. O Service NUNCA escreve comandos SQL (ele pede os dados para o Repository).',
            '3. O Repository NUNCA concatena variáveis direto no texto do SQL com "+" (usa sempre parâmetros $1, $2 com WHERE para impedir SQL Injection).',
          ],
        },
      ],
    },

    // ========================================================================
    // CAPÍTULO 2: RANCHER DESKTOP, DOCKER E COMANDOS NPM (DO CLONE AO AR)
    // ========================================================================
    {
      heading: '2. Na Prática: Subindo o Boilerplate com Rancher Desktop, Docker e NPM',
      body: 'Para rodar o SISMOB-BOILERPLATE na sua máquina, precisamos de duas coisas trabalhando juntas: o Banco de Dados PostgreSQL (que roda dentro de um container usando o Rancher Desktop) e a aplicação NestJS (que roda pelo terminal com o NPM).',
      callouts: [
        {
          type: 'info',
          title: '🐮 O que é o Rancher Desktop e como configurá-lo?',
          content:
            'O Rancher Desktop é a ferramenta gratuita e leve que usamos nas máquinas de desenvolvimento para gerenciar containers Docker e Kubernetes sem precisar de licenças pagas do Docker Desktop.',
          bullets: [
            '1. Abra o aplicativo Rancher Desktop no seu computador.',
            '2. Vá em Preferences ( Ícone de Engrenagem ⚙️ ) ➔ Container Engine.',
            '3. Selecione a opção "dockerd (moby)" (isso habilita os comandos docker e docker compose no seu terminal).',
            '4. Aguarde a barra inferior do Rancher ficar verde ("Engine Ready"). Pronto! Agora os comandos Docker funcionam no seu VS Code.',
          ],
        },
      ],
      commandCards: [
        {
          name: 'Passo 1: Clonar o Repositório e Entrar na Pasta',
          role: 'Terminal Git',
          concept:
            'Baixamos o código do SISMOB-BOILERPLATE para o nosso computador e abrimos a pasta no VS Code:',
          code: `git clone https://github.com/pedro090904/SISMOB-BOILERPLATE.git
cd SISMOB-BOILERPLATE
code .`,
        },
        {
          name: 'Passo 2: Subir o Banco de Dados com Docker (via Rancher)',
          role: 'Infraestrutura Local',
          concept:
            'O arquivo docker-compose.yml que está na raiz do boilerplate configura automaticamente um banco PostgreSQL com PostGIS e executa o script init.sql (que cria o schema dados_mobilidade):',
          details: [
            'O parâmetro -d (detached) faz o banco rodar em segundo plano, deixando seu terminal livre.',
            'Use "docker compose ps" para confirmar que o container está com status Up / Running na porta 5432.',
          ],
          code: `# Com o Rancher Desktop aberto, rode:
docker compose up -d

# Verifique se o container do banco subiu:
docker compose ps`,
        },
        {
          name: 'Passo 3: Instalar Pacotes e Iniciar o Servidor com NPM',
          role: 'Node.js & NestJS',
          concept:
            'Agora que o banco está de pé no Rancher, instalamos as bibliotecas TypeScript do projeto e ligamos a API em modo de desenvolvimento:',
          details: [
            'Na primeira vez que o servidor sobe, o arquivo src/service/Seed.ts verifica se a tabela dados_mobilidade.tab_linha está vazia.',
            'Se estiver vazia, ele lê automaticamente o arquivo src/config/tab_linha.sql e insere todas as linhas reais de ônibus do DF para você já ter dados para trabalhar!',
          ],
          code: `# 1. Baixa todas as dependências listadas no package.json (cria a pasta node_modules)
npm install

# 2. Inicia o servidor NestJS com recarregamento automático (Watch Mode)
npm run start:dev

# Saída esperada no terminal:
# [Nest] LOG [SeedService] Populando tabela dados_mobilidade.tab_linha com dados iniciais...
# [Nest] LOG [NestApplication] Aplicação SISMOB rodando em: http://localhost:8097/api/docs`,
        },
      ],
      tables: [
        {
          headers: ['Comando NPM do Boilerplate', 'Quando você deve usar?', 'O que ele faz nos bastidores?'],
          rows: [
            [
              'npm install',
              'Apenas quando clonar o projeto ou quando alguém adicionar uma biblioteca nova.',
              'Lê o package.json e o package-lock.json e instala os pacotes na pasta node_modules/.',
            ],
            [
              'npm run start:dev',
              'Todos os dias enquanto estiver programando.',
              'Inicia o NestJS com --watch. Sempre que você salvar (Ctrl+S) um arquivo .ts, ele reinicia o servidor sozinho.',
            ],
            [
              'npm run build',
              'Antes de enviar seu código para o GitLab/GitHub.',
              'Compila o TypeScript para JavaScript puro na pasta dist/ e garante que não há nenhum erro de compilação.',
            ],
            [
              'npm run lint',
              'Antes de abrir um Merge Request.',
              'Passa o pente fino do ESLint procurando variáveis não usadas ou fora do padrão da equipe.',
            ],
            [
              'npm test / npm run test:e2e',
              'Para validar se suas alterações não quebraram nada.',
              'Executa os testes automatizados com Jest.',
            ],
          ],
        },
      ],
    },

    // ========================================================================
    // CAPÍTULO 3: EXPLORADOR PASTA A PASTA DO SISMOB-BOILERPLATE
    // ========================================================================
    {
      heading: '3. Anatomia Completa: O Que Vai em Cada Pasta do SISMOB-BOILERPLATE?',
      body: 'Uma das maiores dúvidas de quem está começando é: "Preciso criar uma funcionalidade nova, em qual pasta eu mexo?". Use o explorador interativo abaixo clicando em cada pasta real do SISMOB-BOILERPLATE para entender o papel de cada uma:',
      folderExplorer: [
        {
          id: 'folder-entity',
          path: 'src/entity/',
          type: 'folder',
          analogy: 'O Espelho da Tabela SQL',
          purpose:
            'Aqui ficam as classes TypeScript que representam fielmente as tabelas do banco de dados PostgreSQL. Cada propriedade da classe aponta para uma coluna real da tabela física.',
          filesInside: ['src/entity/Linha.ts'],
          mustDo: [
            'Declarar @Entity({ name: "tab_linha", schema: "dados_mobilidade" })',
            'Mapear o nome exato da coluna física do banco (ex: @Column({ name: "cd_linha" })) para um nome amigável em camelCase (codigo: string)',
          ],
          mustNotDo: [
            'Nunca coloque queries SQL ou regras de negócio dentro da Entity',
            'Nunca esqueça de informar o schema "dados_mobilidade"',
          ],
          codePreview: `@Entity({ name: 'tab_linha', schema: 'dados_mobilidade' })
export class Linha {
  @PrimaryGeneratedColumn({ name: 'id_linha' })
  id: number;

  @Column({ name: 'cd_linha', length: 10 })
  codigo: string;

  @Column({ name: 'tx_linha', length: 255 })
  descricao: string;

  @Column({ name: 'vl_tarifa', type: 'numeric' })
  valorTarifa: number;
}`,
        },
        {
          id: 'folder-dto',
          path: 'src/dto/',
          type: 'folder',
          analogy: 'O Segurança da Porta (Contrato de Entrada)',
          purpose:
            'DTO significa Data Transfer Object. Ele define quais filtros ou campos o usuário pode enviar na requisição e aplica validações automáticas (tamanho máximo, texto obrigatório) antes mesmo de chegar ao seu código.',
          filesInside: ['src/dto/Linha.ts', 'src/dto/Auth.ts'],
          mustDo: [
            'Usar decoradores do class-validator (@IsString, @IsOptional, @MaxLength)',
            'Documentar cada campo com @ApiProperty ou @ApiPropertyOptional para aparecer no Swagger',
          ],
          mustNotDo: [
            'Nunca use o tipo "any"',
            'Nunca coloque lógica de banco de dados dentro de um DTO',
          ],
        },
        {
          id: 'folder-repository',
          path: 'src/repository/',
          type: 'folder',
          analogy: 'O Cofre e Especialista em SQL',
          purpose:
            'É a única pasta que conversa com o banco de dados. Aqui escrevemos consultas SQL parametrizadas (sempre com cláusula WHERE e $1, $2) ou usamos métodos do TypeORM.',
          filesInside: ['src/repository/Linha.ts'],
          mustDo: [
            'Escrever SQL com cláusula WHERE explícita e parâmetros ($1, $2)',
            'Usar apelidos (AS "codigo") no SELECT para devolver os nomes no padrão da entidade',
          ],
          mustNotDo: [
            'PROIBIDO concatenar texto no SQL com "+" ou "${variavel}" (Risco grave de SQL Injection)',
            'Não retornar status HTTP (como 404) daqui; apenas retorne os dados ou null/vazio',
          ],
        },
        {
          id: 'folder-service',
          path: 'src/service/',
          type: 'folder',
          analogy: 'O Cérebro das Regras de Negócio',
          purpose:
            'Recebe os dados limpos do Controller, chama o Repository e toma decisões. Por exemplo: se o usuário buscou uma linha que não existe no banco, é o Service que decide lançar o erro EntityNotFoundException (404).',
          filesInside: ['src/service/Linha.ts', 'src/service/Auth.ts', 'src/service/Seed.ts'],
          mustDo: [
            'Concentrar 100% das validações de regra de negócio (if/else de domínio)',
            'Lançar exceções da pasta src/exceptions/ quando algo violar a regra',
          ],
          mustNotDo: [
            'Nunca manipular objetos HTTP (req, res)',
            'Nunca escrever SELECT/UPDATE SQL direto dentro do Service',
          ],
        },
        {
          id: 'folder-controller',
          path: 'src/controller/',
          type: 'folder',
          analogy: 'O Recepcionista de Rotas HTTP',
          purpose:
            'Define os endereços da API (ex: @Get(), @Post()), protege a rota com @UseGuards(JwtAuthGuard), recebe os parâmetros da URL (@Query, @Param, @Body) e repassa imediatamente para o Service.',
          filesInside: ['src/controller/Linha.ts', 'src/controller/Auth.ts', 'src/controller/Docs.ts'],
          mustDo: [
            'Manter os métodos curtos (de 3 a 5 linhas apenas chamando o Service)',
            'Documentar a rota com @ApiTags, @ApiOperation e @ApiResponse para o Swagger',
          ],
          mustNotDo: [
            'Jamais injetar o Repository direto no Controller (pule nunca o Service!)',
          ],
        },
        {
          id: 'folder-module',
          path: 'src/module/',
          type: 'folder',
          analogy: 'A Caixa Organizadora do Domínio',
          purpose:
            'No NestJS, precisamos avisar como o Controller, o Service, o Repository e a Entity se conectam. O arquivo LinhaModule faz exatamente essa colagem e depois é importado no src/app.module.ts.',
          filesInside: ['src/module/Linha.ts'],
          mustDo: [
            'Registrar a Entity no TypeOrmModule.forFeature([Linha])',
            'Declarar o Controller em controllers: [...] e o Service/Repository em providers: [...]',
          ],
          mustNotDo: ['Esquecer de importar o novo módulo dentro do src/app.module.ts'],
        },
        {
          id: 'folder-config',
          path: 'src/config/',
          type: 'folder',
          analogy: 'A Casa de Máquinas',
          purpose:
            'Guarda a conexão com o PostgreSQL/Oracle (Database.ts), a configuração de chave secreta do token (Jwt.ts) e o script SQL inicial com os dados das linhas de ônibus (tab_linha.sql).',
          filesInside: ['src/config/Database.ts', 'src/config/Jwt.ts', 'src/config/tab_linha.sql'],
          mustDo: ['Ler credenciais exclusivamente através de variáveis de ambiente (process.env)'],
          mustNotDo: ['Nunca deixar senhas reais escritas fixas (hardcoded) no código'],
        },
        {
          id: 'folder-guards-filters',
          path: 'src/guards/, filters/ & exceptions/',
          type: 'folder',
          analogy: 'A Blindagem e Padronização da API',
          purpose:
            'guards/Jwt.ts bloqueia quem não enviou token válido (401). exceptions/ traz erros prontos (400, 404, 409). filters/all-exceptions.filter.ts captura qualquer erro e devolve um JSON limpo e padronizado.',
          filesInside: [
            'src/guards/Jwt.ts',
            'src/filters/all-exceptions.filter.ts',
            'src/exceptions/Business.ts',
            'src/exceptions/entity-not-found.exception.ts',
          ],
          mustDo: ['Reutilizar as exceções existentes nos seus novos Services'],
          mustNotDo: ['Não usar throw new Error() genérico do JavaScript'],
        },
      ],
    },

    // ========================================================================
    // CAPÍTULO 4: A LINGUAGEM DA WEB: CÓDIGOS DE STATUS HTTP NO SISMOB (2xx, 4xx e 5xx)
    // ========================================================================
    {
      heading: '4. A Linguagem da Web: Códigos de Status HTTP no SISMOB (2xx, 4xx e 5xx)',
      body: 'Toda vez que um cliente (como o Swagger, um aplicativo móvel ou o front-end) faz uma requisição HTTP para a nossa API, o servidor responde com um número de três dígitos chamado HTTP Status Code. Esse número é a resposta mais rápida e padronizada do mundo para dizer: "deu certo", "você enviou algo errado" ou "o servidor caiu".',
      paragraphs: [
        'Antes de abrir o Swagger no próximo capítulo, você precisa entender o que esses códigos significam. No SISMOB-BOILERPLATE, nós seguimos à risca as convenções RESTful e usamos o filtro global de exceções (src/filters/all-exceptions.filter.ts) para garantir que nenhum erro seja mascarado como sucesso.',
        'Use o painel interativo abaixo para clicar em cada código e descobrir sua analogia prática, o cenário real no SISMOB e como o NestJS produz cada resposta:',
      ],
      callouts: [
        {
          type: 'important',
          title: '🚦 O Semáforo das Famílias HTTP',
          content: 'Grave esta regra de ouro para nunca mais confundir a responsabilidade de cada erro:',
          bullets: [
            '🟢 Família 2xx (Sucesso): "Deu tudo certo! Aqui está o que você pediu ou a confirmação do que salvamos."',
            '🟡 Família 4xx (Erro do Cliente): "A culpa foi de quem chamou a API" (faltou o token JWT, enviou dados inválidos no DTO ou buscou uma linha que não existe no banco).',
            '🔴 Família 5xx (Erro do Servidor): "A culpa foi da nossa aplicação" (o container do banco caiu no Rancher, houve falha de rede ou ocorreu um erro de JavaScript não tratado).',
          ],
        },
        {
          type: 'danger',
          title: '🚫 O Pecado Capital das APIs: Retornar HTTP 200 com Erro dentro do JSON',
          content:
            'Nunca cometa o erro de responder com status HTTP 200 OK devolvendo um JSON como { "sucesso": false, "mensagem": "Linha não encontrada" }. Isso quebra monitoramentos de infraestrutura, dificulta a vida dos desenvolvedores front-end e viola as diretrizes de arquitetura da SEMOB. Se o recurso não existe, o status DEVE ser 404!',
        },
      ],
      httpCodesExplorer: [
        {
          code: 200,
          phrase: 'OK',
          category: '2xx',
          analogy: 'O garçom entregou exatamente o prato que você pediu na mesa.',
          realWorldScenario:
            'Consultas de linhas bem-sucedidas (GET /api/linhas ou GET /api/linhas/:codigo quando a linha existe no banco) ou atualizações concluídas.',
          howToTriggerNest:
            '@Get() e @Put() no Controller retornam 200 OK por padrão no NestJS sem você precisar configurar nada.',
          responsePreview: `// HTTP 200 OK
[
  {
    "id": 1,
    "codigo": "0.111",
    "descricao": "RODOVIÁRIA DO PLANO PILOTO / ASA NORTE (UNB)",
    "valorTarifa": 3.8,
    "sentido": "CIRCULAR"
  }
]`,
        },
        {
          code: 201,
          phrase: 'Created',
          category: '2xx',
          analogy:
            'Você encomendou um bolo novo e a confeitaria avisa que ele acabou de ser assado e guardado.',
          realWorldScenario:
            'Cadastro de uma nova linha de ônibus ou novo veículo na frota da SEMOB através de um formulário POST.',
          howToTriggerNest:
            '@Post() no Controller retorna 201 Created por padrão no NestJS para indicar que um novo recurso físico foi criado.',
          responsePreview: `// HTTP 201 Created
{
  "id": 42,
  "codigo": "0.222",
  "descricao": "CIRCULAR PRAÇA DOS TRÊS PODERES / ESPLANADA",
  "valorTarifa": 2.7,
  "sentido": "CIRCULAR"
}`,
        },
        {
          code: 204,
          phrase: 'No Content',
          category: '2xx',
          analogy:
            'Você pediu para o garçom recolher um prato vazio: ele levou embora com sucesso e não há nada para trazer na bandeja.',
          realWorldScenario:
            'Exclusão de um registro (DELETE /api/linhas/:id) ou endpoint de cancelamento onde a operação deu certo e o corpo da resposta é intencionalmente vazio.',
          howToTriggerNest:
            '@Delete(":id") combinado com o decorador @HttpCode(HttpStatus.NO_CONTENT).',
          responsePreview: `// HTTP 204 No Content
// Corpo da resposta vazio (0 bytes)`,
        },
        {
          code: 400,
          phrase: 'Bad Request',
          category: '4xx',
          analogy:
            'Você tentou pedir um "sanduíche de tijolo" no restaurante: o pedido é absurdo e a cozinha nem começa a preparar.',
          realWorldScenario:
            'O usuário enviou uma tarifa negativa (?tarifaMaxima=-5.00) ou um texto com mais de 255 caracteres, violando o class-validator do DTO.',
          howToTriggerNest:
            'Disparado automaticamente pelo ValidationPipe do NestJS antes de chegar no Service.',
          responsePreview: `// HTTP 400 Bad Request
{
  "statusCode": 400,
  "timestamp": "2026-10-21T11:00:00.000Z",
  "path": "/api/linhas?tarifaMaxima=-5",
  "method": "GET",
  "message": [
    "A tarifa não pode ser negativa."
  ]
}`,
        },
        {
          code: 401,
          phrase: 'Unauthorized',
          category: '4xx',
          analogy:
            'Você tentou entrar na festa VIP sem a pulseira de identificação ou com uma pulseira vencida.',
          realWorldScenario:
            'Qualquer requisição para GET /api/linhas enviada sem o token JWT ou com token expirado/adulterado no Swagger.',
          howToTriggerNest:
            'Disparado automaticamente pelo decorador @UseGuards(JwtAuthGuard) no topo do Controller.',
          responsePreview: `// HTTP 401 Unauthorized
{
  "statusCode": 401,
  "timestamp": "2026-10-21T11:00:00.000Z",
  "path": "/api/linhas",
  "method": "GET",
  "message": "Unauthorized — Token JWT ausente ou expirado!"
}`,
        },
        {
          code: 403,
          phrase: 'Forbidden',
          category: '4xx',
          analogy:
            'Você está dentro da festa com a pulseira comum, mas tentou entrar na cabine do DJ restrita à gerência.',
          realWorldScenario:
            'O estagiário está autenticado com token válido, mas sua role é "ALUNO" e ele tentou chamar uma rota administrativa exclusiva de "SUPERVISOR" ou "ADMIN".',
          howToTriggerNest:
            'Disparado pelo RolesGuard (@Roles("ADMIN")) quando o payload do JWT não possui o papel exigido.',
          responsePreview: `// HTTP 403 Forbidden
{
  "statusCode": 403,
  "timestamp": "2026-10-21T11:00:00.000Z",
  "path": "/api/admin/reset-database",
  "method": "POST",
  "message": "Forbidden resource — Apenas SUPERVISOR ou ADMIN podem executar esta ação."
}`,
        },
        {
          code: 404,
          phrase: 'Not Found',
          category: '4xx',
          analogy: 'Você pediu um prato que simplesmente não consta no cardápio de hoje.',
          realWorldScenario:
            'O usuário buscou uma linha de ônibus que não existe no banco de dados (ex: GET /api/linhas/9.999).',
          howToTriggerNest:
            "throw new EntityNotFoundException('Linha', codigo) dentro do LinhaService.",
          responsePreview: `// HTTP 404 Not Found
{
  "statusCode": 404,
  "timestamp": "2026-10-21T11:00:00.000Z",
  "path": "/api/linhas/9.999",
  "method": "GET",
  "message": "Linha com identificador 9.999 não foi encontrada no sistema."
}`,
        },
        {
          code: 409,
          phrase: 'Conflict',
          category: '4xx',
          analogy:
            'Você tentou reservar o assento 12B no avião, mas outro passageiro acabou de comprar esse mesmo assento um segundo antes.',
          realWorldScenario:
            'Tentativa de cadastrar uma linha com o código "0.111" que já existe na tabela dados_mobilidade.tab_linha (violação de chave única).',
          howToTriggerNest:
            "throw new EntityAlreadyExistsException('Linha', '0.111') ou erro de violação de Unique Constraint do PostgreSQL.",
          responsePreview: `// HTTP 409 Conflict
{
  "statusCode": 409,
  "timestamp": "2026-10-21T11:00:00.000Z",
  "path": "/api/linhas",
  "method": "POST",
  "message": "Linha com código 0.111 já está cadastrada no sistema."
}`,
        },
        {
          code: 422,
          phrase: 'Unprocessable Entity',
          category: '4xx',
          analogy:
            'Você preencheu o formulário de passaporte com letras legíveis e sem rasuras, mas colocou sua data de nascimento no futuro (ano 2045).',
          realWorldScenario:
            'O JSON está sintaticamente perfeito, mas viola uma regra de negócio de transporte da SEMOB (ex: linha circular com apenas 1 parada cadastrada).',
          howToTriggerNest:
            "throw new BusinessException('Uma linha circular exige no mínimo 3 pontos de parada.') no Service.",
          responsePreview: `// HTTP 422 Unprocessable Entity
{
  "statusCode": 422,
  "timestamp": "2026-10-21T11:00:00.000Z",
  "path": "/api/linhas/validar",
  "method": "POST",
  "message": "Regra de Negócio Violada: Uma linha circular exige no mínimo 3 pontos de parada."
}`,
        },
        {
          code: 500,
          phrase: 'Internal Server Error',
          category: '5xx',
          analogy:
            'A cozinha do restaurante pegou fogo ou faltou luz geral: não foi culpa do cliente, mas o atendimento foi interrompido.',
          realWorldScenario:
            'O container do PostgreSQL no Rancher Desktop caiu, houve falha de rede ou ocorreu um erro de JavaScript não tratado ("Cannot read properties of undefined").',
          howToTriggerNest:
            'Capturado pelo AllExceptionsFilter (src/filters/all-exceptions.filter.ts) para evitar expor dados sensíveis do servidor.',
          responsePreview: `// HTTP 500 Internal Server Error
{
  "statusCode": 500,
  "timestamp": "2026-10-21T11:00:00.000Z",
  "path": "/api/linhas",
  "method": "GET",
  "message": "Erro interno do servidor. Contate o administrador do SISMOB."
}`,
        },
      ],
      tables: [
        {
          headers: ['Código', 'Nome Oficial', 'Família', 'Quando Usar no SISMOB?', 'Como Disparar no NestJS?'],
          rows: [
            [
              '200 OK',
              'Sucesso Geral',
              '2xx',
              'Consultas GET bem-sucedidas ou atualizações que devolvem dados.',
              'Padrão do @Get() ou @Put()',
            ],
            [
              '201 Created',
              'Criado com Sucesso',
              '2xx',
              'Novos registros inseridos via POST (ex: nova linha cadastrada).',
              'Padrão do @Post() no NestJS',
            ],
            [
              '204 No Content',
              'Sem Conteúdo',
              '2xx',
              'Ações concluídas onde nada precisa ser retornado (ex: DELETE).',
              '@HttpCode(HttpStatus.NO_CONTENT)',
            ],
            [
              '400 Bad Request',
              'Requisição Inválida',
              '4xx',
              'O usuário enviou dados com tipos errados ou violou validações do DTO.',
              'Automático pelo ValidationPipe',
            ],
            [
              '401 Unauthorized',
              'Não Autenticado',
              '4xx',
              'Tentativa de acessar rota privada sem o cabeçalho Authorization: Bearer <token>.',
              'Disparado pelo JwtAuthGuard',
            ],
            [
              '403 Forbidden',
              'Proibido / Sem Acesso',
              '4xx',
              'Usuário está logado, mas seu perfil não tem permissão para esta rota específica.',
              'Disparado pelo RolesGuard',
            ],
            [
              '404 Not Found',
              'Não Encontrado',
              '4xx',
              'O código de linha, veículo ou usuário informado na URL não existe no banco.',
              "throw new EntityNotFoundException('Linha', codigo)",
            ],
            [
              '409 Conflict',
              'Conflito de Dados',
              '4xx',
              'Tentativa de cadastrar uma linha com cd_linha já existente (chave única).',
              "throw new EntityAlreadyExistsException('Linha', codigo)",
            ],
            [
              '422 Unprocessable',
              'Entidade Improcessável',
              '4xx',
              'O JSON está correto, mas viola uma regra de negócio semântica da SEMOB.',
              "throw new BusinessException('Mensagem')",
            ],
            [
              '500 Server Error',
              'Erro Interno',
              '5xx',
              'Falha de rede com o PostgreSQL, timeout ou bug no código.',
              'Capturado pelo AllExceptionsFilter',
            ],
          ],
        },
      ],
    },

    // ========================================================================
    // CAPÍTULO 5: O QUE É O SWAGGER E COMO TESTAR AS APIS DE LINHAS
    // ========================================================================
    {
      heading: '5. O que é o Swagger e Como Testar as APIs de Linhas na Prática',
      body: 'Antigamente, para testar uma API Back-end, você precisava instalar programas externos como Postman ou Insomnia e adivinhar quais parâmetros cada rota aceitava. O SISMOB-BOILERPLATE resolve isso com o Swagger (configurado em src/docs/Swagger.ts).',
      paragraphs: [
        'O Swagger lê automaticamente os decoradores (@ApiTags, @ApiOperation, @ApiProperty) que colocamos nos nossos Controllers e DTOs e gera uma página web interativa no endereço http://localhost:8097/api/docs.',
        'Como as rotas de Linhas são protegidas por login (@UseGuards(JwtAuthGuard)), se você tentar clicar em "Execute" direto na rota GET /api/linhas sem autenticar, você receberá o erro HTTP 401 Unauthorized que vimos no capítulo anterior! Veja no simulador interativo abaixo os 3 passos exatos para autenticar e consultar as linhas:',
      ],
      enableSwaggerSimulator: true,
      bullets: [
        'Passo 1 no Swagger real: Role até a seção "Auth", abra a rota POST /api/auth/login, clique em "Try it out" e depois em "Execute". Copie o texto gigante do access_token gerado.',
        'Passo 2 no Swagger real: Suba até o topo direito da página, clique no botão verde "Authorize 🔒", cole o token no campo Value e clique em "Authorize".',
        'Passo 3 no Swagger real: Agora vá na seção "Linhas", abra a rota GET /api/linhas, clique em "Try it out", digite 0.111 no campo codigo e clique em "Execute"!',
      ],
    },

    // ========================================================================
    // CAPÍTULO 6: TUTORIAL GUIADO — CRIANDO UMA NOVA API DE LINHAS DO ZERO
    // ========================================================================
    {
      heading: '6. Laboratório Guiado: Criando Novos Endpoints de Linhas Pensando na Tabela',
      body: 'Agora vamos colocar a mão na massa! Imagine que o seu supervisor pediu para você criar duas novas consultas na API de Linhas do SISMOB-BOILERPLATE: 1) Buscar uma linha específica pelo código exato (GET /api/linhas/:codigo) e 2) Listar linhas por teto de tarifa (GET /api/linhas?tarifaMaxima=5.50).',
      paragraphs: [
        'Como alguém que está começando deve pensar? Sempre comece olhando para a tabela do banco de dados (dados_mobilidade.tab_linha) e suba camada por camada até chegar na tela do Swagger. Navegue pelos 6 passos interativos abaixo para ver a construção comentada linha por linha:',
      ],
      guidedTutorialSteps: [
        {
          stepNumber: 1,
          title: 'Olhar a Tabela e a Entity',
          fileTarget: 'src/entity/Linha.ts',
          questionAnswered:
            'Quais colunas existem na tabela dados_mobilidade.tab_linha e como o TypeScript enxerga elas?',
          whyItMatters:
            'Antes de escrever qualquer código, olhamos para o banco. Na tabela dados_mobilidade.tab_linha, os nomes das colunas estão em snake_case (id_linha, cd_linha, tx_linha, vl_tarifa, sentido). A nossa classe Entity faz a ponte traduzindo esses nomes físicos para propriedades elegantes em TypeScript.',
          language: 'typescript',
          code: `import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'tab_linha', schema: 'dados_mobilidade' })
export class Linha {
  @PrimaryGeneratedColumn({ name: 'id_linha' })
  id: number;

  @Column({ name: 'cd_linha', length: 10 })
  codigo: string;

  @Column({ name: 'tx_linha', length: 255 })
  descricao: string;

  @Column({ name: 'vl_tarifa', type: 'numeric', precision: 10, scale: 2 })
  valorTarifa: number;

  @Column({ name: 'sentido', length: 20, nullable: true })
  sentido: string;
}`,
          lineByLineExplanations: [
            {
              lineHighlight: `@Entity({ name: 'tab_linha', schema: 'dados_mobilidade' })`,
              explanation:
                'Diz ao TypeORM que esta classe representa exatamente a tabela "tab_linha" que fica dentro do schema "dados_mobilidade" no PostgreSQL.',
            },
            {
              lineHighlight: `@PrimaryGeneratedColumn({ name: 'id_linha' })`,
              explanation:
                'Indica que a coluna "id_linha" é a Chave Primária (PK) auto-incrementada da tabela.',
            },
            {
              lineHighlight: `@Column({ name: 'cd_linha' }) codigo: string;`,
              explanation:
                'No banco a coluna se chama "cd_linha", mas no nosso código TypeScript e no JSON da API ela aparecerá com o nome "codigo".',
            },
          ],
        },
        {
          stepNumber: 2,
          title: 'Criar o Filtro no DTO',
          fileTarget: 'src/dto/Linha.ts',
          questionAnswered:
            'Quais parâmetros o usuário pode digitar no Swagger quando quiser filtrar linhas?',
          whyItMatters:
            'Se queremos permitir filtrar por código, descrição ou tarifa máxima na URL (?codigo=0.111&tarifaMaxima=5.50), precisamos declarar esses campos no FilterLinhaDto. O ValidationPipe vai barrar qualquer dado inválido automaticamente!',
          language: 'typescript',
          code: `import { IsString, IsOptional, MaxLength, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilterLinhaDto {
  @ApiPropertyOptional({
    description: 'Código exato da linha de ônibus',
    example: '0.111',
  })
  @IsOptional()
  @IsString({ message: 'O código deve ser um texto.' })
  @MaxLength(10)
  codigo?: string;

  @ApiPropertyOptional({
    description: 'Trecho do nome ou itinerário da linha',
    example: 'Rodoviária',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  descricao?: string;

  @ApiPropertyOptional({
    description: 'Valor máximo da tarifa em reais (ex: 5.50)',
    example: 5.5,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'A tarifa máxima deve ser um número válido.' })
  @Min(0, { message: 'A tarifa não pode ser negativa.' })
  tarifaMaxima?: number;
}`,
          lineByLineExplanations: [
            {
              lineHighlight: `@ApiPropertyOptional({ description: '...', example: '0.111' })`,
              explanation:
                'Faz o campo aparecer desenhado automaticamente lá na tela do Swagger com um exemplo pronto para o usuário testar!',
            },
            {
              lineHighlight: `@IsOptional()`,
              explanation:
                'Diz que o filtro não é obrigatório: se o usuário não preencher nada, a API listará todas as linhas.',
            },
            {
              lineHighlight: `@Type(() => Number) + @IsNumber() + @Min(0)`,
              explanation:
                'Na URL tudo chega como texto ("5.50"). O @Type converte para número e o @Min(0) garante que ninguém envie uma tarifa negativa.',
            },
          ],
        },
        {
          stepNumber: 3,
          title: 'Escrever o SQL no Repository',
          fileTarget: 'src/repository/Linha.ts',
          questionAnswered:
            'Como buscamos os dados na tabela tab_linha usando cláusula WHERE segura e parâmetros ($1, $2)?',
          whyItMatters:
            'Aqui está o coração da consulta! No Repository, escrevemos o SQL pensando nas colunas reais da tabela (cd_linha, tx_linha, vl_tarifa) e usamos apelidos (AS "codigo") para combinar com a nossa Entity. Repare como TODOS os filtros usam WHERE e placeholders ($1, $2).',
          language: 'typescript',
          code: `import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Linha } from '../entity/Linha';

@Injectable()
export class LinhaRepository extends Repository<Linha> {
  constructor(private dataSource: DataSource) {
    super(Linha, dataSource.createEntityManager());
  }

  async findByFilters(
    codigo?: string,
    descricao?: string,
    tarifaMaxima?: number,
  ): Promise<Linha[]> {
    let sql = \`
      SELECT 
        id_linha AS "id",
        cd_linha AS "codigo",
        tx_linha AS "descricao",
        vl_tarifa AS "valorTarifa",
        sentido AS "sentido"
      FROM dados_mobilidade.tab_linha
      WHERE 1=1
    \`;

    const params: unknown[] = [];

    if (codigo) {
      sql += \` AND cd_linha = $\${params.length + 1}\`;
      params.push(codigo);
    }

    if (descricao) {
      sql += \` AND tx_linha ILIKE $\${params.length + 1}\`;
      params.push(\`%\${descricao}%\`);
    }

    if (tarifaMaxima !== undefined) {
      sql += \` AND vl_tarifa <= $\${params.length + 1}\`;
      params.push(tarifaMaxima);
    }

    sql += \` ORDER BY cd_linha ASC\`;
    return this.dataSource.query(sql, params);
  }

  async findOneByCodigo(codigo: string): Promise<Linha | null> {
    const sql = \`
      SELECT 
        id_linha AS "id",
        cd_linha AS "codigo",
        tx_linha AS "descricao",
        vl_tarifa AS "valorTarifa",
        sentido AS "sentido"
      FROM dados_mobilidade.tab_linha
      WHERE cd_linha = $1
      LIMIT 1
    \`;
    const rows = await this.dataSource.query(sql, [codigo]);
    return rows.length > 0 ? rows[0] : null;
  }
}`,
          lineByLineExplanations: [
            {
              lineHighlight: `WHERE 1=1`,
              explanation:
                'Truque clássico e seguro de SQL dinâmico: como 1=1 é sempre verdadeiro, podemos adicionar quantos "AND ..." quisermos abaixo conforme os filtros que o usuário preencheu.',
            },
            {
              lineHighlight: `sql += \` AND cd_linha = $\${params.length + 1}\`; params.push(codigo);`,
              explanation:
                'Em vez de colar o texto do usuário na query (o que permitiria SQL Injection), geramos "$1", "$2" e colocamos o valor real dentro do array params.',
            },
            {
              lineHighlight: `WHERE cd_linha = $1 LIMIT 1`,
              explanation:
                'No método findOneByCodigo, buscamos exatamente a linha cujo cd_linha bate com o parâmetro $1.',
            },
          ],
        },
        {
          stepNumber: 4,
          title: 'Aplicar Regras no Service',
          fileTarget: 'src/service/Linha.ts',
          questionAnswered:
            'O que deve acontecer se o usuário buscar um código de linha que não existe (ex: 9.999)?',
          whyItMatters:
            'O Repository apenas devolve null quando não acha a linha no banco. Quem decide que "não achar a linha" deve virar um erro HTTP 404 amigável para o usuário é o Service, usando a nossa classe EntityNotFoundException!',
          language: 'typescript',
          code: `import { Injectable } from '@nestjs/common';
import { LinhaRepository } from '../repository/Linha';
import { FilterLinhaDto } from '../dto/Linha';
import { Linha } from '../entity/Linha';
import { EntityNotFoundException } from '../exceptions/entity-not-found.exception';

@Injectable()
export class LinhaService {
  constructor(private readonly linhaRepository: LinhaRepository) {}

  async listar(dto: FilterLinhaDto): Promise<Linha[]> {
    return this.linhaRepository.findByFilters(
      dto.codigo,
      dto.descricao,
      dto.tarifaMaxima,
    );
  }

  async buscarPorCodigo(codigo: string): Promise<Linha> {
    const linha = await this.linhaRepository.findOneByCodigo(codigo);

    if (!linha) {
      // Dispara automaticamente HTTP 404 formatado pelo AllExceptionsFilter!
      throw new EntityNotFoundException('Linha', codigo);
    }

    return linha;
  }
}`,
          lineByLineExplanations: [
            {
              lineHighlight: `constructor(private readonly linhaRepository: LinhaRepository)`,
              explanation:
                'Injeção de Dependência do NestJS: o Service pede o LinhaRepository pronto para uso sem precisar dar "new LinhaRepository()".',
            },
            {
              lineHighlight: `if (!linha) throw new EntityNotFoundException('Linha', codigo);`,
              explanation:
                'Se o banco retornou vazio, interrompemos o fluxo na hora e devolvemos status 404 com a mensagem padronizada da SEMOB.',
            },
          ],
        },
        {
          stepNumber: 5,
          title: 'Expor as Rotas no Controller',
          fileTarget: 'src/controller/Linha.ts',
          questionAnswered:
            'Como transformamos os métodos do Service em URLs reais visíveis no Swagger?',
          whyItMatters:
            'No Controller, conectamos o mundo HTTP (URLs, Query Params, Route Params e proteção JWT) com o nosso Service. Repare como o Controller é limpo: ele não tem nenhuma regra de negócio!',
          language: 'typescript',
          code: `import { Controller, Get, Query, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { LinhaService } from '../service/Linha';
import { FilterLinhaDto } from '../dto/Linha';
import { JwtAuthGuard } from '../guards/Jwt';

@ApiTags('Linhas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('linhas')
export class LinhaController {
  constructor(private readonly linhaService: LinhaService) {}

  @Get()
  @ApiOperation({ summary: 'Listar linhas de ônibus com filtros opcionais' })
  @ApiResponse({ status: 200, description: 'Lista de linhas retornada com sucesso.' })
  async listar(@Query() filters: FilterLinhaDto) {
    return this.linhaService.listar(filters);
  }

  @Get(':codigo')
  @ApiOperation({ summary: 'Buscar detalhes de uma linha específica pelo código (ex: 0.111)' })
  @ApiResponse({ status: 200, description: 'Linha encontrada.' })
  @ApiResponse({ status: 404, description: 'Linha não cadastrada na base.' })
  async buscarPorCodigo(@Param('codigo') codigo: string) {
    return this.linhaService.buscarPorCodigo(codigo);
  }
}`,
          lineByLineExplanations: [
            {
              lineHighlight: `@ApiBearerAuth() + @UseGuards(JwtAuthGuard)`,
              explanation:
                'Exige que o usuário esteja autenticado com o token JWT (cadeado Authorize aberto no Swagger) para acessar qualquer rota deste Controller.',
            },
            {
              lineHighlight: `@Get() async listar(@Query() filters: FilterLinhaDto)`,
              explanation:
                'Responde a GET /api/linhas lendo os filtros da Query String (?codigo=0.111&tarifaMaxima=5.50).',
            },
            {
              lineHighlight: `@Get(':codigo') async buscarPorCodigo(@Param('codigo') codigo: string)`,
              explanation:
                'Responde a GET /api/linhas/0.111 capturando o valor dinâmico ":codigo" direto da URL.',
            },
          ],
        },
        {
          stepNumber: 6,
          title: 'Conectar Tudo no Module',
          fileTarget: 'src/module/Linha.ts & src/app.module.ts',
          questionAnswered:
            'Como o NestJS descobre que o Controller, o Service e o Repository fazem parte do mesmo conjunto?',
          whyItMatters:
            'O último passo é garantir que as peças estão registradas no LinhaModule e que o LinhaModule está listado dentro do arquivo raiz src/app.module.ts. Sem isso, a rota não aparece no Swagger!',
          language: 'typescript',
          code: `// Em src/module/Linha.ts:
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Linha } from '../entity/Linha';
import { LinhaRepository } from '../repository/Linha';
import { LinhaService } from '../service/Linha';
import { LinhaController } from '../controller/Linha';

@Module({
  imports: [TypeOrmModule.forFeature([Linha])],
  controllers: [LinhaController],
  providers: [LinhaService, LinhaRepository],
  exports: [LinhaService],
})
export class LinhaModule {}`,
          lineByLineExplanations: [
            {
              lineHighlight: `imports: [TypeOrmModule.forFeature([Linha])]`,
              explanation:
                'Registra a entidade Linha (tabela dados_mobilidade.tab_linha) neste módulo.',
            },
            {
              lineHighlight: `controllers: [LinhaController]`,
              explanation:
                'Ativa todas as rotas HTTP (@Get, @Post) declaradas no LinhaController.',
            },
            {
              lineHighlight: `providers: [LinhaService, LinhaRepository]`,
              explanation:
                'Autoriza o motor de Injeção de Dependências do NestJS a instanciar o Service e o Repository automaticamente.',
            },
          ],
        },
      ],
    },
  ],
  checklist: [
    'Configurei o Rancher Desktop no modo dockerd (moby) e subi o banco com docker compose up -d',
    'Executei npm install e npm run start:dev confirmando a carga automática do Seed (tab_linha.sql)',
    'Explorei as pastas do SISMOB-BOILERPLATE compreendendo a separação Entity ➔ DTO ➔ Repository ➔ Service ➔ Controller',
    'Compreendi o significado de cada Status HTTP (200, 201, 400, 401, 403, 404, 409 e 500)',
    'Acessei o Swagger em http://localhost:8097/api/docs, gerei o token no POST /api/auth/login e ativei o botão Authorize',
    'Pratiquei a criação de novos endpoints de Linhas utilizando queries parametrizadas ($1, $2) com cláusula WHERE',
  ],
};
