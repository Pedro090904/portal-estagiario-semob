import React from 'react';
import { LMSProvider, useLMS } from './context/LMSContext';
import { Header } from './components/common/Header';
import { DashboardView } from './components/dashboard/DashboardView';
import { SkillTree } from './components/tracks/SkillTree';
import { TrackCatalog } from './components/tracks/TrackCatalog';
import { StudyPlayer } from './components/player/StudyPlayer';
import { ResourceLibrary } from './components/library/ResourceLibrary';
import { ForumCommunity } from './components/community/ForumCommunity';
import { StudentProfile } from './components/profile/StudentProfile';
import { QuizModal } from './components/quiz/QuizModal';

const MainLayout: React.FC = () => {
  const { currentTab, setCurrentTab } = useLMS();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Bar Navigation following Top Bar Contract */}
      <Header />

      {/* Main View Port */}
      <main className="flex-1">
        {currentTab === 'dashboard' && <DashboardView />}
        {currentTab === 'skill-tree' && <SkillTree />}
        {currentTab === 'tracks' && <TrackCatalog />}
        {currentTab === 'player' && <StudyPlayer />}
        {currentTab === 'library' && <ResourceLibrary />}
        {currentTab === 'community' && <ForumCommunity />}
        {currentTab === 'profile' && <StudentProfile />}
      </main>

      {/* Global Modals */}
      <QuizModal />

      {/* Clean Uncluttered Footer */}
      <footer className="border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 mt-16 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-white">DevJourney LMS/LXP</span>
            <span aria-hidden="true">·</span>
            <span>Plataforma de Aprendizagem para Desenvolvedores</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentTab('dashboard')}
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Dashboard
            </button>
            <button
              onClick={() => setCurrentTab('skill-tree')}
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Skill Tree
            </button>
            <button
              onClick={() => setCurrentTab('library')}
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Materiais
            </button>
            <button
              onClick={() => setCurrentTab('community')}
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Comunidade
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <LMSProvider>
      <MainLayout />
    </LMSProvider>
  );
}
