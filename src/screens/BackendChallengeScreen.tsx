import React, { useState } from 'react';
import {
  Server,
  Database,
  CheckCircle2,
  Circle,
  Code2,
  ArrowRight,
  BookOpen,
  FileJson,
  FolderGit2,
  Sparkles,
  ShieldAlert,
  HelpCircle,
} from 'lucide-react';
import { ChallengeSubmission } from '../types';
import { ChallengeSubmissionPanel } from '../components/ChallengeSubmissionPanel';

interface BackendChallengeScreenProps {
  completedItems: string[];
  onToggleItem: (itemKey: string) => void;
  submission?: ChallengeSubmission;
  onSaveSubmission: (challengeId: string, data: Partial<ChallengeSubmission>) => void;
  onOpenModule: (moduleId: string) => void;
}

interface ApiChallengeSpec {
  id: 'itinerario' | 'horarios';
  badge: string;
  title: string;
  method: string;
  endpoint: string;
  queryParams: string;
  originQuestionTitle: string;
  baseSqlFromChallenge: string;
  businessRules: string[];
  expectedSuccessJson: string;
  expectedErrorJson: string;
}

const API_CHALLENGE_SPECS: ApiChallengeSpec[] = [
  {
    id: 'itinerario',
    badge: 'Missão 1 • Transformar SQL de Itinerário em Endpoint',
    title: 'API de Consulta de Itinerário Descritivo por Linha',
    method: 'GET',
    endpoint: '/api/linhas/:codigo/itinerario',
    queryParams: '?sentido=IDA (Opcional)',
    originQuestionTitle: 'Baseado nas Questões "e" e "l" do seu Desafio SQL',
    baseSqlFromChallenge: `-- Você já escreveu este SQL no desafio anterior!
-- Agora sua missão é levá-lo para o LinhaRepository parametrizando com $1 (e $2 se houver sentido):
select
  tl.cd_linha,
  ti.lin_sentido,
  tid.nm_sequencia, 
  tid.nm_via
from
  tab_itinerario_descritivo tid,
  tab_itinerario ti,
  tab_linha tl
where
  tl.id_linha = ti.id_linha
  and ti.id_itinerario = tid.id_itinerario
  and tl.cd_linha in ('0.170')
order by 
  ti.lin_sentido,
  tid.nm_sequencia;`,
    businessRules: [
      'Receber o código da linha via Route Param (:codigo) e, opcionalmente, o sentido via Query Param (?sentido=).',
      'No Repository, substituir o valor fixo (\'0.170\') pelo parâmetro seguro $1 na cláusula WHERE.',
      'Se o usuário enviar o filtro opcional de sentido, adicionar dinamicamente "AND ti.lin_sentido = $2" no WHERE.',
      'No Service, verificar se o array retornado está vazio; se estiver, lançar EntityNotFoundException (HTTP 404).',
    ],
    expectedSuccessJson: `[
  {
    "cd_linha": "0.111",
    "lin_sentido": "CIRCULAR",
    "nm_sequencia": 1,
    "nm_via": "RODOVIÁRIA DO PLANO PILOTO"
  },
  {
    "cd_linha": "0.111",
    "lin_sentido": "CIRCULAR",
    "nm_sequencia": 2,
    "nm_via": "EIXO RODOVIÁRIO NORTE"
  }
]`,
    expectedErrorJson: `{
  "statusCode": 404,
  "timestamp": "2026-10-23T14:00:00.000Z",
  "path": "/api/linhas/9.999/itinerario",
  "method": "GET",
  "message": "Itinerário da Linha com identificador '9.999' não foi encontrado."
}`,
  },
  {
    id: 'horarios',
    badge: 'Missão 2 • Transformar SQL de Horários em Endpoint',
    title: 'API de Consulta de Tabela Horária e Dias de Operação',
    method: 'GET',
    endpoint: '/api/linhas/:codigo/horarios',
    queryParams: '?sentido=IDA (Opcional)',
    originQuestionTitle: 'Baseado nas Questões "g" e "n" do seu Desafio SQL',
    baseSqlFromChallenge: `-- Você já escreveu este SQL nas questões "g" e "n"!
-- Leve-o para o LinhaRepository trocando '0.111' pelo parâmetro seguro $1:
select
    tl.cd_linha AS "linha",
    ti.lin_sentido AS "sentido",
    SUBSTRING(LPAD(th.hr_prevista::text, 4, '0'), 1, 2)
    || ':' ||
    SUBSTRING(LPAD(th.hr_prevista::text, 4, '0'), 3, 2)
    AS "horario",
    CASE
        WHEN th.domingo = 'S' AND th.segunda = 'S' AND th.terca = 'S'
         AND th.quarta = 'S' AND th.quinta = 'S' AND th.sexta = 'S' AND th.sabado = 'S'
            THEN 'Todos os dias'
        WHEN th.domingo = 'N' AND th.segunda = 'S' AND th.terca = 'S'
         AND th.quarta = 'S' AND th.quinta = 'S' AND th.sexta = 'S' AND th.sabado = 'N'
            THEN 'Segunda a Sexta'
        WHEN th.domingo = 'S' AND th.segunda = 'N' AND th.terca = 'N'
         AND th.quarta = 'N' AND th.quinta = 'N' AND th.sexta = 'N' AND th.sabado = 'S'
            THEN 'Sábado e Domingo'
        ELSE 'Dias específicos'
    END AS "diasOperacao"
FROM
    tab_linha tl,
    tab_operadora_linha tol,
    tab_horario th,
    tab_itinerario ti
WHERE
    tl.id_linha = tol.id_linha
    AND tol.id_operadora_linha = th.id_operadora_linha
    AND tl.id_linha = ti.id_linha
    AND tl.cd_linha = '0.111'
ORDER BY
    ti.lin_sentido,
    th.hr_prevista;`,
    businessRules: [
      'Formatar a hora prevista de 4 dígitos (ex: 615 -> "06:15") e consolidar os dias da semana exatamente como na questão "g".',
      'Parametrizar o código da linha com $1 no WHERE (jamais concatenar strings!).',
      'Permitir filtrar opcionalmente pelo sentido ($2) caso seja informado na Query String.',
      'Documentar a rota no LinhaController com @ApiOperation e @ApiResponse para que apareça no Swagger (porta 8097).',
    ],
    expectedSuccessJson: `[
  {
    "linha": "0.111",
    "sentido": "CIRCULAR",
    "horario": "06:15",
    "diasOperacao": "Segunda a Sexta"
  },
  {
    "linha": "0.111",
    "sentido": "CIRCULAR",
    "horario": "07:30",
    "diasOperacao": "Todos os dias"
  }
]`,
    expectedErrorJson: `{
  "statusCode": 404,
  "timestamp": "2026-10-23T14:00:00.000Z",
  "path": "/api/linhas/9.999/horarios",
  "method": "GET",
  "message": "Horários da Linha com identificador '9.999' não foram encontrados."
}`,
  },
];

interface FolderMissionGuide {
  id: string;
  folder: string;
  file: string;
  role: string;
  whatYouMustBuild: string[];
  architecturalTip: string;
}

const FOLDER_MISSIONS: FolderMissionGuide[] = [
  {
    id: 'entity',
    folder: '1º Passo • Pasta src/entity/',
    file: 'src/entity/Linha.ts',
    role: 'Mapear e tipar as tabelas físicas do PostgreSQL no TypeORM',
    whatYouMustBuild: [
      'Abra src/entity/Linha.ts no BoilerPlate_Back_end e observe o mapeamento da tabela física dados_mobilidade.tab_linha com @Entity({ name: "tab_linha", schema: "dados_mobilidade" }).',
      'Analise as colunas mapeadas (@PrimaryGeneratedColumn e @Column com cd_linha, tx_linha, vl_tarifa, etc.).',
      'Verifique as tabelas que seu SQL utiliza (tab_linha, tab_itinerario, tab_itinerario_descritivo, tab_operadora_linha, tab_horario) para entender o modelo de dados e garantir tipos TypeScript correspondentes.',
    ],
    architecturalTip:
      'Regra de ouro da SEMOB: as Entities são apenas o espelho tipado das tabelas do banco no TypeScript. Elas NUNCA contêm consultas SQL, regras de negócio ou lógica HTTP!',
  },
  {
    id: 'dto',
    folder: '2º Passo • Pasta src/dto/',
    file: 'src/dto/Linha.ts',
    role: 'Validar os parâmetros e filtros que vêm da URL e documentar no Swagger',
    whatYouMustBuild: [
      'Abra src/dto/Linha.ts que já existe no BoilerPlate_Back_end.',
      'Analise como a classe FilterLinhaDto valida parâmetros de entrada usando decorators do class-validator.',
      'Crie ou adicione a validação opcional para o filtro de "sentido" usando @IsOptional(), @IsString() e decore com @ApiPropertyOptional() para expor no Swagger.',
    ],
    architecturalTip:
      'Lembre-se: o ValidationPipe global no main.ts descarta ou bloqueia qualquer parâmetro de Query que não esteja explicitamente declarado no DTO com @IsOptional()!',
  },
  {
    id: 'repository',
    folder: '3º Passo • Pasta src/repository/',
    file: 'src/repository/Linha.ts',
    role: 'Executar os 2 SQLs parametrizados ($1, $2) no banco de dados',
    whatYouMustBuild: [
      'Abra src/repository/Linha.ts e observe como o método findByFilters foi construído usando this.dataSource.query(sql, params).',
      'Crie o método assíncrono para buscar o Itinerário Descritivo colando o SQL da Questão "e/l" e trocando o código fixo pelo parâmetro seguro $1 (e $2 se houver sentido).',
      'Crie o método assíncrono para buscar a Tabela Horária colando o SQL da Questão "g/n" e trocando o código fixo pelo parâmetro seguro $1 (e $2 se houver sentido).',
    ],
    architecturalTip:
      'Regra inegociável da SEMOB: JAMAIS faça concatenação de strings (+ ou `${...}`) no SQL! Todas as junções de tabelas devem ser feitas no WHERE e parâmetros seguros devem sempre usar $1, $2 para blindar contra SQL Injection.',
  },
  {
    id: 'service',
    folder: '4º Passo • Pasta src/service/',
    file: 'src/service/Linha.ts',
    role: 'Aplicar regras de negócio e disparar erro 404 se vazio',
    whatYouMustBuild: [
      'Abra src/service/Linha.ts e veja como ele injeta o LinhaRepository no construtor via Injeção de Dependências.',
      'Crie os dois métodos de negócio que recebem os parâmetros limpos e chamam os novos métodos do seu LinhaRepository.',
      'Adicione a verificação: se a consulta retornar uma lista vazia (length === 0), lance a exceção semântica EntityNotFoundException (de src/exceptions/entity-not-found.exception.ts).',
    ],
    architecturalTip:
      'O Service é o cérebro da aplicação: ele desconhece req/res HTTP e não escreve SQL. Ele apenas recebe parâmetros, pede dados ao Repository e decide se o resultado é válido ou dispara exceção.',
  },
  {
    id: 'controller',
    folder: '5º Passo • Pasta src/controller/',
    file: 'src/controller/Linha.ts',
    role: 'Expor os 2 endpoints REST e documentar no Swagger',
    whatYouMustBuild: [
      'Abra src/controller/Linha.ts (que já possui @UseGuards(JwtAuthGuard) e @Controller("linhas")).',
      'Declare a rota @Get(":codigo/itinerario") capturando @Param("codigo") e @Query() para chamar o Service.',
      'Declare a rota @Get(":codigo/horarios") capturando @Param("codigo") e @Query() para chamar o Service.',
      'Adicione @ApiOperation e @ApiResponse em ambas para que apareçam documentadas e testáveis no Swagger (http://localhost:8097/api/docs).',
    ],
    architecturalTip:
      'Mantenha o Controller extremamente enxuto (3 a 5 linhas por endpoint). Ele nunca injeta o Repository diretamente e nunca manipula regras de negócio.',
  },
  {
    id: 'module',
    folder: '6º Passo • Pasta src/module/',
    file: 'src/module/Linha.ts',
    role: 'Amarrar Controller, Service, Repository e Entity no NestJS',
    whatYouMustBuild: [
      'Abra src/module/Linha.ts (a classe LinhaModule anotada com o decorador @Module({ ... })).',
      'Verifique se a Entity Linha está registrada em TypeOrmModule.forFeature([Linha]).',
      'Confirme que o LinhaController está listado em controllers: [LinhaController].',
      'Confirme que LinhaService e LinhaRepository estão registrados em providers: [LinhaService, LinhaRepository].',
      'Adicione LinhaService em exports: [LinhaService] para disponibilizá-lo para outros módulos caso necessário.',
    ],
    architecturalTip:
      'O Module do NestJS é a caixa organizadora do domínio. Se você esquecer de registrar o Controller ou os Providers aqui, a Injeção de Dependências falhará na inicialização do servidor!',
  },
  {
    id: 'appmodule',
    folder: '7º Passo • Arquivo src/app.module.ts',
    file: 'src/app.module.ts',
    role: 'Conectar o módulo de linhas ao tronco central da API',
    whatYouMustBuild: [
      'Abra o arquivo src/app.module.ts na raiz do código-fonte do BoilerPlate_Back_end.',
      'Verifique se LinhaModule está importado no array imports: [...] da classe AppModule ao lado de ConfigModule, DatabaseModule e AuthModule.',
      'Salve o arquivo e confira os logs do terminal (npm run start:dev): o NestJS deve listar o mapeamento das novas rotas GET /api/linhas/:codigo/itinerario e GET /api/linhas/:codigo/horarios.',
      'Acesse http://localhost:8097/api/docs no navegador para testar os endpoints interativamente no Swagger!',
    ],
    architecturalTip:
      'O AppModule é a raiz de toda a árvore de módulos do NestJS. Sem ele importar o LinhaModule, suas rotas e controllers não existem para o servidor web HTTP!',
  },
];

const CHECKLIST_ITEMS = [
  {
    key: 'back-1',
    title: 'Ambiente BoilerPlate_Back_end ativo na porta 8097',
    desc: 'Subi o container PostgreSQL no Rancher Desktop com os seeds das tabelas e validei o acesso ao Swagger.',
  },
  {
    key: 'back-2',
    title: 'Endpoint 1: GET /api/linhas/:codigo/itinerario implementado',
    desc: 'Transformei o SQL das questões "e/l" em endpoint passando pela esteira completa: Entity ➔ DTO ➔ Repository ($1) ➔ Service (404) ➔ Controller ➔ LinhaModule ➔ AppModule.',
  },
  {
    key: 'back-3',
    title: 'Endpoint 2: GET /api/linhas/:codigo/horarios implementado',
    desc: 'Transformei o SQL das questões "g/n" em endpoint formatando horário e dias de operação com parâmetros seguros no WHERE e amarração nos módulos.',
  },
  {
    key: 'back-4',
    title: 'Teste no Swagger com Token JWT e Validação de Erro 404',
    desc: 'Testei ambas as rotas no Swagger para as linhas 0.111 e 0.170 (200 OK) e para um código inexistente (404 Not Found).',
  },
];

export const BackendChallengeScreen: React.FC<BackendChallengeScreenProps> = ({
  completedItems,
  onToggleItem,
  submission,
  onSaveSubmission,
  onOpenModule,
}) => {
  const [selectedApiId, setSelectedApiId] = useState<'itinerario' | 'horarios'>('itinerario');
  const [selectedFolderId, setSelectedFolderId] = useState<string>('entity');

  const activeApi =
    API_CHALLENGE_SPECS.find((a) => a.id === selectedApiId) || API_CHALLENGE_SPECS[0];
  const activeFolder =
    FOLDER_MISSIONS.find((f) => f.id === selectedFolderId) || FOLDER_MISSIONS[0];

  return (
    <div className="screen-container">
      {/* Hero Banner */}
      <section className="hero-banner">
        <div className="hero-content">
          <span className="hero-badge">
            <Server size={14} /> Etapa 2 da Jornada Prática • Engenharia Back-end
          </span>
          <h1>Desafio Back-end: Transformando seus SQLs em APIs no Boilerplate</h1>
          <p>
            No desafio de Banco de Dados você criou as consultas SQL para descobrir o{' '}
            <strong>Itinerário Descritivo</strong> e a <strong>Tabela Horária</strong> de uma linha.
            Agora a sua missão como desenvolvedor Back-end é abrir o <code>BoilerPlate_Back_end</code> e
            transformar esses 2 SQLs em <strong>2 Endpoints RESTful reais</strong> seguindo a arquitetura em camadas!
          </p>
          <div className="hero-actions">
            <button className="btn-secondary" onClick={() => onOpenModule('mod-4-backend')}>
              <BookOpen size={16} /> Consultar Manual do BoilerPlate_Back_end
            </button>
          </div>
        </div>
      </section>

      {/* Especificação Técnica das 2 APIs que o Aluno Deve Construir */}
      <section className="section-card">
        <div className="section-header-row">
          <div>
            <h2>
              <Sparkles size={20} style={{ display: 'inline', marginRight: '0.5rem' }} />
              Especificação Técnica: Quais APIs você deve construir?
            </h2>
            <p className="text-muted">
              Alterne entre as 2 missões abaixo para ver o SQL de origem (que você fez na etapa anterior), as regras de negócio e o contrato JSON que o seu endpoint deve devolver:
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', margin: '1.25rem 0' }}>
          {API_CHALLENGE_SPECS.map((spec) => (
            <button
              key={spec.id}
              type="button"
              onClick={() => setSelectedApiId(spec.id)}
              className={`sql-filter-btn ${selectedApiId === spec.id ? 'active' : ''}`}
              style={{ padding: '0.75rem 1.2rem', fontWeight: 700 }}
            >
              {spec.id === 'itinerario'
                ? '🗺️ Missão 1: GET /api/linhas/:codigo/itinerario'
                : '🕒 Missão 2: GET /api/linhas/:codigo/horarios'}
            </button>
          ))}
        </div>

        <div className="glass-card" style={{ padding: '1.35rem' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.5rem',
              paddingBottom: '1rem',
              borderBottom: '1px solid rgba(148,163,184,0.15)',
            }}
          >
            <div>
              <span className="status-pill passed" style={{ fontSize: '0.72rem' }}>
                {activeApi.badge}
              </span>
              <h3 style={{ fontSize: '1.2rem', marginTop: '0.35rem' }}>{activeApi.title}</h3>
              <p className="text-muted" style={{ fontSize: '0.84rem' }}>
                {activeApi.originQuestionTitle}
              </p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span className="status-pill passed" style={{ fontFamily: 'monospace', fontWeight: 700 }}>
                {activeApi.method} {activeApi.endpoint}
              </span>
              <div className="text-muted" style={{ fontSize: '0.75rem', fontFamily: 'monospace', marginTop: '0.25rem' }}>
                {activeApi.queryParams}
              </div>
            </div>
          </div>

          {/* Grid: A Matéria-Prima (SQL) + Regras de Transformação */}
          <div className="cards-grid two-cols" style={{ marginTop: '1.25rem', alignItems: 'start' }}>
            <div>
              <strong style={{ fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: 6, marginBottom: '0.4rem' }}>
                <Database size={15} color="#38bdf8" /> 1. Sua Matéria-Prima (O SQL do Desafio Anterior):
              </strong>
              <pre className="code-block" style={{ margin: 0, fontSize: '0.78rem' }}>
                <code>{activeApi.baseSqlFromChallenge}</code>
              </pre>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div className="glass-card" style={{ padding: '1rem', borderLeft: '4px solid #38bdf8' }}>
                <strong style={{ fontSize: '0.86rem', color: '#38bdf8', display: 'block', marginBottom: '0.4rem' }}>
                  🎯 Requisitos de Engenharia para esta Rota:
                </strong>
                <ul style={{ paddingLeft: '1.2rem', fontSize: '0.84rem', lineHeight: 1.65 }}>
                  {activeApi.businessRules.map((rule, i) => (
                    <li key={i} style={{ marginBottom: '0.3rem' }}>
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <strong style={{ fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: 5, marginBottom: '0.35rem' }}>
                  <FileJson size={15} color="#10b981" /> Contrato JSON Esperado no Swagger (HTTP 200 OK):
                </strong>
                <pre className="code-block" style={{ margin: 0, fontSize: '0.76rem' }}>
                  <code>{activeApi.expectedSuccessJson}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Guia Arquitetural por Pasta (O Que Fazer em Cada Pasta sem Dar o Código Pronto) */}
      <section className="section-card">
        <div className="section-header-row">
          <div>
            <h2>
              <FolderGit2 size={20} style={{ display: 'inline', marginRight: '0.5rem' }} />
              Bússola de Implementação: O que fazer em cada pasta do Boilerplate?
            </h2>
            <p className="text-muted">
              Clique em cada uma das 7 etapas na ordem exata de desenvolvimento abaixo para saber qual é o seu papel na construção das duas APIs (sem spoilers de código!):
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', margin: '1.15rem 0' }}>
          {FOLDER_MISSIONS.map((fm, idx) => (
            <React.Fragment key={fm.id}>
              <button
                type="button"
                onClick={() => setSelectedFolderId(fm.id)}
                className={`sql-filter-btn ${selectedFolderId === fm.id ? 'active' : ''}`}
              >
                {fm.folder}
              </button>
              {idx < FOLDER_MISSIONS.length - 1 && (
                <ArrowRight size={15} style={{ alignSelf: 'center', opacity: 0.4 }} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="glass-card" style={{ padding: '1.35rem', borderLeft: '4px solid #818cf8' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem' }}>{activeFolder.folder}</h3>
              <p className="text-muted" style={{ fontSize: '0.85rem' }}>{activeFolder.role}</p>
            </div>
            <code className="status-pill passed" style={{ fontSize: '0.8rem' }}>
              Arquivo: {activeFolder.file}
            </code>
          </div>

          <ul style={{ paddingLeft: '1.25rem', fontSize: '0.9rem', lineHeight: 1.7, margin: '0.85rem 0' }}>
            {activeFolder.whatYouMustBuild.map((step, i) => (
              <li key={i} style={{ marginBottom: '0.35rem' }}>
                {step}
              </li>
            ))}
          </ul>

          <div
            className="glass-card"
            style={{
              marginTop: '1rem',
              padding: '0.85rem 1rem',
              background: 'rgba(56, 189, 248, 0.08)',
              borderLeft: '3px solid #38bdf8',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
            }}
          >
            <HelpCircle size={18} color="#38bdf8" />
            <span style={{ fontSize: '0.84rem' }}>
              <strong>Dica de Ouro:</strong> {activeFolder.architecturalTip}
            </span>
          </div>
        </div>
      </section>

      {/* Checklist de Progresso do Aluno */}
      <section className="section-card">
        <h2>
          <Code2 size={20} style={{ display: 'inline', marginRight: '0.5rem' }} />
          Etapas de Verificação da sua Implementação
        </h2>
        <div className="checklist-box" style={{ marginTop: '1rem' }}>
          {CHECKLIST_ITEMS.map((item) => {
            const done = completedItems.includes(item.key);
            return (
              <div
                key={item.key}
                onClick={() => onToggleItem(item.key)}
                className={`checklist-item ${done ? 'completed' : ''}`}
                style={{ cursor: 'pointer', alignItems: 'flex-start' }}
              >
                <div style={{ marginTop: '0.15rem' }}>
                  {done ? <CheckCircle2 size={20} color="#10b981" /> : <Circle size={20} />}
                </div>
                <div style={{ flex: 1 }}>
                  <strong>{item.title}</strong>
                  <p className="text-muted" style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Painel de Submissão */}
      <ChallengeSubmissionPanel
        challengeId="challenge-backend-api"
        title="Submissão do Desafio Back-end (APIs de Itinerário e Horários)"
        subtitle="Valide todos os itens da revisão de PR e cole o link do seu repositório Git com as duas novas rotas implementadas."
        requireRepoUrl={true}
        existingSubmission={submission}
        onSaveSubmission={onSaveSubmission}
        prChecklist={[
          'Mapeei/verifiquei as Entities no TypeORM e criei as validações com @IsOptional() no DTO?',
          'Implementei a rota GET /api/linhas/:codigo/itinerario usando o SQL da questão "e/l" parametrizado com $1 no LinhaRepository?',
          'Implementei a rota GET /api/linhas/:codigo/horarios usando o SQL da questão "g/n" parametrizado com $1 no LinhaRepository?',
          'O LinhaController apenas repassa a chamada para o LinhaService sem conter regras de negócio ou SQL?',
          'O LinhaService lança EntityNotFoundException (404) quando uma linha não é encontrada?',
          'O LinhaModule registra controllers e providers e está devidamente importado no AppModule raiz?',
          'Testei os 2 endpoints no Swagger (http://localhost:8097/api/docs) autenticando com o botão Authorize?',
        ]}
      />
    </div>
  );
};
