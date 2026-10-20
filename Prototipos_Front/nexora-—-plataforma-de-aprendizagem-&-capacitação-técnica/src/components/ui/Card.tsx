/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'interactive' | 'flat';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  ...props
}) => {
  const variantStyles = {
    default: 'bg-white border border-slate-200/90 shadow-xs rounded-xl',
    elevated: 'bg-white border border-slate-200/90 shadow-md rounded-xl',
    interactive:
      'bg-white border border-slate-200/90 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all rounded-xl cursor-pointer',
    flat: 'bg-slate-50 border border-slate-200 rounded-xl',
  };

  const paddingStyles = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-6 sm:p-8',
  };

  return (
    <div className={`${variantStyles[variant]} ${paddingStyles[padding]} ${className}`} {...props}>
      {children}
    </div>
  );
};
