import {
  Trilha,
  ConteudoBiblioteca,
  AlunoSupervisorView,
  ItemFilaEntrega,
  ItemFilaCertificado,
  Certificado,
  GlossarioItem,
  BrandConfig
} from '../types';

export const BRANDS: Record<string, BrandConfig> = {
  semob: {
    id: 'semob',
    nomeCompleto: 'Secretaria Municipal de Mobilidade Urbana',
    sigla: 'SEMOB',
    subtitulo: 'Plataforma Institucional de Formação e Biblioteca Técnica',
    corPrimariaHex: '#1d4ed8',
    corAcentoHex: '#d97706',
    suporteEmail: 'ti.suporte@semob.gov.br',
    termoUsoResumo: 'Ambiente oficial para formação de estagiários e documentação operacional da SEMOB.'
  },
  azimute: {
    id: 'azimute',
    nomeCompleto: 'Azimute Dev Academy',
    sigla: 'Azimute',
    subtitulo: 'Plataforma Aceleradora de Carreiras em Engenharia de Software',
    corPrimariaHex: '#059669',
    corAcentoHex: '#0284c7',
    suporteEmail: 'contato@azimutedev.io',
    termoUsoResumo: 'Plataforma white-label para capacitação acelerada de desenvolvedores de software.'
  },
  novagov: {
    id: 'novagov',
    nomeCompleto: 'NovaGov Instituto Tecnológico Público',
    sigla: 'NovaGov',
    subtitulo: 'Ambiente Integrado de Ensino Técnico e Inovação Governamental',
    corPrimariaHex: '#4f46e5',
    corAcentoHex: '#ea580c',
    suporteEmail: 'suporte@novagov.org.br',
    termoUsoResumo: 'Capacitação e trilhas padronizadas para órgãos públicos federais e estaduais.'
  }
};

export const GLOSSARIO_TERMOS: GlossarioItem[] = [
  {
    termo: 'SEI',
    significado: 'Sistema Eletrônico de Informações. Plataforma padrão do governo para tramitação oficial de processos administrativos e certificações.',
    categoria: 'Institucional'
  },
  {
    termo: 'SIT',
    significado: 'Sistema Integrado de Transporte. Ecossistema central da SEMOB que orquestra bilhetagem, telemetria de frotas e escalas de motoristas.',
    categoria: 'Institucional'
  },
  {
    termo: 'POP',
    significado: 'Procedimento Operacional Padrão. Manual com o passo a passo exato para executar tarefas técnicas críticas com segurança.',
    categoria: 'Processos'
  },
  {
    termo: 'NestJS',
    significado: 'Framework progressivo Node.js com TypeScript e arquitetura modular padrão MVC/Clean Architecture, utilizado nas APIs da SEMOB.',
    categoria: 'Desenvolvimento'
  },
  {
    termo: 'PostgreSQL',
    significado: 'Sistema gerenciador de banco de dados relacional robusto e de código aberto, adotado como fonte primária de verdade dos dados da SEMOB.',
    categoria: 'Desenvolvimento'
  },
  {
    termo: 'GitLab CI',
    significado: 'Ferramenta de Integração Contínua que executa testes automáticos e validações de segurança a cada push de código nos repositórios.',
    categoria: 'Desenvolvimento'
  },
  {
    termo: 'White-Label',
    significado: 'Software construído para que diferentes órgãos ou empresas usem sua própria marca, cores e logotipo sem alterar o código-fonte.',
    categoria: 'Desenvolvimento'
  }
];

export const TRILHA_DESENVOLVEDOR_SEMOB: Trilha = {
  id: 'trilha-dev-semob-2026',
  titulo: 'Formação Desenvolvedor Júnior SEMOB',
  sigla: 'DEV-SEMOB',
  descricao: 'Trilha obrigatória de integração e nivelamento técnico para novos estagiários e desenvolvedores júniores da Secretaria de Mobilidade. Do zero à produção nos sistemas do SIT.',
  publicoAlvo: 'Estagiários de Engenharia/TI e Desenvolvedores Júniores',
  cargaHorariaHoras: 120,
  area: 'desenvolvimento',
  obrigatoria: true,
  status: 'em_andamento',
  fase: 'MVP',
  dataInicio: '01/10/2026',
  dataConclusaoEstimada: '01/12/2026',
  etapas: [
    {
      id: 'etapa-01',
      trilhaId: 'trilha-dev-semob-2026',
      ordem: 1,
      titulo: 'Cultura, Diretrizes e Arquitetura dos Sistemas SEMOB',
      descricaoCurta: 'Visão geral da infraestrutura tecnológica de mobilidade urbana, microsserviços do SIT e boas práticas.',
      tipo: 'manual',
      obrigatoria: true,
      tempoEstimadoMinutos: 35,
      status: 'concluida',
      versao: 'v2.1',
      dataUltimaRevisao: '12/10/2026',
      blocosManual: [
        {
          id: 'b-1',
          tipo: 'texto',
          titulo: 'Bem-vindo à Engenharia de Tecnologia da SEMOB',
          conteudo: 'A Secretaria de Mobilidade Urbana gerencia uma malha complexa de transporte público que atende mais de 1,2 milhão de passageiros diariamente. Como desenvolvedor, seu código terá impacto direto no tempo de deslocamento das pessoas, na pontualidade das viagens e na transparência pública dos dados municipais.'
        },
        {
          id: 'b-2',
          tipo: 'destaque',
          tipoDestaque: 'info',
          titulo: 'A Regra de Ouro da Confiabilidade',
          conteudo: 'Todos os microsserviços da SEMOB operam em regime 24/7. Erros em APIs de bilhetagem ou de rastreamento por GPS causam filas nos terminais. Por isso, nunca suba código para o branch principal sem cobertura de testes e homologação prévia.'
        },
        {
          id: 'b-3',
          tipo: 'cenario',
          titulo: 'Cenário Real: O Ponto de Integração do Corredor Central',
          conteudo: 'Às 07:30 da manhã, o terminal Central recebe 3.400 requisições por segundo consultando a previsão de chegada de ônibus. Nossas APIs usam cache em memória (Redis) com invalidação orientada a eventos para manter a latência abaixo de 45 milissegundos.'
        },
        {
          id: 'b-4',
          tipo: 'tabela',
          titulo: 'Mapeamento dos Principais Serviços do SIT',
          dadosTabela: {
            cabecalhos: ['Serviço', 'Tecnologia Principal', 'Função Central', 'Nível Crítico'],
            linhas: [
              ['sit-bilhetagem', 'NestJS / PostgreSQL', 'Processa validação de cartões e gratuidades', 'Crítico (SLA 99.9%)'],
              ['sit-telemetria', 'Go / TimescaleDB', 'Ingere coordenadas GPS de 1.800 veículos a cada 15s', 'Crítico (SLA 99.5%)'],
              ['sit-portal-cidadao', 'React / Tailwind', 'Página pública de itinerários e linhas municipais', 'Normal (SLA 99.0%)'],
              ['sit-relatorios-sei', 'Node.js / Worker', 'Gera demonstrativos oficiais de subsídio e processos', 'Normal (SLA 99.0%)']
            ]
          }
        },
        {
          id: 'b-5',
          tipo: 'cartao_comando',
          titulo: 'Acesso ao Repositório Interno',
          comando: 'ssh -T git@gitlab.semob.gov.br',
          explicacao: 'Use sua chave SSH institucional cadastrada no primeiro dia para autenticar sem necessidade de digitar senha repetidamente.'
        }
      ]
    },
    {
      id: 'etapa-02',
      trilhaId: 'trilha-dev-semob-2026',
      ordem: 2,
      titulo: 'Git e Fluxo de Ramificação no GitLab Institucional',
      descricaoCurta: 'Padrão de commits, criação de merge requests e fluxo de aprovação de código com revisores.',
      tipo: 'manual',
      obrigatoria: true,
      tempoEstimadoMinutos: 40,
      status: 'concluida',
      versao: 'v3.0',
      dataUltimaRevisao: '14/10/2026',
      blocosManual: [
        {
          id: 'b-6',
          tipo: 'texto',
          titulo: 'O Padrão Git SEMOB',
          conteudo: 'Trabalhamos com o modelo Trunk-Based simplificado. Ninguém faz commit direto na branch main. Cada melhoria ou correção parte de um issue oficial do GitLab ou chamado interno.'
        },
        {
          id: 'b-7',
          tipo: 'cartao_comando',
          titulo: 'Criando sua ramificação de trabalho',
          comando: 'git checkout -b feature/SIT-482-consulta-itinerario-terminal',
          explicacao: 'Sempre prefixe sua ramificação com o tipo (feature/, bugfix/, hotfix/) seguido pelo identificador do chamado.'
        },
        {
          id: 'b-8',
          tipo: 'destaque',
          tipoDestaque: 'dica',
          titulo: 'Convenção de Mensagens de Commit',
          conteudo: 'Escreva commits no padrão Conventional Commits em português: feat(api): adiciona rota de contagem de passageiros por linha ou fix(sql): corrige indice de busca por placa.'
        }
      ]
    },
    {
      id: 'etapa-03',
      trilhaId: 'trilha-dev-semob-2026',
      ordem: 3,
      titulo: 'PostgreSQL & Modelagem de Dados de Transporte',
      descricaoCurta: 'Entenda os esquemas das tabelas de linhas de ônibus, viagens diárias, paradas e indicadores operacionais.',
      tipo: 'manual',
      obrigatoria: true,
      tempoEstimadoMinutos: 45,
      status: 'concluida',
      versao: 'v1.4',
      dataUltimaRevisao: '15/10/2026',
      blocosManual: [
        {
          id: 'b-9',
          tipo: 'texto',
          titulo: 'Estrutura Relacional da Frota e Viagens',
          conteudo: 'Os dados operacionais de transporte estão organizados em esquemas bem definidos. A tabela `linhas_onibus` armazena os itinerários e tarifas; a tabela `viagens_diarias` registra cada percurso realizado pelos ônibus com horários planejados e horários reais.'
        },
        {
          id: 'b-10',
          tipo: 'codigo',
          titulo: 'Consulta de Exemplo: Atraso Médio por Linha',
          linguagem: 'sql',
          codigo: `-- Média de atraso em minutos por linha de ônibus no horário de pico
SELECT 
  l.codigo_linha,
  l.nome_linha,
  ROUND(AVG(v.minutos_atraso), 1) AS media_atraso_minutos,
  COUNT(v.id) AS total_viagens
FROM linhas_onibus l
JOIN viagens_diarias v ON v.linha_id = l.id
WHERE v.data_viagem = CURRENT_DATE
GROUP BY l.codigo_linha, l.nome_linha
HAVING AVG(v.minutos_atraso) > 5.0
ORDER BY media_atraso_minutos DESC;`
        }
      ]
    },
    {
      id: 'etapa-04',
      trilhaId: 'trilha-dev-semob-2026',
      ordem: 4,
      titulo: 'Desafio Prático SQL: Atrasos Críticos no Corredor Norte',
      descricaoCurta: 'Escreva uma consulta SQL para extrair linhas com atraso superior a 10 minutos para o painel de operações.',
      tipo: 'desafio_sql',
      obrigatoria: true,
      tempoEstimadoMinutos: 50,
      status: 'em_andamento',
      versao: 'v2.0',
      dataUltimaRevisao: '16/10/2026',
      desafioSQL: {
        id: 'desafio-sql-01',
        titulo: 'Relatório de Viagens com Atraso Crítico',
        contextoOrganizacional: 'O Centro de Controle Operacional (CCO) da SEMOB precisa identificar quais linhas do "Corredor Norte" tiveram viagens com atraso maior ou igual a 12 minutos na data de hoje, para acionar a empresa concessionária.',
        enunciado: 'Escreva uma consulta SQL que retorne o código da linha (codigo_linha), o nome da linha (nome_linha), a quantidade de viagens em atraso (viagens_atrasadas) e o maior atraso registrado em minutos (maior_atraso). Filtre apenas viagens com status "atrasada" e atraso >= 12 minutos. Ordene pelo maior_atraso decrescente.',
        tabelas: [
          {
            nome: 'linhas_onibus',
            descricao: 'Catálogo oficial de linhas do transporte coletivo municipal.',
            colunas: [
              { nome: 'id', tipo: 'INTEGER', descricao: 'Identificador único da linha', chavePrimaria: true },
              { nome: 'codigo_linha', tipo: 'VARCHAR(10)', descricao: 'Código exibido no letreiro (ex: 104, 302, 510)' },
              { nome: 'nome_linha', tipo: 'VARCHAR(100)', descricao: 'Nome e destino da linha' },
              { nome: 'corredor', tipo: 'VARCHAR(50)', descricao: 'Corredor viário (ex: Corredor Norte, Sul, Leste)' },
              { nome: 'tarifa_vigente', tipo: 'NUMERIC(4,2)', descricao: 'Valor atual da tarifa' }
            ],
            linhasExemplo: [
              { id: 1, codigo_linha: '104', nome_linha: 'Terminal Norte / Praça Cívica', corredor: 'Corredor Norte', tarifa_vigente: 4.80 },
              { id: 2, codigo_linha: '108', nome_linha: 'Terminal Norte / Hospital Geral', corredor: 'Corredor Norte', tarifa_vigente: 4.80 },
              { id: 3, codigo_linha: '201', nome_linha: 'Terminal Sul / Centro Histórico', corredor: 'Corredor Sul', tarifa_vigente: 4.80 },
              { id: 4, codigo_linha: '305', nome_linha: 'Circular Universitário Expresso', corredor: 'Corredor Norte', tarifa_vigente: 4.80 }
            ]
          },
          {
            nome: 'viagens_diarias',
            descricao: 'Registro das viagens monitoradas pelo CCO via GPS embarcado.',
            colunas: [
              { nome: 'id', tipo: 'INTEGER', descricao: 'Identificador da viagem', chavePrimaria: true },
              { nome: 'linha_id', tipo: 'INTEGER', descricao: 'Chave estrangeira apontando para linhas_onibus', chaveEstrangeira: 'linhas_onibus.id' },
              { nome: 'prefixo_veiculo', tipo: 'VARCHAR(10)', descricao: 'Prefixo do ônibus (ex: 20412)' },
              { nome: 'horario_previsto', tipo: 'TIME', descricao: 'Horário agendado para início' },
              { nome: 'minutos_atraso', tipo: 'INTEGER', descricao: 'Atraso apurado em minutos' },
              { nome: 'status', tipo: 'VARCHAR(20)', descricao: 'no_horario, toleravel ou atrasada' }
            ],
            linhasExemplo: [
              { id: 101, linha_id: 1, prefixo_veiculo: '20412', horario_previsto: '07:15', minutos_atraso: 18, status: 'atrasada' },
              { id: 102, linha_id: 1, prefixo_veiculo: '20414', horario_previsto: '07:45', minutos_atraso: 14, status: 'atrasada' },
              { id: 103, linha_id: 2, prefixo_veiculo: '10805', horario_previsto: '08:00', minutos_atraso: 22, status: 'atrasada' },
              { id: 104, linha_id: 2, prefixo_veiculo: '10806', horario_previsto: '08:30', minutos_atraso: 6, status: 'toleravel' },
              { id: 105, linha_id: 3, prefixo_veiculo: '30201', horario_previsto: '07:30', minutos_atraso: 15, status: 'atrasada' },
              { id: 106, linha_id: 4, prefixo_veiculo: '40510', horario_previsto: '07:50', minutos_atraso: 16, status: 'atrasada' }
            ]
          }
        ],
        consultaInicial: `SELECT 
  l.codigo_linha,
  l.nome_linha,
  COUNT(v.id) AS viagens_atrasadas,
  MAX(v.minutos_atraso) AS maior_atraso
FROM linhas_onibus l
JOIN viagens_diarias v ON v.linha_id = l.id
-- Complete os filtros pedidos no enunciado
GROUP BY l.codigo_linha, l.nome_linha;`,
        consultaEsperada: `SELECT 
  l.codigo_linha,
  l.nome_linha,
  COUNT(v.id) AS viagens_atrasadas,
  MAX(v.minutos_atraso) AS maior_atraso
FROM linhas_onibus l
JOIN viagens_diarias v ON v.linha_id = l.id
WHERE v.minutos_atraso >= 12
  AND v.status = 'atrasada'
  AND l.corredor = 'Corredor Norte'
GROUP BY l.codigo_linha, l.nome_linha
ORDER BY maior_atraso DESC;`,
        criteriosSucesso: [
          'Faz a junção (JOIN) correta entre linhas_onibus e viagens_diarias',
          'Filtra viagens do "Corredor Norte"',
          'Filtra apenas minutos_atraso >= 12 e status = \'atrasada\'',
          'Agrupa por codigo_linha e nome_linha',
          'Ordena por maior_atraso em ordem decrescente (DESC)'
        ],
        dicas: [
          'Dica 1: Utilize `JOIN viagens_diarias v ON v.linha_id = l.id` para conectar as tabelas pelo identificador da linha.',
          'Dica 2: Na cláusula `WHERE`, adicione as três condições com `AND`: `l.corredor = \'Corredor Norte\' AND v.minutos_atraso >= 12 AND v.status = \'atrasada\'`.',
          'Dica 3: Ao final, utilize `ORDER BY maior_atraso DESC` para que a linha com o maior atraso apareça primeiro.'
        ],
        resultadoEsperado: [
          { codigo_linha: '108', nome_linha: 'Terminal Norte / Hospital Geral', viagens_atrasadas: 1, maior_atraso: 22 },
          { codigo_linha: '104', nome_linha: 'Terminal Norte / Praça Cívica', viagens_atrasadas: 2, maior_atraso: 18 },
          { codigo_linha: '305', nome_linha: 'Circular Universitário Expresso', viagens_atrasadas: 1, maior_atraso: 16 }
        ]
      }
    },
    {
      id: 'etapa-05',
      trilhaId: 'trilha-dev-semob-2026',
      ordem: 5,
      titulo: 'Quiz de Avaliação: Banco de Dados e Modelagem SEMOB',
      descricaoCurta: 'Teste seus conhecimentos sobre integridade referencial, consultas com agregação e índices.',
      tipo: 'quiz',
      obrigatoria: true,
      tempoEstimadoMinutos: 25,
      status: 'disponivel',
      versao: 'v1.2',
      dataUltimaRevisao: '17/10/2026',
      quiz: {
        id: 'quiz-01',
        titulo: 'Avaliação de Banco de Dados Relacional',
        instrucoes: 'Responda com atenção. Cada alternativa possui explicação técnica detalhada após a confirmação. Nota mínima para aprovação: 70%. Tentativas ilimitadas.',
        notaMinima: 70,
        perguntas: [
          {
            id: 'q-1',
            enunciado: 'Por que a tabela de telemetria de GPS utiliza chave estrangeira referenciando o identificador do veículo (veiculo_id) com restrição referencial?',
            conceitoChave: 'Integridade Referencial',
            alternativas: [
              {
                id: 'alt-1a',
                texto: 'Apenas para permitir que o banco execute consultas sem necessidade de cláusulas WHERE.',
                explicacao: 'Incorreto. A cláusula WHERE continua necessária para filtrar registros; a chave estrangeira trata de integridade e relacionamento, não de sintaxe de busca.'
              },
              {
                id: 'alt-1b',
                texto: 'Para garantir que nenhuma coordenada geográfica seja atribuída a um ônibus inexistente ou excluído no cadastro do SIT.',
                explicacao: 'Correto! A chave estrangeira com integridade referencial impede coordenadas órfãs e inconsistência cadastral na malha de transporte.'
              },
              {
                id: 'alt-1c',
                texto: 'Para criptografar as coordenadas geográficas contra vazamento externo de dados conforme a LGPD.',
                explicacao: 'Incorreto. Criptografia é implementada por funções criptográficas ou na camada de repouso (TDE), não por restrições de foreign key.'
              },
              {
                id: 'alt-1d',
                texto: 'Para duplicar os dados automaticamente em caso de falha do servidor da nuvem.',
                explicacao: 'Incorreto. A redundância e replicação são gerenciadas pela infraestrutura de cluster (WAL replication), não pela definição de chaves relacionais.'
              }
            ],
            alternativaCorretaId: 'alt-1b'
          },
          {
            id: 'q-2',
            enunciado: 'Qual a diferença fundamental entre as cláusulas WHERE e HAVING em uma consulta SQL com agregações (como SUM, COUNT ou AVG)?',
            conceitoChave: 'Filtragem vs Agregação',
            alternativas: [
              {
                id: 'alt-2a',
                texto: 'WHERE filtra linhas individuais antes do agrupamento; HAVING filtra grupos após o cálculo das funções agregadas.',
                explicacao: 'Correto! Essa é a regra essencial: condições sobre campos pontuais ficam no WHERE, enquanto condições sobre o resultado de agregados (ex: AVG(atraso) > 10) ficam no HAVING.'
              },
              {
                id: 'alt-2b',
                texto: 'Não há diferença técnica, HAVING é apenas uma sintaxe alternativa criada para bancos de dados mais antigos.',
                explicacao: 'Incorreto. Ambas existem no padrão ANSI SQL e cumprem etapas diferentes no plano de execução do banco relacional.'
              },
              {
                id: 'alt-2c',
                texto: 'WHERE só pode ser utilizado com números, enquanto HAVING só pode ser utilizado com textos e datas.',
                explicacao: 'Incorreto. Ambos os filtros operam com qualquer tipo primitivo compatível do PostgreSQL.'
              },
              {
                id: 'alt-2d',
                texto: 'HAVING ordena o resultado final, enquanto WHERE apenas seleciona colunas.',
                explicacao: 'Incorreto. Quem ordena o resultado é a cláusula ORDER BY.'
              }
            ],
            alternativaCorretaId: 'alt-2a'
          },
          {
            id: 'q-3',
            enunciado: 'Em um sistema com alto volume de leituras nos horários de pico, qual a função de um índice B-Tree na coluna `data_viagem` da tabela `viagens_diarias`?',
            conceitoChave: 'Indexação e Performance',
            alternativas: [
              {
                id: 'alt-3a',
                texto: 'Acelerar drasticamente as buscas por intervalo de datas, reduzindo o tempo de varredura sequencial (Sequential Scan) da tabela inteira.',
                explicacao: 'Correto! Sem índice, o banco precisaria ler milhões de linhas disco a disco. Com o índice B-Tree, o custo de busca cai para O(log N).'
              },
              {
                id: 'alt-3b',
                texto: 'Garantir que não possam existir duas viagens na mesma data em hipótese alguma.',
                explicacao: 'Incorreto. Isso seria atribuição de uma restrição de unicidade (UNIQUE CONSTRAINT), não de um índice B-tree comum.'
              },
              {
                id: 'alt-3c',
                texto: 'Compactar o tamanho do banco de dados eliminando backups antigos automaticamente.',
                explicacao: 'Incorreto. Pelo contrário: índices consomem espaço adicional em disco para manter a estrutura de busca.'
              },
              {
                id: 'alt-3d',
                texto: 'Substituir a necessidade de utilizar o framework NestJS na camada de aplicação.',
                explicacao: 'Incorreto. O índice é um recurso interno do banco de dados e não substitui camadas de back-end.'
              }
            ],
            alternativaCorretaId: 'alt-3a'
          }
        ]
      }
    },
    {
      id: 'etapa-06',
      trilhaId: 'trilha-dev-semob-2026',
      ordem: 6,
      titulo: 'Desenvolvimento Back-end com NestJS e Clean Architecture',
      descricaoCurta: 'Padrão de controllers, services, injeção de dependência e DTOs com validação no NestJS.',
      tipo: 'manual',
      obrigatoria: true,
      tempoEstimadoMinutos: 45,
      status: 'disponivel',
      versao: 'v1.1',
      dataUltimaRevisao: '18/10/2026',
      blocosManual: [
        {
          id: 'b-11',
          tipo: 'texto',
          titulo: 'Arquitetura Modular das APIs da SEMOB',
          conteudo: 'Adotamos NestJS por sua estrutura opinativa que evita "código espaguete". Todo módulo expõe Controller (camada HTTP), Service (regras de negócio de transporte) e Repository (acesso ao banco).'
        },
        {
          id: 'b-12',
          tipo: 'codigo',
          titulo: 'Exemplo de Controller com Decorators e DTO',
          linguagem: 'typescript',
          codigo: `@Controller('linhas')
export class LinhasController {
  constructor(private readonly linhasService: LinhasService) {}

  @Get(':codigo/itinerario')
  async obterItinerario(@Param('codigo') codigo: string): Promise<ItinerarioDTO> {
    return this.linhasService.buscarPorCodigo(codigo);
  }
}`
        }
      ]
    },
    {
      id: 'etapa-07',
      trilhaId: 'trilha-dev-semob-2026',
      ordem: 7,
      titulo: 'Entrega de Código GitLab: Microsserviço de Consulta de Linhas',
      descricaoCurta: 'Implementação de endpoint REST com NestJS e PostgreSQL. Envie o link do seu Merge Request para validação do supervisor.',
      tipo: 'entrega_codigo',
      obrigatoria: true,
      tempoEstimadoMinutos: 90,
      status: 'disponivel',
      versao: 'v2.0',
      dataUltimaRevisao: '18/10/2026',
      entregaCodigo: {
        id: 'entrega-01',
        titulo: 'Endpoint de Consulta de Linhas e Atrasos',
        descricao: 'Você deve implementar o endpoint GET /api/v1/linhas/atrasos-corredor no repositório fornecido no modelo. O endpoint deve retornar os dados filtrados com testes unitários em Jest cobrindo 80% do Service.',
        criteriosAceite: [
          'Repositório no GitLab da SEMOB com ramificação feature/SIT-atrasos devidamente atualizada.',
          'Pipeline do GitLab CI executando com sucesso (testes unitários verdes).',
          'README.md com instruções claras de execução com Docker Compose.',
          'Código em TypeScript sem uso de `any` explícito e com tipagem estrita.',
          'Validação dos parâmetros com DTOs e class-validator.'
        ],
        repositorioExemploUrl: 'https://gitlab.semob.gov.br/dev-estagio/sit-linhas-api',
        urlRepositorioEnviada: 'https://gitlab.semob.gov.br/estagiarios/lucas-mendes/sit-linhas-api',
        status: 'em_revisao',
        dataEnvio: '18/10/2026 14:32',
        historicoComentarios: [
          {
            id: 'com-1',
            autorNome: 'Carlos Silveira',
            autorCargo: 'Supervisor Técnico SEMOB',
            dataHora: '19/10/2026 09:15',
            statusDecisao: 'precisa_de_correcao',
            comentario: 'Lucas, bom trabalho na estrutura do Controller! No entanto, faltou incluir o teste unitário para o caso em que o corredor não é encontrado (lançando NotFoundException). Ajuste o teste e reenvie para homologação.'
          },
          {
            id: 'com-2',
            autorNome: 'Lucas Mendes',
            autorCargo: 'Estagiário de Desenvolvimento',
            dataHora: '19/10/2026 11:40',
            statusDecisao: 'enviada',
            comentario: 'Ajustado! Adicionei o teste de NotFoundException no arquivo linhas.service.spec.ts e o coverage do Jest subiu para 86%. Pipeline já passou.'
          }
        ]
      }
    },
    {
      id: 'etapa-08',
      trilhaId: 'trilha-dev-semob-2026',
      ordem: 8,
      titulo: 'Projeto Integrador: Painel de Monitoramento de Frotas',
      descricaoCurta: 'Integração completa front-end React com a API NestJS e exibição no painel de controle operacional.',
      tipo: 'projeto',
      obrigatoria: true,
      tempoEstimadoMinutos: 120,
      status: 'bloqueada',
      versao: 'v1.0',
      dataUltimaRevisao: '19/10/2026',
      entregaCodigo: {
        id: 'entrega-02',
        titulo: 'Dashboard Operacional com Atualização em Tempo Real',
        descricao: 'Construa a tela de acompanhamento com lista de veículos por corredor, indicador visual de atraso e filtros acessíveis por teclado e mobile.',
        criteriosAceite: [
          'Design responsivo funcionando perfeitamente em telas de 360px até 1440px.',
          'Contraste conforme WCAG 2.1 AA em todos os estados de componentes.',
          'Integração com o backend via camada de serviço tipada.',
          'Tratamento completo de estados de carregamento (Skeleton), erro e vazio.'
        ],
        status: 'rascunho',
        historicoComentarios: []
      }
    }
  ]
};

export const TRILHA_SECRETARIA_FUTURO: Trilha = {
  id: 'trilha-sec-2027',
  titulo: 'Rotinas Administrativas e Processos SEI na Gestão de Trânsito',
  sigla: 'SEC-SEI',
  descricao: 'Formação para servidores e assessores: autuação de processos no SEI, gestão de protocolos de multas, atendimento ao cidadão e tramitação de POPs.',
  publicoAlvo: 'Servidores públicos e assessores administrativos da SEMOB',
  cargaHorariaHoras: 60,
  area: 'secretaria',
  obrigatoria: false,
  status: 'fase_futura',
  fase: 'FASE 2',
  etapas: []
};

export const BIBLIOTECA_CONTEUDOS: ConteudoBiblioteca[] = [
  {
    id: 'bib-01',
    titulo: 'Guia de Convenção Git e Versionamento SEMOB',
    resumo: 'Regras oficiais de nomenclatura de branches, mensagens de commit semântico e processo de code review obrigatório.',
    categoria: 'manual',
    area: 'Engenharia de Software',
    tags: ['Git', 'GitLab', 'Boas Práticas', 'Code Review'],
    escopo: 'institucional',
    tempoLeituraMinutos: 15,
    versao: 'v2.3',
    dataRevisao: '10/10/2026',
    conteudoBlocos: [
      {
        id: 'bb-1',
        tipo: 'texto',
        titulo: 'Padronização Obrigatória de Ramificações',
        conteudo: 'Toda alteração deve ser rastreável a um número de processo ou tarefa no quadro Kanban institucional. Ramificações sem número do chamado serão rejeitadas pelo hook de pré-recebimento do GitLab.'
      },
      {
        id: 'bb-2',
        tipo: 'cartao_comando',
        titulo: 'Exemplo de Comando de Push com Rastreabilidade',
        comando: 'git push origin feature/SIT-910-correcao-layout-aluno',
        explicacao: 'Nunca utilize force push (--force) nas branches compartilhadas de staging ou homologação.'
      }
    ]
  },
  {
    id: 'bib-02',
    titulo: 'POP-TI-014: Procedimento de Deploy em Ambiente de Homologação',
    resumo: 'Passo a passo operacional para publicação e verificação de novas versões de APIs e front-ends nos servidores municipais.',
    categoria: 'pop',
    area: 'Infraestrutura e DevOps',
    tags: ['POP', 'Deploy', 'Docker', 'Staging', 'Segurança'],
    escopo: 'institucional',
    tempoLeituraMinutos: 20,
    versao: 'v4.0',
    dataRevisao: '14/10/2026',
    conteudoBlocos: [
      {
        id: 'bb-3',
        tipo: 'destaque',
        tipoDestaque: 'atencao',
        titulo: 'Janela de Aplicação de Homologação',
        conteudo: 'Deploys em homologação devem ser agendados entre as 09:00 e 17:00, mediante notificação no canal corporativo #deploys-sit.'
      },
      {
        id: 'bb-4',
        tipo: 'cartao_comando',
        titulo: 'Disparo do Pipeline Automatizado',
        comando: 'gitlab-ci trigger --env=homolog --service=sit-backend',
        explicacao: 'Dispara a suíte de testes de regressão antes do reinício dos containers em ambiente de validação.'
      }
    ]
  },
  {
    id: 'bib-03',
    titulo: 'Dicionário de Dados do Sistema de Bilhetagem (SIT-Card)',
    resumo: 'Mapeamento detalhado de tabelas, tipos de dados, chaves estrangeiras e índices do validador de cartões de passagem.',
    categoria: 'modelo',
    area: 'Banco de Dados',
    tags: ['PostgreSQL', 'Modelagem', 'Bilhetagem', 'SIT'],
    escopo: 'institucional',
    tempoLeituraMinutos: 30,
    versao: 'v1.8',
    dataRevisao: '02/10/2026',
    conteudoBlocos: [
      {
        id: 'bb-5',
        tipo: 'tabela',
        titulo: 'Tabelas Centrais do Validador',
        dadosTabela: {
          cabecalhos: ['Tabela', 'Descrição Primária', 'Volumetria Mensal', 'Período de Retenção'],
          linhas: [
            ['cartao_passageiro', 'Cadastro de chips e identificador de benefícios', '850.000 registros', 'Permanente'],
            ['transacao_validador', 'Batidas de cartão registradas nas catracas', '35.000.000 registros', '5 anos (conforme lei municipal)'],
            ['recarregamento_saldo', 'Operações financeiras via Pix e postos autorizados', '1.200.000 registros', '10 anos (fiscal)']
          ]
        }
      }
    ]
  },
  {
    id: 'bib-04',
    titulo: 'A Evolução dos Sistemas de Ônibus: Da Ficha de Papel ao GPS',
    resumo: 'Curiosidades históricas e técnicas sobre como a gestão de mobilidade urbana da cidade se transformou nas últimas décadas.',
    categoria: 'curiosidade',
    area: 'História & Mobilidade',
    tags: ['Curiosidades', 'História', 'Mobilidade Urbana', 'Cultura'],
    escopo: 'geral',
    tempoLeituraMinutos: 10,
    versao: 'v1.0',
    dataRevisao: '01/09/2026',
    conteudoBlocos: [
      {
        id: 'bb-6',
        tipo: 'texto',
        titulo: 'Você sabia?',
        conteudo: 'Até o ano de 1998, as linhas de ônibus municipais eram controladas por fiscais com pranchetas de papel posicionados nas esquinas principais. Hoje, mais de 1.800 veículos transmitem coordenadas telemétricas criptografadas a cada 15 segundos diretamente para a nuvem da SEMOB.'
      }
    ]
  }
];

export const CERTIFICADO_EXEMPLO: Certificado = {
  id: 'cert-2026-0089',
  codigoValidacao: 'SEMOB-2026-X89J-4712',
  trilhaId: 'trilha-dev-semob-2026',
  trilhaTitulo: 'Formação Desenvolvedor Júnior SEMOB',
  alunoId: 'aluno-01',
  alunoNome: 'Lucas Mendes Ferreira',
  alunoCpfMascarado: '***.482.918-**',
  cargaHoraria: 120,
  processoSei: '00084-00012345/2026-19',
  dataEmissao: '19/10/2026',
  dataConclusaoTrilha: '18/10/2026',
  status: 'emitido',
  ementa: [
    'Módulo 1: Arquitetura de Microsserviços e Governança Tecnológica SEMOB',
    'Módulo 2: Git Avançado, Conventional Commits e Fluxo de Merge Requests no GitLab',
    'Módulo 3: Modelagem Relacional PostgreSQL, Otimização de Consultas e Índices B-Tree',
    'Módulo 4: Avaliação Prática em SQL com Execução Real em Dados Operacionais de Transporte',
    'Módulo 5: Desenvolvimento de APIs REST com NestJS, Injeção de Dependências e DTOs',
    'Módulo 6: Validação de Código com Testes Unitários em Jest e Integração Contínua (CI)',
    'Módulo 7: Projeto Prático Aplicado: Painel de Monitoramento de Frotas e Atrasos'
  ],
  assinaturaSubsecretario: {
    nome: 'Dr. Roberto Magalhães Vieira',
    cargo: 'Subsecretário de Tecnologia da Informação e Inovação',
    orgao: 'Secretaria Municipal de Mobilidade Urbana'
  },
  assinaturaSupervisor: {
    nome: 'Carlos Eduardo Silveira',
    cargo: 'Supervisor e Orientador de Estágio Técnico',
    orgao: 'Gerência de Engenharia de Software da SEMOB'
  }
};

export const ALUNOS_SUPERVISOR_MOCK: AlunoSupervisorView[] = [
  {
    id: 'aluno-01',
    nome: 'Lucas Mendes Ferreira',
    email: 'lucas.mendes@estagio.semob.gov.br',
    area: 'Engenharia de Software (SIT)',
    trilhaNome: 'Formação Desenvolvedor Júnior SEMOB',
    etapasConcluidas: 7,
    totalEtapas: 8,
    ultimoAcesso: 'Hoje às 15:20',
    situacao: 'aguardando_revisao',
    mediaQuiz: 92,
    entregasPendentes: 1
  },
  {
    id: 'aluno-02',
    nome: 'Beatriz Vasconcelos Lima',
    email: 'beatriz.lima@estagio.semob.gov.br',
    area: 'Ciência de Dados de Trânsito',
    trilhaNome: 'Formação Desenvolvedor Júnior SEMOB',
    etapasConcluidas: 8,
    totalEtapas: 8,
    ultimoAcesso: 'Ontem às 18:40',
    situacao: 'concluido',
    mediaQuiz: 96,
    entregasPendentes: 0
  },
  {
    id: 'aluno-03',
    nome: 'Gabriel Pires Albuquerque',
    email: 'gabriel.albuquerque@estagio.semob.gov.br',
    area: 'Infraestrutura e Redes',
    trilhaNome: 'Formação Desenvolvedor Júnior SEMOB',
    etapasConcluidas: 3,
    totalEtapas: 8,
    ultimoAcesso: 'Há 3 dias',
    situacao: 'atencao',
    mediaQuiz: 72,
    entregasPendentes: 0
  },
  {
    id: 'aluno-04',
    nome: 'Mariana Duarte Souza',
    email: 'mariana.souza@estagio.semob.gov.br',
    area: 'Engenharia de Software (SIT)',
    trilhaNome: 'Formação Desenvolvedor Júnior SEMOB',
    etapasConcluidas: 5,
    totalEtapas: 8,
    ultimoAcesso: 'Hoje às 11:15',
    situacao: 'em_dia',
    mediaQuiz: 88,
    entregasPendentes: 0
  }
];

export const FILA_ENTREGAS_MOCK: ItemFilaEntrega[] = [
  {
    id: 'fila-ent-01',
    alunoId: 'aluno-01',
    alunoNome: 'Lucas Mendes Ferreira',
    alunoEmail: 'lucas.mendes@estagio.semob.gov.br',
    trilhaId: 'trilha-dev-semob-2026',
    trilhaNome: 'Formação Desenvolvedor Júnior SEMOB',
    etapaId: 'etapa-07',
    etapaTitulo: 'Microsserviço de Consulta de Linhas no GitLab',
    tipo: 'entrega_codigo',
    urlRepositorio: 'https://gitlab.semob.gov.br/estagiarios/lucas-mendes/sit-linhas-api',
    dataSubmissao: '19/10/2026 11:40',
    tempoEsperaHoras: 4,
    tentativaNumero: 2,
    criteriosAceite: [
      'Repositório no GitLab da SEMOB com branch feature devidamente atualizada',
      'Pipeline do GitLab CI com testes verdes (86% de cobertura em Jest)',
      'README.md com instruções claras de execução com Docker Compose',
      'Código em TypeScript estrito e tipado',
      'Tratamento de NotFoundException verificado'
    ]
  },
  {
    id: 'fila-ent-02',
    alunoId: 'aluno-04',
    alunoNome: 'Mariana Duarte Souza',
    alunoEmail: 'mariana.souza@estagio.semob.gov.br',
    trilhaId: 'trilha-dev-semob-2026',
    trilhaNome: 'Formação Desenvolvedor Júnior SEMOB',
    etapaId: 'etapa-07',
    etapaTitulo: 'Microsserviço de Consulta de Linhas no GitLab',
    tipo: 'entrega_codigo',
    urlRepositorio: 'https://gitlab.semob.gov.br/estagiarios/mariana-souza/sit-linhas-api',
    dataSubmissao: '19/10/2026 08:30',
    tempoEsperaHoras: 7,
    tentativaNumero: 1,
    criteriosAceite: [
      'Repositório no GitLab da SEMOB com branch feature devidamente atualizada',
      'Pipeline do GitLab CI com testes verdes',
      'README.md com instruções de execução',
      'Validação de DTOs e class-validator'
    ]
  }
];

export const FILA_CERTIFICADOS_MOCK: ItemFilaCertificado[] = [
  {
    id: 'fila-cert-01',
    certificadoId: 'cert-solic-01',
    alunoId: 'aluno-02',
    alunoNome: 'Beatriz Vasconcelos Lima',
    alunoEmail: 'beatriz.lima@estagio.semob.gov.br',
    trilhaId: 'trilha-dev-semob-2026',
    trilhaNome: 'Formação Desenvolvedor Júnior SEMOB',
    processoSei: '00084-00014589/2026-33',
    cargaHoraria: 120,
    dataSolicitacao: '18/10/2026 18:45',
    etapasConcluidas: 8,
    totalEtapas: 8,
    todasEtapasAprovadas: true
  }
];
