import React from 'react';

export const SkeletonCard: React.FC = () => (
  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 animate-pulse">
    <div className="flex items-center justify-between">
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-16" />
    </div>
    <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
    <div className="space-y-2">
      <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full" />
      <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-5/6" />
    </div>
    <div className="flex items-center gap-3 pt-2">
      <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg w-28" />
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-20" />
    </div>
  </div>
);

export const SkeletonTable: React.FC = () => (
  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3 animate-pulse">
    <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-1/3 mb-4" />
    {[1, 2, 3, 4].map(i => (
      <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/5" />
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/5" />
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/6" />
      </div>
    ))}
  </div>
);
