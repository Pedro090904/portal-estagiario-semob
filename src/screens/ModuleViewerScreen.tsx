import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  BookOpen,
  Lightbulb,
  Copy,
  Check,
  Award,
  History,
  Layers,
  ListChecks,
} from 'lucide-react';
import { LearningModule, QuizAttempt, QuizBlockData } from '../types';
import { getQuizByModuleId, QUIZZES } from '../services/dataService';
import { QuizBlock } from '../components/QuizBlock';
import { ModuleNotesPanel } from '../components/ModuleNotesPanel';

interface ModuleViewerScreenProps {
  module: LearningModule;
  isCompleted: boolean;
  completedChecklist: string[];
  quizAttempt?: QuizAttempt;
  quizHistory?: QuizAttempt[];
  moduleNote: string;
  onBack: () => void;
  onToggleComplete: (moduleId: string) => void;
  onToggleChecklist: (moduleId: string, itemKey: string) => void;
  onSaveQuiz: (attempt: QuizAttempt) => void;
  onSaveNote: (moduleId: string, note: string) => void;
  onSelectModule: (moduleId: string) => void;
  allModules: LearningModule[];
}

export const ModuleViewerScreen: React.FC<ModuleViewerScreenProps> = ({
  module,
  isCompleted,
  completedChecklist,
  quizAttempt,
  quizHistory = [],
  moduleNote,
  onBack,
  onToggleComplete,
  onToggleChecklist,
  onSaveQuiz,
  onSaveNote,
  onSelectModule,
  allModules,
}) => {
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'step' | 'full'>('step');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const questions = getQuizByModuleId(module.id);
  const quizData: QuizBlockData = QUIZZES.find(
    (q) => q.moduleId === module.id || q.id === module.quizId
  ) || {
    id: module.quizId || `quiz-${module.id}`,
    moduleId: module.id,
    title: `Quiz: ${module.title}`,
    subtitle: 'Validação de Conhecimentos',
    badge: module.category,
    description: module.description,
    passingScore: 75,
    questions,
  };

  // Sempre que mudar de módulo, volta para a primeira lição e para o topo
  useEffect(() => {
    setActiveSectionIndex(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [module.id]);

  const currentIdxInAll = allModules.findIndex((m) => m.id === module.id);
  const prevModule = currentIdxInAll > 0 ? allModules[currentIdxInAll - 1] : null;
  const nextModule =
    currentIdxInAll < allModules.length - 1 ? allModules[currentIdxInAll + 1] : null;

  const handleCopyCode = (key: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const sectionsToRender =
    viewMode === 'step'
      ? [module.sections[activeSectionIndex]].filter(Boolean)
      : module.sections;

  return (
    <div className="screen-container">
      {/* Barra de Topo e Navegação entre Módulos */}
      <div
        className="module-viewer-topbar"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
          marginBottom: '1.25rem',
        }}
      >
        <button className="btn-secondary" onClick={onBack}>
          <ArrowLeft size={16} /> Voltar para a Trilha
        </button>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button
            type="button"
            onClick={() => setViewMode(viewMode === 'step' ? 'full' : 'step')}
            className="btn-secondary"
            title="Alternar modo de visualização"
          >
            <Layers size={15} />
            {viewMode === 'step' ? 'Ver Todas as Lições Juntas' : 'Modo Passo a Passo (Microlearning)'}
          </button>

          <button
            className={isCompleted ? 'btn-secondary' : 'btn-primary'}
            onClick={() => onToggleComplete(module.id)}
          >
            <CheckCircle2 size={16} />
            {isCompleted ? 'Módulo Concluído ✓' : 'Marcar Módulo como Lido'}
          </button>
        </div>
      </div>

      {/* Hero do Módulo */}
      <section className="hero-banner">
        <div className="hero-content">
          <span className="hero-badge">
            Módulo 0{module.order} • {module.category.toUpperCase()} • <Clock size={13} />{' '}
            {module.estimatedTime}
          </span>
          <h1>{module.title}</h1>
          <p>{module.description}</p>

          {/* Objetivos de Aprendizagem */}
          {module.objectives && module.objectives.length > 0 && (
            <div style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {module.objectives.map((obj, idx) => (
                <span key={idx} className="status-pill passed" style={{ fontSize: '0.75rem' }}>
                  🎯 {obj}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Navegador de Micro-Lições (Etapas Internas do Módulo) */}
      {viewMode === 'step' && module.sections.length > 1 && (
        <section className="section-card" style={{ padding: '1rem 1.25rem' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.75rem',
            }}
          >
            <strong style={{ fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <BookOpen size={16} /> Progresso da Leitura neste Módulo: Lição {activeSectionIndex + 1} de{' '}
              {module.sections.length}
            </strong>
            <span className="text-muted" style={{ fontSize: '0.8rem' }}>
              {Math.round(((activeSectionIndex + 1) / module.sections.length) * 100)}% do conteúdo teórico
            </span>
          </div>

          <div className="sql-filter-buttons" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {module.sections.map((sec, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveSectionIndex(idx)}
                className={`sql-filter-btn ${activeSectionIndex === idx ? 'active' : ''}`}
              >
                {idx + 1}. {sec.heading}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Renderização das Secções de Conteúdo */}
      <div className="module-sections-list">
        {sectionsToRender.map((section, idx) => {
          const realIndex = viewMode === 'step' ? activeSectionIndex : idx;
          const codeKey = `${module.id}-sec-${realIndex}`;

          return (
            <section key={codeKey} className="section-card">
              <div className="section-header-row">
                <h2>
                  <span className="status-pill passed" style={{ marginRight: '0.6rem', fontSize: '0.8rem' }}>
                    Lição {realIndex + 1}/{module.sections.length}
                  </span>
                  {section.heading}
                </h2>
              </div>

              <p style={{ lineHeight: 1.75, marginTop: '0.75rem', fontSize: '0.96rem' }}>
                {section.body}
              </p>

              {section.bullets && section.bullets.length > 0 && (
                <ul
                  className="module-bullet-list"
                  style={{ marginTop: '1rem', paddingLeft: '1.25rem', lineHeight: 1.7 }}
                >
                  {section.bullets.map((item, bIdx) => (
                    <li key={bIdx} style={{ marginBottom: '0.4rem' }}>
                      {item}
                    </li>
                  ))}
                </ul>
              )}

              {section.codeExample && (
                <div style={{ marginTop: '1.25rem' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '0.4rem',
                    }}
                  >
                    <span className="text-muted" style={{ fontSize: '0.78rem', fontFamily: 'monospace' }}>
                      Exemplo Prático ({section.codeLanguage || 'code'})
                    </span>
                    <button
                      type="button"
                      className="btn-secondary"
                      style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem' }}
                      onClick={() => handleCopyCode(codeKey, section.codeExample!)}
                    >
                      {copiedKey === codeKey ? <Check size={13} /> : <Copy size={13} />}
                      {copiedKey === codeKey ? 'Copiado!' : 'Copiar Código'}
                    </button>
                  </div>
                  <pre className="code-block">
                    <code>{section.codeExample}</code>
                  </pre>
                </div>
              )}

              {section.tip && (
                <div className="sql-hint-box" style={{ marginTop: '1.25rem' }}>
                  <Lightbulb size={18} />
                  <span>
                    <strong>Boas Práticas:</strong> {section.tip}
                  </span>
                </div>
              )}

              {/* Botões de Avanço Rápido entre Micro-Lições */}
              {viewMode === 'step' && (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '1.5rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid rgba(148,163,184,0.15)',
                  }}
                >
                  <button
                    type="button"
                    className="btn-secondary"
                    disabled={activeSectionIndex === 0}
                    onClick={() => setActiveSectionIndex((prev) => Math.max(0, prev - 1))}
                    style={{ opacity: activeSectionIndex === 0 ? 0.4 : 1 }}
                  >
                    <ArrowLeft size={15} /> Lição Anterior
                  </button>

                  {activeSectionIndex < module.sections.length - 1 ? (
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={() => setActiveSectionIndex((prev) => prev + 1)}
                    >
                      Próxima Lição ({activeSectionIndex + 2}/{module.sections.length}) <ArrowRight size={15} />
                    </button>
                  ) : (
                    <span className="status-pill passed">
                      🎉 Última lição deste módulo! Realize o checklist e o Quiz abaixo.
                    </span>
                  )}
                </div>
              )}
            </section>
          );
        })}
      </div>

      {/* Checklist Prático do Módulo */}
      {module.checklist && module.checklist.length > 0 && (
        <section className="section-card">
          <h2>
            <ListChecks size={20} style={{ display: 'inline', marginRight: '0.5rem' }} />
            Checklist de Verificação Prática
          </h2>
          <p className="text-muted" style={{ marginBottom: '1rem' }}>
            Marque cada atividade à medida que a testar na sua máquina de desenvolvimento:
          </p>
          <div className="checklist-box">
            {module.checklist.map((item, idx) => {
              const itemKey = `check-${idx}`;
              const checked = completedChecklist.includes(itemKey);
              return (
                <label
                  key={itemKey}
                  className={`checklist-item ${checked ? 'completed' : ''}`}
                  style={{ cursor: 'pointer' }}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggleChecklist(module.id, itemKey)}
                  />
                  <span className="checklist-text">{item}</span>
                </label>
              );
            })}
          </div>
        </section>
      )}

      {/* Bloco de Anotações Pessoais do Estudante */}
      <ModuleNotesPanel
        module={module}
        initialNotes={moduleNote}
        onSaveNotes={(noteText) => onSaveNote(module.id, noteText)}
      />

      {/* Histórico de Tentativas do Estudante neste Módulo (Fase 4 da Auditoria) */}
      {quizHistory.length > 0 && (
        <section className="section-card">
          <div className="section-header-row">
            <div>
              <h2>
                <History size={20} style={{ display: 'inline', marginRight: '0.5rem' }} />
                Histórico de Tentativas neste Módulo
              </h2>
              <p className="text-muted">
                Todas as suas avaliações anteriores ficam preservadas para acompanhamento de evolução.
              </p>
            </div>
            {quizAttempt && (
              <span className={`status-pill ${quizAttempt.passed ? 'passed' : 'pending'}`}>
                <Award size={14} style={{ display: 'inline', marginRight: 4 }} />
                Melhor Nota: {quizAttempt.percentage}%
              </span>
            )}
          </div>

          <div className="cards-grid three-cols" style={{ marginTop: '1rem' }}>
            {quizHistory.map((att, i) => (
              <div key={i} className="glass-card" style={{ padding: '0.9rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong>Tentativa #{att.attemptNumber || i + 1}</strong>
                  <span className={`status-pill ${att.passed ? 'passed' : 'pending'}`}>
                    {att.percentage}% ({att.score}/{att.totalQuestions})
                  </span>
                </div>
                <p className="text-muted" style={{ fontSize: '0.75rem', marginTop: '0.4rem' }}>
                  Realizado em: {new Date(att.completedAt).toLocaleString('pt-BR')}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Quiz de Validação do Módulo */}
      {questions.length > 0 && (
        <QuizBlock
          quiz={quizData}
          existingAttempt={quizAttempt}
          onSaveAttempt={onSaveQuiz}
        />
      )}

      {/* Navegação Inferior entre Módulos da Trilha */}
      <section
        className="section-card"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        {prevModule ? (
          <button className="btn-secondary" onClick={() => onSelectModule(prevModule.id)}>
            <ArrowLeft size={16} /> Anterior: {prevModule.title}
          </button>
        ) : (
          <div />
        )}

        {nextModule ? (
          <button className="btn-primary" onClick={() => onSelectModule(nextModule.id)}>
            Próximo Módulo: {nextModule.title} <ArrowRight size={16} />
          </button>
        ) : (
          <button className="btn-primary" onClick={onBack}>
            Concluir Leitura e Voltar à Trilha <CheckCircle2 size={16} />
          </button>
        )}
      </section>
    </div>
  );
};
export default ModuleViewerScreen;
