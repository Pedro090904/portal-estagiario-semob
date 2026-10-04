import React, { useState } from 'react';
import { ScreenType } from '../types';
import { MODULES } from '../services/dataService';
import { 
  Compass, 
  GitBranch, 
  Database, 
  Server, 
  Layout, 
  CheckCircle2, 
  Award, 
  ArrowRight, 
  Terminal, 
  ShieldCheck, 
  UserCheck, 
  Clock, 
  BookOpen, 
  Sparkles,
  Edit2,
  Check
} from 'lucide-react';

interface HomeScreenProps {
  onNavigate: (screen: ScreenType) => void;
  completedModules: string[];
  passedQuizzesCount: number;
  totalQuizzes: number;
  completedChallengesCount: number;
  totalChallenges: number;
  overallPercentage: number;
  studentName: string;
  onUpdateStudentName: (name: string) => void;
  onToggleModule: (moduleId: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigate,
  completedModules,
  passedQuizzesCount,
  totalQuizzes,
  completedChallengesCount,
  totalChallenges,
  overallPercentage,
  studentName,
  onUpdateStudentName,
  onToggleModule,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(studentName);

  const handleSaveName = () => {
    if (tempName.trim()) {
      onUpdateStudentName(tempName.trim());
    }
    setIsEditingName(false);
  };

  const getModuleIcon = (id: string) => {
    switch (id) {
      case 'git': return <GitBranch className="text-sky" size={24} />;
      case 'sql': return <Database className="text-emerald" size={24} />;
      case 'gabarito-sql': return <CheckCircle2 className="text-emerald" size={24} />;
      case 'backend': return <Server className="text-indigo" size={24} />;
      case 'frontend': return <Layout className="text-cyan" size={24} />;
      default: return <BookOpen size={24} />;
    }
  };

  return (
    <div className="home-screen">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-badge">
            <span className="pulse-dot"></span>
            <span>PROGRAMA OFICIAL DE FORMAÇÃO • SUTINF / SEMOB-DF</span>
          </div>

          <h1 className="hero-title">
            Do Zero a Desenvolvedor Júnior na <span className="gradient-text">SEMOB-DF</span>
          </h1>

          <p className="hero-description">
            Plataforma interativa unificada com todos os manuais oficiais, diretrizes arquiteturais, desafios práticos de SQL e APIs, e quizzes de validação de conhecimento para a equipe de tecnologia dos transportes de Brasília.
          </p>

          {/* Student Welcome Card */}
          <div className="student-profile-bar">
            <div className="student-avatar">
              <UserCheck size={24} />
            </div>
            <div className="student-info">
              <div className="student-label">Desenvolvedor(a) em Formação:</div>
              {isEditingName ? (
                <div className="student-name-edit">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    placeholder="Digite seu nome completo"
                    className="name-input"
                    autoFocus
                  />
                  <button onClick={handleSaveName} className="btn-icon-check" title="Salvar nome">
                    <Check size={18} />
                  </button>
                </div>
              ) : (
                <div className="student-name-display" onClick={() => setIsEditingName(true)}>
                  <span className="student-name-text">{studentName}</span>
                  <button className="btn-edit-name" title="Editar nome para o certificado">
                    <Edit2 size={14} />
                  </button>
                </div>
              )}
            </div>

            <div className="hero-ctas">
              <button onClick={() => onNavigate('roteiro')} className="btn-primary">
                <Compass size={18} />
                Iniciar Roteiro de Integração
              </button>
              <button onClick={() => onNavigate('quizzes')} className="btn-secondary">
                <Sparkles size={18} />
                Central de Quizzes
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Row */}
      <section className="metrics-section">
        <div className="metrics-grid">
          <div className="metric-card highlight">
            <div className="metric-header">
              <span className="metric-title">Progresso da Formação</span>
              <Award className="metric-icon" size={20} />
            </div>
            <div className="metric-value">{overallPercentage}%</div>
            <div className="metric-bar">
              <div className="metric-bar-fill" style={{ width: `${overallPercentage}%` }}></div>
            </div>
            <div className="metric-footer">
              {overallPercentage >= 80 ? 'Pronto para emitir o Certificado!' : 'Complete os módulos e quizzes para avançar.'}
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <span className="metric-title">Manuais Estudados</span>
              <BookOpen className="metric-icon" size={20} />
            </div>
            <div className="metric-value">{completedModules.length} / {MODULES.length}</div>
            <div className="metric-footer text-muted">Guias oficiais de arquitetura lidos</div>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <span className="metric-title">Quizzes Aprovados</span>
              <CheckCircle2 className="metric-icon" size={20} />
            </div>
            <div className="metric-value">{passedQuizzesCount} / {totalQuizzes}</div>
            <div className="metric-footer text-muted">Aproveitamento mínimo de 75% exigido</div>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <span className="metric-title">Desafios Práticos</span>
              <Terminal className="metric-icon" size={20} />
            </div>
            <div className="metric-value">{completedChallengesCount} / {totalChallenges}</div>
            <div className="metric-footer text-muted">25 queries SQL + Back-end + Front-end</div>
          </div>
        </div>
      </section>

      {/* The 5 Pillars of SEMOB Training */}
      <section className="track-section">
        <div className="section-header">
          <div className="section-badge">TRILHA PEDAGÓGICA</div>
          <h2 className="section-title">Os 5 Pilares de Formação do Desenvolvedor</h2>
          <p className="section-desc">
            Siga a sequência didática recomendada para dominar do fluxo colaborativo à entrega em produção.
          </p>
        </div>

        {/* Integration Plan Featured Banner */}
        <div className="featured-roadmap-card" onClick={() => onNavigate('roteiro')}>
          <div className="featured-content">
            <div className="featured-tag">
              <Compass size={16} />
              <span>ROTEIRO OFICIAL DE INTEGRAÇÃO</span>
            </div>
            <h3>Conhecendo a SEMOB, a SUTINF e o Ecossistema de Mobilidade</h3>
            <p>
              O roteiro institucional completo baseado no documento oficial de estágio: o papel da SUTINF, bacias de transporte, ambientes de homologação e produção, o SISMOB Boilerplate e o Desafio InfoÔnibus.
            </p>
            <div className="featured-meta">
              <span><Clock size={14} /> Leitura estimada: 25 min</span>
              <span><ShieldCheck size={14} /> Guia Obrigatório de Acolhimento</span>
            </div>
          </div>
          <button className="btn-featured-action">
            Acessar Roteiro <ArrowRight size={18} />
          </button>
        </div>

        {/* Modules Grid */}
        <div className="modules-grid">
          {MODULES.map((module, index) => {
            const isCompleted = completedModules.includes(module.id);

            return (
              <div key={module.id} className={`module-card ${isCompleted ? 'module-done' : ''}`}>
                <div className="module-card-top">
                  <div className="module-step-badge">Módulo 0{index + 1}</div>
                  <div className="module-duration">{module.duration}</div>
                </div>

                <div className="module-header-block">
                  <div className="module-icon-box">{getModuleIcon(module.id)}</div>
                  <div>
                    <h3 className="module-title">{module.shortTitle}</h3>
                    <span className="module-category">{module.category}</span>
                  </div>
                </div>

                <p className="module-desc">{module.description}</p>

                <div className="module-topics-list">
                  {module.topics.map((topic, i) => (
                    <span key={i} className="module-topic-chip">
                      • {topic}
                    </span>
                  ))}
                </div>

                <div className="module-card-footer">
                  <button 
                    onClick={() => onNavigate(module.screenKey)} 
                    className="btn-primary btn-sm"
                  >
                    Estudar Manual <ArrowRight size={14} />
                  </button>
                  <button
                    onClick={() => onToggleModule(module.id)}
                    className={`btn-check-toggle ${isCompleted ? 'checked' : ''}`}
                    title={isCompleted ? 'Marcar como não concluído' : 'Marcar como concluído'}
                  >
                    <CheckCircle2 size={16} />
                    <span>{isCompleted ? 'Concluído' : 'Marcar lido'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Practical Challenges Spotlight */}
      <section className="challenges-spotlight">
        <div className="section-header">
          <div className="section-badge">MÃO NA MASSA</div>
          <h2 className="section-title">Desafios Práticos com Gabarito Oficial</h2>
          <p className="section-desc">
            Resolva os desafios reais com apoio do nosso gabarito e raciocínio lógico estruturado.
          </p>
        </div>

        <div className="challenges-grid">
          <div className="challenge-spotlight-card" onClick={() => onNavigate('desafio-sql')}>
            <div className="card-badge bg-emerald">SQL & PostGIS</div>
            <h3>Desafio Prático SQL (25 Questões)</h3>
            <p>
              Investigue as linhas 0.111 e 0.170, consulte tabelas operacionais, analise sentidos de ida e volta e cruze dados de bilhetagem e horários.
            </p>
            <div className="card-action-link">
              Abrir Questões & Gabarito <ArrowRight size={16} />
            </div>
          </div>

          <div className="challenge-spotlight-card" onClick={() => onNavigate('desafio-backend')}>
            <div className="card-badge bg-indigo">NestJS & Docker</div>
            <h3>Desafio Back-end: Recurso Veículos</h3>
            <p>
              Crie um novo recurso no SISMOB Boilerplate do zero passando pelas 7 etapas canônicas: Entity, DTO, Repository parametrizado, Service e Controller.
            </p>
            <div className="card-action-link">
              Ver Passo a Passo <ArrowRight size={16} />
            </div>
          </div>

          <div className="challenge-spotlight-card" onClick={() => onNavigate('desafio-frontend')}>
            <div className="card-badge bg-cyan">React 18 & Vite</div>
            <h3>Desafio Front-end: Novo "InfoÔnibus"</h3>
            <p>
              Construa uma interface moderna integrada a APIs reais de transporte com busca dinâmica, paradas, itinerário espacial e GPS em tempo real.
            </p>
            <div className="card-action-link">
              Especificações & Demo <ArrowRight size={16} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
