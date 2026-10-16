import { LearningModule } from '../../types';

export const mod04Backend: LearningModule = {
  id: 'mod-4-backend',
  order: 4,
  title: 'Manual Oficial de Desenvolvimento Back-end (NestJS • TypeORM • SQL)',
  category: 'backend',
  estimatedTime: '3h 30min',
  description:
    'Guia arquitetural definitivo, padrões de código, ciclo de vida de requisições, tratamento global de exceções, blindagem contra SQL Injection e tutorial prático do zero ao endpoint completo com Swagger e Jest.',
  objectives: [
    'Dominar a Arquitetura em Camadas (Controller ➔ Service ➔ Repository ➔ Entity) com IoC/DI no NestJS',
    'Aplicar validação declarativa com DTOs (class-validator) e padronização de Status Codes HTTP',
    'Utilizar a hierarquia de exceções de domínio (BusinessException, EntityNotFoundException, EntityAlreadyExistsException)',
    'Decidir entre TypeORM (CRUD) e SQL Nativo Parametrizado ($1, $2) com blindagem total contra SQL Injection',
    'Construir um módulo completo do zero (Entidade, DTO, Repository, Service, Controller, Module e Testes Unitários)',
  ],
  sections: [
    {
      heading: '1. Padrão Arquitetural e Ciclo de Vida da Requisição',
      body: 'O projeto adota uma Arquitetura em Camadas (Layered Architecture) com Modularidade por Domínio e Inversão de Controle / Injeção de Dependências (IoC / DI). As camadas seguem o princípio da responsabilidade única (SRP) e da dependência unidirecional descendente: cada camada só pode invocar serviços da camada imediatamente inferior, nunca da superior e nunca pulando etapas.',
      codeBlocks: [
        {
          title: 'Fluxo Unidirecional Descendente das Camadas',
          language: 'text',
          code: `[ Cliente HTTP ]
       │
       ▼
[ Camada de Entrada ] ──────► Controllers, DTOs & Swagger
       │
       ▼
[ Camada de Domínio ] ──────► Services & Exceções de Negócio
       │
       ▼
[ Camada de Persistência ] ──► Repositories (TypeORM / SQL Parametrizado)
       │
       ▼
[ Camada de Dados ] ────────► Entidades & Banco de Dados (PostgreSQL / Oracle)`,
        },
      ],
      callouts: [
        {
          type: 'important',
          title: '🛡️ Regra Fundamental de Isolamento Back-end',
          content: 'O respeito às fronteiras de cada camada é obrigatório em qualquer Pull Request:',
          bullets: [
            'O Controller nunca acessa o banco de dados diretamente;',
            'O Repository nunca conhece objetos de requisição HTTP (Request, Response) e não contém regras de validação de negócio;',
            'O Service é o único detentor das decisões, orquestrações e regras do domínio.',
          ],
        },
        {
          type: 'info',
          title: '🔄 Esteira de Execução de uma Requisição no NestJS (Request Lifecycle)',
          content: 'Qualquer requisição HTTP que chega à API percorre rigorosamente 7 etapas:',
          bullets: [
            '1. Global Prefix (/api) & CORS: Recebe a chamada HTTP e valida a origem.',
            '2. JwtAuthGuard: Avalia se a rota é privada; se o Bearer Token for inválido ou ausente, dispara 401 Unauthorized imediatamente.',
            '3. ValidationPipe (DTO): Valida o payload contra o DTO (whitelist: true, forbidNonWhitelisted: true). Se falhar, retorna 400 Bad Request.',
            '4. Controller: Recebe o DTO tipado e sanitizado e invoca o método correspondente no Service.',
            '5. Service: Valida as regras de negócio (ex: duplicidade, valores válidos). Se violar, lança BusinessException / EntityNotFoundException.',
            '6. Repository: Executa a query parametrizada ($1, $2) com cláusula WHERE ou método TypeORM no PostgreSQL/Oracle.',
            '7. AllExceptionsFilter: Se qualquer erro ocorrer em qualquer etapa, formata em um JSON único e seguro sem vazar stack trace.',
          ],
        },
      ],
    },
    {
      heading: '2. Estrutura de Pastas e Matriz de Responsabilidades',
      body: 'Compreenda onde cada arquivo reside no boilerplate oficial e o que é estritamente proibido em cada diretório:',
      codeBlocks: [
        {
          title: 'Mapeamento Completo de Diretórios (src/)',
          language: 'text',
          code: `SISMOB-BOILERPLATE/
├── src/
│   ├── config/        ← Database.ts (TypeORM), Jwt.ts e scripts seeds (.sql)
│   ├── controller/    ← Camada de entrada REST (Auth.ts, Linha.ts, Docs.ts)
│   ├── service/       ← Camada de lógica de negócio (Auth.ts, Linha.ts, Seed.ts)
│   ├── repository/    ← Persistência customizada e SQL nativo anti-injection
│   ├── entity/        ← Mapeamento relacional das tabelas (TypeORM Entities)
│   ├── dto/           ← Contratos de entrada/saída com class-validator e Swagger
│   ├── guards/        ← JwtAuthGuard (validação de Bearer Token)
│   ├── filters/       ← all-exceptions.filter.ts (captura global de erros)
│   ├── exceptions/    ← Business.ts (400), entity-not-found (404), already-exists (409)
│   ├── module/        ← Módulos isolados por domínio (LinhaModule, VeiculoModule)
│   ├── utils/         ← BaseEntity abstrata com timestamps de auditoria
│   ├── docs/          ← Swagger.ts (setup da UI OpenAPI)
│   ├── app.module.ts  ← Módulo raiz da aplicação
│   └── main.ts        ← Bootstrap, ValidationPipe global, filtros e porta`,
        },
      ],
      tables: [
        {
          headers: ['Diretório / Camada', 'O QUE DEVE SER FEITO AQUI ✅', 'O QUE NUNCA DEVE SER FEITO AQUI ❌'],
          rows: [
            [
              '/controller',
              '• Definir rotas HTTP (@Get, @Post)\n• Associar DTOs (@Body, @Query, @Param)\n• Declarar decorators Swagger (@ApiTags, @ApiOperation)\n• Aplicar @UseGuards(JwtAuthGuard)',
              '• NUNCA faça queries SQL ou acesse repositories diretamente.\n• NUNCA implemente if/else com regras de negócio.',
            ],
            [
              '/service',
              '• Conter 100% da lógica e regras de negócio.\n• Lançar exceções semânticas (BusinessException, etc.).\n• Orquestrar chamadas a um ou múltiplos repositories.',
              '• NUNCA acesse objetos Express (req, res).\n• NUNCA monte queries SQL dinâmicas (isso pertence ao Repository).',
            ],
            [
              '/repository',
              '• Executar queries SQL parametrizadas (this.dataSource.query).\n• Utilizar métodos do TypeORM (find, findOne, save).\n• Mapear projeções para DTOs ou entidades.',
              '• NUNCA aplique regras de validação de negócio aqui.\n• NUNCA concatene strings em queries SQL (+ param).',
            ],
            [
              '/entity',
              '• Mapear tabelas, schemas, colunas e chaves primárias (@PrimaryGeneratedColumn).',
              '• NUNCA retorne entidades com campos sensíveis (senhas, hashes) diretamente na API.',
            ],
            [
              '/dto',
              '• Declarar contratos com decorators do class-validator e @ApiProperty() do Swagger.',
              '• NUNCA use tipos genéricos (any) nos atributos do DTO.',
            ],
          ],
        },
      ],
    },
    {
      heading: '3. Padrões de Código, DTOs e Status Codes HTTP',
      body: 'Para manter consistência em todo o ecossistema, seguimos convenções estritas de nomenclatura, validação de entrada com ValidationPipe e semântica de verbos HTTP.',
      tables: [
        {
          headers: ['Elemento', 'Convenção', 'Exemplo Correto', 'Exemplo Incorreto'],
          rows: [
            ['Classes de Controller', 'PascalCase + sufixo Controller', 'LinhaController, VeiculoController', 'LinhaCtrl, Linhas'],
            ['Classes de Service', 'PascalCase + sufixo Service', 'LinhaService, AuthService', 'LinhaManager, LinhaLogic'],
            ['Classes de Repository', 'PascalCase + sufixo Repository', 'LinhaRepository, VeiculoRepository', 'LinhaDao, LinhaDb'],
            ['Classes de Entidade', 'PascalCase singular', 'Linha, Veiculo, Usuario', 'Linhas, TabLinha'],
            ['Classes DTO', 'PascalCase + sufixo Dto', 'FilterLinhaDto, CreateVeiculoDto', 'LinhaFilter, VeiculoInput'],
            ['Métodos e Variáveis', 'camelCase', 'buscarLinhas(), codigoLinha', 'BuscarLinhas(), codigo_linha'],
            ['Tabelas e Colunas SQL', 'snake_case com prefixo', 'dados_mobilidade.tab_linha, cd_linha', 'Linhas, CodLinha'],
          ],
        },
        {
          headers: ['Verbo HTTP', 'Status Code', 'Quando Utilizar', 'Payload de Resposta'],
          rows: [
            ['GET', '200 OK', 'Busca de listagens ou recurso pontual por ID', 'Objeto encontrado ou array de objetos'],
            ['POST', '201 Created', 'Criação bem-sucedida de um novo recurso', 'Objeto recém-criado com seu ID gerado'],
            ['PUT / PATCH', '200 OK', 'Atualização completa ou parcial de um recurso', 'Recurso com seus dados atualizados'],
            ['DELETE', '200 OK / 204', 'Remoção de um recurso do sistema', 'Mensagem de confirmação ou 204 sem body'],
            ['QUALQUER', '400 Bad Request', 'Falha de validação no DTO ou violação de regra de negócio', 'JSON padronizado com statusCode: 400'],
            ['QUALQUER', '401 / 403', 'Token ausente/inválido (401) ou sem permissão (403)', 'JSON padronizado de erro'],
            ['QUALQUER', '404 Not Found', 'Recurso solicitado não existe no banco de dados', 'JSON padronizado com statusCode: 404'],
            ['QUALQUER', '409 Conflict', 'Violação de unicidade (ex: placa ou prefixo já cadastrado)', 'JSON padronizado com statusCode: 409'],
          ],
        },
      ],
      codeBlocks: [
        {
          title: 'Configuração Global do ValidationPipe (src/main.ts)',
          language: 'typescript',
          code: `app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,            // Remove automaticamente qualquer propriedade não declarada no DTO
    forbidNonWhitelisted: true, // Lança HTTP 400 se o cliente enviar propriedades estranhas
    transform: true,            // Converte strings em tipos primitivos automaticamente (ex: '123' -> 123)
  }),
);`,
        },
        {
          title: 'Exemplo de DTO com class-validator e Swagger (src/dto/Linha.ts)',
          language: 'typescript',
          code: `import { IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilterLinhaDto {
  @ApiPropertyOptional({
    description: 'Código oficial da linha no padrão SEMOB',
    example: '0.108',
  })
  @IsOptional()
  @IsString({ message: 'O código da linha deve ser uma string.' })
  @MaxLength(8, { message: 'O código da linha não pode exceder 8 caracteres.' })
  codigo?: string;

  @ApiPropertyOptional({
    description: 'Descrição ou itinerário da linha',
    example: 'W3 Norte',
  })
  @IsOptional()
  @IsString({ message: 'A descrição deve ser um texto válido.' })
  @MaxLength(255, { message: 'A descrição não pode exceder 255 caracteres.' })
  descricao?: string;
}`,
        },
      ],
    },
    {
      heading: '4. Tratamento Global de Erros e Hierarquia de Exceções',
      body: 'Nenhuma exceção não tratada deve vazar para o cliente como stack trace de Node.js. O projeto conta com o AllExceptionsFilter e classes semânticas derivadas de HttpException.',
      codeBlocks: [
        {
          title: 'Hierarquia de Exceções de Domínio e Uso no Service',
          language: 'typescript',
          code: `/*
          ┌──────────────────────────┐
          │      HttpException       │
          └─────────────┬────────────┘
                        ▼
          ┌──────────────────────────┐
          │    BusinessException     │  ──► Status 400 (Bad Request)
          └─────────────┬────────────┘
          ┌─────────────┴────────────────────────────┐
          ▼                                          ▼
┌───────────────────────────┐              ┌───────────────────────────┐
│  EntityNotFoundException  │              │EntityAlreadyExistsException│
│   ──► Status 404          │              │    ──► Status 409         │
└───────────────────────────┘              └───────────────────────────┘
*/

import { EntityNotFoundException } from '../exceptions/entity-not-found.exception';
import { EntityAlreadyExistsException } from '../exceptions/entity-already-exists.exception';
import { BusinessException } from '../exceptions/Business';

// 1. Recurso não localizado (404)
if (!registro) {
  throw new EntityNotFoundException('Linha', codigo);
}

// 2. Conflito de duplicidade (409)
if (existeLinha) {
  throw new EntityAlreadyExistsException('Linha', 'código', codigo);
}

// 3. Regra de negócio violada (400)
if (valorTarifa < 0) {
  throw new BusinessException('O valor da tarifa não pode ser negativo.');
}`,
        },
      ],
    },
    {
      heading: '5. Acesso a Dados: ORM vs. SQL Nativo e Blindagem Anti-SQL Injection',
      body: 'Utilizamos TypeORM para operações de CRUD simples (criação, edição, deleção e busca por PK) pela produtividade e auditoria automática, e SQL Nativo Parametrizado (this.dataSource.query) para consultas complexas com múltiplos JOINs, agregações ou filtros dinâmicos.',
      callouts: [
        {
          type: 'danger',
          title: '🚨 TOLERÂNCIA ZERO PARA CONCATENAÇÃO DE SQL (SQL INJECTION)',
          content:
            'Sob nenhuma circunstância utilize concatenação (+ ou template string \${var}) para inserir valores externos no comando SQL. Utilize sempre parâmetros numerados ($1, $2) com array separado de valores e cláusula WHERE explícita.',
        },
      ],
      codeBlocks: [
        {
          title: '✅ PADRÃO CORRETO (Parametrizado com WHERE vs. ❌ Vulnerável)',
          language: 'typescript',
          code: `// ✅ PADRÃO CORRETO (SEGURO CONTRA SQL INJECTION):
async findByFilters(codigo?: string, descricao?: string): Promise<Linha[]> {
  let sql = \`
    SELECT 
      id_linha as "id", 
      cd_linha as "codigo", 
      tx_linha as "descricao", 
      vl_tarifa as "valorTarifa"
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

  return this.dataSource.query(sql, params);
}

// ❌ CÓDIGO VULNERÁVEL (ESTRITAMENTE PROIBIDO):
// const sql = "SELECT * FROM tab_linha WHERE cd_linha = '" + codigo + "'";`,
        },
      ],
    },
    {
      heading: '6. Tutorial Prático Completo: Do Zero ao Endpoint de Veículos (7 Passos)',
      body: 'Acompanhe abaixo a implementação completa do módulo de Veículos seguindo a ordem oficial de desenvolvimento: 1. Entidade ➔ 2. DTOs ➔ 3. Repository ➔ 4. Service ➔ 5. Controller ➔ 6. Module ➔ 7. AppModule & Testes.',
      codeBlocks: [
        {
          title: 'Passo 1: Criação da Entidade de Banco (src/entity/Veiculo.ts)',
          language: 'typescript',
          code: `import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity({ name: 'tab_veiculo', schema: 'dados_mobilidade' })
export class Veiculo {
  @PrimaryGeneratedColumn({ name: 'id_veiculo' })
  id: number;

  @Column({ name: 'nr_prefixo', length: 10, unique: true })
  prefixo: string; // Ex: '115201'

  @Column({ name: 'nr_placa', length: 8, unique: true })
  placa: string; // Ex: 'ABC1D23'

  @Column({ name: 'ds_modelo', length: 100 })
  modelo: string; // Ex: 'Caio Millennium IV'

  @Column({ name: 'st_ativo', type: 'boolean', default: true })
  ativo: boolean;

  @CreateDateColumn({ name: 'dataregistro' })
  dataRegistro: Date;
}`,
        },
        {
          title: 'Passo 2: Definição dos DTOs de Entrada e Validação (src/dto/Veiculo.ts)',
          language: 'typescript',
          code: `import { IsString, IsNotEmpty, IsOptional, MaxLength, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateVeiculoDto {
  @ApiProperty({ description: 'Número do prefixo do veículo', example: '115201' })
  @IsNotEmpty({ message: 'O prefixo é obrigatório.' })
  @IsString({ message: 'O prefixo deve ser texto.' })
  @MaxLength(10, { message: 'Prefixo não pode exceder 10 caracteres.' })
  prefixo: string;

  @ApiProperty({ description: 'Placa do veículo (padrão Mercosul)', example: 'ABC1D23' })
  @IsNotEmpty({ message: 'A placa é obrigatória.' })
  @IsString({ message: 'A placa deve ser texto.' })
  @MaxLength(8, { message: 'Placa não pode exceder 8 caracteres.' })
  placa: string;

  @ApiProperty({ description: 'Modelo ou fabricante do veículo', example: 'Caio Millennium IV' })
  @IsNotEmpty({ message: 'O modelo é obrigatório.' })
  @IsString({ message: 'O modelo deve ser texto.' })
  @MaxLength(100, { message: 'Modelo não pode exceder 100 caracteres.' })
  modelo: string;
}

export class FilterVeiculoDto {
  @ApiPropertyOptional({ description: 'Filtro por prefixo', example: '115' })
  @IsOptional()
  @IsString()
  prefixo?: string;

  @ApiPropertyOptional({ description: 'Filtro por status ativo/inativo', example: true })
  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}`,
        },
        {
          title: 'Passo 3: Criação do Repositório Especializado (src/repository/Veiculo.ts)',
          language: 'typescript',
          code: `import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Veiculo } from '../entity/Veiculo';

@Injectable()
export class VeiculoRepository extends Repository<Veiculo> {
  constructor(private dataSource: DataSource) {
    super(Veiculo, dataSource.createEntityManager());
  }

  async findByFilters(prefixo?: string, ativo?: boolean): Promise<Veiculo[]> {
    let sql = \`
      SELECT 
        id_veiculo as "id",
        nr_prefixo as "prefixo",
        nr_placa as "placa",
        ds_modelo as "modelo",
        st_ativo as "ativo",
        dataregistro as "dataRegistro"
      FROM dados_mobilidade.tab_veiculo
      WHERE 1=1
    \`;

    const params: unknown[] = [];

    if (prefixo) {
      sql += \` AND nr_prefixo LIKE $\${params.length + 1}\`;
      params.push(\`%\${prefixo}%\`);
    }

    if (ativo !== undefined) {
      sql += \` AND st_ativo = $\${params.length + 1}\`;
      params.push(ativo);
    }

    sql += \` ORDER BY nr_prefixo ASC\`;
    return this.dataSource.query(sql, params);
  }
}`,
        },
        {
          title: 'Passo 4: Implementação do Service com Regras de Negócio (src/service/Veiculo.ts)',
          language: 'typescript',
          code: `import { Injectable } from '@nestjs/common';
import { VeiculoRepository } from '../repository/Veiculo';
import { Veiculo } from '../entity/Veiculo';
import { CreateVeiculoDto, FilterVeiculoDto } from '../dto/Veiculo';
import { EntityNotFoundException } from '../exceptions/entity-not-found.exception';
import { EntityAlreadyExistsException } from '../exceptions/entity-already-exists.exception';

@Injectable()
export class VeiculoService {
  constructor(private readonly veiculoRepository: VeiculoRepository) {}

  async listar(filters: FilterVeiculoDto): Promise<Veiculo[]> {
    return this.veiculoRepository.findByFilters(filters.prefixo, filters.ativo);
  }

  async buscarPorId(id: number): Promise<Veiculo> {
    const veiculo = await this.veiculoRepository.findOne({ where: { id } });
    if (!veiculo) {
      throw new EntityNotFoundException('Veículo', id);
    }
    return veiculo;
  }

  async criar(dto: CreateVeiculoDto): Promise<Veiculo> {
    const placaExistente = await this.veiculoRepository.findOne({ where: { placa: dto.placa } });
    if (placaExistente) {
      throw new EntityAlreadyExistsException('Veículo', 'placa', dto.placa);
    }

    const prefixoExistente = await this.veiculoRepository.findOne({ where: { prefixo: dto.prefixo } });
    if (prefixoExistente) {
      throw new EntityAlreadyExistsException('Veículo', 'prefixo', dto.prefixo);
    }

    const novoVeiculo = this.veiculoRepository.create(dto);
    return this.veiculoRepository.save(novoVeiculo);
  }
}`,
        },
        {
          title: 'Passo 5 & 6: Controller OpenAPI e Registro do Módulo (src/controller/Veiculo.ts & src/module/Veiculo.ts)',
          language: 'typescript',
          code: `import { Controller, Get, Post, Body, Param, Query, UseGuards, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { VeiculoService } from '../service/Veiculo';
import { CreateVeiculoDto, FilterVeiculoDto } from '../dto/Veiculo';
import { JwtAuthGuard } from '../guards/Jwt';

@ApiTags('Veículos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('veiculos')
export class VeiculoController {
  constructor(private readonly veiculoService: VeiculoService) {}

  @Get()
  @ApiOperation({ summary: 'Listar veículos com filtros opcionais' })
  async listar(@Query() filters: FilterVeiculoDto) {
    return this.veiculoService.listar(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter detalhes de um veículo por ID' })
  async buscarPorId(@Param('id') id: number) {
    return this.veiculoService.buscarPorId(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Cadastrar um novo veículo na frota' })
  async criar(@Body() dto: CreateVeiculoDto) {
    return this.veiculoService.criar(dto);
  }
}`,
        },
        {
          title: 'Passo 7: Teste Unitário Isolado Mockando o Repository (src/service/Veiculo.spec.ts)',
          language: 'typescript',
          code: `import { Test, TestingModule } from '@nestjs/testing';
import { VeiculoService } from './Veiculo';
import { VeiculoRepository } from '../repository/Veiculo';
import { EntityNotFoundException } from '../exceptions/entity-not-found.exception';

describe('VeiculoService', () => {
  let service: VeiculoService;
  let repository: Partial<Record<keyof VeiculoRepository, jest.Mock>>;

  beforeEach(async () => {
    repository = {
      findOne: jest.fn(),
      findByFilters: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VeiculoService,
        { provide: VeiculoRepository, useValue: repository },
      ],
    }).compile();

    service = module.get<VeiculoService>(VeiculoService);
  });

  it('deve lançar EntityNotFoundException se o veículo não existir', async () => {
    repository.findOne!.mockResolvedValue(null);
    await expect(service.buscarPorId(999)).rejects.toThrow(EntityNotFoundException);
  });
});`,
        },
      ],
    },
  ],
  checklist: [
    'A rota possui DTO de entrada com validações do class-validator e documentação Swagger',
    'O Controller não contém nenhuma regra de negócio ou lógica de banco de dados',
    'O Service lança exceções semânticas (EntityNotFoundException, BusinessException)',
    'O Repository utiliza queries parametrizadas ($1, $2) com cláusula WHERE sem concatenação de strings',
    'O novo módulo foi registado no AppModule e validado com testes unitários',
  ],
};
