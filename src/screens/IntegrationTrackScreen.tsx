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
  ShieldAlert, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp,
  Cpu,
  Boxes,
  Lock,
  ExternalLink
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

        {/* Navigation Tabs */}
        <div className="track-tabs-bar">
          <button 
            className={`track-tab-btn ${activeTab === 1 ? 'active' : ''}`}
            onClick={() => setActiveTab(1)}
          >
            1. Institucional & Stack
          </button>
          <button 
            className={`track-tab-btn ${activeTab === 2 ? 'active' : ''}`}
            onClick={() => setActiveTab(2)}
          >
            2. Git & GitLab Flow
          </button>
          <button 
            className={`track-tab-btn ${activeTab === 3 ? 'active' : ''}`}
            onClick={() => setActiveTab(3)}
          >
            3. Bancos & SQL (bdg vs prod)
          </button>
          <button 
            className={`track-tab-btn ${activeTab === 4 ? 'active' : ''}`}
            onClick={() => setActiveTab(4)}
          >
            4. Back-end (SISMOB Boilerplate)
          </button>
          <button 
            className={`track-tab-btn ${activeTab === 5 ? 'active' : ''}`}
            onClick={() => setActiveTab(5)}
          >
            5. Front-end (InfoÔnibus)
          </button>
          <button 
            className={`track-tab-btn ${activeTab === 6 ? 'active' : ''}`}
            onClick={() => setActiveTab(6)}
          >
            6. Trilha do Zero a Júnior
          </button>
        </div>
      </div>

      {/* TAB 1: INSTITUCIONAL & STACK */}
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
              Dentro desse ecossistema, a <strong>Subsecretaria de Tecnologia da Informação (SUTINF)</strong> atua como o motor tecnológico da pasta. Nossa missão é gerir processos tecnológicos, garantir alta disponibilidade de dados e desenvolver soluções que otimizem a operação do transporte público.
            </p>
            <p>
              Como estagiário(a), você atuará diretamente no suporte e desenvolvimento de soluções de ponta, integrando sistemas web, aplicativos móveis e bases geoespaciais vitais para o Distrito Federal.
            </p>
          </div>

          <h3>Nosso Stack Tecnológico Corporativo</h3>
          <div className="stack-grid">
            <div className="stack-item-card">
              <div className="item-icon-box bg-cyan-subtle">
                <Layout className="text-cyan" size={24} />
              </div>
              <h4>Front-end Moderno</h4>
              <p>React.js (versão ^18.0) com Vite, TypeScript rígido e empacotamento híbrido mobile com Capacitor.</p>
            </div>

            <div className="stack-item-card">
              <div className="item-icon-box bg-indigo-subtle">
                <Server className="text-indigo" size={24} />
              </div>
              <h4>Back-end & APIs</h4>
              <p>NestJS (Node.js + TypeScript), TypeORM, autenticação segura com JWT e contêineres Docker.</p>
            </div>

            <div className="stack-item-card">
              <div className="item-icon-box bg-emerald-subtle">
                <Database className="text-emerald" size={24} />
              </div>
              <h4>Gestão de Dados</h4>
              <p>PostgreSQL com extensões espaciais PostGIS para rotas/coordenadas, e Oracle como base central legada.</p>
            </div>

            <div className="stack-item-card">
              <div className="item-icon-box bg-amber-subtle">
                <Cpu className="text-amber" size={24} />
              </div>
              <h4>Processamento & BI</h4>
              <p>Python para automações e pipelines de dados, Java para sistemas legados e Qlik para painéis analíticos.</p>
            </div>
          </div>

          <h3>Sistemas Principais da Secretaria</h3>
          <div className="table-wrapper">
            <table className="info-table">
              <thead>
                <tr>
                  <th>Sistema</th>
                  <th>Finalidade & Descrição</th>
                  <th>Tecnologias Envolvidas</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>SISMOB</strong></td>
                  <td>Sistema Integrado de Mobilidade. É o nosso portal unificador e o principal foco de desenvolvimento da SUTINF, integrando todos os fluxos da casa.</td>
                  <td>NestJS, React, PostgreSQL</td>
                </tr>
                <tr>
                  <td><strong>INFOMOB</strong></td>
                  <td>Desdobramento do SISMOB voltado para o cidadão e controle social, com visualização simplificada de linhas, itinerários e dados abertos.</td>
                  <td>React, Vite, APIs Abertas</td>
                </tr>
                <tr>
                  <td><strong>QLIK</strong></td>
                  <td>Plataforma de Business Intelligence (BI) utilizada para transformar grandes massas de dados de bilhetagem e GPS em insights estratégicos para diretores e secretários.</td>
                  <td>Qlik Sense, Data Warehouse</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="step-actions">
            <button onClick={() => setActiveTab(2)} className="btn-primary">
              Avançar para Etapa 2: Git & Versionamento <ArrowRight size={16} />
            </button>
          </div>
        </section>
      )}

      {/* TAB 2: GIT & GITLAB FLOW */}
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
              <p>Consulte a mecânica completa das 4 zonas do Git, comandos essenciais, commits semânticos e resolução de conflitos complexos de merge.</p>
              <button onClick={() => onNavigate('modulo-git')} className="btn-secondary btn-sm">
                Abrir Manual do Git <ArrowRight size={14} />
              </button>
            </div>
          </div>

          <div className="step-actions">
            <button onClick={() => setActiveTab(1)} className="btn-secondary">Voltar</button>
            <button onClick={() => setActiveTab(3)} className="btn-primary">
              Avançar para Etapa 3: Bancos de Dados & SQL <ArrowRight size={16} />
            </button>
          </div>
        </section>
      )}

      {/* TAB 3: BANCOS DE DADOS & SQL */}
      {activeTab === 3 && (
        <section className="track-content-card">
          <div className="card-section-tag">ETAPA 03</div>
          <h2>3. Nossos Bancos de Dados e Mão na Massa (SQL)</h2>
          <p>
            Na SUTINF, a regra de ouro é: <strong>nunca testamos no escuro e respeitamos o banco de produção</strong>.
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

          <h3>Perguntas Dinâmicas de Revisão SQL (Pense Mentalmente)</h3>
          <p className="text-muted">Clique em cada pergunta para conferir o raciocínio correto do roteiro:</p>

          <div className="interactive-qa-list">
            <div className="qa-item">
              <div className="qa-question" onClick={() => toggleReveal('qa1')}>
                <span>1. Se você quiser visualizar absolutamente todas as colunas de uma tabela chamada <code>linhas_onibus</code>, qual caractere coringa você coloca logo após o SELECT?</span>
                {revealedQuestions['qa1'] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>
              {revealedQuestions['qa1'] && (
                <div className="qa-answer">
                  <strong>Resposta:</strong> O caractere asterisco (<code>*</code>). Exemplo: <code>SELECT * FROM linhas_onibus;</code>. 
                  <em>(Dica profissional: em produção, evite o asterisco e traga sempre apenas as colunas que você realmente precisa!)</em>
                </div>
              )}
            </div>

            <div className="qa-item">
              <div className="qa-question" onClick={() => toggleReveal('qa2')}>
                <span>2. Para achar uma linha específica, usamos <code>WHERE numero_linha = '0.111'</code>. E se você quisesse buscar qualquer linha que contenha a palavra "Gama" no nome?</span>
                {revealedQuestions['qa2'] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>
              {revealedQuestions['qa2'] && (
                <div className="qa-answer">
                  <strong>Resposta:</strong> Usa-se o operador <code>LIKE</code> (ou <code>ILIKE</code> no Postgres para ignorar maiúsculas/minúsculas) acompanhado do símbolo de porcentagem (<code>%</code>). Exemplo: <code>WHERE nome_linha ILIKE '%Gama%';</code>.
                </div>
              )}
            </div>

            <div className="qa-item">
              <div className="qa-question" onClick={() => toggleReveal('qa3')}>
                <span>3. Se a diretoria pedir "qual a linha com a maior extensão do DF?", qual função você usaria na coluna de extensão (MAX ou MIN) e como você ordenaria o resultado (ASC ou DESC)?</span>
                {revealedQuestions['qa3'] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>
              {revealedQuestions['qa3'] && (
                <div className="qa-answer">
                  <strong>Resposta:</strong> Usaria a função <code>MAX(extensao)</code> ou ordenaria com <code>ORDER BY extensao DESC LIMIT 1;</code>.
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
            <h3>⚡ O Desafio Prático SQL (25 Questões)</h3>
            <p>
              Preparamos um desafio completo com 25 consultas reais divididas em 3 partes: Investigando a Linha 0.111, Compreendendo os Sentidos na Linha 0.170 e Cruzamentos Estratégicos.
            </p>
            <div className="desafio-btns">
              <button onClick={() => onNavigate('desafio-sql')} className="btn-primary">
                Abrir Desafio SQL das 25 Questões <ArrowRight size={16} />
              </button>
              <button onClick={() => onNavigate('modulo-gabarito')} className="btn-secondary">
                Ver Gabarito Oficial Comentado <ExternalLink size={16} />
              </button>
            </div>
          </div>

          <div className="step-actions">
            <button onClick={() => setActiveTab(2)} className="btn-secondary">Voltar</button>
            <button onClick={() => setActiveTab(4)} className="btn-primary">
              Avançar para Etapa 4: Back-end NestJS <ArrowRight size={16} />
            </button>
          </div>
        </section>
      )}

      {/* TAB 4: BACK-END SISMOB BOILERPLATE */}
      {activeTab === 4 && (
        <section className="track-content-card">
          <div className="card-section-tag">ETAPA 04</div>
          <h2>4. Repositório SEMOB e o Padrão Backend (SISMOB Boilerplate)</h2>
          <p>
            O <strong>SISMOB Boilerplate</strong> é o nosso projeto base padronizado para criação de APIs REST em microsserviços de transporte. Ele reúne as principais tecnologias da nossa stack:
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

          <h3>Arquitetura em 3 Camadas</h3>
          <div className="layers-visual">
            <div className="layer-block controller">
              <strong>1. Controller</strong>
              <span>Recebe a requisição HTTP e repassa para o Service. <em>NUNCA acessa o banco diretamente.</em></span>
            </div>
            <div className="layer-arrow">↓</div>
            <div className="layer-block service">
              <strong>2. Service</strong>
              <span>Contém toda a lógica e regra de negócio da aplicação.</span>
            </div>
            <div className="layer-arrow">↓</div>
            <div className="layer-block repository">
              <strong>3. Repository</strong>
              <span>Executa as queries SQL no banco de dados de forma segura.</span>
            </div>
          </div>

          <div className="rule-card">
            <h4>⭐ Regra de Ouro da Arquitetura: Entity vs. SQL Nativo</h4>
            <ul>
              <li><strong>Use Entities (ORM TypeORM):</strong> Para operações simples de CRUD em uma única tabela. Traz agilidade e validação.</li>
              <li><strong>Use SQL Nativo Parametrizado ($1, $2):</strong> Para relatórios analíticos complexos, consultas espaciais ou múltiplos JOINs. O Repository usa queries parametrizadas nativas, que é a blindagem definitiva contra SQL Injection.</li>
            </ul>
          </div>

          <h3>O Desafio das 7 Etapas do Back-end</h3>
          <p>Para consolidar a prática, você desenvolverá um novo recurso (ex: <code>Veículos</code>) passando pelas 7 etapas:</p>
          <ol className="ordered-steps-list">
            <li><strong>Passo 1:</strong> Criar a Entity (<code>src/entity/veiculo.entity.ts</code>)</li>
            <li><strong>Passo 2:</strong> Criar o DTO (<code>src/dto/create-veiculo.dto.ts</code>) com validações <code>class-validator</code></li>
            <li><strong>Passo 3:</strong> Criar o Repository (<code>src/repository/veiculo.repository.ts</code>) com queries parametrizadas</li>
            <li><strong>Passo 4:</strong> Criar o Service (<code>src/service/veiculo.service.ts</code>) com regras de negócio</li>
            <li><strong>Passo 5:</strong> Criar o Controller (<code>src/controller/veiculo.controller.ts</code>) protegido por <code>@UseGuards(JwtAuthGuard)</code></li>
            <li><strong>Passo 6:</strong> Criar o Module (<code>src/module/veiculo.module.ts</code>)</li>
            <li><strong>Passo 7:</strong> Registrar no <code>AppModule</code> (<code>src/app.module.ts</code>)</li>
          </ol>

          <div className="step-actions">
            <button onClick={() => setActiveTab(3)} className="btn-secondary">Voltar</button>
            <button onClick={() => onNavigate('desafio-backend')} className="btn-primary">
              Abrir Tutorial do Desafio Back-end <ArrowRight size={16} />
            </button>
            <button onClick={() => setActiveTab(5)} className="btn-secondary">
              Avançar para Etapa 5: Front-end <ArrowRight size={16} />
            </button>
          </div>
        </section>
      )}

      {/* TAB 5: FRONT-END & DESAFIO INFOÔNIBUS */}
      {activeTab === 5 && (
        <section className="track-content-card">
          <div className="card-section-tag">ETAPA 05</div>
          <h2>5. Front-End (React), Arquitetura SUTINF e o Desafio InfoÔnibus</h2>
          <p>
            Nossos projetos front-end são concebidos para funcionar com a mesma base de código tanto na <strong>Web quanto no Mobile</strong> através do Capacitor. Nossa stack utiliza React 18 e Vite.
          </p>

          <h3>A Arquitetura em 5 Camadas</h3>
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
                  <td>Concentra a lógica de negócio e controle de estados.</td>
                  <td><strong>Regra das 50 Linhas:</strong> Se passar de 50 linhas focadas em lógica, extrair para um Hook customizado.</td>
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

          <div className="desafio-banner">
            <h3>🚌 O Desafio Prático: O Novo "InfoÔnibus"</h3>
            <p>
              O desafio culminante é criar uma interface baseada no portal oficial do InfoÔnibus consumindo serviços de uma API real de mobilidade:
            </p>
            <ul>
              <li>Campo de pesquisa dinâmico de linhas integrado à API;</li>
              <li>Exibição dos pontos de parada da linha pesquisada;</li>
              <li>Localização do veículo em tempo real via telemetria;</li>
              <li>Apresentação do traçado espacial (itinerário) no mapa;</li>
              <li>Painel descritivo completo com filtros interativos.</li>
            </ul>
            <button onClick={() => onNavigate('desafio-frontend')} className="btn-primary mt-2">
              Explorar Desafio do InfoÔnibus <ArrowRight size={16} />
            </button>
          </div>

          <div className="step-actions">
            <button onClick={() => setActiveTab(4)} className="btn-secondary">Voltar</button>
            <button onClick={() => setActiveTab(6)} className="btn-primary">
              Avançar para Etapa 6: Trilha de Aprofundamento <ArrowRight size={16} />
            </button>
          </div>
        </section>
      )}

      {/* TAB 6: TRILHA DO ZERO A JÚNIOR */}
      {activeTab === 6 && (
        <section className="track-content-card">
          <div className="card-section-tag">ETAPA 06</div>
          <h2>6. Trilha de Aprofundamento: Do Zero ao Desenvolvedor Júnior</h2>
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
            <h3>Pronto para testar seus conhecimentos?</h3>
            <p>
              Agora que você compreendeu toda a trilha pedagógica, avance para a nossa Central de Quizzes para validar o aprendizado de cada bloco e desbloquear o seu Certificado de Formação!
            </p>
            <div className="final-btns">
              <button onClick={() => onNavigate('quizzes')} className="btn-primary">
                Acessar Central de Quizzes <ArrowRight size={16} />
              </button>
              <button onClick={() => onNavigate('certificado')} className="btn-secondary">
                Ver Requisitos do Certificado <ArrowRight size={16} />
              </button>
            </div>
          </div>

          <div className="step-actions">
            <button onClick={() => setActiveTab(5)} className="btn-secondary">Voltar</button>
          </div>
        </section>
      )}
    </div>
  );
};
