import React, { useState } from 'react';
import { ScreenType, ThemeMode } from '../types';
import { 
  Compass, 
  BookOpen, 
  CheckSquare, 
  Terminal, 
  Award, 
  Moon, 
  Sun, 
  Menu, 
  X, 
  ChevronDown,
  Layers,
  Database,
  GitBranch,
  Server,
  Layout,
  Home,
  CheckCircle2
} from 'lucide-react';

interface NavbarProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  overallPercentage: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentScreen,
  onNavigate,
  theme,
  onToggleTheme,
  overallPercentage,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [manualsDropdownOpen, setManualsDropdownOpen] = useState(false);
  const [challengesDropdownOpen, setChallengesDropdownOpen] = useState(false);

  const handleNav = (screen: ScreenType) => {
    onNavigate(screen);
    setMobileMenuOpen(false);
    setManualsDropdownOpen(false);
    setChallengesDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isManualActive = ['modulo-git', 'modulo-sql', 'modulo-gabarito', 'modulo-backend', 'modulo-frontend'].includes(currentScreen);
  const isChallengeActive = ['desafio-sql', 'desafio-backend', 'desafio-frontend'].includes(currentScreen);

  return (
    <>
      <header className="site-header">
        <div className="header-container">
          {/* Brand / Logo */}
          <div className="header-brand" onClick={() => handleNav('home')}>
            <div className="brand-logo-icon">
              <Layers className="icon-main" size={20} />
            </div>
            <div className="brand-texts">
              <div className="brand-title">SEMOB<span className="brand-dot">.</span>DF</div>
              <div className="brand-sub">SUTINF • DEV ACADEMY</div>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="desktop-nav">
            <button 
              className={`nav-btn ${currentScreen === 'home' ? 'active' : ''}`}
              onClick={() => handleNav('home')}
            >
              Início
            </button>

            <button 
              className={`nav-btn ${currentScreen === 'roteiro' ? 'active' : ''}`}
              onClick={() => handleNav('roteiro')}
            >
              <Compass className="nav-icon" size={16} />
              Roteiro de Integração
            </button>

            {/* Manuais Dropdown */}
            <div className="nav-dropdown-wrapper">
              <button 
                className={`nav-btn dropdown-toggle ${isManualActive ? 'active' : ''}`}
                onClick={() => {
                  setManualsDropdownOpen(!manualsDropdownOpen);
                  setChallengesDropdownOpen(false);
                }}
              >
                <BookOpen className="nav-icon" size={16} />
                Manuais Oficiais
                <ChevronDown className={`chevron ${manualsDropdownOpen ? 'rotate' : ''}`} size={14} />
              </button>

              {manualsDropdownOpen && (
                <div className="dropdown-menu">
                  <button onClick={() => handleNav('modulo-git')} className="dropdown-item">
                    <GitBranch size={16} className="text-sky" />
                    <div>
                      <div className="item-title">Git & Engenharia Colaborativa</div>
                      <div className="item-desc">GitLab Flow, Branches e CI/CD</div>
                    </div>
                  </button>
                  <button onClick={() => handleNav('modulo-sql')} className="dropdown-item">
                    <Database size={16} className="text-emerald" />
                    <div>
                      <div className="item-title">Bancos de Dados & SQL SEMOB</div>
                      <div className="item-desc">PostgreSQL, PostGIS e produção</div>
                    </div>
                  </button>
                  <button onClick={() => handleNav('modulo-gabarito')} className="dropdown-item">
                    <CheckCircle2 size={16} className="text-emerald" />
                    <div>
                      <div className="item-title">Gabarito Oficial SQL</div>
                      <div className="item-desc">As 25 resoluções passo a passo</div>
                    </div>
                  </button>
                  <button onClick={() => handleNav('modulo-backend')} className="dropdown-item">
                    <Server size={16} className="text-indigo" />
                    <div>
                      <div className="item-title">Back-end NestJS (SISMOB)</div>
                      <div className="item-desc">3 Camadas, TypeORM e Docker</div>
                    </div>
                  </button>
                  <button onClick={() => handleNav('modulo-frontend')} className="dropdown-item">
                    <Layout size={16} className="text-cyan" />
                    <div>
                      <div className="item-title">Front-end React & Vite</div>
                      <div className="item-desc">5 Camadas e Regra das 50 Linhas</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Central de Quizzes */}
            <button 
              className={`nav-btn ${currentScreen === 'quizzes' ? 'active' : ''}`}
              onClick={() => handleNav('quizzes')}
            >
              <CheckSquare className="nav-icon" size={16} />
              Central de Quizzes
            </button>

            {/* Desafios Dropdown */}
            <div className="nav-dropdown-wrapper">
              <button 
                className={`nav-btn dropdown-toggle ${isChallengeActive ? 'active' : ''}`}
                onClick={() => {
                  setChallengesDropdownOpen(!challengesDropdownOpen);
                  setManualsDropdownOpen(false);
                }}
              >
                <Terminal className="nav-icon" size={16} />
                Desafios Práticos
                <ChevronDown className={`chevron ${challengesDropdownOpen ? 'rotate' : ''}`} size={14} />
              </button>

              {challengesDropdownOpen && (
                <div className="dropdown-menu">
                  <button onClick={() => handleNav('desafio-sql')} className="dropdown-item">
                    <Database size={16} className="text-emerald" />
                    <div>
                      <div className="item-title">Desafio SQL das 25 Questões</div>
                      <div className="item-desc">Consultas reais em dados_mobilidade</div>
                    </div>
                  </button>
                  <button onClick={() => handleNav('desafio-backend')} className="dropdown-item">
                    <Server size={16} className="text-indigo" />
                    <div>
                      <div className="item-title">Desafio Back-end (Veículos)</div>
                      <div className="item-desc">As 7 etapas no SISMOB Boilerplate</div>
                    </div>
                  </button>
                  <button onClick={() => handleNav('desafio-frontend')} className="dropdown-item">
                    <Layout size={16} className="text-cyan" />
                    <div>
                      <div className="item-title">Desafio Front-end (InfoÔnibus)</div>
                      <div className="item-desc">Pesquisa, rotas e GPS em tempo real</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Certificado */}
            <button 
              className={`nav-btn ${currentScreen === 'certificado' ? 'active' : ''}`}
              onClick={() => handleNav('certificado')}
            >
              <Award className="nav-icon" size={16} />
              Certificado
            </button>
          </nav>

          {/* Actions (Progress & Theme & Hamburger) */}
          <div className="header-actions">
            {/* Progress pill - adapts on mobile */}
            <div 
              className="progress-pill" 
              title="Seu progresso global na trilha de formação"
              onClick={() => handleNav('certificado')}
            >
              <span className="pill-dot"></span>
              <span className="pill-text-desktop">{overallPercentage}% Formação</span>
              <span className="pill-text-mobile">{overallPercentage}%</span>
              <div className="pill-bar">
                <div className="pill-bar-fill" style={{ width: `${overallPercentage}%` }}></div>
              </div>
            </div>

            {/* Theme Toggle */}
            <button 
              className="theme-btn" 
              onClick={onToggleTheme} 
              title={`Alternar para tema ${theme === 'dark' ? 'claro' : 'escuro'}`}
              aria-label="Alternar tema"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Mobile hamburger */}
            <button 
              className="mobile-hamburger" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Abrir menu de navegação"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Fullscreen / Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header-row">
              <div className="drawer-brand-wrap">
                <Layers size={18} className="text-sky" />
                <span className="drawer-brand-name">SEMOB<strong>.DF</strong></span>
              </div>
              <button 
                onClick={() => setMobileMenuOpen(false)} 
                className="btn-close-drawer" 
                aria-label="Fechar menu"
              >
                <X size={20} />
              </button>
            </div>

            <div className="drawer-user-progress">
              <div className="drawer-progress-header">
                <span>Seu Progresso Geral</span>
                <strong>{overallPercentage}%</strong>
              </div>
              <div className="drawer-progress-bar">
                <div className="drawer-progress-fill" style={{ width: `${overallPercentage}%` }}></div>
              </div>
            </div>

            <div className="drawer-section-title">Navegação Principal</div>
            <button onClick={() => handleNav('home')} className={`drawer-btn ${currentScreen === 'home' ? 'active' : ''}`}>
              <Home size={18} className="text-sky" /> Início
            </button>
            <button onClick={() => handleNav('roteiro')} className={`drawer-btn ${currentScreen === 'roteiro' ? 'active' : ''}`}>
              <Compass size={18} className="text-emerald" /> Roteiro de Integração (PDF)
            </button>
            <button onClick={() => handleNav('quizzes')} className={`drawer-btn ${currentScreen === 'quizzes' ? 'active' : ''}`}>
              <CheckSquare size={18} className="text-amber" /> Central de Quizzes
            </button>
            <button onClick={() => handleNav('certificado')} className={`drawer-btn ${currentScreen === 'certificado' ? 'active' : ''}`}>
              <Award size={18} className="text-indigo" /> Certificado Oficial
            </button>
            
            <div className="drawer-section-title">Manuais Oficiais SUTINF</div>
            <button onClick={() => handleNav('modulo-git')} className={`drawer-btn ${currentScreen === 'modulo-git' ? 'active' : ''}`}>
              <GitBranch size={16} className="text-sky" /> Git & DevSecOps
            </button>
            <button onClick={() => handleNav('modulo-sql')} className={`drawer-btn ${currentScreen === 'modulo-sql' ? 'active' : ''}`}>
              <Database size={16} className="text-emerald" /> Banco de Dados & SQL
            </button>
            <button onClick={() => handleNav('modulo-gabarito')} className={`drawer-btn ${currentScreen === 'modulo-gabarito' ? 'active' : ''}`}>
              <CheckCircle2 size={16} className="text-emerald" /> Gabarito Oficial SQL (25 Itens)
            </button>
            <button onClick={() => handleNav('modulo-backend')} className={`drawer-btn ${currentScreen === 'modulo-backend' ? 'active' : ''}`}>
              <Server size={16} className="text-indigo" /> Back-end NestJS (SISMOB)
            </button>
            <button onClick={() => handleNav('modulo-frontend')} className={`drawer-btn ${currentScreen === 'modulo-frontend' ? 'active' : ''}`}>
              <Layout size={16} className="text-cyan" /> Front-end React & Vite
            </button>

            <div className="drawer-section-title">Desafios Práticos</div>
            <button onClick={() => handleNav('desafio-sql')} className={`drawer-btn ${currentScreen === 'desafio-sql' ? 'active' : ''}`}>
              <Database size={16} className="text-emerald" /> Desafio SQL (25 Questões)
            </button>
            <button onClick={() => handleNav('desafio-backend')} className={`drawer-btn ${currentScreen === 'desafio-backend' ? 'active' : ''}`}>
              <Server size={16} className="text-indigo" /> Desafio Back-end (Veículos)
            </button>
            <button onClick={() => handleNav('desafio-frontend')} className={`drawer-btn ${currentScreen === 'desafio-frontend' ? 'active' : ''}`}>
              <Layout size={16} className="text-cyan" /> Desafio Front-end (InfoÔnibus)
            </button>
          </div>
        </div>
      )}

      {/* Docked Mobile Bottom Navigation Bar (Thumb Friendly) */}
      <nav className="mobile-bottom-dock">
        <button 
          onClick={() => handleNav('home')} 
          className={`dock-tab ${currentScreen === 'home' ? 'active' : ''}`}
        >
          <Home size={20} />
          <span>Início</span>
        </button>

        <button 
          onClick={() => handleNav('roteiro')} 
          className={`dock-tab ${currentScreen === 'roteiro' ? 'active' : ''}`}
        >
          <Compass size={20} />
          <span>Roteiro</span>
        </button>

        <button 
          onClick={() => setMobileMenuOpen(true)} 
          className={`dock-tab ${isManualActive ? 'active' : ''}`}
        >
          <BookOpen size={20} />
          <span>Manuais</span>
        </button>

        <button 
          onClick={() => handleNav('quizzes')} 
          className={`dock-tab ${currentScreen === 'quizzes' ? 'active' : ''}`}
        >
          <CheckSquare size={20} />
          <span>Quizzes</span>
        </button>

        <button 
          onClick={() => handleNav('certificado')} 
          className={`dock-tab ${currentScreen === 'certificado' ? 'active' : ''}`}
        >
          <Award size={20} />
          <span>Certificado</span>
        </button>
      </nav>
    </>
  );
};
