import React from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ScreenType } from './types';
import { useStudentProgress } from './hooks/useStudentProgress';
import { useTheme } from './hooks/useTheme';
import { getModules } from './services/dataService';
import { SCREEN_TO_PATH, modulePath, pathToScreen } from './config/routes';
import { LibraryScreen } from './screens/LibraryScreen';
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
import { CertificateValidationScreen } from './screens/CertificateValidationScreen';

export const App: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // A URL é a fonte da verdade da tela atual: F5 e links diretos preservam a página (Q47)
  const routedScreen = pathToScreen(location.pathname);
  const currentScreen: ScreenType = routedScreen ?? 'home';
  const { theme, toggleTheme } = useTheme();
  const {
    progress,
    updateStudentName,
    toggleModule,
    toggleChallenge,
    toggleChecklist,
    recordQuizAttempt,
    recordNote,
    saveChallenge,
    resetProgress,
    metrics,
  } = useStudentProgress();

  const handleNavigate = (screen: ScreenType) => {
    navigate(SCREEN_TO_PATH[screen] ?? '/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenModule = (moduleId: string) => {
    navigate(modulePath(moduleId));
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
        return (
          <IntegrationTrackScreen
            completedItems={progress.completedChecklists['integration-track'] || []}
            onToggleItem={(key) => toggleChecklist('integration-track', key)}
            onOpenModule={handleOpenModule}
            onNavigateChallenge={(screen) => {
              if (screen === 'sql-challenge') handleNavigate('desafio-sql');
              if (screen === 'backend-challenge') handleNavigate('desafio-backend');
              if (screen === 'frontend-challenge') handleNavigate('desafio-frontend');
              if (screen === 'certificado') handleNavigate('certificado');
            }}
            onNavigate={handleNavigate}
          />
        );

      case 'biblioteca':
        return (
          <LibraryScreen
            modules={getModules()}
            onOpenManual={(id) => {
              navigate(modulePath(id));
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        );

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
        const urlModId = location.pathname.startsWith('/modulos/')
          ? location.pathname.replace('/modulos/', '').trim()
          : null;
        const moduleId = (urlModId && urlModId !== 'gabarito-sql')
          ? urlModId
          : (idMap[currentScreen] || 'mod-1-ambiente');
        const allMods = getModules();
        const mod = allMods.find((m) => m.id === moduleId) || allMods[0];
        const quizKey = mod.quizId || mod.id;
        const attempt = progress.quizScores[quizKey];
        const history = progress.quizHistory[quizKey] || progress.quizHistory[mod.id] || [];
        const note = progress.moduleNotes[mod.id] || '';
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
            onSelectModule={(id) => handleOpenModule(id)}
            allModules={allMods}
          />
        );
      }

      case 'quizzes':
        return (
          <QuizCenterScreen
            quizAttempts={progress.quizScores}
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
            submission={progress.challengeSubmissions?.['challenge-sql-relatorios']}
            onSaveSubmission={saveChallenge}
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
            submission={progress.challengeSubmissions?.['challenge-backend-api']}
            onSaveSubmission={saveChallenge}
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
            submission={progress.challengeSubmissions?.['challenge-frontend-ui']}
            onSaveSubmission={saveChallenge}
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
            completedChallengesCount={metrics.completedChallengesCount}
            totalChallenges={metrics.totalChallenges}
            overallPercentage={metrics.overallPercentage}
            averageScore={metrics.averageQuizScore}
            isUnlocked={metrics.isCertificateUnlocked}
            onNavigate={handleNavigate}
          />
        );

      case 'validar-certificado':
        return <CertificateValidationScreen />;

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

  // Rotas desconhecidas voltam para a Home em vez de renderizar silenciosamente outra tela
  if (routedScreen === null) {
    return <Navigate to="/" replace />;
  }

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
