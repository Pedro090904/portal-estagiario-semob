import React, { useState } from 'react';
import { Copy, Check, Code } from 'lucide-react';

interface MarkdownViewerProps {
  content?: string;
  codeSnippet?: {
    language: string;
    code: string;
    filename?: string;
  };
}

export const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ content, codeSnippet }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = (codeText: string) => {
    navigator.clipboard.writeText(codeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 text-slate-800 dark:text-slate-200">
      {/* Code Snippet Block (if present) */}
      {codeSnippet && (
        <div className="rounded-xl overflow-hidden border border-slate-700/80 bg-slate-950 shadow-md">
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs text-slate-400 font-mono">
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4 text-indigo-400" />
              <span>{codeSnippet.filename || `snippet.${codeSnippet.language}`}</span>
            </div>
            <button
              onClick={() => handleCopyCode(codeSnippet.code)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Copiar código para a área de transferência"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[11px] text-emerald-400">Copiado</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span className="text-[11px]">Copiar</span>
                </>
              )}
            </button>
          </div>
          <pre className="p-4 text-xs sm:text-sm font-mono text-emerald-400 dark:text-emerald-300 overflow-x-auto leading-relaxed">
            <code>{codeSnippet.code}</code>
          </pre>
        </div>
      )}

      {/* Structured Text Content */}
      {content && (
        <div className="prose dark:prose-invert max-w-none text-sm sm:text-base leading-relaxed space-y-4">
          {content.split('\n\n').map((paragraph, idx) => {
            if (paragraph.startsWith('### ')) {
              return (
                <h3
                  key={idx}
                  className="text-lg font-bold text-slate-900 dark:text-white pt-2 border-b border-slate-100 dark:border-slate-800 pb-1"
                >
                  {paragraph.replace('### ', '')}
                </h3>
              );
            }
            if (paragraph.startsWith('#### ')) {
              return (
                <h4 key={idx} className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  {paragraph.replace('#### ', '')}
                </h4>
              );
            }
            if (paragraph.startsWith('```')) {
              const lines = paragraph.split('\n');
              const language = lines[0].replace('```', '') || 'text';
              const codeBody = lines.slice(1, -1).join('\n');
              return (
                <div key={idx} className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 my-4 shadow-sm">
                  <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-[11px] font-mono text-slate-400">
                    <span>{language}</span>
                    <button
                      onClick={() => handleCopyCode(codeBody)}
                      className="hover:text-white transition-colors"
                    >
                      Copiar
                    </button>
                  </div>
                  <pre className="p-4 text-xs font-mono text-indigo-300 overflow-x-auto">
                    <code>{codeBody}</code>
                  </pre>
                </div>
              );
            }
            return (
              <p key={idx} className="text-slate-700 dark:text-slate-300">
                {paragraph}
              </p>
            );
          })}
        </div>
      )}
    </div>
  );
};
