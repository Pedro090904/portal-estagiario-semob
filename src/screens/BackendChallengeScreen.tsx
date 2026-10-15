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
} from 'lucide-react';
import { ChallengeSubmissionPanel } from '../components/ChallengeSubmissionPanel';

interface BackendChallengeScreenProps {
  completedItems: string[];
  onToggleItem: (itemKey: string) => void;
  onOpenModule: (moduleId: string) => void;
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
    id: 'controller',
    name: '1. Controller',
    folder: 'src/controllers/LinhaController.ts',
    role: 'Porta de entrada HTTP. Recebe req/res, extrai parâmetros, chama o Service e devolve o status HTTP adequado.',
    mustDo: [
      'Extrair req.params, req.query e req.body',
      'Chamar o método correspondente no LinhaService',
      'Retornar status HTTP corretos (200, 201, 204, 400, 404)',
    ],
    mustNotDo: [
      'NUNCA escrever SQL ou acessar o pool do banco diretamente',
      'NUNCA concentrar cálculos de negócio complexos no controller',
    ],
    codeSample: `export class LinhaController {
  constructor(private readonly service = new LinhaService()) {}

  listar = async (req: Request, res: Response) => {
    const { ativa, sentido } = req.query;
    const linhas = await this.service.listarLinhas({
      ativa: ativa ? ativa === 'true' : undefined,
      sentido: sentido as string | undefined,
    });
    return res.status(200).json(linhas);
  };
}`,
  },
  {
    id: 'service',
    name: '2. Service',
    folder: 'src/services/LinhaService.ts',
    role: 'Coração das regras de negócio. Valida se a tarifa é positiva, se o código da linha já existe e orquestra chamadas ao Repository.',
    mustDo: [
      'Validar regras de domínio (ex: tarifa > 0, código único)',
      'Lançar erros semânticos (AppError 400 ou 404) quando algo falhar',
      'Formatar ou agregar dados para o resumo executivo',
    ],
    mustNotDo: [
      'NUNCA manipular objetos Request ou Response do Express',
      'NUNCA executar queries SQL cruas diretamente',
    ],
    codeSample: `export class LinhaService {
  constructor(private readonly repo = new LinhaRepository()) {}

  async buscarPorCodigo(cd_linha: string) {
    const linha = await this.repo.findByCodigo(cd_linha);
    if (!linha) {
      throw new AppError('Linha não encontrada para o código informado', 404);
    }
    return linha;
  }
}`,
  },
  {
    id: 'repository',
    name: '3. Repository',
    folder: 'src/repositories/LinhaRepository.ts',
    role: 'Camada exclusiva de persistência e consultas SQL parametrizadas (sempre com cláusula WHERE).',
    mustDo: [
      'Isolar todas as queries SQL ou chamadas ao banco/dados',
      'Usar parâmetros ($1, $2) e cláusula WHERE explícita em buscas, updates e deletes',
      'Retornar entidades tipadas para o Service',
    ],
    mustNotDo: [
      'NUNCA concatenar strings em SQL (risco de SQL Injection)',
      'NUNCA executar UPDATE ou DELETE sem cláusula WHERE',
    ],
    codeSample: `export class LinhaRepository {
  async findByCodigo(cd_linha: string): Promise<Linha | null> {
    const sql = \`
      SELECT id_linha, cd_linha, nm_linha, vl_tarifa, sentido, st_ativa
      FROM semob.linhas
      WHERE cd_linha = $1 AND st_ativa = true;
    \`;
    // Execução parametrizada segura com WHERE
    return db.queryOne(sql, [cd_linha]);
  }
}`,
  },
  {
    id: 'model',
    name: '4. Model / Types',
    folder: 'src/models/Linha.ts',
    role: 'Contratos TypeScript e DTOs que garantem tipagem forte em todas as camadas.',
    mustDo: [
      'Definir a interface Linha e os DTOs CreateLinhaDTO / UpdateLinhaDTO',
      'Tipar os filtros permitidos na listagem',
    ],
    mustNotDo: ['NUNCA usar o tipo "any" para contornar erros de compilação'],
    codeSample: `export type SentidoLinha = 'IDA' | 'VOLTA' | 'CIRCULAR';

export interface Linha {
  id_linha: number;
  cd_linha: string;
  nm_linha: string;
  vl_tarifa: number;
  sentido: SentidoLinha;
  st_ativa: boolean;
  horarios: string[];
}`,
  },
];

const FILE_SEQUENCE_STEPS = [
  {
    key: 'back-step-1',
    order: '1º Passo',
    file: 'src/models/Linha.ts',
    title: 'Definir Contratos e Interfaces (Model & DTOs)',
    desc: 'Comece sempre pelos tipos: defina a entidade Linha, os filtros de busca e os DTOs de criação/atualização.',
  },
  {
    key: 'back-step-2',
    order: '2º Passo',
    file: 'src/repositories/LinhaRepository.ts',
    title: 'Implementar o Acesso a Dados (Repository)',
    desc: 'Implemente findAll, findByCodigo, create, update e delete garantindo filtro WHERE explícito por código ou ID.',
  },
  {
    key: 'back-step-3',
    order: '3º Passo',
    file: 'src/services/LinhaService.ts',
    title: 'Codificar as Regras de Negócio (Service)',
    desc: 'Valide se a linha já existe antes de cadastrar, verifique tarifa > 0 e implemente o cálculo da rota /linhas/resumo.',
  },
  {
    key: 'back-step-4',
    order: '4º Passo',
    file: 'src/controllers/LinhaController.ts',
    title: 'Expor os Handlers HTTP (Controller)',
    desc: 'Conecte os 6 endpoints recebendo os dados da requisição, chamando o Service e retornando os status HTTP corretos.',
  },
  {
    key: 'back-step-5',
    order: '5º Passo',
    file: 'src/routes/linha.routes.ts & src/app.ts',
    title: 'Registar as Rotas e Middleware Global de Erros',
    desc: 'Atenção à ordem das rotas: registe GET /linhas/resumo ANTES de GET /linhas/:cd_linha para evitar conflito de parâmetros.',
  },
];

const API_ENDPOINTS = [
  { method: 'GET', path: '/linhas', status: '200 OK', desc: 'Lista linhas com filtros opcionais (?ativa=true&sentido=IDA&busca=UnB)' },
  { method: 'GET', path: '/linhas/resumo', status: '200 OK', desc: 'Retorna total de linhas, ativas, inativas e tarifa média' },
  { method: 'GET', path: '/linhas/:cd_linha', status: '200 / 404', desc: 'Busca detalhes de uma linha específica pelo código (ex: 0.110)' },
  { method: 'POST', path: '/linhas', status: '201 / 400', desc: 'Cadastra uma nova linha validando campos obrigatórios e duplicidade' },
  { method: 'PUT', path: '/linhas/:cd_linha', status: '200 / 404', desc: 'Atualiza dados de uma linha existente filtrando pelo código no WHERE' },
  { method: 'DELETE', path: '/linhas/:cd_linha', status: '204 / 404', desc: 'Remove ou inativa uma linha específica de forma segura' },
];

export const BackendChallengeScreen: React.FC<BackendChallengeScreenProps> = ({
  completedItems,
  onToggleItem,
  onOpenModule,
}) => {
  const [activeLayerId, setActiveLayerId] = useState<string>('controller');
  const activeLayer = ARCH_LAYERS.find((l) => l.id === activeLayerId) || ARCH_LAYERS[0];

  return (
    <div className="screen-container">
      {/* Hero Banner */}
      <section className="hero-banner">
        <div className="hero-content">
          <span className="hero-badge">
            <Server size={14} /> Desafio Prático • Engenharia Backend
          </span>
          <h1>API RESTful de Linhas de Transporte — Arquitetura em Camadas</h1>
          <p>
            Construa a API que alimentará o sistema <strong>InfoÔnibus</strong> aplicando separação
            estrita de responsabilidades entre <code>Controller</code>, <code>Service</code>,{' '}
            <code>Repository</code> e <code>Model</code>.
          </p>
          <div className="hero-actions">
            <button className="btn-secondary" onClick={() => onOpenModule('mod-4-backend')}>
              <BookOpen size={16} /> Revisar Módulo de Arquitetura Backend na Plataforma
            </button>
          </div>
        </div>
      </section>

      {/* Fluxo Interativo da Arquitetura em Camadas */}
      <section className="section-card">
        <div className="section-header-row">
          <div>
            <h2>
              <Layers size={20} style={{ display: 'inline', marginRight: '0.5rem' }} />
              Fluxo Interativo das Camadas (Clique para inspecionar)
            </h2>
            <p className="text-muted">
              Entenda exatamente o que entra e o que é proibido em cada camada antes de criar os ficheiros.
            </p>
          </div>
        </div>

        <div className="arch-flow" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', margin: '1.25rem 0' }}>
          {ARCH_LAYERS.map((layer, index) => (
            <React.Fragment key={layer.id}>
              <button
                type="button"
                onClick={() => setActiveLayerId(layer.id)}
                className={`sql-filter-btn ${activeLayerId === layer.id ? 'active' : ''}`}
                style={{ padding: '0.75rem 1.1rem', fontWeight: 700 }}
              >
                {layer.name}
              </button>
              {index < ARCH_LAYERS.length - 1 && (
                <span style={{ display: 'flex', alignItems: 'center', opacity: 0.5 }}>
                  <ArrowRight size={18} />
                </span>
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem' }}>{activeLayer.name}</h3>
              <p className="text-muted">{activeLayer.role}</p>
            </div>
            <span className="status-pill passed" style={{ fontFamily: 'monospace' }}>
              {activeLayer.folder}
            </span>
          </div>

          <div className="cards-grid two-cols" style={{ marginBottom: '1rem' }}>
            <div className="glass-card" style={{ borderLeft: '4px solid #10b981' }}>
              <strong style={{ color: '#10b981', display: 'block', marginBottom: '0.5rem' }}>
                ✅ O que DEVE fazer:
              </strong>
              <ul style={{ paddingLeft: '1.2rem', fontSize: '0.88rem', lineHeight: 1.6 }}>
                {activeLayer.mustDo.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="glass-card" style={{ borderLeft: '4px solid #ef4444' }}>
              <strong style={{ color: '#ef4444', display: 'block', marginBottom: '0.5rem' }}>
                🚫 O que NÃO DEVE fazer:
              </strong>
              <ul style={{ paddingLeft: '1.2rem', fontSize: '0.88rem', lineHeight: 1.6 }}>
                {activeLayer.mustNotDo.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <pre className="code-block">
            <code>{activeLayer.codeSample}</code>
          </pre>
        </div>
      </section>

      {/* Sequência Guiada de Ficheiros a serem criados */}
      <section className="section-card">
        <div className="section-header-row">
          <div>
            <h2>
              <Code2 size={20} style={{ display: 'inline', marginRight: '0.5rem' }} />
              Sequência Recomendada de Criação dos Ficheiros
            </h2>
            <p className="text-muted">
              Siga esta ordem de baixo para cima (Model → Repository → Service → Controller → Routes)
              e marque cada etapa concluída.
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

      {/* Contrato das 6 Rotas da API */}
      <section className="section-card">
        <h2>
          <Terminal size={20} style={{ display: 'inline', marginRight: '0.5rem' }} />
          Contrato dos 6 Endpoints Obrigatórios
        </h2>
        <div className="cards-grid two-cols" style={{ marginTop: '1rem' }}>
          {API_ENDPOINTS.map((ep, idx) => (
            <div key={idx} className="glass-card" style={{ padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span className="status-pill passed" style={{ fontFamily: 'monospace', fontWeight: 700 }}>
                  {ep.method} {ep.path}
                </span>
                <span className="text-muted" style={{ fontSize: '0.75rem', fontFamily: 'monospace' }}>
                  {ep.status}
                </span>
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
        title="Entrega do Repositório & Checklist de Arquitetura Backend"
        subtitle="Valide a qualidade do seu código e cole o link do seu repositório Git com a API implementada."
        requireRepoUrl={true}
        prChecklist={[
          'Criei os ficheiros seguindo a separação estrita: Model, Repository, Service, Controller e Routes?',
          'A rota estática GET /linhas/resumo foi declarada antes da rota dinâmica GET /linhas/:cd_linha?',
          'O Controller não possui nenhuma lógica de banco de dados nem regras de cálculo direto?',
          'Todas as buscas, atualizações e remoções no Repository utilizam cláusula WHERE segura?',
          'Adicionei validação de entrada (tarifa positiva, campos obrigatórios) retornando HTTP 400 quando inválido?',
        ]}
      />
    </div>
  );
};
export default BackendChallengeScreen;
