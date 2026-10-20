import React from 'react';
import { ProgressOverview } from './ProgressOverview';
import { RecommendedNext } from './RecommendedNext';
import { StreakHeatmap } from './StreakHeatmap';
import { QuickAccess } from './QuickAccess';

export const DashboardView: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Progress Overview & Hero */}
      <section aria-label="Visão Geral do Aluno">
        <ProgressOverview />
      </section>

      {/* 2. Recommended Next Lesson / Quiz */}
      <section aria-label="Próxima Aula Recomendada">
        <RecommendedNext />
      </section>

      {/* 3. Study Engagement & Streak Heatmap */}
      <section aria-label="Ofensiva e Heatmap de Estudos">
        <StreakHeatmap />
      </section>

      {/* 4. Quick Access to Documents & Community */}
      <section aria-label="Acesso Rápido a Materiais e Fórum">
        <QuickAccess />
      </section>
    </div>
  );
};
