import React from 'react';
import { UserRole } from '../types';
import { useApp } from '../context/AppContext';
import { ShieldAlert, ArrowLeft, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProtegidoPorPerfilProps {
  rolesPermitidos: UserRole[];
  children: React.ReactNode;
}

export const ProtegidoPorPerfil: React.FC<ProtegidoPorPerfilProps> = ({
  rolesPermitidos,
  children
}) => {
  const { currentUser, setRole } = useApp();

  const permitido = rolesPermitidos.includes(currentUser.role);

  if (!permitido) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-600 mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs uppercase tracking-wider font-semibold text-amber-700 dark:text-amber-400">
            Acesso Restrito (Erro 403)
          </span>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Área Exclusiva para {rolesPermitidos.map(r => r === 'supervisor' ? 'Supervisores' : r === 'admin' ? 'Administradores' : r).join(' ou ')}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            Seu perfil atual é <strong className="font-semibold text-slate-900 dark:text-slate-200">{currentUser.cargo}</strong>. Para acessar esta tela, utilize a troca de perfil abaixo para fins de avaliação e testes da plataforma.
          </p>
        </div>

        {/* Quick simulator switcher for evaluation */}
        <div className="p-4 bg-slate-100 dark:bg-slate-800/80 rounded-xl max-w-md mx-auto space-y-3 border border-slate-200 dark:border-slate-700 text-xs">
          <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5">
            <UserCheck className="w-4 h-4 text-blue-600" />
            Alternar perfil de teste para visualizar:
          </span>
          <div className="flex flex-wrap justify-center gap-2">
            {rolesPermitidos.map(r => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-xs transition-colors"
              >
                Ativar perfil {r === 'supervisor' ? 'Supervisor Técnico' : r === 'admin' ? 'Administrador' : r}
              </button>
            ))}
          </div>
        </div>

        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Voltar para o Início
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
