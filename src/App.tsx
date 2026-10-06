import React, { useState } from 'react';
import { ScreenType } from './types';
import { useStudentProgress } from './hooks/useStudentProgress';
import { useTheme } from './hooks/useTheme';
import { MODULES } from './services/dataService';
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
    recordQuizAttempt,
    recordNote,
    resetProgress,
    metrics,
  } = useStudentProgress();

  const handleNavigate = (screen: ScreenType) => {
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

      case 'modulo-git': {
        const mod = MODULES.find((m) => m.id === 'git') || MODULES[0];
        const next = MODULES.find((m) => m.id === 'sql');
        return (
          <ModuleViewerScreen
            module={mod}
            onNavigate={handleNavigate}
            isCompleted={progress.completedModules.includes(mod.id)}
            onToggleComplete={toggleModule}
            quizAttempt={progress.quizAttempts[mod.quizId]}
            onSaveQuizAttempt={recordQuizAttempt}
            nextModule={next}
            userNotes={progress.notes[mod.id] || ''}
            onSaveNotes={(noteText) => recordNote(mod.id, noteText)}
          />
        );
      }

      case 'modulo-sql': {
        const mod = MODULES.find((m) => m.id === 'sql') || MODULES[1];
        const prev = MODULES.find((m) => m.id === 'git');
        const next = MODULES.find((m) => m.id === 'gabarito-sql');
        return (
          <ModuleViewerScreen
            module={mod}
            onNavigate={handleNavigate}
            isCompleted={progress.completedModules.includes(mod.id)}
            onToggleComplete={toggleModule}
            quizAttempt={progress.quizAttempts[mod.quizId]}
            onSaveQuizAttempt={recordQuizAttempt}
            prevModule={prev}
            nextModule={next}
            userNotes={progress.notes[mod.id] || ''}
            onSaveNotes={(noteText) => recordNote(mod.id, noteText)}
          />
        );
      }

      case 'modulo-gabarito': {
        const mod = MODULES.find((m) => m.id === 'gabarito-sql') || MODULES[2];
        const prev = MODULES.find((m) => m.id === 'sql');
        const next = MODULES.find((m) => m.id === 'backend');
        return (
          <ModuleViewerScreen
            module={mod}
            onNavigate={handleNavigate}
            isCompleted={progress.completedModules.includes(mod.id)}
            onToggleComplete={toggleModule}
            quizAttempt={progress.quizAttempts[mod.quizId]}
            onSaveQuizAttempt={recordQuizAttempt}
            prevModule={prev}
            nextModule={next}
            userNotes={progress.notes[mod.id] || ''}
            onSaveNotes={(noteText) => recordNote(mod.id, noteText)}
          />
        );
      }

      case 'modulo-backend': {
        const mod = MODULES.find((m) => m.id === 'backend') || MODULES[3];
        const prev = MODULES.find((m) => m.id === 'gabarito-sql');
        const next = MODULES.find((m) => m.id === 'frontend');
        return (
          <ModuleViewerScreen
            module={mod}
            onNavigate={handleNavigate}
            isCompleted={progress.completedModules.includes(mod.id)}
            onToggleComplete={toggleModule}
            quizAttempt={progress.quizAttempts[mod.quizId]}
            onSaveQuizAttempt={recordQuizAttempt}
            prevModule={prev}
            nextModule={next}
            userNotes={progress.notes[mod.id] || ''}
            onSaveNotes={(noteText) => recordNote(mod.id, noteText)}
          />
        );
      }

      case 'modulo-frontend': {
        const mod = MODULES.find((m) => m.id === 'frontend') || MODULES[4];
        const prev = MODULES.find((m) => m.id === 'backend');
        return (
          <ModuleViewerScreen
            module={mod}
            onNavigate={handleNavigate}
            isCompleted={progress.completedModules.includes(mod.id)}
            onToggleComplete={toggleModule}
            quizAttempt={progress.quizAttempts[mod.quizId]}
            onSaveQuizAttempt={recordQuizAttempt}
            prevModule={prev}
            userNotes={progress.notes[mod.id] || ''}
            onSaveNotes={(noteText) => recordNote(mod.id, noteText)}
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
        return (
          <SqlChallengeScreen
            completedChallenges={progress.completedChallenges}
            onToggleChallenge={toggleChallenge}
            notes={progress.notes}
            onSaveNote={recordNote}
            onNavigate={handleNavigate}
          />
        );

      case 'desafio-backend':
        return (
          <BackendChallengeScreen
            isCompleted={progress.completedChallenges.includes('backend-challenge')}
            onToggleComplete={() => toggleChallenge('backend-challenge')}
            onNavigate={handleNavigate}
          />
        );

      case 'desafio-frontend':
        return (
          <FrontendChallengeScreen
            isCompleted={progress.completedChallenges.includes('frontend-challenge')}
            onToggleComplete={() => toggleChallenge('frontend-challenge')}
            onNavigate={handleNavigate}
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

  return (
    <div className="app-layout">
      <Navbar
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
        theme={theme}
        onToggleTheme={toggleTheme}
        overallPercentage={metrics.overallPercentage}
      />

      <main className="main-content-area">
        {renderCurrentScreen()}
      </main>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
};
export default App;
