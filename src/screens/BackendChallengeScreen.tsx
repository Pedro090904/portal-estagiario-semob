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
    folder: 'src/veiculos/entities/veiculo.entity.ts',
    role: 'Mapeamento ORM (TypeORM) que espelha fielmente a tabela do PostgreSQL com tipagem estrita de colunas e chaves.',
    mustDo: [
      'Decorar a classe com @Entity({ name: "tab_veiculo", schema: "dados_mobilidade" })',
      'Definir @PrimaryGeneratedColumn("increment") para id_veiculo',
      'Mapear nr_placa, nr_prefixo, ano_fabricacao, tp_combustivel e relacionar com id_linha via @ManyToOne',
    ],
    mustNotDo: [
      'NUNCA colocar lógica de negócio ou queries SQL dentro da Entity',
      'NUNCA importar Request, Response ou decorators HTTP nesta camada',
    ],
    codeSample: `@Entity({ name: 'tab_veiculo', schema: 'dados_mobilidade' })
export class VeiculoEntity {
  @PrimaryGeneratedColumn()
  id_veiculo: number;

  @Column({ length: 7, unique: true })
  nr_placa: string;

  @Column({ length: 8 })
  nr_prefixo: string;

  @Column({ type: 'int' })
  ano_fabricacao: number;

  @Column({ default: true })
  st_ativo: boolean;

  @ManyToOne(() => LinhaEntity, { nullable: false })
  @JoinColumn({ name: 'id_linha' })
  linha: LinhaEntity;
}`,
  },
  {
    id: 'dto',
    name: '2. DTO',
    folder: 'src/veiculos/dto/create-veiculo.dto.ts',
    role: 'Data Transfer Object para validação de entrada via class-validator e documentação OpenAPI Swagger.',
    mustDo: [
      'Validar formato de placa Mercosul com regex: @Matches(/^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/)',
      'Garantir ano de fabricação positivo com @Min(2000) e @Max(new Date().getFullYear() + 1)',
      'Documentar cada campo com decorators do Swagger: @ApiProperty({ example: "ABC1D23" })',
    ],
    mustNotDo: [
      'NUNCA permitir dados não tipados ou any no payload',
      'NUNCA confiar no body sem aplicar ValidationPipe({ whitelist: true })',
    ],
    codeSample: `import { IsString, IsNotEmpty, Matches, IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVeiculoDto {
  @ApiProperty({ description: 'Placa padrão Mercosul', example: 'BRA2E19' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/, {
    message: 'Placa deve seguir o padrão Mercosul (ex: ABC1D23)',
  })
  nr_placa: string;

  @ApiProperty({ description: 'Prefixo operacional da operadora', example: '112450' })
  @IsString()
  @IsNotEmpty()
  nr_prefixo: string;

  @ApiProperty({ description: 'Ano de fabricação do chassi', example: 2023 })
  @IsInt()
  @Min(2005)
  ano_fabricacao: number;

  @ApiProperty({ description: 'ID da Linha vinculada', example: 104 })
  @IsInt()
  id_linha: number;
}`,
  },
  {
    id: 'repository',
    name: '3. Repository',
    folder: 'src/veiculos/veiculo.repository.ts',
    role: 'Isolamento de persistência de dados. Executa queries com WHERE parametrizado e filtros operacionais.',
    mustDo: [
      'Estender ou injetar Repository<VeiculoEntity> gerenciado pelo TypeORM',
      'Implementar buscas parametrizadas garantindo WHERE cd_linha ou WHERE nr_placa',
      'Tratar paginação e isolar consultas geoespaciais caso aplicável',
    ],
    mustNotDo: [
      'NUNCA concatenar parâmetros em SQL bruto (risco crítico de SQL Injection)',
      'NUNCA executar comandos de escrita (UPDATE/DELETE) sem filtro WHERE explícito',
    ],
    codeSample: `@Injectable()
export class VeiculoRepository {
  constructor(
    @InjectRepository(VeiculoEntity)
    private readonly repo: Repository<VeiculoEntity>,
  ) {}

  async findByPlaca(placa: string): Promise<VeiculoEntity | null> {
    return this.repo.findOne({ where: { nr_placa: placa.toUpperCase() } });
  }

  async findByLinha(id_linha: number): Promise<VeiculoEntity[]> {
    return this.repo.find({
      where: { linha: { id_linha }, st_ativo: true },
      relations: ['linha'],
    });
  }
}`,
  },
  {
    id: 'service',
    name: '4. Service',
    folder: 'src/veiculos/veiculo.service.ts',
    role: 'Núcleo das regras de negócio. Valida unicidade de placa, idade máxima da frota da SEMOB e lança exceções semânticas.',
    mustDo: [
      'Verificar se a placa já existe antes de cadastrar e lançar ConflictException (409)',
      'Validar idade máxima do ônibus (regra SEMOB: frota máxima de 10 anos para convencionais)',
      'Lançar NotFoundException (404) quando o veículo ou a linha vinculada não existir',
    ],
    mustNotDo: [
      'NUNCA manipular objetos HTTP req/res diretamente dentro do Service',
      'NUNCA deixar passar erros de banco de dados sem encapsular em exceções de domínio',
    ],
    codeSample: `@Injectable()
export class VeiculoService {
  constructor(
    private readonly veiculoRepo: VeiculoRepository,
    private readonly linhaRepo: LinhaRepository,
  ) {}

  async criarVeiculo(dto: CreateVeiculoDto): Promise<VeiculoEntity> {
    const existe = await this.veiculoRepo.findByPlaca(dto.nr_placa);
    if (existe) {
      throw new ConflictException('Veículo com esta placa já está cadastrado no SISMOB');
    }

    const linha = await this.linhaRepo.findById(dto.id_linha);
    if (!linha) {
      throw new NotFoundException('Linha informada não existe');
    }

    return this.veiculoRepo.save({ ...dto, linha });
  }
}`,
  },
  {
    id: 'controller',
    name: '5. Controller',
    folder: 'src/veiculos/veiculo.controller.ts',
    role: 'Porta de entrada HTTP. Recebe payloads, valida tokens via Guards, anota rotas no Swagger e devolve respostas REST.',
    mustDo: [
      'Anotar classe com @ApiTags("Veículos") e @Controller("veiculos")',
      'Proteger rotas de mutação (POST, PUT, DELETE) com @UseGuards(JwtAuthGuard)',
      'Retornar status HTTP semânticos (200 OK, 201 Created, 204 No Content)',
    ],
    mustNotDo: [
      'NUNCA colocar lógicas de cálculo ou queries dentro de métodos do controller',
      'NUNCA deixar rotas sensíveis de gravação públicas sem autenticação JWT',
    ],
    codeSample: `@ApiTags('Veículos')
@Controller('veiculos')
export class VeiculoController {
  constructor(private readonly veiculoService: VeiculoService) {}

  @Get()
  @ApiOperation({ summary: 'Listar frota de veículos com filtros' })
  async listar(@Query('linhaId') linhaId?: number) {
    return this.veiculoService.listar(linhaId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cadastrar novo veículo no SISMOB (Apenas Fiscais Autenticados)' })
  @HttpCode(HttpStatus.CREATED)
  async criar(@Body() dto: CreateVeiculoDto) {
    return this.veiculoService.criarVeiculo(dto);
  }
}`,
  },
  {
    id: 'module',
    name: '6. Module',
    folder: 'src/veiculos/veiculo.module.ts',
    role: 'Módulo de injeção de dependências do NestJS que encapsula controllers, providers e exporta o service.',
    mustDo: [
      'Importar TypeOrmModule.forFeature([VeiculoEntity])',
      'Registrar VeiculoController em controllers: [...]',
      'Registrar VeiculoService e VeiculoRepository em providers: [...]',
      'Exportar VeiculoService para que outros módulos (ex: Fiscalizacao) possam consumi-lo',
    ],
    mustNotDo: [
      'NUNCA esquecer de registrar os repositories nos providers',
      'NUNCA criar dependências circulares entre módulos sem forwardRef()',
    ],
    codeSample: `@Module({
  imports: [
    TypeOrmModule.forFeature([VeiculoEntity]),
    LinhasModule, // Importa dependência de validação de linhas
  ],
  controllers: [VeiculoController],
  providers: [VeiculoService, VeiculoRepository],
  exports: [VeiculoService],
})
export class VeiculoModule {}`,
  },
  {
    id: 'appmodule',
    name: '7. AppModule',
    folder: 'src/app.module.ts',
    role: 'Raiz da aplicação NestJS. Agrega AuthModule (JWT), DatabaseModule, LinhasModule e o novo VeiculoModule.',
    mustDo: [
      'Importar ConfigModule para variáveis de ambiente (.env)',
      'Importar AuthModule com JwtStrategy e JwtAuthGuard global ou por rota',
      'Adicionar VeiculoModule à lista principal de imports do sistema',
    ],
    mustNotDo: [
      'NUNCA deixar segredos de JWT hardcoded no app.module.ts',
      'NUNCA subir a API sem registrar o módulo recém-criado na árvore raiz',
    ],
    codeSample: `@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({ useClass: DatabaseConfigService }),
    AuthModule,     // Provedor de JWT Tokens e Guards
    LinhasModule,   // Módulo validado do ecossistema base
    VeiculoModule,  // MÓDULO NOVO IMPLEMENTADO NO DESAFIO
  ],
})
export class AppModule {}`,
  },
];

const FILE_SEQUENCE_STEPS = [
  {
    key: 'back-step-1',
    order: '1º Arquivo',
    file: 'src/veiculos/entities/veiculo.entity.ts',
    title: 'Modelar a Entidade de Veículo (TypeORM Entity)',
    desc: 'Mapeie as colunas da tabela dados_mobilidade.tab_veiculo, chaves primárias e o relacionamento com LinhaEntity.',
  },
  {
    key: 'back-step-2',
    order: '2º Arquivo',
    file: 'src/veiculos/dto/create-veiculo.dto.ts',
    title: 'Definir DTOs com Validação Estrita (class-validator)',
    desc: 'Crie os DTOs com decorators de validação (Regex de placa Mercosul, ano de fabricação) e documentação Swagger.',
  },
  {
    key: 'back-step-3',
    order: '3º Arquivo',
    file: 'src/veiculos/veiculo.repository.ts',
    title: 'Implementar a Persistência (Custom Repository)',
    desc: 'Isole as consultas ao banco: buscas por placa, filtros por linha e operações de escrita com cláusula WHERE explícita.',
  },
  {
    key: 'back-step-4',
    order: '4º Arquivo',
    file: 'src/veiculos/veiculo.service.ts',
    title: 'Codificar as Regras de Domínio e Validações (Service)',
    desc: 'Implemente regras de negócio da SEMOB: duplicidade de placa, limite de idade da frota (10 anos) e exceções semânticas.',
  },
  {
    key: 'back-step-5',
    order: '5º Arquivo',
    file: 'src/veiculos/veiculo.controller.ts',
    title: 'Expor os Endpoints HTTP com Guards JWT (Controller)',
    desc: 'Mapeie as rotas REST com status codes corretos, documentação OpenAPI Swagger e proteção @UseGuards(JwtAuthGuard).',
  },
  {
    key: 'back-step-6',
    order: '6º Arquivo',
    file: 'src/veiculos/veiculo.module.ts',
    title: 'Empacotar o Módulo NestJS (Dependency Injection)',
    desc: 'Conecte Entity, Repository, Service e Controller no módulo independente de Veículos.',
  },
  {
    key: 'back-step-7',
    order: '7º Arquivo',
    file: 'src/app.module.ts',
    title: 'Acoplar na Raiz da Aplicação (AppModule)',
    desc: 'Importe o VeiculoModule no módulo principal para disponibilizar os endpoints na API e na documentação Swagger.',
  },
];

const API_ENDPOINTS = [
  { method: 'GET', path: '/veiculos', auth: 'Público', status: '200 OK', desc: 'Lista veículos cadastrados com filtros opcionais (?linhaId=104&ano=2023)' },
  { method: 'GET', path: '/veiculos/:id', auth: 'Público', status: '200 / 404', desc: 'Retorna dados completos de um veículo específico pelo ID ou código' },
  { method: 'GET', path: '/veiculos/linha/:cd_linha', auth: 'Público', status: '200 OK', desc: 'Retorna toda a frota operacional alocada a uma linha específica (ex: 0.110)' },
  { method: 'POST', path: '/veiculos', auth: 'Bearer JWT', status: '201 / 400 / 409', desc: 'Cadastra novo veículo com validação de placa Mercosul e checagem de duplicidade' },
  { method: 'PUT', path: '/veiculos/:id', auth: 'Bearer JWT', status: '200 / 404', desc: 'Atualiza dados cadastrais do veículo (status ativo, prefixo) filtrando pelo ID no WHERE' },
  { method: 'DELETE', path: '/veiculos/:id', auth: 'Bearer JWT', status: '204 / 404', desc: 'Inativa operacionalmente o veículo na frota da SEMOB de forma segura' },
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
          <h1>Desafio de Engenharia Backend: Módulo de Veículos (SISMOB)</h1>
          <p>
            Construa o módulo completo de <strong>Veículos da Frota SEMOB</strong> utilizando o padrão
            arquitetural oficial da SUTINF em <strong>7 camadas NestJS + TypeORM</strong>, protegido por
            autenticação <strong>JWT</strong> e documentado com <strong>OpenAPI Swagger</strong>.
          </p>
          <div className="hero-actions">
            <button className="btn-secondary" onClick={() => onOpenModule('mod-4-backend')}>
              <BookOpen size={16} /> Revisar Módulo 4: Arquitetura Backend na Plataforma
            </button>
          </div>
        </div>
      </section>

      {/* Roteiro da Missão: Do Clone ao Módulo de Veículos */}
      <section className="section-card">
        <h2>
          <GitBranch size={20} style={{ display: 'inline', marginRight: '0.5rem' }} />
          Roteiro da Missão: Como executar este desafio passo a passo
        </h2>
        <p className="text-muted" style={{ marginTop: '0.3rem', marginBottom: '1.25rem' }}>
          Este desafio simula o fluxo diário de engenharia na SUTINF/SEMOB. Siga os 3 passos estruturantes:
        </p>

        <div className="cards-grid three-cols">
          <div className="glass-card" style={{ borderTop: '4px solid #3b82f6', padding: '1.25rem' }}>
            <span className="status-pill pending" style={{ marginBottom: '0.5rem' }}>Passo 1 • Setup</span>
            <h3 style={{ fontSize: '1.05rem', marginTop: '0.3rem' }}>Clonar Boilerplate SEMOB</h3>
            <p className="text-muted" style={{ fontSize: '0.85rem', marginTop: '0.5rem', lineHeight: 1.5 }}>
              Clone o repositório base com a estrutura NestJS, Docker Compose e banco PostgreSQL já configurados:
            </p>
            <pre className="code-block" style={{ fontSize: '0.78rem', margin: '0.75rem 0' }}>
              <code>git clone https://gitlab.semob.df.gov.br/sutinf/sismob-backend.git&#10;cd sismob-backend&#10;npm install</code>
            </pre>
          </div>

          <div className="glass-card" style={{ borderTop: '4px solid #10b981', padding: '1.25rem' }}>
            <span className="status-pill passed" style={{ marginBottom: '0.5rem' }}>Passo 2 • Validação</span>
            <h3 style={{ fontSize: '1.05rem', marginTop: '0.3rem' }}>Subir e Testar /linhas</h3>
            <p className="text-muted" style={{ fontSize: '0.85rem', marginTop: '0.5rem', lineHeight: 1.5 }}>
              Suba o banco e a API com Docker, verifique o módulo de <code>/linhas</code> já existente e explore o Swagger:
            </p>
            <pre className="code-block" style={{ fontSize: '0.78rem', margin: '0.75rem 0' }}>
              <code>docker compose up -d&#10;npm run start:dev&#10;# Acesse: http://localhost:3333/api/docs</code>
            </pre>
          </div>

          <div className="glass-card" style={{ borderTop: '4px solid #f59e0b', padding: '1.25rem' }}>
            <span className="status-pill active" style={{ marginBottom: '0.5rem' }}>Passo 3 • Desafio Real</span>
            <h3 style={{ fontSize: '1.05rem', marginTop: '0.3rem' }}>Criar os 7 Arquivos de Veículos</h3>
            <p className="text-muted" style={{ fontSize: '0.85rem', marginTop: '0.5rem', lineHeight: 1.5 }}>
              O desafio começa aqui! Crie o novo domínio <code>/veiculos</code> passando por todos os 7 arquivos obrigatórios, com validação de placa Mercosul e JWT.
            </p>
          </div>
        </div>
      </section>

      {/* Fluxo Interativo dos 7 Arquivos da Arquitetura SUTINF */}
      <section className="section-card">
        <div className="section-header-row">
          <div>
            <h2>
              <Layers size={20} style={{ display: 'inline', marginRight: '0.5rem' }} />
              Os 7 Arquivos Obrigatórios da Arquitetura SEMOB (Clique para inspecionar)
            </h2>
            <p className="text-muted">
              Inspecione o papel, as regras e o código de referência de cada uma das 7 camadas antes de escrever seu código.
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
              No ecossistema da SEMOB, requisições de consulta pública (leitura de linhas e frotas) não exigem token. Porém, <strong>operações de mutação (POST /veiculos, PUT, DELETE)</strong> alteram a base cadastral de transporte e DEVEM ser protegidas:
            </p>
            <ul style={{ paddingLeft: '1.2rem', fontSize: '0.85rem', lineHeight: 1.6, marginTop: '0.5rem' }}>
              <li>Utilize o decorador <code>@UseGuards(JwtAuthGuard)</code> no controller de Veículos;</li>
              <li>A requisição deve enviar o cabeçalho <code>Authorization: Bearer &lt;token&gt;</code>;</li>
              <li>O token é gerado pelo <code>AuthModule</code> presente no boilerplate da SEMOB;</li>
              <li>Em caso de token ausente ou expirado, a API deve retornar <code>401 Unauthorized</code> automaticamente.</li>
            </ul>
          </div>

          <div className="glass-card" style={{ padding: '1.25rem', borderLeft: '4px solid #0ea5e9' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
              <FileText size={18} color="#0ea5e9" /> Documentação OpenAPI Swagger
            </h3>
            <p className="text-muted" style={{ fontSize: '0.88rem', marginTop: '0.5rem', lineHeight: 1.6 }}>
              Toda API governamental da SEMOB deve ser auto-documentada para consumo de outras secretarias e aplicativos mobile:
            </p>
            <ul style={{ paddingLeft: '1.2rem', fontSize: '0.85rem', lineHeight: 1.6, marginTop: '0.5rem' }}>
              <li>Decore a classe do controller com <code>@ApiTags('Veículos')</code>;</li>
              <li>Decore cada endpoint com <code>@ApiOperation(&#123; summary: '...' &#125;)</code> e <code>@ApiResponse()</code>;</li>
              <li>Nas rotas protegidas por JWT, adicione <code>@ApiBearerAuth()</code>;</li>
              <li>Verifique a documentação gerada em tempo real acessando <code>http://localhost:3333/api/docs</code>.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Sequência Guiada de Criação dos 7 Arquivos */}
      <section className="section-card">
        <div className="section-header-row">
          <div>
            <h2>
              <Code2 size={20} style={{ display: 'inline', marginRight: '0.5rem' }} />
              Sequência Guiada de Criação dos 7 Arquivos
            </h2>
            <p className="text-muted">
              Siga a ordem arquitetural de baixo para cima (Entity → DTO → Repository → Service → Controller → Module → AppModule) e marque o seu progresso:
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

      {/* Contrato dos Endpoints do Módulo de Veículos */}
      <section className="section-card">
        <h2>
          <Terminal size={20} style={{ display: 'inline', marginRight: '0.5rem' }} />
          Contrato da API REST de Veículos (/veiculos)
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
        subtitle="Valide o cumprimento dos 7 arquivos e cole o link do seu Merge Request / Repositório Git."
        requireRepoUrl={true}
        existingSubmission={submission}
        onSaveSubmission={onSaveSubmission}
        prChecklist={[
          'Clonei o boilerplate, rodei o Docker Compose e validei o funcionamento prévio do módulo /linhas?',
          'Criei os 7 arquivos do módulo de Veículos: Entity, DTO, Repository, Service, Controller, Module e AppModule?',
          'O DTO valida placa padrão Mercosul com regex e ano de fabricação positivo com class-validator?',
          'O Service valida unicidade de placa lançando ConflictException (409) e trata inexistência com NotFoundException (404)?',
          'As rotas de mutação (POST, PUT, DELETE) estão devidamente protegidas com @UseGuards(JwtAuthGuard)?',
          'Todos os endpoints e DTOs foram documentados com decoradores OpenAPI Swagger?',
        ]}
      />
    </div>
  );
};
export default BackendChallengeScreen;

