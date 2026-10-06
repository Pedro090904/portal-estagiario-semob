import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ModuleMetadata, QuizAttempt, ScreenType } from '../types';
import { QUIZZES } from '../services/dataService';
import { QuizBlock } from '../components/QuizBlock';
import { ModuleNotesPanel } from '../components/ModuleNotesPanel';
import { 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  BookOpen, 
  List, 
  X, 
  ChevronRight, 
  ExternalLink,
  FileText,
  Columns,
  Maximize2,
  Minimize2,
  Clock,
  Edit3
} from 'lucide-react';

interface TocItem {
  id: string;
  title: string;
  level: number;
}

interface ModuleViewerScreenProps {
  module: ModuleMetadata;
  onNavigate: (screen: ScreenType) => void;
  isCompleted: boolean;
  onToggleComplete: (moduleId: string) => void;
  quizAttempt?: QuizAttempt;
  onSaveQuizAttempt: (attempt: QuizAttempt) => void;
  nextModule?: ModuleMetadata;
  prevModule?: ModuleMetadata;
  userNotes?: string;
  onSaveNotes?: (notes: string) => void;
}

declare global {
  interface Window {
    hljs?: {
      highlightElement: (element: HTMLElement) => void;
    };
    mermaid?: {
      run: (options?: { querySelector?: string }) => Promise<void>;
    };
  }
}

export const ModuleViewerScreen: React.FC<ModuleViewerScreenProps> = ({
  module,
  onNavigate,
  isCompleted,
  onToggleComplete,
  quizAttempt,
  onSaveQuizAttempt,
  nextModule,
  prevModule,
  userNotes = '',
  onSaveNotes,
}) => {
  const [contentHtml, setContentHtml] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const [activeTocId, setActiveTocId] = useState<string>('');
  const [mobileTocOpen, setMobileTocOpen] = useState<boolean>(false);
  const [readingProgress, setReadingProgress] = useState<number>(0);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');

  // Novos modos de visualização inspirados no player avançado
  const [viewerMode, setViewerMode] = useState<'read' | 'notes' | 'split'>('read');
  const [zenMode, setZenMode] = useState<boolean>(false);

  const contentRef = useRef<HTMLDivElement>(null);
  const quizSectionRef = useRef<HTMLDivElement>(null);
  const quizData = QUIZZES.find((q) => q.id === module.quizId);

  // Estimativa de tempo de leitura restante
  const durationNumber = parseInt(module.duration.replace(/\D/g, ''), 10) || 30;
  const estimatedRemainingMinutes = Math.max(1, Math.round(durationNumber * (1 - readingProgress / 100)));
  const hasUserNotes = Boolean(userNotes && userNotes.trim().length > 0);

  // Carregamento e higienização robusta do HTML para dispositivos móveis
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setLoadError(null);
    setContentHtml('');
    setTocItems([]);
    setActiveTocId('');

    fetch(`/${module.htmlFile}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Falha ao carregar ${module.htmlFile} (HTTP ${res.status})`);
        return res.text();
      })
      .then((htmlText) => {
        if (!isMounted) return;

        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');

        const mainEl = doc.querySelector('main.container') || doc.body;

        // 1. Remover elementos redundantes e botões legados da página original
        mainEl.querySelectorAll('.top-toolbar, .print-btn, header, .copy-btn, .code-header button').forEach((el) => el.remove());

        // 2. Extrair headings para o Sumário com IDs seguros
        const headings = mainEl.querySelectorAll('h2, h3');
        const items: TocItem[] = [];

        headings.forEach((heading, idx) => {
          let id = heading.getAttribute('id');
          if (!id) {
            const textSlug = heading.textContent
              ?.toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/^-|-$/g, '') || `secao-${idx + 1}`;
            id = textSlug;
            heading.setAttribute('id', id);
          }

          items.push({
            id,
            title: heading.textContent?.trim() || `Seção ${idx + 1}`,
            level: heading.tagName.toLowerCase() === 'h2' ? 2 : 3,
          });
        });

        // 3. Blindagem Mobile para Tabelas: adicionar dica de scroll e container
        mainEl.querySelectorAll('table').forEach((table) => {
          if (!table.parentElement?.classList.contains('table-wrapper')) {
            const wrapper = doc.createElement('div');
            wrapper.className = 'table-wrapper';
            
            const hint = doc.createElement('div');
            hint.className = 'table-scroll-hint';
            hint.innerHTML = '<span>↔ Arraste horizontalmente para ver todas as colunas</span>';
            
            table.parentNode?.insertBefore(wrapper, table);
            wrapper.appendChild(hint);
            wrapper.appendChild(table);
          }
        });

        // 4. Blindagem contra estouro de imagens e SVGs
        mainEl.querySelectorAll('img, svg').forEach((media) => {
          media.setAttribute('style', 'max-width: 100%; height: auto;');
        });

        setContentHtml(mainEl.innerHTML);
        setTocItems(items);
        setIsLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error('Erro ao carregar manual:', err);
        setLoadError(err.message || 'Erro ao carregar o conteúdo do manual.');
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [module.htmlFile]);

  // Code Highlighting, Mermaid e Copiar Código
  useEffect(() => {
    if (!contentRef.current || isLoading) return;

    if (window.hljs) {
      contentRef.current.querySelectorAll('pre code').forEach((block) => {
        window.hljs?.highlightElement(block as HTMLElement);
      });
    }

    contentRef.current.querySelectorAll('pre').forEach((pre) => {
      if (pre.querySelector('.btn-copy-code')) return;

      const copyBtn = document.createElement('button');
      copyBtn.className = 'btn-copy-code';
      copyBtn.innerHTML = '<span>Copiar</span>';
      copyBtn.title = 'Copiar código';
      copyBtn.onclick = () => {
        const codeText = pre.querySelector('code')?.innerText || pre.innerText;
        navigator.clipboard.writeText(codeText);
        copyBtn.innerHTML = '<span>✓ Copiado!</span>';
        copyBtn.classList.add('copied');
        setTimeout(() => {
          copyBtn.innerHTML = '<span>Copiar</span>';
          copyBtn.classList.remove('copied');
        }, 2000);
      };

      pre.style.position = 'relative';
      pre.appendChild(copyBtn);
    });

    if (window.mermaid) {
      try {
        window.mermaid.run({ querySelector: '.native-manual-content .mermaid' });
      } catch (e) {
        console.warn('Falha na renderização de diagramas mermaid:', e);
      }
    }

    // Interceptar cliques em links internos # para rolagem suave
    const anchorLinks = contentRef.current.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const href = anchor.getAttribute('href');
        if (!href) return;
        const targetId = href.substring(1);
        scrollToSection(targetId);
      });
    });
  }, [contentHtml, isLoading, viewerMode]);

  // ScrollSpy e Progresso de Leitura
  const handleScroll = useCallback(() => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0) {
      const current = Math.min(Math.max((window.scrollY / totalHeight) * 100, 0), 100);
      setReadingProgress(Math.round(current));
    }

    if (tocItems.length === 0) return;
    const scrollPos = window.scrollY + 120;

    for (let i = tocItems.length - 1; i >= 0; i--) {
      const el = document.getElementById(tocItems[i].id);
      if (el && el.offsetTop <= scrollPos) {
        setActiveTocId(tocItems[i].id);
        break;
      }
    }
  }, [tocItems]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const scrollToSection = (id: string) => {
    setMobileTocOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      setActiveTocId(id);
    }
  };

  const scrollToQuiz = () => {
    if (viewerMode === 'notes') {
      setViewerMode('read');
      setTimeout(() => {
        quizSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      quizSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const cycleFontSize = () => {
    if (fontSize === 'normal') setFontSize('large');
    else if (fontSize === 'large') setFontSize('xlarge');
    else setFontSize('normal');
  };

  return (
    <div className={`native-manual-page font-size-${fontSize} ${zenMode ? 'is-zen-mode' : ''}`}>
      {/* Barra de Progresso de Leitura Fixa no Topo */}
      <div className="reading-progress-track">
        <div className="reading-progress-bar" style={{ width: `${readingProgress}%` }}></div>
      </div>

      {/* Toolbar Superior do Manual */}
      <header className="manual-top-toolbar">
        <div className="toolbar-left">
          <div className="manual-breadcrumbs">
            <span onClick={() => onNavigate('home')} className="crumb-link">Início</span>
            <span className="crumb-sep">/</span>
            <span className="crumb-cat">{module.category}</span>
            <span className="crumb-sep">/</span>
            <span className="crumb-current">{module.shortTitle}</span>
          </div>
          <div className="toolbar-title-row">
            <h1 className="manual-toolbar-title">{module.shortTitle}</h1>
            {viewerMode === 'read' && (
              <span className="reading-time-badge" title="Tempo restante estimado com base no progresso de rolagem">
                <Clock size={12} className="text-primary" />
                <span>~{estimatedRemainingMinutes} min restantes</span>
              </span>
            )}
          </div>
        </div>

        {/* Seletor de Modos do Player (Leitura / Anotações / Lado a Lado) */}
        <div className="viewer-mode-selector">
          <button
            type="button"
            onClick={() => setViewerMode('read')}
            className={`mode-btn ${viewerMode === 'read' ? 'active' : ''}`}
            title="Exibir apenas o conteúdo oficial do manual"
          >
            <BookOpen size={14} />
            <span>Leitura</span>
          </button>

          <button
            type="button"
            onClick={() => setViewerMode('notes')}
            className={`mode-btn ${viewerMode === 'notes' ? 'active' : ''}`}
            title="Abrir caderno de notas técnicas pessoais"
          >
            <FileText size={14} />
            <span>Anotações</span>
            {hasUserNotes && <span className="notes-has-content-dot" title="Você tem anotações neste módulo" />}
          </button>

          <button
            type="button"
            onClick={() => setViewerMode('split')}
            className={`mode-btn split-screen-btn ${viewerMode === 'split' ? 'active' : ''}`}
            title="Exibir manual e caderno de anotações lado a lado (recomendado para desktop)"
          >
            <Columns size={14} />
            <span>Lado a Lado</span>
          </button>
        </div>

        <div className="toolbar-actions">
          {/* Botão de Sumário visível no mobile */}
          {viewerMode !== 'notes' && (
            <button
              onClick={() => setMobileTocOpen(true)}
              className="btn-secondary btn-sm mobile-toc-trigger"
              title="Abrir Sumário do Documento"
            >
              <List size={15} />
              <span>Índice ({tocItems.length})</span>
            </button>
          )}

          {/* Ajuste de Fonte */}
          {viewerMode !== 'notes' && (
            <button
              onClick={cycleFontSize}
              className="btn-secondary btn-sm font-toggle-btn"
              title="Alterar tamanho do texto de leitura"
            >
              <span className="font-label">Aa</span>
              <span className="font-current-tag">{fontSize === 'normal' ? '100%' : fontSize === 'large' ? '115%' : '130%'}</span>
            </button>
          )}

          {/* Modo Foco / Zen */}
          <button
            type="button"
            onClick={() => setZenMode(!zenMode)}
            className={`btn-secondary btn-sm zen-toggle-btn ${zenMode ? 'active' : ''}`}
            title={zenMode ? 'Sair do Modo Foco' : 'Ativar Modo Foco (oculta distrações da tela)'}
          >
            {zenMode ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            <span className="zen-btn-label">{zenMode ? 'Normal' : 'Foco'}</span>
          </button>

          {quizData && (
            <button onClick={scrollToQuiz} className="btn-secondary btn-sm btn-quiz-jump">
              <Sparkles size={15} className="text-amber" />
              <span>Quiz</span>
            </button>
          )}

          <button
            onClick={() => onToggleComplete(module.id)}
            className={`btn-toggle-read ${isCompleted ? 'is-read' : ''}`}
          >
            <CheckCircle2 size={15} />
            <span>{isCompleted ? 'Lido' : 'Concluir'}</span>
          </button>
        </div>
      </header>

      {/* =====================================================================
          MODO 1: APENAS ANOTAÇÕES (Tela cheia para anotações)
          ===================================================================== */}
      {viewerMode === 'notes' && (
        <main className="manual-notes-view-mode">
          <div className="notes-view-container">
            <div className="notes-view-banner">
              <div>
                <h2>Caderno de Anotações: {module.title}</h2>
                <p>Anote pontos-chave, comandos Git, consultas PostgreSQL ou regras de negócio para consultar mais tarde no seu estágio.</p>
              </div>
              <button
                type="button"
                onClick={() => setViewerMode('read')}
                className="btn-secondary btn-sm"
              >
                <BookOpen size={14} />
                <span>Voltar ao Manual</span>
              </button>
            </div>

            <ModuleNotesPanel
              module={module}
              initialNotes={userNotes}
              onSaveNotes={onSaveNotes || (() => {})}
            />
          </div>
        </main>
      )}

      {/* =====================================================================
          MODO 2: TELA DIVIDIDA (Manual à esquerda + Anotações à direita)
          ===================================================================== */}
      {viewerMode === 'split' && (
        <div className="manual-split-view-grid">
          {/* Coluna da Esquerda: Conteúdo do Manual com scroll autônomo */}
          <div className="split-column-manual">
            {isLoading && (
              <div className="manual-loading-state">
                <div className="spinner"></div>
                <p>Carregando conteúdo oficial do manual...</p>
              </div>
            )}

            {!isLoading && !loadError && (
              <div
                ref={contentRef}
                className="native-manual-content"
                dangerouslySetInnerHTML={{ __html: contentHtml }}
              />
            )}

            {/* Quiz Nativo no split */}
            {quizData && (
              <section className="manual-bottom-quiz-section" ref={quizSectionRef}>
                <div className="quiz-section-divider">
                  <span className="divider-line"></span>
                  <span className="divider-badge">🎯 TESTE SEUS CONHECIMENTOS</span>
                  <span className="divider-line"></span>
                </div>

                <QuizBlock
                  quiz={quizData}
                  existingAttempt={quizAttempt}
                  onSaveAttempt={onSaveQuizAttempt}
                />
              </section>
            )}
          </div>

          {/* Coluna da Direita: Caderno de Anotações Fixo */}
          <div className="split-column-notes">
            <div className="split-notes-sticky-wrap">
              <ModuleNotesPanel
                module={module}
                initialNotes={userNotes}
                onSaveNotes={onSaveNotes || (() => {})}
                isSplitView={true}
              />
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODO 3: LEITURA PADRÃO (Artigo centralizado + Sumário lateral)
          ===================================================================== */}
      {viewerMode === 'read' && (
        <div className="manual-layout-grid">
          <article className="manual-article-column">
            {isLoading && (
              <div className="manual-loading-state">
                <div className="spinner"></div>
                <p>Carregando conteúdo oficial do manual...</p>
              </div>
            )}

            {loadError && (
              <div className="manual-error-state">
                <h3>Não foi possível carregar este manual diretamente</h3>
                <p>{loadError}</p>
                <a
                  href={`/${module.htmlFile}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  <ExternalLink size={16} />
                  Abrir Arquivo em Nova Aba
                </a>
              </div>
            )}

            {!isLoading && !loadError && (
              <div
                ref={contentRef}
                className="native-manual-content"
                dangerouslySetInnerHTML={{ __html: contentHtml }}
              />
            )}

            {/* Callout de Anotações: Convite didático para registrar notas */}
            <div className="notes-callout-card">
              <div className="notes-callout-content">
                <div className="notes-callout-icon">
                  <FileText size={20} className="text-primary" />
                </div>
                <div>
                  <h4 className="notes-callout-title">Caderno de Anotações deste Módulo</h4>
                  <p className="notes-callout-desc">
                    {hasUserNotes
                      ? 'Você já possui notas salvas para este manual. Acesse para revisar ou atualizar seus comandos.'
                      : 'Precisa fixar comandos de terminal, conexões de banco ou dúvidas para o supervisor? Salve no seu caderno de anotações.'}
                  </p>
                </div>
              </div>
              <div className="notes-callout-btns">
                <button
                  type="button"
                  onClick={() => setViewerMode('notes')}
                  className="btn-secondary btn-sm"
                >
                  <Edit3 size={14} />
                  <span>{hasUserNotes ? 'Abrir Anotações' : 'Criar Anotações'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewerMode('split')}
                  className="btn-secondary btn-sm desktop-only"
                  title="Abrir manual e anotações lado a lado"
                >
                  <Columns size={14} />
                  <span>Ver Lado a Lado</span>
                </button>
              </div>
            </div>

            {/* Quiz Nativo ao Final */}
            {quizData && (
              <section className="manual-bottom-quiz-section" ref={quizSectionRef}>
                <div className="quiz-section-divider">
                  <span className="divider-line"></span>
                  <span className="divider-badge">🎯 TESTE SEUS CONHECIMENTOS</span>
                  <span className="divider-line"></span>
                </div>

                <QuizBlock
                  quiz={quizData}
                  existingAttempt={quizAttempt}
                  onSaveAttempt={onSaveQuizAttempt}
                />
              </section>
            )}

            {/* Navegação Entre Módulos */}
            <nav className="manual-bottom-nav">
              {prevModule ? (
                <button
                  onClick={() => {
                    onNavigate(prevModule.screenKey);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="nav-page-btn prev"
                >
                  <span className="nav-dir-label"><ArrowLeft size={14} /> Módulo Anterior</span>
                  <span className="nav-title-label">{prevModule.shortTitle}</span>
                </button>
              ) : (
                <button onClick={() => onNavigate('roteiro')} className="nav-page-btn prev">
                  <span className="nav-dir-label"><ArrowLeft size={14} /> Início</span>
                  <span className="nav-title-label">Roteiro de Integração</span>
                </button>
              )}

              <button
                onClick={() => onToggleComplete(module.id)}
                className={`btn-primary btn-finish-reading ${isCompleted ? 'btn-green' : ''}`}
              >
                <CheckCircle2 size={18} />
                <span>{isCompleted ? '✓ Módulo Finalizado com Sucesso' : 'Finalizar Estudo do Módulo'}</span>
              </button>

              {nextModule ? (
                <button
                  onClick={() => {
                    onNavigate(nextModule.screenKey);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="nav-page-btn next"
                >
                  <span className="nav-dir-label">Próximo Módulo <ArrowRight size={14} /></span>
                  <span className="nav-title-label">{nextModule.shortTitle}</span>
                </button>
              ) : (
                <button onClick={() => onNavigate('quizzes')} className="nav-page-btn next">
                  <span className="nav-dir-label">Avançar <ArrowRight size={14} /></span>
                  <span className="nav-title-label">Central de Quizzes</span>
                </button>
              )}
            </nav>
          </article>

          {/* Sidebar Direita de Sumário (Desktop) */}
          <aside className="manual-toc-sidebar">
            <div className="toc-sidebar-inner">
              <div className="toc-sidebar-header">
                <BookOpen size={16} className="text-primary" />
                <span>Neste Manual</span>
              </div>

              <nav className="toc-links-list">
                {tocItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`toc-link-item level-${item.level} ${activeTocId === item.id ? 'active' : ''}`}
                  >
                    <span className="toc-dot"></span>
                    <span className="toc-text">{item.title}</span>
                  </button>
                ))}

                {quizData && (
                  <button
                    onClick={scrollToQuiz}
                    className="toc-link-item toc-quiz-link"
                  >
                    <Sparkles size={14} className="text-amber" />
                    <span>🎯 Teste de Conhecimentos</span>
                  </button>
                )}
              </nav>

              <div className="toc-sidebar-progress">
                <div className="progress-label">
                  <span>Progresso</span>
                  <strong>{readingProgress}%</strong>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${readingProgress}%` }}></div>
                </div>
              </div>

              {/* Acesso rápido às anotações na sidebar */}
              <div className="toc-sidebar-notes-shortcut">
                <button
                  type="button"
                  onClick={() => setViewerMode('notes')}
                  className="sidebar-notes-btn"
                >
                  <FileText size={14} />
                  <span>Caderno de Notas</span>
                  {hasUserNotes && <span className="notes-badge-count">Ativo</span>}
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Drawer Off-Canvas para Sumário no Mobile */}
      {mobileTocOpen && (
        <div className="mobile-toc-overlay" onClick={() => setMobileTocOpen(false)}>
          <div className="mobile-toc-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-toc-header">
              <div className="mobile-toc-title">
                <BookOpen size={18} className="text-primary" />
                <h3>Sumário do Manual</h3>
              </div>
              <button
                onClick={() => setMobileTocOpen(false)}
                className="btn-icon-close"
                aria-label="Fechar índice"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mobile-toc-body">
              <nav className="toc-links-list">
                {tocItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`toc-link-item level-${item.level} ${activeTocId === item.id ? 'active' : ''}`}
                  >
                    <span className="toc-dot"></span>
                    <span className="toc-text">{item.title}</span>
                    <ChevronRight size={14} className="toc-arrow" />
                  </button>
                ))}

                {quizData && (
                  <button
                    onClick={() => {
                      setMobileTocOpen(false);
                      scrollToQuiz();
                    }}
                    className="toc-link-item toc-quiz-link"
                  >
                    <Sparkles size={14} className="text-amber" />
                    <span>🎯 Teste de Conhecimentos</span>
                  </button>
                )}
              </nav>
            </div>

            <div className="mobile-toc-footer">
              <button
                type="button"
                onClick={() => {
                  setMobileTocOpen(false);
                  setViewerMode('notes');
                }}
                className="btn-secondary w-full"
              >
                <FileText size={15} />
                <span>Abrir Caderno de Notas</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
