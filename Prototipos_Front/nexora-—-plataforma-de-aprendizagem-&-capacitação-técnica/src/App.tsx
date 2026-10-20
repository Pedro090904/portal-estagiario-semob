/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { Topbar } from './components/layout/Topbar';
import { Sidebar } from './components/layout/Sidebar';
import { StudentDashboard } from './components/student/StudentDashboard';
import { TrackCatalog } from './components/student/TrackCatalog';
import { TrackDetail } from './components/student/TrackDetail';
import { StudyReader } from './components/student/StudyReader';
import { TechnicalLibrary } from './components/student/TechnicalLibrary';
import { SqlChallengeLab } from './components/student/SqlChallengeLab';
import { BackendChallengeLab } from './components/student/BackendChallengeLab';
import { FrontendChallengeLab } from './components/student/FrontendChallengeLab';
import { CompetenciesMatrix } from './components/student/CompetenciesMatrix';
import { ProjectsView } from './components/student/ProjectsView';
import { CertificateView } from './components/student/CertificateView';
import { SupervisorDashboard } from './components/supervisor/SupervisorDashboard';
import { AdminTrackManager } from './components/admin/AdminTrackManager';
import { AdminUserManager } from './components/admin/AdminUserManager';
import { ChevronRight, Home } from 'lucide-react';

interface NavigationPayload {
  trackId?: string;
  stageId?: string;
  challengeId?: string;
}

const MainAppContent: React.FC = () => {
  const { currentUser, isSupervisor, isAdmin } = useAuth();
  const [activeSection, setActiveSection] = useState<string>('dashboard');
  const [navPayload, setNavPayload] = useState<NavigationPayload>({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleNavigate = (section: string, payload?: NavigationPayload) => {
    setActiveSection(section);
    if (payload) {
      setNavPayload(payload);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const breadcrumbsMap: Record<string, { parent?: string; label: string }> = {
    dashboard: { label: 'Visão Geral do Aluno' },
    catalog: { label: 'Catálogo de Trilhas' },
    track_detail: { parent: 'Catálogo', label: 'Trilha de Estagiários' },
    reader: { parent: 'Trilha', label: 'Ambiente de Estudo & Leitura' },
    library: { label: 'Biblioteca Técnica' },
    challenge_sql: { parent: 'Laboratórios', label: 'Desafio 1: Banco de Dados SQL' },
    challenge_backend: { parent: 'Laboratórios', label: 'Desafio 2: API REST Backend' },
    challenge_frontend: { parent: 'Laboratórios', label: 'Desafio 3: Frontend & A11y' },
    competencies: { label: 'Matriz de Competências' },
    projects: { label: 'Projetos Integradores' },
    certificates: { label: 'Certificados & Credenciais' },
    supervisor_dashboard: { label: 'Painel da Supervisão Técnica' },
    supervisor_reviews: { parent: 'Supervisão', label: 'Revisão de Entregáveis' },
    admin_tracks: { label: 'Administração de Trilhas & Conteúdos' },
    admin_users: { label: 'Gestão de Usuários & Permissões' },
  };

  const currentCrumb = breadcrumbsMap[activeSection] || { label: 'Início' };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Topbar */}
      <Topbar
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        activeSection={activeSection}
        onNavigate={handleNavigate}
      />

      <div className="flex-1 flex">
        {/* Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          activeSection={activeSection}
          onNavigate={handleNavigate}
        />

        {/* Main Content Viewport */}
        <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
          {/* Breadcrumb contextual header bar */}
          <div className="px-4 sm:px-8 py-3 bg-white/70 border-b border-slate-200/70 text-xs text-slate-500 flex items-center justify-between">
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleNavigate('dashboard')}
                className="hover:text-slate-900 flex items-center gap-1"
              >
                <Home className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Nexora</span>
              </button>
              <ChevronRight className="w-3 h-3 text-slate-300" />
              {currentCrumb.parent && (
                <>
                  <span className="text-slate-400">{currentCrumb.parent}</span>
                  <ChevronRight className="w-3 h-3 text-slate-300" />
                </>
              )}
              <span className="font-semibold text-slate-800 truncate">
                {currentCrumb.label}
              </span>
            </nav>

            <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
              Organização: {currentUser?.organizationName}
            </span>
          </div>

          {/* Page Body */}
          <main className="flex-1 p-4 sm:p-8">
            {activeSection === 'dashboard' && <StudentDashboard onNavigate={handleNavigate} />}
            {activeSection === 'catalog' && <TrackCatalog onNavigate={handleNavigate} />}
            {activeSection === 'track_detail' && (
              <TrackDetail onNavigate={handleNavigate} trackId={navPayload.trackId} />
            )}
            {activeSection === 'reader' && (
              <StudyReader
                onNavigate={handleNavigate}
                stageId={navPayload.stageId}
                trackId={navPayload.trackId}
              />
            )}
            {activeSection === 'library' && <TechnicalLibrary onNavigate={handleNavigate} />}
            {activeSection === 'challenge_sql' && <SqlChallengeLab onNavigate={handleNavigate} />}
            {activeSection === 'challenge_backend' && (
              <BackendChallengeLab onNavigate={handleNavigate} />
            )}
            {activeSection === 'challenge_frontend' && (
              <FrontendChallengeLab onNavigate={handleNavigate} />
            )}
            {activeSection === 'competencies' && <CompetenciesMatrix />}
            {activeSection === 'projects' && <ProjectsView />}
            {activeSection === 'certificates' && <CertificateView />}

            {/* Supervisor Sections */}
            {(activeSection === 'supervisor_dashboard' || activeSection === 'supervisor_reviews') && (
              <SupervisorDashboard onNavigate={handleNavigate} />
            )}

            {/* Admin Sections */}
            {activeSection === 'admin_tracks' && <AdminTrackManager />}
            {activeSection === 'admin_users' && <AdminUserManager />}
          </main>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <MainAppContent />
      </NotificationProvider>
    </AuthProvider>
  );
}
