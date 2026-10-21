import React, { useState } from 'react';
import {
  Server,
  Layers,
  CheckCircle2,
  Circle,
  Code2,
  ArrowRight,
  BookOpen,
  Terminal,
  ShieldCheck,
  GitBranch,
  Key,
  FileCode2,
  FileText,
  Boxes,
  Clock,
  MapPin,
  Compass,
} from 'lucide-react';
import { ChallengeSubmissionPanel } from '../components/ChallengeSubmissionPanel';
import { ChallengeSubmission } from '../types';

interface BackendChallengeScreenProps {
  completedItems: string[];
  onToggleItem: (itemKey: string) => void;
  onOpenModule: (moduleId: string) => void;
  submission?: ChallengeSubmission;
  onSaveSubmission: (challengeId: string, data: Partial<ChallengeSubmission>) => void;
}

interface ArchLayer {
  id: string;
  name: string;
  folder: string;
  role: string;
  mustDo: string[];
  mustNotDo: string[];
  codeSample: string;
}

const ARCH_LAYERS: ArchLayer[] = [
  {
    id: 'entity',
    name: '1. Entity',
    folder: 'src/entity/ItinerarioDescritivo.ts',
    role: 'Mapeamento ORM (TypeORM) que espelha as tabelas reais tab_itinerario_descritivo e tab_horario com tipagem estrita de colunas no schema dados_mobilidade.',
    mustDo: [
      'Decorar a classe com @Entity({ name: "tab_itinerario_descritivo", schema: "dados_mobilidade" })',
      'Definir @PrimaryGeneratedColumn({ name: "id_itinerario" }) para a chave primária',
      'Mapear colunas reais: nm_sequencia (int), nm_via (varchar), localidade (varchar)',
    ],
    mustNotDo: [
      'NUNCA colocar queries SQL ou lógica de negócio dentro da Entity',
      'NUNCA esquecer o schema "dados_mobilidade" no decorator @Entity',
    ],
    codeSample: `import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'tab_itinerario_descritivo', schema: 'dados_mobilidade' })
export class ItinerarioDescritivo {
  @PrimaryGeneratedColumn({ name: 'id_itinerario' })
  id: number;

  @Column({ name: 'nm_sequencia', type: 'int' })
  sequencia: number;

  @Column({ name: 'nm_via', length: 150 })
  nomeVia: string;

  @Column({ name: 'localidade', length: 100, nullable: true })
  localidade: string;
}

// Entidade para o Quadro de Horários (tab_horario):
@Entity({ name: 'tab_horario', schema: 'dados_mobilidade' })
export class Horario {
  @PrimaryGeneratedColumn({ name: 'id_horario' })
  id: number;

  @Column({ name: 'hr_prevista', length: 5 })
  horario: string;

  @Column({ name: 'sentido', length: 20 })
  sentido: string;

  @Column({ default: false }) segunda: boolean;
  @Column({ default: false }) terca: boolean;
  @Column({ default: false }) quarta: boolean;
  @Column({ default: false }) quinta: boolean;
  @Column({ default: false }) sexta: boolean;
  @Column({ default: false }) sabado: boolean;
  @Column({ default: false }) domingo: boolean;
}`,
  },
  {
    id: 'dto',
    name: '2. DTO',
    folder: 'src/dto/Linha.ts',
    role: 'Data Transfer Object para validação de filtros de entrada via class-validator e documentação automática OpenAPI Swagger.',
    mustDo: [
      'Validar parâmetro opcional tipoDia com @IsIn(["UTIL", "SABADO", "DOMINGO"])',
      'Documentar cada campo com decorators do Swagger: @ApiPropertyOptional({ example: "UTIL" })',
      'Definir DTO de atualização de status operacional com validações estritas',
    ],
    mustNotDo: [
      'NUNCA permitir tipos genéricos ou any nos payloads de entrada',
      'NUNCA deixar campos de query sem decorators de documentação OpenAPI',
    ],
    codeSample: `import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsIn, IsBoolean } from 'class-validator';

export class FilterHorarioDto {
  @ApiPropertyOptional({
    description: 'Filtrar partidas por tipo de dia da operação',
    enum: ['UTIL', 'SABADO', 'DOMINGO'],
    example: 'UTIL',
  })
  @IsOptional()
  @IsString()
  @IsIn(['UTIL', 'SABADO', 'DOMINGO'], {
    message: 'tipoDia deve ser UTIL, SABADO ou DOMINGO',
  })
  tipoDia?: string;
}

export class UpdateStatusLinhaDto {
  @ApiProperty({ description: 'Indica se a linha está ativa operacionalmente', example: true })
  @IsBoolean()
  stAtivo: boolean;

  @ApiPropertyOptional({ description: 'Motivo da alteração ou despacho da fiscalização' })
  @IsOptional()
  @IsString()
  motivo?: string;
}`,
  },
  {
    id: 'repository',
    name: '3. Repository',
    folder: 'src/repository/Linha.ts',
    role: 'Isolamento de persistência SQL. Executa queries com WHERE parametrizado ($1, $2) conectando as tabelas dominadas no Desafio SQL.',
    mustDo: [
      'Utilizar this.dataSource.query() com cláusulas WHERE parametrizadas ($1, $2)',
      'Unir tab_linha, tab_itinerario e tab_itinerario_descritivo ordenando por d.nm_sequencia ASC',
      'Unir tab_linha, tab_operadora_linha e tab_horario filtrando por dias da semana',
    ],
    mustNotDo: [
      'PROIBIDO concatenar variáveis em SQL com "+" ou "\${param}" (Risco crítico de SQL Injection)',
      'NUNCA disparar exceções HTTP 404 dentro do repositório; retorne lista vazia ou null',
    ],
    codeSample: `@Injectable()
export class LinhaRepository {
  constructor(private readonly dataSource: DataSource) {}

  // Consulta do Itinerário Descritivo (Tabelas do Desafio SQL)
  async findItinerarioByCodigo(codigo: string): Promise<ItinerarioDescritivo[]> {
    const sql = \`
      SELECT 
        d.nm_sequencia AS "sequencia",
        d.nm_via AS "nomeVia",
        d.localidade AS "localidade",
        i.lin_sentido AS "sentido"
      FROM dados_mobilidade.tab_linha l
      INNER JOIN dados_mobilidade.tab_itinerario i ON l.id_linha = i.id_linha
      INNER JOIN dados_mobilidade.tab_itinerario_descritivo d ON i.id_itinerario = d.id_itinerario
      WHERE l.cd_linha = $1
      ORDER BY d.nm_sequencia ASC
    \`;
    return this.dataSource.query(sql, [codigo]);
  }

  // Consulta do Quadro de Horários Programados
  async findHorariosByCodigo(codigo: string, tipoDia?: string): Promise<any[]> {
    let sql = \`
      SELECT 
        h.hr_prevista AS "horario",
        h.sentido AS "sentido",
        h.segunda, h.terca, h.quarta, h.quinta, h.sexta, h.sabado, h.domingo
      FROM dados_mobilidade.tab_linha l
      INNER JOIN dados_mobilidade.tab_operadora_linha ol ON l.id_linha = ol.id_linha
      INNER JOIN dados_mobilidade.tab_horario h ON ol.id_operadora_linha = h.id_operadora_linha
      WHERE l.cd_linha = $1
    \`;
    const params: any[] = [codigo];

    if (tipoDia === 'UTIL') {
      sql += \` AND (h.segunda = true OR h.terca = true OR h.quarta = true OR h.quinta = true OR h.sexta = true)\`;
    } else if (tipoDia === 'SABADO') {
      sql += \` AND h.sabado = true\`;
    } else if (tipoDia === 'DOMINGO') {
      sql += \` AND h.domingo = true\`;
    }

    sql += \` ORDER BY h.hr_prevista ASC\`;
    return this.dataSource.query(sql, params);
  }
}`,
  },
  {
    id: 'service',
    name: '4. Service',
    folder: 'src/service/Linha.ts',
    role: 'Núcleo das regras de negócio. Valida se a linha existe no cadastro antes de buscar itinerários e lança exceções semânticas da SEMOB.',
    mustDo: [
      'Verificar se a linha existe chamando this.linhaRepository.findOneByCodigo(codigo)',
      'Lançar EntityNotFoundException("Linha", codigo) (404) quando o código não existir',
      'Agrupar os horários por sentido (IDA / VOLTA) ou retornar formato amigável',
    ],
    mustNotDo: [
      'NUNCA manipular objetos HTTP req/res diretamente dentro do Service',
      'NUNCA retornar 200 OK com array vazio caso a linha sequer exista no cadastro',
    ],
    codeSample: `@Injectable()
export class LinhaService {
  constructor(private readonly linhaRepo: LinhaRepository) {}

  async obterItinerario(codigo: string): Promise<ItinerarioDescritivo[]> {
    // 1. Regra de Negócio: a linha existe na base da SEMOB?
    const linha = await this.linhaRepo.findOneByCodigo(codigo);
    if (!linha) {
      throw new EntityNotFoundException('Linha', codigo); // HTTP 404
    }

    // 2. Busca o itinerário descritivo ordenado
    const itinerario = await this.linhaRepo.findItinerarioByCodigo(codigo);
    if (!itinerario || itinerario.length === 0) {
      throw new NotFoundException(\`Itinerário ainda não cadastrado para a linha \${codigo}\`);
    }

    return itinerario;
  }

  async obterHorarios(codigo: string, tipoDia?: string): Promise<any> {
    const linha = await this.linhaRepo.findOneByCodigo(codigo);
    if (!linha) {
      throw new EntityNotFoundException('Linha', codigo); // HTTP 404
    }

    const partidas = await this.linhaRepo.findHorariosByCodigo(codigo, tipoDia);
    return {
      linha: { codigo: linha.codigo, descricao: linha.descricao },
      tipoDia: tipoDia || 'TODOS',
      totalPartidas: partidas.length,
      partidas,
    };
  }
}`,
  },
  {
    id: 'controller',
    name: '5. Controller',
    folder: 'src/controller/Linha.ts',
    role: 'Porta de entrada HTTP. Expõe endpoints REST semânticos, decora Swagger OpenAPI e protege rotas administrativas com JWT.',
    mustDo: [
      'Anotar rotas públicas @Get(":codigo/itinerario") e @Get(":codigo/horarios")',
      'Proteger rota de alteração operacional com @UseGuards(JwtAuthGuard) e @ApiBearerAuth()',
      'Documentar respostas HTTP com @ApiOperation e @ApiResponse para o Swagger',
    ],
    mustNotDo: [
      'NUNCA colocar queries SQL ou lógica de cálculo de trajeto dentro do Controller',
      'NUNCA expor rotas de escrita (POST, PUT, DELETE) sem autenticação JWT',
    ],
    codeSample: `@ApiTags('Linhas')
@Controller('linhas')
export class LinhaController {
  constructor(private readonly linhaService: LinhaService) {}

  @Get(':codigo/itinerario')
  @ApiOperation({ summary: 'Obter trajeto descritivo sequencial de vias da linha' })
  @ApiResponse({ status: 200, description: 'Sequência de vias retornada com sucesso' })
  @ApiResponse({ status: 404, description: 'Linha ou itinerário não encontrado no SISMOB' })
  async obterItinerario(@Param('codigo') codigo: string) {
    return this.linhaService.obterItinerario(codigo);
  }

  @Get(':codigo/horarios')
  @ApiOperation({ summary: 'Obter quadro de horários programados da linha' })
  @ApiResponse({ status: 200, description: 'Quadro de partidas retornado com sucesso' })
  @ApiResponse({ status: 404, description: 'Linha não cadastrada' })
  async obterHorarios(
    @Param('codigo') codigo: string,
    @Query() filters: FilterHorarioDto,
  ) {
    return this.linhaService.obterHorarios(codigo, filters.tipoDia);
  }

  @Put(':codigo/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar status operacional da linha (Requer JWT da SEMOB)' })
  @ApiResponse({ status: 200, description: 'Status atualizado com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado (Token JWT ausente ou expirado)' })
  async atualizarStatus(
    @Param('codigo') codigo: string,
    @Body() dto: UpdateStatusLinhaDto,
  ) {
    return this.linhaService.atualizarStatus(codigo, dto);
  }
}`,
  },
  {
    id: 'module',
    name: '6. Module',
    folder: 'src/module/Linha.ts',
    role: 'Módulo de injeção de dependências do NestJS que encapsula controllers, providers e registra as entidades no TypeORM.',
    mustDo: [
      'Importar TypeOrmModule.forFeature([Linha, ItinerarioDescritivo, Horario])',
      'Registrar LinhaController em controllers: [LinhaController]',
      'Registrar LinhaService e LinhaRepository em providers: [LinhaService, LinhaRepository]',
      'Exportar LinhaService para módulos integradores (como o futuro módulo de Telemetria/VOL)',
    ],
    mustNotDo: [
      'NUNCA esquecer de registrar o LinhaRepository nos providers do módulo',
      'NUNCA criar imports circulares sem a função forwardRef()',
    ],
    codeSample: `import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Linha } from '../entity/Linha';
import { ItinerarioDescritivo, Horario } from '../entity/ItinerarioDescritivo';
import { LinhaController } from '../controller/Linha';
import { LinhaService } from '../service/Linha';
import { LinhaRepository } from '../repository/Linha';

@Module({
  imports: [
    TypeOrmModule.forFeature([Linha, ItinerarioDescritivo, Horario]),
  ],
  controllers: [LinhaController],
  providers: [LinhaService, LinhaRepository],
  exports: [LinhaService, LinhaRepository],
})
export class LinhaModule {}`,
  },
  {
    id: 'appmodule',
    name: '7. AppModule & Swagger',
    folder: 'src/app.module.ts',
    role: 'Raiz da aplicação NestJS. Agrega AuthModule (JWT), DatabaseModule e LinhaModule rodando no Docker na porta 8097.',
    mustDo: [
      'Verificar se LinhaModule está importado no AppModule raiz',
      'Validar se AuthModule está configurado para emitir e verificar tokens JWT',
      'Testar todos os endpoints na interface gráfica Swagger em http://localhost:8097/api/docs',
    ],
    mustNotDo: [
      'NUNCA deixar segredos JWT em texto puro no código; use variáveis de ambiente (.env)',
      'NUNCA considerar o desafio concluído sem testar os retornos 200, 401 e 404 no Swagger',
    ],
    codeSample: `@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({ useClass: DatabaseConfigService }),
    AuthModule,    // Autenticação JWT (admin / sismob@2026)
    LinhaModule,   // Módulo oficial com Itinerários e Horários
  ],
})
export class AppModule {}

// No Swagger (http://localhost:8097/api/docs):
// 1. Teste GET /api/linhas/0.111/itinerario -> 200 OK com sequência de vias
// 2. Teste GET /api/linhas/0.111/horarios?tipoDia=UTIL -> 200 OK com quadro de partidas
// 3. Teste GET /api/linhas/9.999/itinerario -> 404 Not Found
// 4. Teste PUT /api/linhas/0.111/status sem token -> 401 Unauthorized`,
  },
];

const FILE_SEQUENCE_STEPS = [
  {
    key: 'back-step-1',
    order: '1º Arquivo',
    file: 'src/entity/ItinerarioDescritivo.ts',
    title: 'Modelar Entidades de Itinerário e Horário (TypeORM)',
    desc: 'Mapeie as tabelas dados_mobilidade.tab_itinerario_descritivo e tab_horario com colunas físicas e chaves primárias.',
  },
  {
    key: 'back-step-2',
    order: '2º Arquivo',
    file: 'src/dto/Linha.ts',
    title: 'Criar DTOs de Filtro e Contratos OpenAPI (class-validator)',
    desc: 'Crie FilterHorarioDto com validação @IsIn(["UTIL", "SABADO", "DOMINGO"]) e UpdateStatusLinhaDto com anotações Swagger.',
  },
  {
    key: 'back-step-3',
    order: '3º Arquivo',
    file: 'src/repository/Linha.ts',
    title: 'Implementar Queries Parametrizadas no Repository',
    desc: 'Escreva as queries SQL unindo tab_linha, tab_itinerario, tab_itinerario_descritivo e tab_horario com proteção contra SQL Injection ($1).',
  },
  {
    key: 'back-step-4',
    order: '4º Arquivo',
    file: 'src/service/Linha.ts',
    title: 'Codificar Regras de Negócio e HTTP 404 no Service',
    desc: 'Implemente a checagem de existência da linha e dispare EntityNotFoundException caso o código não exista no SISMOB.',
  },
  {
    key: 'back-step-5',
    order: '5º Arquivo',
    file: 'src/controller/Linha.ts',
    title: 'Expor Endpoints REST e Proteger com Guards JWT',
    desc: 'Mapeie GET :codigo/itinerario, GET :codigo/horarios e a rota administrativa PUT :codigo/status com @UseGuards(JwtAuthGuard).',
  },
  {
    key: 'back-step-6',
    order: '6º Arquivo',
    file: 'src/module/Linha.ts',
    title: 'Registrar Dependências no Módulo NestJS',
    desc: 'Garanta que TypeOrmModule.forFeature inclua as novas entidades e que LinhaService e LinhaRepository estejam nos providers.',
  },
  {
    key: 'back-step-7',
    order: '7º Arquivo',
    file: 'http://localhost:8097/api/docs',
    title: 'Testar Endpoints de Ponta a Ponta no Swagger',
    desc: 'Abra o Swagger, teste as rotas públicas, faça login com admin/sismob@2026, desbloqueie o Authorize e valide as respostas 200, 401 e 404.',
  },
];

const API_ENDPOINTS = [
  {
    method: 'GET',
    path: '/api/linhas',
    auth: 'Público',
    status: '200 OK',
    desc: 'Lista linhas cadastradas com filtros opcionais (?codigo=0.111&tarifaMaxima=5.50)',
  },
  {
    method: 'GET',
    path: '/api/linhas/:codigo',
    auth: 'Público',
    status: '200 / 404',
    desc: 'Retorna detalhes cadastrais de uma linha específica pelo código (ex: 0.111)',
  },
  {
    method: 'GET',
    path: '/api/linhas/:codigo/itinerario',
    auth: 'Público',
    status: '200 / 404',
    desc: 'Retorna o trajeto sequencial de vias e localidades percorrido pela linha (ordenado por nm_sequencia)',
  },
  {
    method: 'GET',
    path: '/api/linhas/:codigo/horarios',
    auth: 'Público',
    status: '200 / 404',
    desc: 'Retorna o quadro de partidas programadas com filtro opcional por tipo de dia (?tipoDia=UTIL|SABADO|DOMINGO)',
  },
  {
    method: 'PUT',
    path: '/api/linhas/:codigo/status',
    auth: 'Bearer JWT',
    status: '200 / 401 / 404',
    desc: 'Atualiza o status operacional da linha no SISMOB (Apenas fiscais e administradores autenticados)',
  },
  {
    method: 'GET',
    path: '/api/linhas/:codigo/telemetria',
    auth: 'Público',
    status: '200 / 404',
    desc: 'Prévia de dados de telemetria GPS em tempo real (base arquitetural para o futuro Infoônibus / Módulo VOL)',
  },
];

export const BackendChallengeScreen: React.FC<BackendChallengeScreenProps> = ({
  completedItems,
  onToggleItem,
  onOpenModule,
  submission,
  onSaveSubmission,
}) => {
  const [activeLayerId, setActiveLayerId] = useState<string>('entity');
  const activeLayer = ARCH_LAYERS.find((l) => l.id === activeLayerId) || ARCH_LAYERS[0];

  return (
    <div className="screen-container">
      {/* Hero Banner */}
      <section className="hero-banner">
        <div className="hero-content">
          <span className="hero-badge">
            <Server size={14} /> Desafio Prático • Engenharia Backend
          </span>
          <h1>Desafio Backend: APIs de Linhas do SISMOB (Itinerários e Horários)</h1>
          <p>
            Construa endpoints corporativos de alta performance no <strong>SISMOB-BOILERPLATE</strong> utilizando o
            padrão oficial da SUTINF em <strong>NestJS + TypeORM</strong>. Conecte as tabelas reais do Desafio SQL
            (<code>tab_itinerario_descritivo</code> e <code>tab_horario</code>), aplique segurança com <strong>JWT</strong> e
            documente tudo no <strong>Swagger</strong>, preparando a API para o Frontend e o futuro <strong>Infoônibus</strong>.
          </p>
          <div className="hero-actions">
            <button className="btn-secondary" onClick={() => onOpenModule('mod-4-backend')}>
              <BookOpen size={16} /> Revisar Módulo 4: Arquitetura Backend na Plataforma
            </button>
          </div>
        </div>
      </section>

      {/* Roteiro da Missão: Do Clone às Novas APIs de Linha */}
      <section className="section-card">
        <h2>
          <GitBranch size={20} style={{ display: 'inline', marginRight: '0.5rem' }} />
          Roteiro da Missão: Do SISMOB-BOILERPLATE aos Endpoints de Mobilidade
        </h2>
        <p className="text-muted" style={{ marginTop: '0.3rem', marginBottom: '1.25rem' }}>
          Este desafio simula o fluxo diário de desenvolvimento na SUTINF/SEMOB. Siga os 3 passos estruturantes:
        </p>

        <div className="cards-grid three-cols">
          <div className="glass-card" style={{ borderTop: '4px solid #3b82f6', padding: '1.25rem' }}>
            <span className="status-pill pending" style={{ marginBottom: '0.5rem' }}>Passo 1 • Setup</span>
            <h3 style={{ fontSize: '1.05rem', marginTop: '0.3rem' }}>Clonar Boilerplate SEMOB</h3>
            <p className="text-muted" style={{ fontSize: '0.85rem', marginTop: '0.5rem', lineHeight: 1.5 }}>
              Clone o repositório base com a estrutura NestJS, Docker Compose e PostgreSQL PostGIS já configurados:
            </p>
            <pre className="code-block" style={{ fontSize: '0.78rem', margin: '0.75rem 0' }}>
              <code>git clone https://github.com/pedro090904/SISMOB-BOILERPLATE.git&#10;cd SISMOB-BOILERPLATE&#10;npm install</code>
            </pre>
          </div>

          <div className="glass-card" style={{ borderTop: '4px solid #10b981', padding: '1.25rem' }}>
            <span className="status-pill passed" style={{ marginBottom: '0.5rem' }}>Passo 2 • Validação</span>
            <h3 style={{ fontSize: '1.05rem', marginTop: '0.3rem' }}>Subir Banco e Testar /linhas</h3>
            <p className="text-muted" style={{ fontSize: '0.85rem', marginTop: '0.5rem', lineHeight: 1.5 }}>
              Suba o banco no Rancher Desktop e inicie o NestJS. O <code>Seed.ts</code> criará as linhas iniciais:
            </p>
            <pre className="code-block" style={{ fontSize: '0.78rem', margin: '0.75rem 0' }}>
              <code>docker compose up -d&#10;npm run start:dev&#10;# Acesse: http://localhost:8097/api/docs</code>
            </pre>
          </div>

          <div className="glass-card" style={{ borderTop: '4px solid #f59e0b', padding: '1.25rem' }}>
            <span className="status-pill active" style={{ marginBottom: '0.5rem' }}>Passo 3 • Desafio Real</span>
            <h3 style={{ fontSize: '1.05rem', marginTop: '0.3rem' }}>Criar Itinerários e Horários</h3>
            <p className="text-muted" style={{ fontSize: '0.85rem', marginTop: '0.5rem', lineHeight: 1.5 }}>
              O desafio começa aqui! Implemente <code>/api/linhas/:codigo/itinerario</code> e <code>/api/linhas/:codigo/horarios</code> conectando com as queries SQL do desafio anterior!
            </p>
          </div>
        </div>
      </section>

      {/* Fluxo Interativo dos 7 Passos da Arquitetura SUTINF */}
      <section className="section-card">
        <div className="section-header-row">
          <div>
            <h2>
              <Layers size={20} style={{ display: 'inline', marginRight: '0.5rem' }} />
              Os 7 Arquivos e Camadas da Arquitetura SUTINF (Clique para inspecionar)
            </h2>
            <p className="text-muted">
              Inspecione o papel, as regras e o código de referência de cada uma das camadas da arquitetura oficial do SISMOB.
            </p>
          </div>
        </div>

        <div className="arch-flow" style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', margin: '1.25rem 0' }}>
          {ARCH_LAYERS.map((layer, index) => (
            <React.Fragment key={layer.id}>
              <button
                type="button"
                onClick={() => setActiveLayerId(layer.id)}
                className={`sql-filter-btn ${activeLayerId === layer.id ? 'active' : ''}`}
                style={{ padding: '0.65rem 1rem', fontWeight: 700, fontSize: '0.85rem' }}
              >
                {layer.name}
              </button>
              {index < ARCH_LAYERS.length - 1 && (
                <span style={{ display: 'flex', alignItems: 'center', opacity: 0.5 }}>
                  <ArrowRight size={16} />
                </span>
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem' }}>{activeLayer.name}</h3>
              <p className="text-muted" style={{ marginTop: '0.2rem' }}>{activeLayer.role}</p>
            </div>
            <span className="status-pill passed" style={{ fontFamily: 'monospace', alignSelf: 'flex-start' }}>
              {activeLayer.folder}
            </span>
          </div>

          <div className="cards-grid two-cols" style={{ marginBottom: '1.25rem' }}>
            <div className="glass-card" style={{ borderLeft: '4px solid #10b981', padding: '1rem' }}>
              <strong style={{ color: '#10b981', display: 'block', marginBottom: '0.5rem' }}>
                ✅ O que DEVE fazer nesta camada:
              </strong>
              <ul style={{ paddingLeft: '1.2rem', fontSize: '0.88rem', lineHeight: 1.6 }}>
                {activeLayer.mustDo.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="glass-card" style={{ borderLeft: '4px solid #ef4444', padding: '1rem' }}>
              <strong style={{ color: '#ef4444', display: 'block', marginBottom: '0.5rem' }}>
                🚫 O que NÃO DEVE fazer nesta camada:
              </strong>
              <ul style={{ paddingLeft: '1.2rem', fontSize: '0.88rem', lineHeight: 1.6 }}>
                {activeLayer.mustNotDo.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <span className="text-muted" style={{ fontSize: '0.78rem', fontFamily: 'monospace' }}>
              Código de Referência • SUTINF Padrão Oficial
            </span>
          </div>
          <pre className="code-block">
            <code>{activeLayer.codeSample}</code>
          </pre>
        </div>
      </section>

      {/* Seção Explicativa: Autenticação JWT & Documentação Swagger */}
      <section className="section-card">
        <div className="cards-grid two-cols">
          <div className="glass-card" style={{ padding: '1.25rem', borderLeft: '4px solid #8b5cf6' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
              <Key size={18} color="#8b5cf6" /> Autenticação JWT no SISMOB
            </h3>
            <p className="text-muted" style={{ fontSize: '0.88rem', marginTop: '0.5rem', lineHeight: 1.6 }}>
              No ecossistema de transporte da SEMOB, consultas públicas (leitura de itinerários e quadro de horários) não exigem token. Porém, <strong>operações de mutação ou despacho (PUT /api/linhas/:codigo/status)</strong> DEVEM ser protegidas:
            </p>
            <ul style={{ paddingLeft: '1.2rem', fontSize: '0.85rem', lineHeight: 1.6, marginTop: '0.5rem' }}>
              <li>Utilize o decorador <code>@UseGuards(JwtAuthGuard)</code> e <code>@ApiBearerAuth()</code> no método do controller;</li>
              <li>A requisição deve enviar o cabeçalho HTTP <code>Authorization: Bearer &lt;token&gt;</code>;</li>
              <li>O token é gerado via <code>POST /api/auth/login</code> (usuário padrão: <code>admin</code> / <code>sismob@2026</code>);</li>
              <li>Em caso de token ausente ou expirado, a API retorna <code>401 Unauthorized</code> automaticamente.</li>
            </ul>
          </div>

          <div className="glass-card" style={{ padding: '1.25rem', borderLeft: '4px solid #0ea5e9' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
              <FileText size={18} color="#0ea5e9" /> Documentação OpenAPI Swagger
            </h3>
            <p className="text-muted" style={{ fontSize: '0.88rem', marginTop: '0.5rem', lineHeight: 1.6 }}>
              Todas as APIs da SEMOB devem ser auto-documentadas para que as equipes de Frontend e os sistemas integrados possam consumir os serviços sem adivinhação:
            </p>
            <ul style={{ paddingLeft: '1.2rem', fontSize: '0.85rem', lineHeight: 1.6, marginTop: '0.5rem' }}>
              <li>Decore a classe com <code>@ApiTags('Linhas')</code> para agrupar as rotas no Swagger;</li>
              <li>Decore os endpoints com <code>@ApiOperation(&#123; summary: '...' &#125;)</code> e <code>@ApiResponse()</code>;</li>
              <li>Nas rotas protegidas por JWT, adicione <code>@ApiBearerAuth()</code> para habilitar o cadeado do Swagger;</li>
              <li>Acesse a documentação gerada em tempo real em <code>http://localhost:8097/api/docs</code>.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Sequência Guiada de Criação dos Arquivos */}
      <section className="section-card">
        <div className="section-header-row">
          <div>
            <h2>
              <Code2 size={20} style={{ display: 'inline', marginRight: '0.5rem' }} />
              Sequência Guiada de Criação dos Arquivos
            </h2>
            <p className="text-muted">
              Siga a ordem arquitetural de baixo para cima (Entity → DTO → Repository → Service → Controller → Module → Swagger E2E) e marque o seu progresso:
            </p>
          </div>
        </div>

        <div className="checklist-box" style={{ marginTop: '1rem' }}>
          {FILE_SEQUENCE_STEPS.map((step) => {
            const done = completedItems.includes(step.key);
            return (
              <div
                key={step.key}
                onClick={() => onToggleItem(step.key)}
                className={`checklist-item ${done ? 'completed' : ''}`}
                style={{ cursor: 'pointer', alignItems: 'flex-start' }}
              >
                <div style={{ marginTop: '0.15rem' }}>
                  {done ? <CheckCircle2 size={20} color="#10b981" /> : <Circle size={20} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span className="status-pill passed" style={{ fontSize: '0.72rem' }}>
                      {step.order}
                    </span>
                    <strong>{step.title}</strong>
                    <code style={{ fontSize: '0.78rem', opacity: 0.8 }}>{step.file}</code>
                  </div>
                  <p className="text-muted" style={{ fontSize: '0.85rem', marginTop: '0.3rem' }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Contrato dos Endpoints da API REST */}
      <section className="section-card">
        <h2>
          <Terminal size={20} style={{ display: 'inline', marginRight: '0.5rem' }} />
          Contrato da API REST de Linhas do SISMOB (/api/linhas)
        </h2>
        <div className="cards-grid two-cols" style={{ marginTop: '1rem' }}>
          {API_ENDPOINTS.map((ep, idx) => (
            <div key={idx} className="glass-card" style={{ padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', flexWrap: 'wrap', gap: '0.3rem' }}>
                <span className="status-pill passed" style={{ fontFamily: 'monospace', fontWeight: 700 }}>
                  {ep.method} {ep.path}
                </span>
                <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
                  <span className={`status-pill ${ep.auth.includes('JWT') ? 'active' : 'pending'}`} style={{ fontSize: '0.72rem' }}>
                    {ep.auth}
                  </span>
                  <span className="text-muted" style={{ fontSize: '0.75rem', fontFamily: 'monospace' }}>
                    {ep.status}
                  </span>
                </div>
              </div>
              <p className="text-muted" style={{ fontSize: '0.85rem' }}>
                {ep.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Submissão Padronizada e Checklist de Pull Request */}
      <ChallengeSubmissionPanel
        challengeId="challenge-backend-api"
        title="Entrega do Repositório & Checklist de Arquitetura Backend SUTINF"
        subtitle="Valide o cumprimento dos endpoints de Linha, Itinerários e Horários e cole o link do seu Merge Request / Repositório Git."
        requireRepoUrl={true}
        existingSubmission={submission}
        onSaveSubmission={onSaveSubmission}
        prChecklist={[
          'Clonei o SISMOB-BOILERPLATE, subi o PostgreSQL com Rancher Desktop e confirmei que GET /api/linhas funciona?',
          'Modelei as entidades/interfaces de Itinerário Descritivo e Horário respeitando o schema dados_mobilidade?',
          'Criei os DTOs com class-validator e decorators OpenAPI Swagger para os parâmetros de itinerário e quadro de horários?',
          'Implementei no LinhaRepository as queries SQL parametrizadas ($1, $2) sem concatenação direta (proteção SQL Injection)?',
          'No LinhaService, tratei o caso de linha inexistente disparando EntityNotFoundException (HTTP 404)?',
          'No LinhaController, expus GET /api/linhas/:codigo/itinerario e GET /api/linhas/:codigo/horarios com documentação Swagger?',
          'Protegi a rota de atualização com @UseGuards(JwtAuthGuard) e @ApiBearerAuth(), validando retorno 401 sem token?',
        ]}
      />
    </div>
  );
};

export default BackendChallengeScreen;
