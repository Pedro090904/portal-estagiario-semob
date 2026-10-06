import React, { useState } from 'react';
import { ScreenType } from '../types';
import { 
  Compass, 
  Layers, 
  GitBranch, 
  Database, 
  Server, 
  Layout, 
  Terminal, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  ShieldAlert, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp,
  Cpu,
  Boxes,
  Lock,
  ExternalLink,
  BookOpen,
  Code2,
  Sparkles
} from 'lucide-react';

interface IntegrationTrackScreenProps {
  onNavigate: (screen: ScreenType) => void;
}

export const IntegrationTrackScreen: React.FC<IntegrationTrackScreenProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<number>(1);
  const [revealedQuestions, setRevealedQuestions] = useState<Record<string, boolean>>({});

  const toggleReveal = (id: string) => {
    setRevealedQuestions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleTabChange = (newTab: number) => {
    setActiveTab(newTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateAndScroll = (screen: ScreenType) => {
    onNavigate(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="track-page-container">
      {/* Page Header */}
      <div className="track-header">
        <div className="header-badge">
          <Compass size={16} />
          <span>ROTEIRO OFICIAL DE INTEGRAÇÃO</span>
        </div>
        <h1 className="page-title">Conhecendo a SEMOB-DF e a SUTINF</h1>
        <p className="page-subtitle">
          Guia de acolhimento e nivelamento prático: do primeiro dia ao desenvolvimento de soluções completas em nosso ecossistema de transporte público.
        </p>

        {/* Navigation Tabs (9 Etapas Sequenciais Padronizadas) */}
        <div className="track-tabs-bar">
          <button 
            className={`track-tab-btn ${activeTab === 1 ? 'active' : ''}`}
            onClick={() => handleTabChange(1)}
          >
            1. Institucional
          </button>
          <button 
            className={`track-tab-btn ${activeTab === 2 ? 'active' : ''}`}
            onClick={() => handleTabChange(2)}
          >
            2. Git & GitLab
          </button>
          <button 
            className={`track-tab-btn ${activeTab === 3 ? 'active' : ''}`}
            onClick={() => handleTabChange(3)}
          >
            3. Banco de Dados
          </button>
          <button 
            className={`track-tab-btn ${activeTab === 4 ? 'active' : ''}`}
            onClick={() => handleTabChange(4)}
          >
            4. Desafio SQL
          </button>
          <button 
            className={`track-tab-btn ${activeTab === 5 ? 'active' : ''}`}
            onClick={() => handleTabChange(5)}
          >
            5. Back-end SUTINF
          </button>
          <button 
            className={`track-tab-btn ${activeTab === 6 ? 'active' : ''}`}
            onClick={() => handleTabChange(6)}
          >
            6. Desafio Back-end
          </button>
          <button 
            className={`track-tab-btn ${activeTab === 7 ? 'active' : ''}`}
            onClick={() => handleTabChange(7)}
          >
            7. Front-end SUTINF
          </button>
          <button 
            className={`track-tab-btn ${activeTab === 8 ? 'active' : ''}`}
            onClick={() => handleTabChange(8)}
          >
            8. Desafio Front-end
          </button>
          <button 
            className={`track-tab-btn ${activeTab === 9 ? 'active' : ''}`}
            onClick={() => handleTabChange(9)}
          >
            9. Trilha & Certificado
          </button>
        </div>
      </div>

      {/* =====================================================================
          TAB 1: INSTITUCIONAL & STACK
          ===================================================================== */}
      {activeTab === 1 && (
        <section className="track-content-card">
          <div className="card-section-tag">ETAPA 01</div>
          <h2>1. Bem-vindo à Secretaria de Mobilidade (SEMOB-DF)</h2>
          <p>
            A <strong>Secretaria de Mobilidade do Distrito Federal (SEMOB-DF)</strong> é o órgão responsável pelo planejamento, gestão e fiscalização de todo o sistema de transporte e mobilidade urbana da capital do país. Por ser uma estrutura complexa que movimenta diariamente mais de 1,3 milhão de passageiros, a Secretaria é composta por diversas subsecretarias com atribuições estratégicas integradas.
          </p>

          <div className="highlight-box">
            <h3>🏛️ O Papel da SUTINF</h3>
            <p>
              A <strong>Subsecretaria de Tecnologia da Informação (SUTINF)</strong> é o motor de engenharia, dados e inovação tecnológica de toda a SEMOB. É aqui que construímos, mantemos e auditamos as soluções computacionais que operam o Sistema de Transporte Público Coletivo do DF (STPC/DF), como o SISMOB, INFOMOB, sistemas de telemetria GPS em tempo real e bilhetagem automática.
            </p>
          </div>

          <h3>Nossa Stack Tecnológica Institucional</h3>
          <div className="tech-stack-grid">
            <div className="tech-item">
              <div className="tech-icon"><GitBranch className="text-sky" size={24} /></div>
              <h4>Versionamento</h4>
              <p>GitLab corporativo com branches protegidas, Merge Requests e pipelines rigorosos de CI/CD.</p>
            </div>
            <div className="tech-item">
              <div className="tech-icon"><Database className="text-emerald" size={24} /></div>
              <h4>Bancos de Dados</h4>
              <p>PostgreSQL 15+ com extensão espacial PostGIS e Oracle Database corporativo legado.</p>
            </div>
            <div className="tech-item">
              <div className="tech-icon"><Server className="text-indigo" size={24} /></div>
              <h4>Back-End</h4>
              <p>Node.js, TypeScript e NestJS em microsserviços organizados estritamente em 3 camadas com Docker.</p>
            </div>
            <div className="tech-item">
              <div className="tech-icon"><Layout className="text-cyan" size={24} /></div>
              <h4>Front-End</h4>
              <p>React 18, Vite, TypeScript rígido (sem `any`), arquitetura em 5 camadas e Capacitor para mobile.</p>
            </div>
          </div>

          <div className="step-actions">
            <div></div>
            <button onClick={() => handleTabChange(2)} className="btn-primary">
              Avançar para Etapa 2: Git & GitLab Flow <ArrowRight size={16} />
            </button>
          </div>
        </section>
      )}

      {/* =====================================================================
          TAB 2: GIT & GITLAB FLOW
          ===================================================================== */}
      {activeTab === 2 && (
        <section className="track-content-card">
          <div className="card-section-tag">ETAPA 02</div>
          <h2>2. O Padrão de Versionamento (GitLab SEMOB)</h2>
          <p>
            Aqui na SEMOB, a qualidade e a segurança do que desenvolvemos são inegociáveis. Por lidarmos com sistemas governamentais críticos, adotamos uma cultura <strong>DevSecOps</strong> rigorosa.
          </p>

          <div className="warning-banner">
            <ShieldAlert size={22} className="text-amber" />
            <div>
              <strong>Regra de Ouro Inegociável:</strong>
              <p>
                A branch principal é sagrada: <strong>NUNCA comitamos código direto na main ou production</strong>. Todo desenvolvimento é feito em branches isoladas de feature e integrado exclusivamente via <strong>Merge Requests (MR)</strong>, passando sempre por revisão técnica de código.
              </p>
            </div>
          </div>

          <h3>Pilares do GitLab Flow na SUTINF</h3>
          <div className="flow-steps-list">
            <div className="flow-step-item">
              <div className="flow-num">1</div>
              <div className="flow-desc">
                <strong>Repositório Centralizado no GitLab:</strong>
                <p>Nosso ambiente é hospedado em infraestrutura própria da secretaria, com esteiras automatizadas de CI/CD definidas no arquivo <code>.gitlab-ci.yml</code>.</p>
              </div>
            </div>

            <div className="flow-step-item">
              <div className="flow-num">2</div>
              <div className="flow-desc">
                <strong>Pipelines de CI/CD e Runners:</strong>
                <p>A cada push, Runners autônomos compilam o projeto, executam linters, validam tipagens e rodam testes antes que o código atinja servidores de homologação ou produção.</p>
              </div>
            </div>

            <div className="flow-step-item">
              <div className="flow-num">3</div>
              <div className="flow-desc">
                <strong>Segurança Básica e .gitignore:</strong>
                <p>O uso correto do <code>.gitignore</code> é crucial. Arquivos sensíveis (como <code>.env</code> com senhas de banco) e pastas pesadas (como <code>node_modules/</code>) jamais devem subir para o repositório.</p>
              </div>
            </div>
          </div>

          <div className="callout-card">
            <div className="callout-icon"><GitBranch size={28} className="text-sky" /></div>
            <div className="callout-body">
              <h4>Aprofunde-se no Manual Oficial do Git</h4>
              <p>Consulte a mecânica completa das 4 zonas do Git, comandos essenciais, commits semânticos, cenários práticos e resolução cirúrgica de conflitos.</p>
              <button onClick={() => navigateAndScroll('modulo-git')} className="btn-primary btn-sm">
                <BookOpen size={14} />
                <span>Abrir Manual Completo do Git</span>
              </button>
            </div>
          </div>

          <div className="step-actions">
            <button onClick={() => handleTabChange(1)} className="btn-secondary">
              <ArrowLeft size={16} /> Voltar
            </button>
            <button onClick={() => handleTabChange(3)} className="btn-primary">
              Avançar para Etapa 3: Bancos de Dados SEMOB <ArrowRight size={16} />
            </button>
          </div>
        </section>
      )}

      {/* =====================================================================
          TAB 3: BANCOS DE DADOS SEMOB (NOVA ETAPA PRÉVIA DE FUNDAMENTOS)
          ===================================================================== */}
      {activeTab === 3 && (
        <section className="track-content-card">
          <div className="card-section-tag">ETAPA 03</div>
          <h2>3. Nossos Bancos de Dados: Arquitetura & Ecossistema</h2>
          <p>
            Na SUTINF, a regra de ouro é: <strong>nunca testamos no escuro e respeitamos o banco de produção</strong>. Lidamos com dois ambientes e dois motores principais com finalidades distintas:
          </p>

          <div className="environments-comparison">
            <div className="env-card dev">
              <div className="env-badge">Ambiente 01</div>
              <h3>bdg (Desenvolvimento & Homologação)</h3>
              <p>É o nosso laboratório seguro. Aqui você pode testar integrações, criar tabelas e experimentar queries. Os dados são estáticos ou inseridos para testes.</p>
              <span className="env-tag text-emerald">Ambiente Livre para Testes</span>
            </div>

            <div className="env-card prod">
              <div className="env-badge bg-red-pill">Ambiente 02</div>
              <h3>dados_mobilidade (Produção)</h3>
              <p>É o coração vivo da operação. Possui a injeção contínua de dados em tempo real (posições de GPS dos ônibus, validações de bilhetagem e integrações ao vivo).</p>
              <span className="env-tag text-red">Atenção Extrema: Evite Queries Pesadas sem Filtros!</span>
            </div>
          </div>

          <h3>PostgreSQL vs. Oracle: Quando usamos cada um?</h3>
          <div className="deep-dive-grid">
            <div className="deep-card">
              <div className="deep-icon"><Database className="text-emerald" size={24} /></div>
              <h4>PostgreSQL + PostGIS</h4>
              <p>
                Utilizado para o novo ecossistema SISMOB e microsserviços. Os esquemas são otimizados para velocidade de leitura, telemetria em tempo real e cálculos espaciais de traçado geográfico de rotas com PostGIS.
              </p>
            </div>

            <div className="deep-card">
              <div className="deep-icon"><Database className="text-amber" size={24} /></div>
              <h4>Oracle Database</h4>
              <p>
                Utilizado para o legado corporativo e auditoria jurídica. Modelo altamente normalizado para controle rigoroso de contratos de permissão, decretos, bacias e empresas operadoras.
              </p>
            </div>
          </div>

          <div className="callout-card">
            <div className="callout-icon"><Database size={28} className="text-emerald" /></div>
            <div className="callout-body">
              <h4>Manual de Engenharia de Dados & Tutorial SQL</h4>
              <p>Aprenda a modelagem das tabelas reais (<code>tab_linha</code>, <code>tab_itinerario</code>, <code>tab_horario</code>, <code>tab_operadora_linha</code>), funções espaciais do PostGIS e sintaxe SQL recomendada.</p>
              <button onClick={() => navigateAndScroll('modulo-sql')} className="btn-primary btn-sm">
                <BookOpen size={14} />
                <span>Estudar Manual de Banco de Dados</span>
              </button>
            </div>
          </div>

          <div className="step-actions">
            <button onClick={() => handleTabChange(2)} className="btn-secondary">
              <ArrowLeft size={16} /> Voltar
            </button>
            <button onClick={() => handleTabChange(4)} className="btn-primary">
              Avançar para Etapa 4: Desafio Prático SQL <ArrowRight size={16} />
            </button>
          </div>
        </section>
      )}

      {/* =====================================================================
          TAB 4: DESAFIOS PRÁTICOS SQL (25 CONSULTAS ANALÍTICAS)
          ===================================================================== */}
      {activeTab === 4 && (
        <section className="track-content-card">
          <div className="card-section-tag">ETAPA 04</div>
          <h2>4. Mão na Massa: As 25 Consultas Analíticas em SQL</h2>
          <p>
            Com os conceitos de banco e modelo mental dominados, agora você aplicará SQL contra dados reais de transporte público do DF.
          </p>

          <h3>Perguntas Rápidas de Aquecimento (Pense Mentalmente)</h3>
          <p className="text-muted">Clique em cada pergunta para conferir o raciocínio correto antes do desafio:</p>

          <div className="interactive-qa-list">
            <div className="qa-item">
              <div className="qa-question" onClick={() => toggleReveal('qa1')}>
                <span>1. Se você quiser visualizar absolutamente todas as colunas de uma tabela chamada <code>linhas_onibus</code>, qual caractere coringa você coloca logo após o SELECT?</span>
                {revealedQuestions['qa1'] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>
              {revealedQuestions['qa1'] && (
                <div className="qa-answer">
                  <strong>Resposta:</strong> O caractere asterisco (<code>*</code>). Exemplo: <code>SELECT * FROM linhas_onibus;</code>. 
                  <em>(Dica profissional: em APIs backend, evite o asterisco e projete sempre as colunas necessárias para economizar rede!)</em>
                </div>
              )}
            </div>

            <div className="qa-item">
              <div className="qa-question" onClick={() => toggleReveal('qa2')}>
                <span>2. Para achar uma linha específica, usamos <code>WHERE cd_linha = '0.111'</code>. E se você quisesse buscar qualquer linha que contenha a palavra "Gama" no nome?</span>
                {revealedQuestions['qa2'] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>
              {revealedQuestions['qa2'] && (
                <div className="qa-answer">
                  <strong>Resposta:</strong> Usa-se o operador <code>LIKE</code> (ou <code>ILIKE</code> no Postgres para ignorar maiúsculas/minúsculas) acompanhado do símbolo <code>%</code>: <code>WHERE tx_linha ILIKE '%Gama%';</code>.
                </div>
              )}
            </div>

            <div className="qa-item">
              <div className="qa-question" onClick={() => toggleReveal('qa3')}>
                <span>3. Se a diretoria pedir "qual a linha com a maior extensão do DF?", qual função você usaria na coluna de extensão (MAX ou MIN) e como ordenaria?</span>
                {revealedQuestions['qa3'] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>
              {revealedQuestions['qa3'] && (
                <div className="qa-answer">
                  <strong>Resposta:</strong> Usaria a função <code>MAX(lin_extensao)</code> ou ordenaria com <code>ORDER BY lin_extensao DESC LIMIT 1;</code>.
                </div>
              )}
            </div>

            <div className="qa-item">
              <div className="qa-question" onClick={() => toggleReveal('qa4')}>
                <span>4. Como lidamos com mapas e traçados de rotas, você verá colunas do tipo <code>geometry</code> (PostGIS). Quais funções transformam coordenadas em algo legível?</span>
                {revealedQuestions['qa4'] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>
              {revealedQuestions['qa4'] && (
                <div className="qa-answer">
                  <strong>Resposta:</strong> Funções como <code>ST_AsText(geometria)</code> (converte para texto legível WKT) e <code>ST_Length(geometria)</code> (calcula o comprimento geométrico da rota).
                </div>
              )}
            </div>
          </div>

          <div className="desafio-banner">
            <h3>⚡ O Desafio Oficial das 25 Consultas Analíticas</h3>
            <p>
              Desenvolva as 25 queries divididas nas 3 fases da operação: Investigando a Linha 0.111, Compreendendo os Sentidos na Linha 0.170 e Cruzamentos Gerais de Bacias e Frotas.
            </p>
            <div className="desafio-btns">
              <button onClick={() => navigateAndScroll('desafio-sql')} className="btn-primary">
                <Code2 size={16} />
                <span>Abrir Desafio SQL das 25 Questões</span>
              </button>
              <button onClick={() => navigateAndScroll('modulo-gabarito')} className="btn-secondary">
                <BookOpen size={16} />
                <span>Consultar Gabarito Oficial Comentado</span>
              </button>
            </div>
          </div>

          <div className="step-actions">
            <button onClick={() => handleTabChange(3)} className="btn-secondary">
              <ArrowLeft size={16} /> Voltar
            </button>
            <button onClick={() => handleTabChange(5)} className="btn-primary">
              Avançar para Etapa 5: Back-end SUTINF <ArrowRight size={16} />
            </button>
          </div>
        </section>
      )}

      {/* =====================================================================
          TAB 5: BACK-END SUTINF (NOVA ETAPA PRÉVIA DE FUNDAMENTOS)
          ===================================================================== */}
      {activeTab === 5 && (
        <section className="track-content-card">
          <div className="card-section-tag">ETAPA 05</div>
          <h2>5. Padrão de Engenharia Back-end: NestJS & 3 Camadas</h2>
          <p>
            Todas as APIs e serviços do ecossistema de transporte da SEMOB são desenvolvidos sobre a arquitetura de microsserviços em 3 camadas, garantindo baixo acoplamento e alta testabilidade.
          </p>

          <h3>A Arquitetura em 3 Camadas da SUTINF</h3>
          <div className="layers-visual">
            <div className="layer-block controller">
              <strong>1. Controller</strong>
              <span>Recebe a requisição HTTP (REST), valida o DTO e delega para o Service. <em>NUNCA acessa o banco diretamente.</em></span>
            </div>
            <div className="layer-arrow">↓</div>
            <div className="layer-block service">
              <strong>2. Service</strong>
              <span>Contém as regras de negócio, validações de transporte e cálculos.</span>
            </div>
            <div className="layer-arrow">↓</div>
            <div className="layer-block repository">
              <strong>3. Repository</strong>
              <span>Executa queries SQL seguras no PostgreSQL com TypeORM e consultas parametrizadas.</span>
            </div>
          </div>

          <div className="rule-card">
            <h4>⭐ Regra de Ouro: Entity vs. SQL Nativo Parametrizado</h4>
            <ul>
              <li><strong>Use Entities (TypeORM):</strong> Para operações simples de CRUD em uma única tabela (ex: cadastro de usuários, criação de registros). Traz agilidade e tipagem estrita.</li>
              <li><strong>Use SQL Nativo Parametrizado ($1, $2):</strong> Para relatórios analíticos complexos, consultas espaciais PostGIS ou múltiplos JOINs. O Repository usa queries parametrizadas nativas, que é a blindagem definitiva contra SQL Injection.</li>
            </ul>
          </div>

          <div className="callout-card">
            <div className="callout-icon"><Server size={28} className="text-indigo" /></div>
            <div className="callout-body">
              <h4>Manual de Desenvolvimento Back-end</h4>
              <p>Consulte o guia completo com a estrutura de pastas do NestJS, injeção de dependência, criação de DTOs com <code>class-validator</code>, guards JWT e documentação OpenAPI Swagger.</p>
              <button onClick={() => navigateAndScroll('modulo-backend')} className="btn-primary btn-sm">
                <BookOpen size={14} />
                <span>Estudar Manual de Back-end</span>
              </button>
            </div>
          </div>

          <div className="step-actions">
            <button onClick={() => handleTabChange(4)} className="btn-secondary">
              <ArrowLeft size={16} /> Voltar
            </button>
            <button onClick={() => handleTabChange(6)} className="btn-primary">
              Avançar para Etapa 6: Desafio Back-end <ArrowRight size={16} />
            </button>
          </div>
        </section>
      )}

      {/* =====================================================================
          TAB 6: DESAFIO BACK-END (SISMOB BOILERPLATE)
          ===================================================================== */}
      {activeTab === 6 && (
        <section className="track-content-card">
          <div className="card-section-tag">ETAPA 06</div>
          <h2>6. Desafio Prático Back-end: SISMOB Boilerplate</h2>
          <p>
            O <strong>SISMOB Boilerplate</strong> é o projeto base institucional padronizado para criação de novos endpoints e microsserviços.
          </p>

          <div className="command-box">
            <div className="command-header">Clone do Projeto Base (Boilerplate)</div>
            <code>git clone https://repositorio.semob.df.gov.br/estagiarios/boilerplate.git</code>
          </div>

          <h3>Subindo a Infraestrutura Local com Docker</h3>
          <p>Para subir o banco de dados e o pgAdmin de forma idêntica à produção, basta executar no terminal:</p>
          <div className="command-box">
            <code>docker compose up -d</code>
          </div>

          <div className="docker-services-grid">
            <div className="docker-service-card">
              <h4>PostgreSQL 15</h4>
              <p>Porta: <code>5432</code></p>
              <p>Extensão PostGIS habilitada para geometrias.</p>
            </div>
            <div className="docker-service-card">
              <h4>pgAdmin 4</h4>
              <p>Porta: <code>http://localhost:5050</code></p>
              <p>Login: <code>admin@sismob.com</code> | Senha: <code>admin</code></p>
            </div>
            <div className="docker-service-card">
              <h4>Swagger OpenAPI</h4>
              <p>Porta: <code>http://localhost:8097/api/docs</code></p>
              <p>Documentação interativa de rotas e testes de endpoints.</p>
            </div>
          </div>

          <h3>O Desafio das 7 Etapas do Back-end</h3>
          <p>Para consolidar a prática, você desenvolverá o módulo <code>Veículos</code> passando pelas 7 etapas:</p>
          <ol className="ordered-steps-list">
            <li><strong>Passo 1:</strong> Criar a Entity (<code>src/entity/veiculo.entity.ts</code>)</li>
            <li><strong>Passo 2:</strong> Criar o DTO (<code>src/dto/create-veiculo.dto.ts</code>) com validações <code>class-validator</code></li>
            <li><strong>Passo 3:</strong> Criar o Repository (<code>src/repository/veiculo.repository.ts</code>) com queries parametrizadas</li>
            <li><strong>Passo 4:</strong> Criar o Service (<code>src/service/veiculo.service.ts</code>) com regras de negócio</li>
            <li><strong>Passo 5:</strong> Criar o Controller (<code>src/controller/veiculo.controller.ts</code>) protegido por <code>@UseGuards(JwtAuthGuard)</code></li>
            <li><strong>Passo 6:</strong> Criar o Module (<code>src/module/veiculo.module.ts</code>)</li>
            <li><strong>Passo 7:</strong> Registrar no <code>AppModule</code> (<code>src/app.module.ts</code>)</li>
          </ol>

          <div className="desafio-banner">
            <h3>🚀 Tutorial Guiado do Desafio Back-end</h3>
            <p>Acesse o roteiro passo a passo com trechos de código prontos para implementar cada uma das 7 etapas no seu ambiente local.</p>
            <button onClick={() => navigateAndScroll('desafio-backend')} className="btn-primary mt-2">
              <Code2 size={16} />
              <span>Abrir Tutorial do Desafio Back-end</span>
            </button>
          </div>

          <div className="step-actions">
            <button onClick={() => handleTabChange(5)} className="btn-secondary">
              <ArrowLeft size={16} /> Voltar
            </button>
            <button onClick={() => handleTabChange(7)} className="btn-primary">
              Avançar para Etapa 7: Front-end SUTINF <ArrowRight size={16} />
            </button>
          </div>
        </section>
      )}

      {/* =====================================================================
          TAB 7: FRONT-END SUTINF (NOVA ETAPA PRÉVIA DE FUNDAMENTOS)
          ===================================================================== */}
      {activeTab === 7 && (
        <section className="track-content-card">
          <div className="card-section-tag">ETAPA 07</div>
          <h2>7. Padrão de Engenharia Front-end: React 18 & 5 Camadas</h2>
          <p>
            Nossos projetos front-end são desenvolvidos com <strong>React 18, Vite e TypeScript rígido</strong>. Toda a arquitetura foi desenhada para funcionar na Web e em dispositivos móveis (Android/iOS) via Capacitor.
          </p>

          <h3>A Arquitetura em 5 Camadas da SUTINF</h3>
          <div className="table-wrapper">
            <table className="info-table">
              <thead>
                <tr>
                  <th>Diretório</th>
                  <th>Responsabilidade Estrita</th>
                  <th>Regra Proibitiva</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>/screens</code></td>
                  <td>Concentra as telas da aplicação, focadas exclusivamente na renderização da UI.</td>
                  <td><strong>Uma Screen NUNCA deve acessar uma API diretamente.</strong></td>
                </tr>
                <tr>
                  <td><code>/hooks</code></td>
                  <td>Concentra a lógica de negócio e controle de estados reativos.</td>
                  <td><strong>Regra das 50 Linhas:</strong> Se passar de 50 linhas de lógica, extrair para um Hook customizado.</td>
                </tr>
                <tr>
                  <td><code>/services</code></td>
                  <td>Camada exclusiva para realizar requisições e comunicações externas com APIs.</td>
                  <td>Proibido conter JSX ou manipulação de elementos visuais.</td>
                </tr>
                <tr>
                  <td><code>/components</code></td>
                  <td>Componentes visuais isolados, reutilizáveis e previsíveis (Dumb Components).</td>
                  <td>Não devem acessar o estado global diretamente.</td>
                </tr>
                <tr>
                  <td><code>/types</code></td>
                  <td>Contratos estáticos do TypeScript.</td>
                  <td><strong>É terminantemente proibido o uso de <code>any</code>.</strong></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="highlight-box">
            <h3>🔒 Segurança de Variáveis de Ambiente</h3>
            <p>
              Chaves de acesso e URLs de APIs nunca podem ser "chumbadas" no código-fonte. Elas devem residir no arquivo <code>.env</code>, sendo obrigatório no Vite o uso do prefixo <code>VITE_</code> (ex: <code>VITE_API_URL</code>).
            </p>
          </div>

          <div className="callout-card">
            <div className="callout-icon"><Layout size={28} className="text-cyan" /></div>
            <div className="callout-body">
              <h4>Manual Prático de Arquitetura Front-end</h4>
              <p>Consulte a especificação das 5 camadas, padrões de hooks, boas práticas de acessibilidade e empacotamento móvel.</p>
              <button onClick={() => navigateAndScroll('modulo-frontend')} className="btn-primary btn-sm">
                <BookOpen size={14} />
                <span>Estudar Manual de Front-end</span>
              </button>
            </div>
          </div>

          <div className="step-actions">
            <button onClick={() => handleTabChange(6)} className="btn-secondary">
              <ArrowLeft size={16} /> Voltar
            </button>
            <button onClick={() => handleTabChange(8)} className="btn-primary">
              Avançar para Etapa 8: Desafio Front-end <ArrowRight size={16} />
            </button>
          </div>
        </section>
      )}

      {/* =====================================================================
          TAB 8: DESAFIO FRONT-END (INFOÔNIBUS)
          ===================================================================== */}
      {activeTab === 8 && (
        <section className="track-content-card">
          <div className="card-section-tag">ETAPA 08</div>
          <h2>8. Desafio Prático Front-end: O Novo "InfoÔnibus"</h2>
          <p>
            O desafio culminante é criar uma interface moderna baseada no portal oficial do <strong>InfoÔnibus</strong>, consumindo os endpoints da API desenvolvida nas etapas anteriores.
          </p>

          <div className="desafio-banner">
            <h3>🚌 Funcionalidades a Implementar</h3>
            <p>
              Você desenvolverá o painel de consulta de passageiros do DF aplicando o padrão das 5 camadas:
            </p>
            <ul>
              <li>Campo de pesquisa dinâmico de linhas integrado à API;</li>
              <li>Exibição dos pontos de parada da linha pesquisada;</li>
              <li>Localização do veículo em tempo real via telemetria;</li>
              <li>Apresentação do traçado espacial (itinerário) no mapa;</li>
              <li>Painel descritivo completo com filtros interativos.</li>
            </ul>
            <button onClick={() => navigateAndScroll('desafio-frontend')} className="btn-primary mt-2">
              <Code2 size={16} />
              <span>Abrir Roteiro do Desafio InfoÔnibus</span>
            </button>
          </div>

          <div className="step-actions">
            <button onClick={() => handleTabChange(7)} className="btn-secondary">
              <ArrowLeft size={16} /> Voltar
            </button>
            <button onClick={() => handleTabChange(9)} className="btn-primary">
              Avançar para Etapa 9: Trilha & Certificado <ArrowRight size={16} />
            </button>
          </div>
        </section>
      )}

      {/* =====================================================================
          TAB 9: TRILHA DO ZERO A JÚNIOR & CERTIFICADO
          ===================================================================== */}
      {activeTab === 9 && (
        <section className="track-content-card">
          <div className="card-section-tag">ETAPA 09</div>
          <h2>9. Trilha de Aprofundamento: Do Zero ao Desenvolvedor Júnior</h2>
          <p>
            A tecnologia evolui rápido, e a <strong>proatividade na busca por conhecimento</strong> é a característica mais valorizada em nossa equipe. Para que você cresça profissionalmente, compilamos os tópicos essenciais de pesquisa autônoma:
          </p>

          <div className="deep-dive-grid">
            <div className="deep-card">
              <div className="deep-icon"><Boxes className="text-cyan" size={24} /></div>
              <h4>Fundamentos de Engenharia</h4>
              <ul>
                <li><strong>Backend vs. Frontend:</strong> Divisão exata de responsabilidades, contratos JSON e desacoplamento de deploys.</li>
                <li><strong>O que é uma SPA (Single Page Application):</strong> Virtual DOM, navegação no cliente sem reload e ganhos de UX.</li>
                <li><strong>APIs RESTful & JWT:</strong> Verbos HTTP, idempotência, expiração de tokens e autenticação stateless.</li>
              </ul>
            </div>

            <div className="deep-card">
              <div className="deep-icon"><Database className="text-emerald" size={24} /></div>
              <h4>Dados & Infraestrutura</h4>
              <ul>
                <li><strong>SQL vs. NoSQL:</strong> Modelos relacionais com integridade referencial vs documentos flexíveis.</li>
                <li><strong>Data Warehouse vs. Transacional:</strong> OLTP (operações rápidas do dia a dia) vs OLAP (painéis no Qlik).</li>
                <li><strong>Dados Espaciais (PostGIS):</strong> Sistemas de coordenadas SRID, índices espaciais GiST e cálculo de polígonos.</li>
              </ul>
            </div>

            <div className="deep-card">
              <div className="deep-icon"><Lock className="text-indigo" size={24} /></div>
              <h4>Cultura DevOps & Ferramental</h4>
              <ul>
                <li><strong>Mecânica do Git:</strong> Snapshots, Staging Area, árvores de commit e resolução cirúrgica de conflitos.</li>
                <li><strong>CI/CD Pipelines:</strong> Esteiras automáticas de compilação, linter e entrega com GitLab Runners.</li>
                <li><strong>Containerização Docker:</strong> Isolamento de dependências e padronização absoluta de ambiente.</li>
                <li><strong>DevSecOps:</strong> Prevenção contra injeção SQL, sanitização de inputs e headers de segurança.</li>
              </ul>
            </div>
          </div>

          <div className="final-step-card">
            <h3>Pronto para testar seus conhecimentos e emitir seu Certificado?</h3>
            <p>
              Agora que você compreendeu toda a trilha pedagógica, avance para a nossa Central de Quizzes para validar o aprendizado de cada bloco e desbloquear o seu Certificado Oficial da SEMOB!
            </p>
            <div className="final-btns">
              <button onClick={() => navigateAndScroll('quizzes')} className="btn-primary">
                <Sparkles size={16} />
                <span>Acessar Central de Quizzes</span>
              </button>
              <button onClick={() => navigateAndScroll('certificado')} className="btn-secondary">
                <CheckCircle2 size={16} />
                <span>Ver Requisitos do Certificado</span>
              </button>
            </div>
          </div>

          <div className="step-actions">
            <button onClick={() => handleTabChange(8)} className="btn-secondary">
              <ArrowLeft size={16} /> Voltar para Etapa 8
            </button>
            <div></div>
          </div>
        </section>
      )}
    </div>
  );
};
