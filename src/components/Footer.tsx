import React from 'react';
import { ScreenType } from '../types';
import { brandConfig } from '../config/brand';
import { ShieldCheck } from 'lucide-react';

interface FooterProps {
  onNavigate: (screen: ScreenType) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="site-footer no-print border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 py-8 px-6 mt-16">
      <div className="footer-container">
        <div className="footer-col brand-col">
          <div className="footer-brand">
            <span className="brand-dot-pulse"></span>
            <strong>{brandConfig.productName}</strong> • {brandConfig.shortName}
          </div>
          <p className="footer-desc">
            {brandConfig.footerDisclaimer}
          </p>
          <div className="footer-badge">
            <ShieldCheck size={16} />
            <span>{brandConfig.heroBadge}</span>
          </div>
        </div>

        <div className="footer-col">
          <div className="footer-col-title">Trilha de Aprendizado</div>
          <ul className="footer-links">
            <li><button onClick={() => onNavigate('roteiro')}>Roteiro de Integração (PDF)</button></li>
            <li><button onClick={() => onNavigate('modulo-git')}>Git & GitLab Flow</button></li>
            <li><button onClick={() => onNavigate('modulo-sql')}>Bancos de Dados & SQL</button></li>
            <li><button onClick={() => onNavigate('modulo-backend')}>Back-end NestJS (SISMOB)</button></li>
            <li><button onClick={() => onNavigate('modulo-frontend')}>Front-end React & Vite</button></li>
          </ul>
        </div>

        <div className="footer-col">
          <div className="footer-col-title">Avaliação & Prática</div>
          <ul className="footer-links">
            <li><button onClick={() => onNavigate('quizzes')}>Central de Quizzes Segmentados</button></li>
            <li><button onClick={() => onNavigate('desafio-sql')}>Desafio Prático SQL (25 Questões)</button></li>
            <li><button onClick={() => onNavigate('modulo-gabarito')}>Gabarito Oficial Comentado</button></li>
            <li><button onClick={() => onNavigate('desafio-backend')}>Desafio Back-end (APIs de Linhas)</button></li>
            <li><button onClick={() => onNavigate('desafio-frontend')}>Desafio Front-end (Submódulos SCL & InfoÔnibus)</button></li>
          </ul>
        </div>

        <div className="footer-col">
          <div className="footer-col-title">Ecossistema & Governança</div>
          <div className="stack-tags">
            <span className="tag">NestJS</span>
            <span className="tag">React 18</span>
            <span className="tag">TypeScript</span>
            <span className="tag">PostgreSQL 15</span>
            <span className="tag">PostGIS</span>
            <span className="tag">Docker</span>
            <span className="tag">CI/CD</span>
            <span className="tag">Capacitor</span>
            <span className="tag">Clean Arch</span>
          </div>
          <p className="footer-micro">
            "A branch principal é sagrada. Nunca comitamos direto na main."
          </p>
        </div>
      </div>

      <div className="footer-bottom mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500 dark:text-slate-400">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200">
              {brandConfig.productName} &copy; {new Date().getFullYear()} — {brandConfig.organizationName}
            </p>
            <p className="text-xs mt-1">{brandConfig.footerDisclaimer}</p>
          </div>
          <div className="flex items-center gap-2 text-xs bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{brandConfig.tagline}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
