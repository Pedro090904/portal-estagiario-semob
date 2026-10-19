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
  Search,
  Sun,
  Moon,
  ArrowUp,
  FileText,
  X,
} from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { LearningModule, QuizAttempt } from '../types';
import { getQuizByModuleId } from '../services/dataService';
import { QuizBlock } from '../components/QuizBlock';
import { ModuleNotesPanel } from '../components/ModuleNotesPanel';
import { TechnicalDiagram } from '../components/TechnicalDiagrams';

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
  // Inicia em 'full' para entregar a experiência de Tutorial Completo imediata, permitindo focar por lição no 'step'
  const [viewMode, setViewMode] = useState<'full' | 'step'>('full');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [scenarioQuery, setScenarioQuery] = useState('');
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const questions = getQuizByModuleId(module.id);

  useEffect(() => {
    setActiveSectionIndex(0);
    setScenarioQuery('');
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
      {/* Barra de Topo */}
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

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setIsNotesOpen(!isNotesOpen)}
            className={`btn-secondary ${isNotesOpen ? 'active' : ''}`}
            title="Abrir Caderno de Notas Técnicas lateral"
          >
            <FileText size={15} /> Caderno de Notas {moduleNote ? '•' : ''}
          </button>

          <button
            type="button"
            onClick={() => setViewMode(viewMode === 'full' ? 'step' : 'full')}
            className="btn-secondary"
          >
            <Layers size={15} />
            {viewMode === 'full'
              ? 'Modo Foco (1 Lição por Vez)'
              : 'Ver Tutorial Completo'}
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            className="theme-toggle-btn"
            style={{ width: '38px', height: '38px', padding: 0 }}
            aria-label="Alternar tema"
            title={`Mudar para tema ${theme === 'dark' ? 'claro' : 'escuro'}`}
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          <button
            className={isCompleted ? 'btn-secondary' : 'btn-primary'}
            onClick={() => onToggleComplete(module.id)}
          >
            <CheckCircle2 size={16} />
            {isCompleted ? 'Módulo Concluído ✓' : 'Marcar Concluído'}
          </button>
        </div>
      </div>

      {/* Hero Banner do Manual */}
      <section className="hero-banner">
        <div className="hero-content">
          <span className="hero-badge">
            Módulo 0{module.order} • {module.category.toUpperCase()} • <Clock size={13} />{' '}
            {module.estimatedTime}
          </span>
          <h1>{module.title}</h1>
          <p>{module.description}</p>

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

      {/* Sumário Rápido de Navegação das Secções do Tutorial */}
      <section className="section-card" style={{ padding: '1.1rem 1.35rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '0.75rem',
            flexWrap: 'wrap',
          }}
        >
          <strong style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <BookOpen size={16} /> Sumário do Tutorial ({module.sections.length} Capítulos)
          </strong>
          <span className="text-muted" style={{ fontSize: '0.78rem' }}>
            {viewMode === 'full'
              ? 'Clique num capítulo para saltar ou ative o Modo Foco acima'
              : `Capítulo ${activeSectionIndex + 1} de ${module.sections.length}`}
          </span>
        </div>

        <div className="sql-filter-buttons" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {module.sections.map((sec, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setActiveSectionIndex(idx);
                if (viewMode === 'full') {
                  const el = document.getElementById(`chapter-${idx}`);
                  el?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className={`sql-filter-btn ${
                viewMode === 'step' && activeSectionIndex === idx ? 'active' : ''
              }`}
            >
              {sec.heading}
            </button>
          ))}
        </div>
      </section>

      {/* Renderização Rica dos Capítulos do Tutorial */}
      <div className="module-sections-list">
        {sectionsToRender.map((section, idx) => {
          const realIndex = viewMode === 'step' ? activeSectionIndex : idx;
          const codeKey = `${module.id}-sec-${realIndex}`;

          const filteredScenarios = section.scenarios?.filter(
            (sc) =>
              sc.title.toLowerCase().includes(scenarioQuery.toLowerCase()) ||
              sc.description.toLowerCase().includes(scenarioQuery.toLowerCase()) ||
              sc.commands.some((c) => c.toLowerCase().includes(scenarioQuery.toLowerCase()))
          );

          return (
            <section id={`chapter-${realIndex}`} key={codeKey} className="section-card">
              <div className="section-header-row">
                <h2>{section.heading}</h2>
              </div>

              <p style={{ lineHeight: 1.75, marginTop: '0.75rem', fontSize: '0.96rem' }}>
                {section.body}
              </p>

              {/* Parágrafos Extras */}
              {section.paragraphs?.map((pText, pIdx) => (
                <p key={pIdx} style={{ lineHeight: 1.75, marginTop: '0.75rem', fontSize: '0.96rem' }}>
                  {pText}
                </p>
              ))}

              {/* Diagrama Vetorial SVG Original */}
              {section.svgDiagramType && <TechnicalDiagram type={section.svgDiagramType} />}

              {/* Callouts / Caixas de Alerta e Analogias */}
              {section.callouts?.map((callout, cIdx) => (
                <div
                  key={cIdx}
                  className="glass-card"
                  style={{
                    marginTop: '1.25rem',
                    borderLeft: `4px solid ${
                      callout.type === 'danger'
                        ? '#ef4444'
                        : callout.type === 'warning'
                        ? '#f59e0b'
                        : callout.type === 'success'
                        ? '#10b981'
                        : callout.type === 'important'
                        ? '#6366f1'
                        : '#38bdf8'
                    }`,
                    padding: '1.15rem 1.35rem',
                  }}
                >
                  <strong
                    style={{
                      display: 'block',
                      fontSize: '0.84rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: '0.4rem',
                    }}
                  >
                    {callout.title}
                  </strong>
                  <p style={{ fontSize: '0.92rem', lineHeight: 1.65 }}>{callout.content}</p>
                  {callout.bullets && (
                    <ul
                      style={{
                        marginTop: '0.5rem',
                        paddingLeft: '1.25rem',
                        fontSize: '0.88rem',
                        lineHeight: 1.65,
                      }}
                    >
                      {callout.bullets.map((b, bIdx) => (
                        <li key={bIdx} style={{ marginBottom: '0.25rem' }}>
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}

              {/* Lista de Bullets Padrão */}
              {section.bullets && section.bullets.length > 0 && (
                <ul
                  className="module-bullet-list"
                  style={{ marginTop: '1rem', paddingLeft: '1.25rem', lineHeight: 1.75 }}
                >
                  {section.bullets.map((item, bIdx) => (
                    <li key={bIdx} style={{ marginBottom: '0.4rem' }}>
                      {item}
                    </li>
                  ))}
                </ul>
              )}

              {/* Tabelas Comparativas Ricas */}
              {section.tables?.map((tb, tIdx) => (
                <div
                  key={tIdx}
                  className="glass-card"
                  style={{ overflowX: 'auto', marginTop: '1.25rem', padding: 0 }}
                >
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                    <thead>
                      <tr
                        style={{
                          borderBottom: '2px solid rgba(56, 189, 248, 0.3)',
                          textAlign: 'left',
                          background: 'rgba(15, 23, 42, 0.35)',
                        }}
                      >
                        {tb.headers.map((h, hIdx) => (
                          <th
                            key={hIdx}
                            style={{
                              padding: '0.85rem 1rem',
                              color: '#38bdf8',
                              textTransform: 'uppercase',
                              fontSize: '0.76rem',
                              letterSpacing: '0.04em',
                            }}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {tb.rows.map((row, rIdx) => (
                        <tr
                          key={rIdx}
                          style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.12)' }}
                        >
                          {row.map((cell, cellIdx) => (
                            <td
                              key={cellIdx}
                              style={{
                                padding: '0.8rem 1rem',
                                verticalAlign: 'top',
                                whiteSpace: 'pre-line',
                                lineHeight: 1.55,
                              }}
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}

              {/* Cartões Didáticos de Comandos (SQL / Git) */}
              {section.commandCards?.map((cmd, cmdIdx) => {
                const cmdCopyKey = `${codeKey}-cmd-${cmdIdx}`;
                return (
                  <div
                    key={cmdIdx}
                    className="glass-card"
                    style={{
                      marginTop: '1.25rem',
                      borderLeft: '4px solid #38bdf8',
                      padding: '1.35rem',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '0.6rem',
                        flexWrap: 'wrap',
                        gap: '0.5rem',
                      }}
                    >
                      <code style={{ fontSize: '1.05rem', fontWeight: 700, color: '#38bdf8' }}>
                        {cmd.name}
                      </code>
                      <span className="status-pill pending" style={{ fontSize: '0.72rem' }}>
                        {cmd.role}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.92rem', lineHeight: 1.65 }}>{cmd.concept}</p>
                    {cmd.details && (
                      <ul
                        style={{
                          marginTop: '0.5rem',
                          paddingLeft: '1.25rem',
                          fontSize: '0.86rem',
                          lineHeight: 1.6,
                        }}
                      >
                        {cmd.details.map((d, dIdx) => (
                          <li key={dIdx}>{d}</li>
                        ))}
                      </ul>
                    )}
                    <div style={{ marginTop: '0.9rem' }}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '0.35rem',
                        }}
                      >
                        <span className="text-muted" style={{ fontSize: '0.75rem', fontFamily: 'monospace' }}>
                          Sintaxe & Exemplo Prático
                        </span>
                        <button
                          type="button"
                          className="btn-secondary"
                          style={{ padding: '0.2rem 0.6rem', fontSize: '0.72rem' }}
                          onClick={() => handleCopyCode(cmdCopyKey, cmd.code)}
                        >
                          {copiedKey === cmdCopyKey ? <Check size={12} /> : <Copy size={12} />}
                          {copiedKey === cmdCopyKey ? 'Copiado!' : 'Copiar'}
                        </button>
                      </div>
                      <pre className="code-block">
                        <code>{cmd.code}</code>
                      </pre>
                    </div>
                  </div>
                );
              })}

              {/* Múltiplos Blocos de Código Passo a Passo */}
              {section.codeBlocks?.map((cb, cbIdx) => {
                const cbCopyKey = `${codeKey}-cb-${cbIdx}`;
                return (
                  <div key={cbIdx} style={{ marginTop: '1.35rem' }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '0.4rem',
                      }}
                    >
                      <strong style={{ fontSize: '0.84rem', fontFamily: 'monospace' }}>
                        {cb.title}
                      </strong>
                      <button
                        type="button"
                        className="btn-secondary"
                        style={{ padding: '0.2rem 0.65rem', fontSize: '0.74rem' }}
                        onClick={() => handleCopyCode(cbCopyKey, cb.code)}
                      >
                        {copiedKey === cbCopyKey ? <Check size={13} /> : <Copy size={13} />}
                        {copiedKey === cbCopyKey ? 'Copiado!' : 'Copiar Código'}
                      </button>
                    </div>
                    <pre className="code-block">
                      <code>{cb.code}</code>
                    </pre>
                  </div>
                );
              })}

              {/* Código Único Legado (caso exista) */}
              {section.codeExample && (
                <div style={{ marginTop: '1.25rem' }}>
                  <pre className="code-block">
                    <code>{section.codeExample}</code>
                  </pre>
                </div>
              )}

              {/* Base Interativa de Cenários ("O que fazer quando...?") com Pesquisa em Tempo Real */}
              {section.scenarios && section.scenarios.length > 0 && (
                <div style={{ marginTop: '1.25rem' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      marginBottom: '1rem',
                    }}
                  >
                    <Search size={18} />
                    <input
                      type="text"
                      value={scenarioQuery}
                      onChange={(e) => setScenarioQuery(e.target.value)}
                      placeholder="🔍 Pesquisar cenário (ex: esqueci, errei o commit, conflito, branch errada, stash)..."
                      className="sql-editor-textarea"
                      style={{ minHeight: '42px', height: '42px', padding: '0.5rem 0.9rem' }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {filteredScenarios?.map((sc, scIdx) => (
                      <div key={scIdx} className="glass-card" style={{ padding: '1.2rem' }}>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            gap: '0.75rem',
                            marginBottom: '0.5rem',
                          }}
                        >
                          <h4 style={{ fontSize: '0.96rem', fontWeight: 700 }}>{sc.title}</h4>
                          <span
                            className={`status-pill ${
                              sc.badgeType === 'success' || sc.badgeType === 'info'
                                ? 'passed'
                                : 'pending'
                            }`}
                            style={{ fontSize: '0.72rem' }}
                          >
                            {sc.badgeText}
                          </span>
                        </div>
                        <p className="text-muted" style={{ fontSize: '0.88rem', marginBottom: '0.65rem' }}>
                          {sc.description}
                        </p>
                        <pre className="code-block">
                          <code>{sc.commands.join('\n')}</code>
                        </pre>
                        {sc.extraNote && (
                          <p
                            className="text-muted"
                            style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}
                          >
                            💡 {sc.extraNote}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
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

              {/* Paginação caso esteja no Modo Foco (Step) */}
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
                    <ArrowLeft size={15} /> Capítulo Anterior
                  </button>

                  {activeSectionIndex < module.sections.length - 1 && (
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={() => setActiveSectionIndex((prev) => prev + 1)}
                    >
                      Próximo Capítulo ({activeSectionIndex + 2}/{module.sections.length}){' '}
                      <ArrowRight size={15} />
                    </button>
                  )}
                </div>
              )}
            </section>
          );
        })}
      </div>

      {/* Checklist Prático (DoD do Módulo) */}
      {module.checklist && module.checklist.length > 0 && (
        <section className="section-card">
          <h2>
            <ListChecks size={20} style={{ display: 'inline', marginRight: '0.5rem' }} />
            Checklist Final de Qualidade e Prática (DoD)
          </h2>
          <p className="text-muted" style={{ marginBottom: '1rem' }}>
            Valide cada item abaixo à medida que aplicar os conhecimentos deste manual:
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

      {/* Bloco de Anotações Pessoais (Visível no rodapé e disponível como Sidebar) */}
      <section style={{ marginBottom: '2rem' }}>
        <ModuleNotesPanel
          moduleId={module.id}
          moduleTitle={module.title}
          initialNote={moduleNote}
          onSaveNote={onSaveNote}
        />
      </section>

      {/* Histórico de Tentativas do Estudante */}
      {quizHistory.length > 0 && (
        <section className="section-card" style={{ marginBottom: '2rem' }}>
          <div className="section-header-row">
            <div>
              <h2>
                <History size={20} style={{ display: 'inline', marginRight: '0.5rem' }} />
                Histórico de Tentativas neste Módulo
              </h2>
              <p className="text-muted">
                Registo auditável de todas as suas avaliações realizadas neste módulo.
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

      {/* Quiz de Validação Isolado com Espaçamento Limpo */}
      {questions.length > 0 && (
        <div style={{ marginTop: '1.5rem', marginBottom: '3rem', clear: 'both' }}>
          <QuizBlock
            moduleId={module.id}
            moduleTitle={module.title}
            questions={questions}
            previousAttempt={quizAttempt}
            onCompleteQuiz={onSaveQuiz}
          />
        </div>
      )}

      {/* Navegação entre Módulos */}
      <section
        className="section-card"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginTop: '2rem',
          clear: 'both',
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
            Concluir e Voltar à Trilha <CheckCircle2 size={16} />
          </button>
        )}
      </section>

      {/* Drawer / Sidebar Lateral para o Caderno de Anotações Técnicas */}
      {isNotesOpen && (
        <div
          className="notes-drawer-overlay no-print"
          onClick={() => setIsNotesOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(3px)',
            zIndex: 1100,
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <div
            className="notes-drawer-container"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '490px',
              maxWidth: '92vw',
              height: '100%',
              background: 'var(--surface)',
              borderLeft: '1px solid var(--border-light)',
              boxShadow: '-8px 0 30px rgba(0,0,0,0.5)',
              display: 'flex',
              flexDirection: 'column',
              padding: '1.25rem',
              overflowY: 'auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={18} className="text-sky" />
                <strong style={{ fontSize: '1.05rem' }}>Caderno de Notas • Módulo 0{module.order}</strong>
              </div>
              <button
                type="button"
                onClick={() => setIsNotesOpen(false)}
                className="btn-secondary"
                style={{ padding: '0.35rem 0.6rem' }}
                aria-label="Fechar anotações"
              >
                <X size={16} /> Fechar
              </button>
            </div>

            <ModuleNotesPanel
              moduleId={module.id}
              moduleTitle={module.title}
              initialNote={moduleNote}
              onSaveNote={onSaveNote}
              isSplitView={true}
            />
          </div>
        </div>
      )}

      {/* Botões Flutuantes: Voltar ao Topo & Abrir Anotações */}
      <div
        className="no-print"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.65rem',
          zIndex: 990,
        }}
      >
        <button
          type="button"
          onClick={() => setIsNotesOpen(true)}
          className="btn-primary"
          style={{
            borderRadius: '999px',
            boxShadow: '0 4px 16px rgba(56, 189, 248, 0.35)',
            padding: '0.65rem 1rem',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
          title="Abrir Caderno de Anotações"
        >
          <FileText size={16} /> Anotações
        </button>

        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="btn-secondary"
          style={{
            borderRadius: '999px',
            boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
            padding: '0.65rem 1rem',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
          title="Voltar ao início do manual"
        >
          <ArrowUp size={16} /> Topo
        </button>
      </div>
    </div>
  );
};
export default ModuleViewerScreen;

