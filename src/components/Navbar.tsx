import React, { useState } from 'react';
import { ScreenType, ThemeMode } from '../types';
import { brandConfig } from '../config/brand';
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
  CheckCircle2,
  Library,
  Boxes
} from 'lucide-react';

interface NavbarProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  overallPercentage: number;
}

// Ícone Vetorial de Alta Fidelidade — Azimute Dev / SUTINF
const AzimuteLogo: React.FC<{ size?: number }> = ({ size = 36 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="brand-vector-logo"
    aria-label="Logo Oficial Azimute Dev"
  >
    <rect width="36" height="36" rx="9" fill="url(#azimute-grad)" />
    <circle cx="18" cy="18" r="10.5" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2" strokeDasharray="2 2" />
    <path d="M18 7.5L21.5 15L18 18L14.5 15L18 7.5Z" fill="#38bdf8" />
    <path d="M18 28.5L14.5 21L18 18L21.5 21L18 28.5Z" fill="rgba(255,255,255,0.7)" />
    <path d="M7.5 18L15 14.5L18 18L15 21.5L7.5 18Z" fill="rgba(255,255,255,0.5)" />
    <path d="M28.5 18L21 21.5L18 18L21 14.5L28.5 18Z" fill="#818cf8" />
    <circle cx="18" cy="18" r="2.2" fill="#ffffff" />
    <defs>
      <linearGradient id="azimute-grad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0284c7" />
        <stop offset="1" stopColor="#4338ca" />
      </linearGradient>
    </defs>
  </svg>
);

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

  const isManualActive = [
    'modulo-ambiente',
    'modulo-git',
    'modulo-sql',
    'modulo-backend',
    'modulo-frontend',
  ].includes(currentScreen);
  const isChallengeActive = ['desafio-sql', 'desafio-backend', 'desafio-frontend'].includes(currentScreen);

  return (
    <>
      <header className="site-header no-print">
        <div className="header-container" style={{ paddingLeft: '1rem' }}>
          {/* Brand / Logo Oficial */}
          <div
            className="header-brand flex items-center gap-3 cursor-pointer"
            onClick={() => handleNav('home')}
            style={{ margin: 0, padding: 0 }}
          >
            <AzimuteLogo size={38} />
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
              <span className="font-extrabold tracking-tight text-slate-900 dark:text-white" style={{ fontSize: '1.15rem' }}>
                {brandConfig.productName}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {brandConfig.departmentName}
              </span>
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
              id="nav-trilha"
              className={`nav-btn ${currentScreen === 'roteiro' ? 'active' : ''}`}
              onClick={() => handleNav('roteiro')}
            >
              <Compass className="nav-icon" size={16} />
              Trilha Guiada
            </button>

            <button
              id="nav-biblioteca"
              className={`nav-btn ${currentScreen === 'biblioteca' ? 'active' : ''}`}
              onClick={() => handleNav('biblioteca')}
            >
              <Library className="nav-icon" size={16} />
              Biblioteca
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
                  <button onClick={() => handleNav('modulo-ambiente')} className="dropdown-item">
                    <Boxes size={16} className="text-cyan" />
                    <div>
                      <div className="item-title">Setup & Ecossistema SISMOB</div>
                      <div className="item-desc">Docker Compose, Linux & PostgreSQL</div>
                    </div>
                  </button>
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
        <div className="mobile-drawer-overlay no-print" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header-row">
              <div className="drawer-brand-wrap flex items-center gap-2">
                <span className="text-lg">🧭</span>
                <span className="drawer-brand-name font-bold">{brandConfig.shortName}</span>
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
              <Compass size={18} className="text-emerald" /> Trilha Guiada
            </button>
            <button onClick={() => handleNav('biblioteca')} className={`drawer-btn ${currentScreen === 'biblioteca' ? 'active' : ''}`}>
              <Library size={18} className="text-sky" /> Biblioteca de Consulta
            </button>
            <button onClick={() => handleNav('quizzes')} className={`drawer-btn ${currentScreen === 'quizzes' ? 'active' : ''}`}>
              <CheckSquare size={18} className="text-amber" /> Central de Quizzes
            </button>
            <button onClick={() => handleNav('certificado')} className={`drawer-btn ${currentScreen === 'certificado' ? 'active' : ''}`}>
              <Award size={18} className="text-indigo" /> Certificado Oficial
            </button>

            <div className="drawer-section-title">Manuais Oficiais SUTINF</div>
            <button onClick={() => handleNav('modulo-ambiente')} className={`drawer-btn ${currentScreen === 'modulo-ambiente' ? 'active' : ''}`}>
              <Boxes size={16} className="text-cyan" /> Setup & Ecossistema SISMOB
            </button>
            <button onClick={() => handleNav('modulo-git')} className={`drawer-btn ${currentScreen === 'modulo-git' ? 'active' : ''}`}>
              <GitBranch size={16} className="text-sky" /> Git & DevSecOps
            </button>
            <button onClick={() => handleNav('modulo-sql')} className={`drawer-btn ${currentScreen === 'modulo-sql' ? 'active' : ''}`}>
              <Database size={16} className="text-emerald" /> Banco de Dados & SQL
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
      <nav className="mobile-bottom-dock no-print">
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
          <span>Trilha</span>
        </button>

        <button
          onClick={() => handleNav('biblioteca')}
          className={`dock-tab ${currentScreen === 'biblioteca' ? 'active' : ''}`}
        >
          <Library size={20} />
          <span>Biblioteca</span>
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
