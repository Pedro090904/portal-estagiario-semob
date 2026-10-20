import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { UserRole, BrandTheme } from '../types';
import {
  Home,
  Layers,
  BookOpen,
  Award,
  Search,
  Moon,
  Sun,
  Shield,
  User,
  Sliders,
  FileText,
  LayoutGrid,
  Menu,
  X,
  WifiOff,
  AlertCircle
} from 'lucide-react';
import { BuscaGlobal } from './BuscaGlobal';
import { DossieProjetoModal } from './DossieProjetoModal';
import { WireframesFase2Modal } from './WireframesFase2Modal';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    currentUser,
    setRole,
    activeBrand,
    brandConfig,
    setBrand,
    themeMode,
    toggleThemeMode,
    setIsSearchOpen,
    setIsDossierOpen,
    setIsWireframesOpen,
    isOffline,
    setIsOffline
  } = useApp();

  const [menuPerfilAberto, setMenuPerfilAberto] = useState(false);
  const navigate = useNavigate();

  const isSupervisorOrAdmin = currentUser.role === 'supervisor' || currentUser.role === 'admin';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors">
      {/* Offline simulation alert bar if triggered */}
      {isOffline && (
        <div className="bg-amber-600 text-white px-4 py-2 text-xs text-center font-medium flex items-center justify-center gap-2">
          <WifiOff className="w-4 h-4" />
          <span>Modo sem conexão ativado para demonstração de resiliência offline.</span>
          <button
            onClick={() => setIsOffline(false)}
            className="underline ml-2 hover:text-amber-100 font-bold"
          >
            Reconectar
          </button>
        </div>
      )}

      {/* Top Bar Contract (1 row, 3 zones) */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6 md:gap-8">
          {/* Zone 1: Brand wordmark (single element) */}
          <Link
            to="/"
            className="flex items-center gap-2.5 whitespace-nowrap shrink-0 group focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center font-bold text-sm tracking-wider shadow-xs">
              {brandConfig.sigla[0]}
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-100 whitespace-nowrap leading-none">
                {brandConfig.sigla} <span className="font-medium text-slate-500 dark:text-slate-400 text-xs hidden sm:inline">Trilhas & Conteúdos</span>
              </span>
            </div>
          </Link>

          {/* Zone 2: 4-5 single-line clean navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-xs lg:text-sm font-medium text-slate-600 dark:text-slate-400">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `whitespace-nowrap shrink-0 py-1 transition-colors border-b-2 ${
                  isActive
                    ? 'border-blue-600 text-slate-900 dark:text-slate-100 font-semibold'
                    : 'border-transparent hover:text-slate-900 dark:hover:text-slate-200'
                }`
              }
            >
              Início
            </NavLink>
            <NavLink
              to="/trilhas"
              className={({ isActive }) =>
                `whitespace-nowrap shrink-0 py-1 transition-colors border-b-2 ${
                  isActive
                    ? 'border-blue-600 text-slate-900 dark:text-slate-100 font-semibold'
                    : 'border-transparent hover:text-slate-900 dark:hover:text-slate-200'
                }`
              }
            >
              Trilhas
            </NavLink>
            <NavLink
              to="/biblioteca"
              className={({ isActive }) =>
                `whitespace-nowrap shrink-0 py-1 transition-colors border-b-2 ${
                  isActive
                    ? 'border-blue-600 text-slate-900 dark:text-slate-100 font-semibold'
                    : 'border-transparent hover:text-slate-900 dark:hover:text-slate-200'
                }`
              }
            >
              Biblioteca
            </NavLink>
            <NavLink
              to="/certificados"
              className={({ isActive }) =>
                `whitespace-nowrap shrink-0 py-1 transition-colors border-b-2 ${
                  isActive
                    ? 'border-blue-600 text-slate-900 dark:text-slate-100 font-semibold'
                    : 'border-transparent hover:text-slate-900 dark:hover:text-slate-200'
                }`
              }
            >
              Certificados
            </NavLink>

            {/* Profile specific links */}
            {(currentUser.role === 'supervisor' || currentUser.role === 'admin') && (
              <NavLink
                to="/supervisor"
                className={({ isActive }) =>
                  `whitespace-nowrap shrink-0 py-1 transition-colors border-b-2 text-indigo-600 dark:text-indigo-400 ${
                    isActive
                      ? 'border-indigo-600 font-semibold'
                      : 'border-transparent hover:text-indigo-800'
                  }`
                }
              >
                Orientador
              </NavLink>
            )}

            {currentUser.role === 'admin' && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `whitespace-nowrap shrink-0 py-1 transition-colors border-b-2 text-amber-600 dark:text-amber-400 ${
                    isActive
                      ? 'border-amber-600 font-semibold'
                      : 'border-transparent hover:text-amber-800'
                  }`
                }
              >
                Administrador
              </NavLink>
            )}
          </nav>

          {/* Zone 3: 1 primary action or controls cluster */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Global Search trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 text-xs text-slate-600 dark:text-slate-400 transition-colors"
              aria-label="Abrir busca global da plataforma"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Buscar...</span>
              <kbd className="hidden lg:inline-block px-1.5 py-0.2 bg-slate-200 dark:bg-slate-700 rounded text-[10px] font-mono text-slate-500">
                ⌘K
              </kbd>
            </button>

            {/* UX Dossier Trigger for Reviewers */}
            <button
              onClick={() => setIsDossierOpen(true)}
              className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 text-xs font-semibold hover:bg-blue-100 transition-colors"
              title="Abrir o Dossiê completo de UX, estratégia e acessibilidade em 5 partes"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Dossiê de UX</span>
            </button>

            {/* Wireframes Phase 2 Trigger */}
            <button
              onClick={() => setIsWireframesOpen(true)}
              className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Visualizar wireframes propostos para FASE 2 e FUTURO"
            >
              <Layers className="w-3.5 h-3.5 text-amber-600" />
              <span>Fase 2 Wireframes</span>
            </button>

            {/* Dark/Light mode toggle */}
            <button
              onClick={toggleThemeMode}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label={`Alternar para tema ${themeMode === 'light' ? 'escuro' : 'claro'}`}
            >
              {themeMode === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            {/* Profile Drawer Toggle Button */}
            <button
              onClick={() => setMenuPerfilAberto(prev => !prev)}
              className="flex items-center gap-2 p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs"
              aria-label="Abrir menu de perfil e personalização da instância"
              aria-expanded={menuPerfilAberto}
            >
              <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-[10px] text-slate-700 dark:text-slate-200">
                {currentUser.nome[0]}
              </div>
              <span className="hidden md:inline font-medium text-slate-700 dark:text-slate-300 max-w-[100px] truncate">
                {currentUser.nome.split(' ')[0]}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12">
        {children}
      </main>

      {/* Profile & Instance Configuration Drawer (Modal/Drawer) */}
      {menuPerfilAberto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Painel de perfil e configurações de marca"
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end animate-in fade-in"
          onClick={() => setMenuPerfilAberto(false)}
        >
          <div
            className="w-full max-w-sm bg-white dark:bg-slate-900 h-full shadow-2xl p-6 overflow-y-auto space-y-6 flex flex-col justify-between border-l border-slate-200 dark:border-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600" />
                  Perfil & Configuração
                </h3>
                <button
                  onClick={() => setMenuPerfilAberto(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Current User Card */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
                    {currentUser.nome[0]}
                  </div>
                  <div className="min-w-0">
                    <span className="font-semibold text-xs text-slate-900 dark:text-slate-100 block truncate">
                      {currentUser.nome}
                    </span>
                    <span className="text-[11px] text-slate-500 block truncate">
                      {currentUser.cargo}
                    </span>
                  </div>
                </div>
                <div className="pt-2 text-[11px] text-slate-500 border-t border-slate-200/60 dark:border-slate-700 flex justify-between">
                  <span>{currentUser.area}</span>
                  <span className="font-mono">{currentUser.pontos} pontos</span>
                </div>
              </div>

              {/* Role Switcher for Evaluators (Critical for testing all perspectives) */}
              <div className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
                  Simular Perfil de Acesso:
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: 'aluno', label: 'Estagiário (Aluno)' },
                    { id: 'dev', label: 'Desenvolvedor' },
                    { id: 'supervisor', label: 'Supervisor (Orientador)' },
                    { id: 'admin', label: 'Administrador' }
                  ].map(item => (
                    <button
                      key={item.id}
                      onClick={() => setRole(item.id as UserRole)}
                      className={`p-2.5 rounded-xl border text-left font-medium transition-colors ${
                        currentUser.role === item.id
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-900 dark:text-blue-100 font-bold'
                          : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* White-Label Instance Brand Switcher */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
                  Instância White-Label (Marca):
                </span>
                <div className="space-y-1.5 text-xs">
                  {[
                    { id: 'semob', label: 'SEMOB - Secretaria de Mobilidade (Padrão)', color: 'bg-blue-600' },
                    { id: 'azimute', label: 'Azimute Dev Academy', color: 'bg-emerald-600' },
                    { id: 'novagov', label: 'NovaGov Instituto Tecnológico', color: 'bg-indigo-600' }
                  ].map(b => (
                    <button
                      key={b.id}
                      onClick={() => setBrand(b.id as BrandTheme)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl border transition-colors ${
                        activeBrand === b.id
                          ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 text-blue-950 dark:text-blue-100 font-bold'
                          : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${b.color}`} />
                        <span>{b.label}</span>
                      </div>
                      {activeBrand === b.id && <span className="text-blue-600 text-[11px]">Ativa</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tools for reviewer */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <span className="font-semibold text-slate-500 block uppercase tracking-wider">
                  Auditoria & Documentação:
                </span>
                <button
                  onClick={() => {
                    setMenuPerfilAberto(false);
                    setIsDossierOpen(true);
                  }}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 flex items-center justify-between font-medium"
                >
                  <span>Ver Dossiê do Projeto (5 Partes)</span>
                  <FileText className="w-4 h-4 text-blue-600" />
                </button>
                <button
                  onClick={() => {
                    setMenuPerfilAberto(false);
                    setIsWireframesOpen(true);
                  }}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 flex items-center justify-between font-medium"
                >
                  <span>Ver Wireframes [FASE 2 / FUTURO]</span>
                  <Layers className="w-4 h-4 text-amber-600" />
                </button>
                <button
                  onClick={() => setIsOffline(!isOffline)}
                  className="w-full text-left p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 flex items-center justify-between"
                >
                  <span>Simular Estado Sem Conexão</span>
                  <WifiOff className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-400 text-center">
              Plataforma SEMOB · Versão 1.0 (MVP 2026)
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation (Strictly max 5 destinations as per Section 5.5) */}
      <nav
        aria-label="Navegação inferior mobile"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 flex items-center justify-around text-[10px] font-medium"
      >
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg transition-colors ${
              isActive ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-500'
            }`
          }
        >
          <Home className="w-4 h-4" />
          <span>Início</span>
        </NavLink>

        <NavLink
          to="/trilhas"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg transition-colors ${
              isActive ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-500'
            }`
          }
        >
          <Layers className="w-4 h-4" />
          <span>Trilhas</span>
        </NavLink>

        <NavLink
          to="/biblioteca"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg transition-colors ${
              isActive ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-500'
            }`
          }
        >
          <BookOpen className="w-4 h-4" />
          <span>Biblioteca</span>
        </NavLink>

        <NavLink
          to="/certificados"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg transition-colors ${
              isActive ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-500'
            }`
          }
        >
          <Award className="w-4 h-4" />
          <span>Certificados</span>
        </NavLink>

        <button
          onClick={() => setMenuPerfilAberto(true)}
          className="flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-slate-500 hover:text-slate-900"
          aria-label="Abrir opções e perfil"
        >
          <Menu className="w-4 h-4" />
          <span>Mais</span>
        </button>
      </nav>

      {/* Global Modals */}
      <BuscaGlobal />
      <DossieProjetoModal />
      <WireframesFase2Modal />
    </div>
  );
};
