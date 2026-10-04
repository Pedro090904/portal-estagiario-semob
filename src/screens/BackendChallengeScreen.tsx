import React, { useState } from 'react';
import { ScreenType } from '../types';
import { 
  Server, 
  CheckCircle2, 
  Copy, 
  Check, 
  Terminal, 
  Code, 
  ShieldCheck, 
  ExternalLink,
  BookOpen
} from 'lucide-react';

interface BackendChallengeScreenProps {
  isCompleted: boolean;
  onToggleComplete: () => void;
  onNavigate: (screen: ScreenType) => void;
}

export const BackendChallengeScreen: React.FC<BackendChallengeScreenProps> = ({
  isCompleted,
  onToggleComplete,
  onNavigate,
}) => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [simulatedLoginDone, setSimulatedLoginDone] = useState(false);
  const [simulatedToken, setSimulatedToken] = useState('');

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleSimulateLogin = () => {
    setSimulatedToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwidXNlcm5hbWUiOiJhZG1pbiIsInJvbGVzIjpbIkFETUlOX1NFVE9SIl19.mock_token_sismob_semob_2026');
    setSimulatedLoginDone(true);
  };

  const steps = [
    {
      step: 1,
      title: 'Passo 1: Criar a Entity',
      path: 'src/entity/veiculo.entity.ts',
      desc: 'Mapeia a tabela no PostgreSQL utilizando os decorators do TypeORM.',
      code: `import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('veiculos')
export class VeiculoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'numero_ordem', length: 10, unique: true })
  numeroOrdem: string;

  @Column({ name: 'placa', length: 8, unique: true })
  placa: string;

  @Column({ name: 'modelo', length: 50 })
  modelo: string;

  @Column({ name: 'ano_fabricacao', type: 'int' })
  anoFabricacao: number;

  @Column({ name: 'ativo', type: 'boolean', default: true })
  ativo: boolean;

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm: Date;

  @UpdateDateColumn({ name: 'atualizado_em' })
  atualizadoEm: Date;
}`,
    },
    {
      step: 2,
      title: 'Passo 2: Criar o DTO com Validadores',
      path: 'src/dto/create-veiculo.dto.ts',
      desc: 'Blindagem de entrada: usa class-validator e ApiProperty para o Swagger.',
      code: `import { IsString, IsNotEmpty, IsInt, Min, Max, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVeiculoDto {
  @ApiProperty({ description: 'Número de ordem operacional do veículo', example: '11025' })
  @IsString()
  @IsNotEmpty({ message: 'O número de ordem é obrigatório' })
  @Length(3, 10)
  numeroOrdem: string;

  @ApiProperty({ description: 'Placa no padrão Mercosul ou antigo', example: 'BRA2E19' })
  @IsString()
  @IsNotEmpty({ message: 'A placa é obrigatória' })
  @Matches(/^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/, { message: 'Formato de placa inválido' })
  placa: string;

  @ApiProperty({ description: 'Modelo do chassi/carroceria', example: 'Caio Millennium BRT' })
  @IsString()
  @IsNotEmpty()
  modelo: string;

  @ApiProperty({ description: 'Ano de fabricação', example: 2024 })
  @IsInt()
  @Min(2010, { message: 'O veículo deve ter no máximo 15 anos de fabricação' })
  @Max(new Date().getFullYear() + 1)
  anoFabricacao: number;
}`,
    },
    {
      step: 3,
      title: 'Passo 3: Criar o Repository com SQL Parametrizado',
      path: 'src/repository/veiculo.repository.ts',
      desc: 'Executa queries com placeholders ($1, $2) para evitar SQL Injection.',
      code: `import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { VeiculoEntity } from '../entity/veiculo.entity';

@Injectable()
export class VeiculoRepository {
  constructor(private readonly dataSource: DataSource) {}

  // Consulta analítica com SQL nativo parametrizado
  async buscarComTelemetria(numeroOrdem: string): Promise<any> {
    const sql = \`
      SELECT 
        v.id,
        v.numero_ordem,
        v.placa,
        v.modelo,
        COALESCE(t.velocidade_kmh, 0) AS velocidade_atual,
        ST_AsText(t.posicao_gps) AS posicao_wkt
      FROM veiculos v
      LEFT JOIN telemetria_tempo_real t ON t.numero_ordem = v.numero_ordem
      WHERE v.numero_ordem = $1
      ORDER BY t.data_hora DESC
      LIMIT 1;
    \`;

    const resultado = await this.dataSource.query(sql, [numeroOrdem]);
    return resultado[0] || null;
  }
}`,
    },
    {
      step: 4,
      title: 'Passo 4: Criar o Service com Regras de Negócio',
      path: 'src/service/veiculo.service.ts',
      desc: 'Contém a lógica de negócio, validações de duplicidade e regras operacionais.',
      code: `import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VeiculoEntity } from '../entity/veiculo.entity';
import { VeiculoRepository } from '../repository/veiculo.repository';
import { CreateVeiculoDto } from '../dto/create-veiculo.dto';

@Injectable()
export class VeiculoService {
  constructor(
    @InjectRepository(VeiculoEntity)
    private readonly entityRepo: Repository<VeiculoEntity>,
    private readonly customRepo: VeiculoRepository,
  ) {}

  async criar(dto: CreateVeiculoDto): Promise<VeiculoEntity> {
    const existePlaca = await this.entityRepo.findOne({ where: { placa: dto.placa } });
    if (existePlaca) {
      throw new ConflictException(\`Já existe um veículo com a placa \${dto.placa}\`);
    }

    const novo = this.entityRepo.create(dto);
    return await this.entityRepo.save(novo);
  }

  async buscarPorOrdem(numeroOrdem: string) {
    const veiculo = await this.customRepo.buscarComTelemetria(numeroOrdem);
    if (!veiculo) {
      throw new NotFoundException(\`Veículo \${numeroOrdem} não encontrado\`);
    }
    return veiculo;
  }
}`,
    },
    {
      step: 5,
      title: 'Passo 5: Criar o Controller Protegido com @UseGuards',
      path: 'src/controller/veiculo.controller.ts',
      desc: 'Mapeia rotas HTTP, documenta com Swagger e protege com JWT Bearer Token.',
      code: `import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { VeiculoService } from '../service/veiculo.service';
import { CreateVeiculoDto } from '../dto/create-veiculo.dto';

@ApiTags('Veículos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/veiculos')
export class VeiculoController {
  constructor(private readonly veiculoService: VeiculoService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar novo veículo de transporte' })
  async criar(@Body() dto: CreateVeiculoDto) {
    return await this.veiculoService.criar(dto);
  }

  @Get(':numeroOrdem')
  @ApiOperation({ summary: 'Buscar veículo e telemetria por número de ordem' })
  async buscarPorOrdem(@Param('numeroOrdem') numeroOrdem: string) {
    return await this.veiculoService.buscarPorOrdem(numeroOrdem);
  }
}`,
    },
    {
      step: 6,
      title: 'Passo 6: Criar o Module',
      path: 'src/module/veiculo.module.ts',
      desc: 'Encapsula o recurso registrando entidades, controllers, services e repositórios.',
      code: `import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VeiculoEntity } from '../entity/veiculo.entity';
import { VeiculoController } from '../controller/veiculo.controller';
import { VeiculoService } from '../service/veiculo.service';
import { VeiculoRepository } from '../repository/veiculo.repository';

@Module({
  imports: [TypeOrmModule.forFeature([VeiculoEntity])],
  controllers: [VeiculoController],
  providers: [VeiculoService, VeiculoRepository],
  exports: [VeiculoService],
})
export class VeiculoModule {}`,
    },
    {
      step: 7,
      title: 'Passo 7: Registrar no AppModule',
      path: 'src/app.module.ts',
      desc: 'Importa o VeiculoModule no módulo raiz da aplicação.',
      code: `import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { LinhasModule } from './linhas/linhas.module';
import { VeiculoModule } from './module/veiculo.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(/* Configurações de banco */),
    AuthModule,
    LinhasModule,
    VeiculoModule, // <-- Registrar o novo módulo aqui!
  ],
})
export class AppModule {}`,
    },
  ];

  const currentStepData = steps[activeStep - 1];

  return (
    <div className="backend-challenge-screen">
      {/* Header */}
      <div className="challenge-page-header">
        <div className="header-badge bg-indigo-pill">
          <Server size={16} />
          <span>DESAFIO PRÁTICO BACK-END</span>
        </div>
        <h1 className="page-title">SISMOB Boilerplate: Criando o Recurso Veículos</h1>
        <p className="page-subtitle">
          Siga o padrão oficial da SUTINF em 7 etapas para adicionar uma nova funcionalidade completa ao backend em NestJS, com TypeORM, consultas nativas parametrizadas e autenticação JWT.
        </p>

        <div className="challenge-completion-box">
          <div className="completion-info">
            <strong>Status do Desafio Back-end:</strong>
            <span>{isCompleted ? '✓ Concluído e Validado no Swagger' : 'Em andamento'}</span>
          </div>
          <button 
            onClick={onToggleComplete}
            className={`btn-primary ${isCompleted ? 'btn-green' : ''}`}
          >
            <CheckCircle2 size={18} />
            {isCompleted ? 'Concluído com Sucesso!' : 'Marcar Desafio como Concluído'}
          </button>
        </div>
      </div>

      {/* Simulator Quick Test */}
      <div className="swagger-simulator-box">
        <div className="simulator-header">
          <div className="sim-title">
            <ShieldCheck size={18} className="text-emerald" />
            <span>Simulador de Autenticação JWT (Swagger 8097)</span>
          </div>
          <span className="sim-badge">POST /api/auth/login</span>
        </div>
        <div className="simulator-body">
          <p>Credenciais de teste do SISMOB Boilerplate: <code>admin</code> / <code>sismob@2026</code></p>
          {!simulatedLoginDone ? (
            <button onClick={handleSimulateLogin} className="btn-secondary btn-sm">
              Simular Geração de Token JWT
            </button>
          ) : (
            <div className="token-display">
              <span className="token-label">Bearer Token JWT Gerado:</span>
              <code className="token-code">{simulatedToken}</code>
              <span className="token-success text-emerald">✓ Pronto para testar rotas protegidas com @UseGuards</span>
            </div>
          )}
        </div>
      </div>

      {/* 7-Step Navigation Tabs */}
      <div className="step-tabs-container">
        {steps.map((s) => (
          <button
            key={s.step}
            onClick={() => setActiveStep(s.step)}
            className={`step-tab-item ${activeStep === s.step ? 'active' : ''}`}
          >
            <span className="tab-circle">{s.step}</span>
            <span className="tab-name">{s.title.replace('Passo ' + s.step + ': ', '')}</span>
          </button>
        ))}
      </div>

      {/* Active Step Content */}
      <div className="step-content-card">
        <div className="step-header">
          <div>
            <div className="step-badge">ETAPA 0{currentStepData.step} DE 07</div>
            <h2>{currentStepData.title}</h2>
            <div className="file-path-tag">
              <Code size={14} />
              <span>{currentStepData.path}</span>
            </div>
          </div>
          <button
            onClick={() => copyToClipboard(currentStepData.code, `step-${currentStepData.step}`)}
            className="btn-secondary btn-sm"
          >
            {copiedCode === `step-${currentStepData.step}` ? (
              <>
                <Check size={14} className="text-emerald" />
                Copiado!
              </>
            ) : (
              <>
                <Copy size={14} />
                Copiar Código
              </>
            )}
          </button>
        </div>

        <p className="step-desc">{currentStepData.desc}</p>

        {/* Code Snippet */}
        <div className="code-viewer-box">
          <pre>
            <code>{currentStepData.code}</code>
          </pre>
        </div>

        {/* Step Navigation Controls */}
        <div className="step-controls">
          <button
            onClick={() => setActiveStep((prev) => Math.max(prev - 1, 1))}
            disabled={activeStep === 1}
            className="btn-secondary"
          >
            Etapa Anterior
          </button>

          <span className="step-counter">Etapa {activeStep} de 7</span>

          <button
            onClick={() => setActiveStep((prev) => Math.min(prev + 1, 7))}
            disabled={activeStep === 7}
            className="btn-primary"
          >
            Próxima Etapa
          </button>
        </div>
      </div>

      {/* Reference Footer */}
      <div className="backend-footer-cta">
        <p>Precisa de mais detalhes sobre filtros globais de exceção, seeds ou migrations?</p>
        <button onClick={() => onNavigate('modulo-backend')} className="btn-secondary">
          <BookOpen size={16} />
          Consultar Manual Completo de Back-end NestJS
        </button>
      </div>
    </div>
  );
};
