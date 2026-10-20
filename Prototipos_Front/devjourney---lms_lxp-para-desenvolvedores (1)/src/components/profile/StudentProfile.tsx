import React, { useState } from 'react';
import {
  Award,
  Terminal,
  Flame,
  CheckCircle2,
  Clock,
  Sparkles,
  GraduationCap,
  Calendar,
  Layers,
  Download,
  Share2,
  Check,
  MessageSquare
} from 'lucide-react';
import { useLMS } from '../../context/LMSContext';
import { Badge, SkillScore } from '../../types/lms';
import { CertificateModal } from './CertificateModal';
import { ProgressBar } from '../common/ProgressBar';

export const StudentProfile: React.FC = () => {
  const {
    userXP,
    currentStreak,
    badges,
    skillScores,
    activeTrack,
    getTrackProgressPercent,
    setIsCertificateModalOpen
  } = useLMS();

  const [hoveredSkill, setHoveredSkill] = useState<SkillScore | null>(null);

  // SVG Radar Chart Math
  const size = 320;
  const center = size / 2;
  const radius = center - 45;
  const totalAxes = skillScores.length;

  const getCoordinates = (index: number, value: number, max: number = 100) => {
    const angle = (Math.PI * 2 / totalAxes) * index - Math.PI / 2;
    const r = (value / max) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  // Generate radar polygon points
  const polygonPoints = skillScores
    .map((skill, index) => {
      const { x, y } = getCoordinates(index, skill.score, skill.fullMark);
      return `${x},${y}`;
    })
    .join(' ');

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Terminal':
        return Terminal;
      case 'Flame':
        return Flame;
      case 'Award':
        return Award;
      case 'MessageSquare':
        return MessageSquare;
      case 'Sparkles':
        return Sparkles;
      case 'GraduationCap':
      default:
        return GraduationCap;
    }
  };

  const progressPercent = getTrackProgressPercent(activeTrack.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Student Profile Hero Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
              alt="Pedro M. Sousa"
              className="w-20 h-20 rounded-2xl object-cover border-2 border-indigo-500 shadow-md"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">Aluno Ativo</span>
                <span aria-hidden="true">·</span>
                <span>Nível 4 (Desenvolvedor em Formação)</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Pedro M. Sousa
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Focado na trilha <strong>Desenvolvedor do Zero ao Júnior</strong> · Aluno desde Setembro de 2026
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3">
            <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80 text-center">
              <div className="text-[11px] text-slate-400 font-medium">Pontuação Total</div>
              <div className="text-xl font-bold font-mono tabular-nums text-indigo-600 dark:text-indigo-400">
                {userXP.toLocaleString()} XP
              </div>
            </div>

            <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80 text-center">
              <div className="text-[11px] text-slate-400 font-medium">Ofensiva Atual</div>
              <div className="text-xl font-bold font-mono tabular-nums text-amber-500 flex items-center justify-center gap-1">
                <Flame className="w-4 h-4 fill-amber-500" />
                {currentStreak}d
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Two Columns: Skill Radar (Teia) + Badges / Gamification */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Skill Radar Chart (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                Skill Radar: Mapa de Competências
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Gráfico de teia avaliando suas habilidades práticas e notas nos quizzes
              </p>
            </div>

            {hoveredSkill && (
              <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2.5 py-1 rounded-md">
                {hoveredSkill.skill}: {hoveredSkill.score}%
              </span>
            )}
          </div>

          {/* Interactive SVG Radar */}
          <div className="flex items-center justify-center py-2">
            <svg
              width={size}
              height={size}
              viewBox={`0 0 ${size} ${size}`}
              className="overflow-visible select-none"
            >
              {/* Concentric Polygons (Levels 20%, 40%, 60%, 80%, 100%) */}
              {[0.2, 0.4, 0.6, 0.8, 1.0].map((level, lIdx) => {
                const levelPoints = skillScores
                  .map((_, index) => {
                    const { x, y } = getCoordinates(index, level * 100, 100);
                    return `${x},${y}`;
                  })
                  .join(' ');

                return (
                  <polygon
                    key={lIdx}
                    points={levelPoints}
                    className="fill-none stroke-slate-200 dark:stroke-slate-800"
                    strokeWidth="1"
                    strokeDasharray={lIdx === 4 ? '' : '2 2'}
                  />
                );
              })}

              {/* Radial Axis Lines */}
              {skillScores.map((_, index) => {
                const { x, y } = getCoordinates(index, 100, 100);
                return (
                  <line
                    key={index}
                    x1={center}
                    y1={center}
                    x2={x}
                    y2={y}
                    className="stroke-slate-200 dark:stroke-slate-800"
                    strokeWidth="1"
                  />
                );
              })}

              {/* Filled Student Polygon Area */}
              <polygon
                points={polygonPoints}
                className="fill-indigo-500/25 stroke-indigo-600 dark:stroke-indigo-400 transition-all duration-300"
                strokeWidth="2"
              />

              {/* Data Points on vertices */}
              {skillScores.map((skill, index) => {
                const { x, y } = getCoordinates(index, skill.score, skill.fullMark);
                const isHovered = hoveredSkill?.skill === skill.skill;

                return (
                  <g key={index}>
                    <circle
                      cx={x}
                      cy={y}
                      r={isHovered ? 6 : 4}
                      className="fill-indigo-600 dark:fill-indigo-400 stroke-white dark:stroke-slate-900 cursor-pointer transition-all"
                      strokeWidth="2"
                      onMouseEnter={() => setHoveredSkill(skill)}
                      onMouseLeave={() => setHoveredSkill(null)}
                    />
                  </g>
                );
              })}

              {/* Labels for each axis outside the circle */}
              {skillScores.map((skill, index) => {
                const { x, y } = getCoordinates(index, 118, 100);
                const isHovered = hoveredSkill?.skill === skill.skill;

                return (
                  <text
                    key={index}
                    x={x}
                    y={y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className={`text-[10px] font-medium transition-colors cursor-pointer ${
                      isHovered
                        ? 'fill-indigo-600 dark:fill-indigo-400 font-bold'
                        : 'fill-slate-500 dark:fill-slate-400'
                    }`}
                    onMouseEnter={() => setHoveredSkill(skill)}
                    onMouseLeave={() => setHoveredSkill(null)}
                  >
                    {skill.skill.split(' ')[0]}
                  </text>
                );
              })}
            </svg>
          </div>

          {/* Skill Breakdown Horizontal Rows */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            {skillScores.map((s, idx) => (
              <div
                key={idx}
                onMouseEnter={() => setHoveredSkill(s)}
                onMouseLeave={() => setHoveredSkill(null)}
                className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                  hoveredSkill?.skill === s.skill
                    ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40'
                    : 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {s.skill}
                  </span>
                  <span className="font-mono tabular-nums font-bold text-indigo-600 dark:text-indigo-400">
                    {s.score}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full"
                    style={{ width: `${s.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Badges & Certificate Area (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Certificate Download Banner */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Certificado de Conclusão
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Carga horária total de 120 horas
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Disponível para emissão e validação pública após aprovação nas avaliações teóricas e práticas da formação.
            </p>

            <button
              onClick={() => setIsCertificateModalOpen(true)}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Visualizar / Baixar Certificado Oficial</span>
            </button>
          </div>

          {/* Badges / Conquistas Grid */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Conquistas & Medalhas
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Desbloqueie marcos para turbinar seu perfil profissional
                </p>
              </div>
              <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                4 / 6
              </span>
            </div>

            <div className="space-y-3">
              {badges.map((badge) => {
                const IconComponent = getBadgeIcon(badge.icon);

                return (
                  <div
                    key={badge.id}
                    className={`p-3 rounded-xl border flex items-center gap-3.5 transition-colors ${
                      badge.unlocked
                        ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800'
                        : 'bg-slate-100/50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/60 opacity-60'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        badge.unlocked
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 shadow-sm'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                      }`}
                    >
                      <IconComponent className="w-4.5 h-4.5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {badge.name}
                        </h4>
                        {badge.unlocked ? (
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Conquistado
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono text-slate-400">
                            {badge.progressPercent}%
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                        {badge.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Certificate Modal */}
      <CertificateModal />
    </div>
  );
};
