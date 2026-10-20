import React from 'react';

interface ProgressBarProps {
  value: number; // 0 to 100
  max?: number;
  label?: string;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'emerald' | 'amber';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  showPercentage = true,
  size = 'md',
  color = 'primary',
  className = ''
}) => {
  const clamped = Math.min(Math.max(0, value), max);
  const percentage = Math.round((clamped / max) * 100);

  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-3.5'
  };

  const colorClasses = {
    primary: 'bg-indigo-600 dark:bg-indigo-500',
    emerald: 'bg-emerald-600 dark:bg-emerald-500',
    amber: 'bg-amber-500 dark:bg-amber-400'
  };

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
          {label && <span>{label}</span>}
          {showPercentage && <span className="font-mono tabular-nums">{percentage}%</span>}
        </div>
      )}
      <div
        className={`w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden ${heightClasses[size]}`}
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${colorClasses[color]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
