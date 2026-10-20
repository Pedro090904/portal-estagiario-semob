import React, { useState } from 'react';
import { Flame, Calendar, Target, CheckCircle2 } from 'lucide-react';
import { useLMS } from '../../context/LMSContext';
import { HeatmapDay } from '../../types/lms';

export const StreakHeatmap: React.FC = () => {
  const { heatmapDays, currentStreak, weeklyGoalHours, completedWeeklyMinutes } = useLMS();
  const [hoveredDay, setHoveredDay] = useState<HeatmapDay | null>(null);

  // Group heatmap days into 16 columns of 7 days
  const weeks: HeatmapDay[][] = [];
  for (let i = 0; i < heatmapDays.length; i += 7) {
    weeks.push(heatmapDays.slice(i, i + 7));
  }

  const getColorClass = (count: number) => {
    switch (count) {
      case 0:
        return 'bg-slate-100 dark:bg-slate-800/80 hover:ring-1 hover:ring-slate-300 dark:hover:ring-slate-600';
      case 1:
        return 'bg-emerald-200 dark:bg-emerald-950/80 text-emerald-800';
      case 2:
        return 'bg-emerald-300 dark:bg-emerald-800 text-emerald-900';
      case 3:
        return 'bg-emerald-400 dark:bg-emerald-600 text-white';
      case 4:
      default:
        return 'bg-emerald-500 dark:bg-emerald-500 text-white';
    }
  };

  const completedWeeklyHours = (completedWeeklyMinutes / 60).toFixed(1);
  const weeklyProgressPercent = Math.min(100, Math.round((completedWeeklyMinutes / (weeklyGoalHours * 60)) * 100));

  const weekDayLabels = ['Seg', 'Qua', 'Sex'];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500" />
            Consistência & Ofensiva de Estudos
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
            <span>Últimas 16 semanas</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">{currentStreak} dias consecutivos ativos</span>
          </div>
        </div>

        {/* Weekly Goal Progress Bar */}
        <div className="bg-slate-50 dark:bg-slate-800/50 px-4 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60 min-w-[220px]">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-600 dark:text-slate-300 flex items-center gap-1.5 font-medium">
              <Target className="w-3.5 h-3.5 text-indigo-500" />
              Meta Semanal
            </span>
            <span className="font-mono tabular-nums text-slate-800 dark:text-slate-200 font-semibold">
              {completedWeeklyHours}h / {weeklyGoalHours}h
            </span>
          </div>
          <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full transition-all duration-300"
              style={{ width: `${weeklyProgressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto pb-2">
        <div className="inline-flex gap-2 items-center">
          {/* Day of week labels */}
          <div className="flex flex-col justify-between h-[104px] text-[10px] text-slate-400 dark:text-slate-500 pr-1 select-none">
            <span>{weekDayLabels[0]}</span>
            <span>{weekDayLabels[1]}</span>
            <span>{weekDayLabels[2]}</span>
          </div>

          {/* Weeks Columns */}
          <div className="flex gap-1.5">
            {weeks.map((week, wIdx) => (
              <div key={wIdx} className="flex flex-col gap-1.5">
                {week.map((day) => {
                  const isHovered = hoveredDay?.date === day.date;
                  return (
                    <div
                      key={day.date}
                      onMouseEnter={() => setHoveredDay(day)}
                      onMouseLeave={() => setHoveredDay(null)}
                      className={`w-3.5 h-3.5 rounded-[3px] transition-all cursor-pointer ${getColorClass(
                        day.count
                      )} ${isHovered ? 'ring-2 ring-indigo-500 scale-110 z-10' : ''}`}
                      title={`${day.date}: ${day.lessonsCompleted} aulas (${day.minutesSpent} min)`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Heatmap Legend & Tooltip detail */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 dark:text-slate-400 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
        <div>
          {hoveredDay ? (
            <span className="font-mono tabular-nums text-slate-700 dark:text-slate-200">
              <strong className="font-semibold">{hoveredDay.date}</strong>: {hoveredDay.lessonsCompleted} lição(ões) estudada(s) ({hoveredDay.minutesSpent} min)
            </span>
          ) : (
            <span>Passe o cursor sobre os blocos para ver o tempo dedicado</span>
          )}
        </div>

        <div className="flex items-center gap-1.5 mt-2 sm:mt-0">
          <span>Menos</span>
          <div className="w-3 h-3 rounded-[2px] bg-slate-100 dark:bg-slate-800" />
          <div className="w-3 h-3 rounded-[2px] bg-emerald-200 dark:bg-emerald-950" />
          <div className="w-3 h-3 rounded-[2px] bg-emerald-300 dark:bg-emerald-800" />
          <div className="w-3 h-3 rounded-[2px] bg-emerald-400 dark:bg-emerald-600" />
          <div className="w-3 h-3 rounded-[2px] bg-emerald-500 dark:bg-emerald-500" />
          <span>Mais</span>
        </div>
      </div>
    </div>
  );
};
