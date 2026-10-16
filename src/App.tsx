import React, { useState } from 'react';
import { ScreenType } from './types';
import { useStudentProgress } from './hooks/useStudentProgress';
import { useTheme } from './hooks/useTheme';
import { MODULES, getModules } from './services/dataService';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeScreen } from './screens/HomeScreen';
import { IntegrationTrackScreen } from './screens/IntegrationTrackScreen';
import { ModuleViewerScreen } from './screens/ModuleViewerScreen';
import { QuizCenterScreen } from './screens/QuizCenterScreen';
import { SqlChallengeScreen } from './screens/SqlChallengeScreen';
import { BackendChallengeScreen } from './screens/BackendChallengeScreen';
import { FrontendChallengeScreen } from './screens/FrontendChallengeScreen';
import { CertificateScreen } from './screens/CertificateScreen';

export const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const { theme, toggleTheme } = useTheme();
  const {
    progress,
    updateStudentName,
    toggleModule,
    toggleChallenge,
    toggleChecklist,
    recordQuizAttempt,
    recordNote,
    resetProgress,
    metrics,
  } = useStudentProgress();

  const handleNavigate = (screen: ScreenType) => {
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenModule = (moduleId: string) => {
    const id = moduleId.toLowerCase();
    if (id.includes('ambiente') || id.includes('docker') || id.includes('setup')) {
      handleNavigate('modulo-ambiente');
    } else if (id.includes('sql') || id.includes('banco') || id.includes('dados')) {
      handleNavigate('modulo-sql');
    } else if (id.includes('backend') || id.includes('back')) {
      handleNavigate('modulo-backend');
    } else if (id.includes('frontend') || id.includes('front')) {
      handleNavigate('modulo-frontend');
    } else if (id.includes('git')) {
      handleNavigate('modulo-git');
    } else if (id.includes('gabarito')) {
      handleNavigate('modulo-gabarito');
    } else {
      handleNavigate('roteiro');
    }
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'home':
        return (
          <HomeScreen
            onNavigate={handleNavigate}
            completedModules={progress.completedModules}
            passedQuizzesCount={metrics.passedQuizzesCount}
            totalQuizzes={metrics.totalQuizzes}
            completedChallengesCount={metrics.completedChallengesCount}
            totalChallenges={metrics.totalChallenges}
            overallPercentage={metrics.overallPercentage}
            studentName={progress.studentName}
            onUpdateStudentName={updateStudentName}
            onToggleModule={toggleModule}
          />
        );

      case 'roteiro':
        return <IntegrationTrackScreen onNavigate={handleNavigate} />;

      case 'modulo-ambiente':
      case 'modulo-git':
      case 'modulo-sql':
      case 'modulo-gabarito':
      case 'modulo-backend':
      case 'modulo-frontend': {
        const idMap: Record<string, string> = {
          'modulo-ambiente': 'mod-1-ambiente',
          'modulo-git': 'mod-2-git',
          'modulo-sql': 'mod-3-banco-dados',
          'modulo-gabarito': 'mod-3-banco-dados',
          'modulo-backend': 'mod-4-backend',
          'modulo-frontend': 'mod-5-frontend',
        };
        const moduleId = idMap[currentScreen] || 'mod-1-ambiente';
        const allMods = getModules();
        const mod = allMods.find((m) => m.id === moduleId) || allMods[0];
        const quizKey = mod.quizId || mod.id;
        const attempt = progress.quizScores[quizKey];
        const history = progress.quizHistory[quizKey] || progress.quizHistory[mod.id] || [];
        const note = progress.moduleNotes[mod.id] || progress.notes[mod.id] || '';
        const checklist = progress.completedChecklists[mod.id] || [];

        return (
          <ModuleViewerScreen
            module={mod}
            isCompleted={progress.completedModules.includes(mod.id)}
            completedChecklist={checklist}
            quizAttempt={attempt}
            quizHistory={history}
            moduleNote={note}
            onBack={() => handleNavigate('roteiro')}
            onToggleComplete={(id) => toggleModule(id)}
            onToggleChecklist={(id, itemKey) => toggleChecklist(id, itemKey)}
            onSaveQuiz={(att) => recordQuizAttempt(att)}
            onSaveNote={(id, noteText) => recordNote(id, noteText)}
            onSelectModule={(id) => {
              const reverseMap: Record<string, ScreenType> = {
                'mod-1-ambiente': 'modulo-ambiente',
                'mod-2-git': 'modulo-git',
                'mod-3-banco-dados': 'modulo-sql',
                'mod-4-backend': 'modulo-backend',
                'mod-5-frontend': 'modulo-frontend',
              };
              const targetScreen = reverseMap[id] || (`modulo-${id}` as ScreenType);
              handleNavigate(targetScreen);
            }}
            allModules={allMods}
          />
        );
      }

      case 'quizzes':
        return (
          <QuizCenterScreen
            quizAttempts={progress.quizAttempts}
            onSaveQuizAttempt={recordQuizAttempt}
            onNavigate={handleNavigate}
            onResetProgress={resetProgress}
          />
        );

      case 'desafio-sql':
      case 'sql-challenge':
        return (
          <SqlChallengeScreen
            completedItems={
              progress.completedChecklists['challenge-sql-relatorios'] ||
              progress.completedChecklists['sql-challenge'] ||
              []
            }
            onToggleItem={(key) => {
              toggleChecklist('challenge-sql-relatorios', key);
            }}
            onOpenModule={handleOpenModule}
          />
        );

      case 'desafio-backend':
      case 'backend-challenge':
        return (
          <BackendChallengeScreen
            completedItems={
              progress.completedChecklists['challenge-backend-api'] ||
              progress.completedChecklists['backend-challenge'] ||
              []
            }
            onToggleItem={(key) => {
              toggleChecklist('challenge-backend-api', key);
            }}
            onOpenModule={handleOpenModule}
          />
        );

      case 'desafio-frontend':
      case 'frontend-challenge':
        return (
          <FrontendChallengeScreen
            completedItems={
              progress.completedChecklists['challenge-frontend-ui'] ||
              progress.completedChecklists['frontend-challenge'] ||
              []
            }
            onToggleItem={(key) => {
              toggleChecklist('challenge-frontend-ui', key);
            }}
            onOpenModule={handleOpenModule}
          />
        );

      case 'certificado':
        return (
          <CertificateScreen
            studentName={progress.studentName}
            onUpdateStudentName={updateStudentName}
            completedModulesCount={metrics.completedModulesCount}
            totalModules={metrics.totalModules}
            passedQuizzesCount={metrics.passedQuizzesCount}
            totalQuizzes={metrics.totalQuizzes}
            overallPercentage={metrics.overallPercentage}
            averageScore={metrics.averageQuizScore}
            isUnlocked={metrics.isCertificateUnlocked}
            onNavigate={handleNavigate}
          />
        );

      default:
        return (
          <HomeScreen
            onNavigate={handleNavigate}
            completedModules={progress.completedModules}
            passedQuizzesCount={metrics.passedQuizzesCount}
            totalQuizzes={metrics.totalQuizzes}
            completedChallengesCount={metrics.completedChallengesCount}
            totalChallenges={metrics.totalChallenges}
            overallPercentage={metrics.overallPercentage}
            studentName={progress.studentName}
            onUpdateStudentName={updateStudentName}
            onToggleModule={toggleModule}
          />
        );
    }
  };

  const isViewingManual = currentScreen.startsWith('modulo-');

  return (
    <div className={`app-layout ${isViewingManual ? 'in-manual-view' : ''}`}>
      {!isViewingManual && (
        <Navbar
          currentScreen={currentScreen}
          onNavigate={handleNavigate}
          theme={theme}
          onToggleTheme={toggleTheme}
          overallPercentage={metrics.overallPercentage}
        />
      )}

      <main className={`main-content-area ${isViewingManual ? 'main-manual-fullscreen' : ''}`}>
        {renderCurrentScreen()}
      </main>

      {!isViewingManual && <Footer onNavigate={handleNavigate} />}
    </div>
  );
};
export default App;
