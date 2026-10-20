/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  LayoutDashboard,
  Compass,
  BookOpen,
  Code2,
  Database,
  Server,
  Layers,
  Award,
  FolderGit2,
  Users2,
  FileCheck2,
  Settings,
  ShieldCheck,
  CheckCircle2,
  X,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection: string;
  onNavigate: (section: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  activeSection,
  onNavigate,
}) => {
  const { currentUser, isStudent, isSupervisor, isAdmin } = useAuth();

  const handleNavClick = (section: string) => {
    onNavigate(section);
    onClose();
  };

  const NavItem = ({
    section,
    label,
    icon: Icon,
    badge,
  }: {
    section: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string | number;
  }) => {
    const isActive = activeSection === section;
    return (
      <button
        type="button"
        onClick={() => handleNavClick(section)}
        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer select-none ${
          isActive
            ? 'bg-indigo-50 text-indigo-900 font-semibold shadow-2xs'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
          <span className="truncate">{label}</span>
        </div>
        {badge !== undefined && (
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
              isActive ? 'bg-indigo-200 text-indigo-900' : 'bg-slate-100 text-slate-600'
            }`}
          >
            {badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-2xs lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200/90 flex flex-col transition-transform duration-200 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-slate-900">Nexora Learning Core</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            aria-label="Fechar menu lateral"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {/* Section: Aluno */}
          <div>
            <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Área do Aluno
            </p>
            <div className="space-y-0.5">
              <NavItem section="dashboard" label="Visão Geral" icon={LayoutDashboard} />
              <NavItem section="catalog" label="Catálogo de Trilhas" icon={Compass} badge="3" />
              <NavItem section="track_detail" label="Trilha de Estagiários" icon={Layers} badge="60%" />
              <NavItem section="library" label="Biblioteca Técnica" icon={BookOpen} badge="4" />
            </div>
          </div>

          {/* Section: Desafios Técnicos */}
          <div>
            <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Laboratórios Técnicos
            </p>
            <div className="space-y-0.5">
              <NavItem section="challenge_sql" label="Desafio 1: Banco de Dados SQL" icon={Database} />
              <NavItem section="challenge_backend" label="Desafio 2: API REST Backend" icon={Server} />
              <NavItem section="challenge_frontend" label="Desafio 3: Frontend & A11y" icon={Code2} />
            </div>
          </div>

          {/* Section: Competências & Projetos */}
          <div>
            <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Evolução Profissional
            </p>
            <div className="space-y-0.5">
              <NavItem section="competencies" label="Matriz de Competências" icon={CheckCircle2} badge="5" />
              <NavItem section="projects" label="Projetos Integradores" icon={FolderGit2} badge="2" />
              <NavItem section="certificates" label="Certificados" icon={Award} badge="1" />
            </div>
          </div>

          {/* Section: Supervisão (Acessível a supervisores e admins, ou para auditoria) */}
          {(isSupervisor || isAdmin) && (
            <div>
              <div className="px-3 mb-2 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                  Área da Supervisora
                </span>
                <span className="text-[9px] bg-emerald-50 text-emerald-700 font-semibold px-1 rounded">
                  LÍDER
                </span>
              </div>
              <div className="space-y-0.5">
                <NavItem section="supervisor_dashboard" label="Painel da Equipe" icon={Users2} />
                <NavItem section="supervisor_reviews" label="Revisão de Entregáveis" icon={FileCheck2} badge="1" />
              </div>
            </div>
          )}

          {/* Section: Administração (Acessível a admins, ou para auditoria) */}
          {isAdmin && (
            <div>
              <div className="px-3 mb-2 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700">
                  Administração
                </span>
                <span className="text-[9px] bg-purple-50 text-purple-700 font-semibold px-1 rounded">
                  ADM
                </span>
              </div>
              <div className="space-y-0.5">
                <NavItem section="admin_tracks" label="Gestão de Conteúdos" icon={Settings} />
                <NavItem section="admin_users" label="Usuários e Papéis" icon={ShieldCheck} />
              </div>
            </div>
          )}
        </div>

        {/* Footer info box */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50">
          <div className="p-2.5 rounded-lg bg-white border border-slate-200">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-900 mb-1">
              <span>Trilha Ativa</span>
              <span className="text-[10px] font-mono text-indigo-600 font-bold">60%</span>
            </div>
            <p className="text-[11px] text-slate-500 truncate mb-2">Formação Estagiários Dev</p>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-indigo-600 h-1.5 rounded-full w-[60%]" />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
