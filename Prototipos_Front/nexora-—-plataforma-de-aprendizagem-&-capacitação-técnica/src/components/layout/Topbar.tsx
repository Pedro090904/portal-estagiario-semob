/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Menu,
  Search,
  Bell,
  BookOpen,
  ChevronDown,
  Sparkles,
  RotateCcw,
  UserCheck,
  Shield,
  GraduationCap,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { ApiService } from '../../services/api';
import { Button } from '../ui/Button';

interface TopbarProps {
  onToggleSidebar: () => void;
  activeSection: string;
  onNavigate: (section: string) => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  onToggleSidebar,
  activeSection,
  onNavigate,
}) => {
  const { currentUser, allUsers, switchUser } = useAuth();
  const { showSuccess, showInfo } = useNotification();
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);

  const handleResetData = () => {
    if (window.confirm('Deseja restaurar todos os dados e progressos para o estado inicial?')) {
      ApiService.resetToDefaults();
      showSuccess('Dados restaurados com sucesso!', 'A plataforma foi reinicializada com o estado padrão.');
      setTimeout(() => window.location.reload(), 400);
    }
  };

  const roleIcons = {
    student: <GraduationCap className="w-4 h-4 text-indigo-600" />,
    supervisor: <UserCheck className="w-4 h-4 text-emerald-600" />,
    admin: <Shield className="w-4 h-4 text-purple-600" />,
  };

  const roleLabels = {
    student: 'Aluno / Estagiário',
    supervisor: 'Supervisora Técnica',
    admin: 'Administrador',
  };

  return (
    <header className="sticky top-0 z-40 h-16 bg-white/95 backdrop-blur-xs border-b border-slate-200/90 px-4 sm:px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          aria-label="Abrir menu de navegação"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Brand */}
        <div
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold text-base shadow-xs group-hover:bg-indigo-700 transition-colors">
            <span className="font-mono text-indigo-400">N</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-900 tracking-tight text-base">Nexora</span>
              <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-1.5 py-0.2 rounded">
                ACADEMY
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-none hidden sm:block">Plataforma de Capacitação Técnica</p>
          </div>
        </div>
      </div>

      {/* Middle: quick search button */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
        <button
          type="button"
          onClick={() => onNavigate('library')}
          className="w-full flex items-center justify-between px-3.5 py-1.5 text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-lg hover:border-slate-300 hover:bg-white transition-all text-left"
        >
          <span className="flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-400" />
            <span>Buscar manuais, desafios ou competências...</span>
          </span>
          <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-100 rounded border border-slate-200">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5">
        {/* Reset Demo Data Button */}
        <button
          type="button"
          onClick={handleResetData}
          title="Restaurar dados para padrão inicial"
          className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden xl:inline">Resetar Dados</span>
        </button>

        {/* Persona / Role Switcher */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
            className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-slate-50 transition-colors text-left"
            aria-expanded={isRoleMenuOpen}
            aria-haspopup="true"
          >
            {currentUser?.avatarUrl ? (
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-200"
              />
            ) : (
              <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                {currentUser?.name.charAt(0)}
              </div>
            )}
            <div className="hidden sm:block">
              <p className="text-xs font-semibold text-slate-900 leading-tight">{currentUser?.name}</p>
              <div className="flex items-center gap-1 text-[10px] text-slate-500">
                {currentUser && roleIcons[currentUser.role]}
                <span>{currentUser ? roleLabels[currentUser.role] : ''}</span>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          {/* Switch dropdown */}
          {isRoleMenuOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50">
              <div className="px-3 py-2 border-b border-slate-100 mb-1">
                <p className="text-xs font-semibold text-slate-900">Alternar Perfil de Acesso</p>
                <p className="text-[11px] text-slate-500">
                  Teste os fluxos de Aluno, Supervisora ou Administrador
                </p>
              </div>

              {allUsers.map((user) => {
                const isSelected = user.id === currentUser?.id;
                return (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => {
                      switchUser(user.id);
                      setIsRoleMenuOpen(false);
                      showInfo(`Perfil alternado para ${user.name} (${roleLabels[user.role]})`);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-xs transition-colors ${
                      isSelected ? 'bg-indigo-50/80 text-indigo-900 font-semibold' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <img src={user.avatarUrl} alt="" className="w-7 h-7 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="truncate font-medium">{user.name}</p>
                      <p className="text-[10px] text-slate-500 truncate">{user.title}</p>
                    </div>
                    {isSelected && <span className="w-2 h-2 rounded-full bg-indigo-600" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
