import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ModuleMetadata, QuizAttempt, ScreenType } from '../types';
import { QUIZZES } from '../services/dataService';
import { QuizBlock } from '../components/QuizBlock';
import { 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  BookOpen, 
  List, 
  X, 
  ChevronRight, 
  ExternalLink 
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
}) => {
  const [contentHtml, setContentHtml] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const [activeTocId, setActiveTocId] = useState<string>('');
  const [mobileTocOpen, setMobileTocOpen] = useState<boolean>(false);
  const [readingProgress, setReadingProgress] = useState<number>(0);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');

  const contentRef = useRef<HTMLDivElement>(null);
  const quizSectionRef = useRef<HTMLDivElement>(null);
  const quizData = QUIZZES.find((q) => q.id === module.quizId);

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
  }, [contentHtml, isLoading]);

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
    quizSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const cycleFontSize = () => {
    if (fontSize === 'normal') setFontSize('large');
    else if (fontSize === 'large') setFontSize('xlarge');
    else setFontSize('normal');
  };

  return (
    <div className={`native-manual-page font-size-${fontSize}`}>
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
          <h1 className="manual-toolbar-title">{module.shortTitle}</h1>
        </div>

        <div className="toolbar-actions">
          {/* Botão de Sumário visível no mobile */}
          <button
            onClick={() => setMobileTocOpen(true)}
            className="btn-secondary btn-sm mobile-toc-trigger"
            title="Abrir Sumário do Documento"
          >
            <List size={15} />
            <span>Índice ({tocItems.length})</span>
          </button>

          {/* Ajuste de Fonte */}
          <button
            onClick={cycleFontSize}
            className="btn-secondary btn-sm font-toggle-btn"
            title="Alterar tamanho do texto de leitura"
          >
            <span className="font-label">Aa</span>
            <span className="font-current-tag">{fontSize === 'normal' ? '100%' : fontSize === 'large' ? '115%' : '130%'}</span>
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

      {/* Grid Principal: Artigo + Sidebar */}
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
          </div>
        </aside>
      </div>

      {/* Drawer Off-Canvas para Sumário no Mobile */}
      {mobileTocOpen && (
        <div className="mobile-toc-overlay" onClick={() => setMobileTocOpen(false)}>
          <div className="mobile-toc-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-drag-pill"></div>
            <div className="drawer-header">
              <div className="drawer-title">
                <BookOpen size={18} className="text-primary" />
                <span>Índice do Manual ({tocItems.length} seções)</span>
              </div>
              <button onClick={() => setMobileTocOpen(false)} className="btn-close-drawer">
                <X size={20} />
              </button>
            </div>

            <div className="drawer-body">
              {tocItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`drawer-toc-item level-${item.level} ${activeTocId === item.id ? 'active' : ''}`}
                >
                  <ChevronRight size={14} className="drawer-chevron" />
                  <span>{item.title}</span>
                </button>
              ))}

              {quizData && (
                <button
                  onClick={() => {
                    setMobileTocOpen(false);
                    scrollToQuiz();
                  }}
                  className="drawer-toc-item toc-quiz-link"
                >
                  <Sparkles size={16} className="text-amber" />
                  <span>🎯 Ir para o Teste de Conhecimentos</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
