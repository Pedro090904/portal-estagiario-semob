import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, 
  Save, 
  Copy, 
  Download, 
  Trash2, 
  Check, 
  Terminal, 
  BookMarked, 
  ListTodo, 
  Code2, 
  Sparkles,
  Info
} from 'lucide-react';
import { ModuleMetadata } from '../types';

interface ModuleNotesPanelProps {
  module: ModuleMetadata;
  initialNotes?: string;
  onSaveNotes: (notes: string) => void;
  isSplitView?: boolean;
}

export const ModuleNotesPanel: React.FC<ModuleNotesPanelProps> = ({
  module,
  initialNotes = '',
  onSaveNotes,
  isSplitView = false,
}) => {
  const [notes, setNotes] = useState<string>(initialNotes);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'idle'>('saved');
  const [lastSavedTime, setLastSavedTime] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [useMonospace, setUseMonospace] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sincroniza estado inicial se mudar de módulo
  useEffect(() => {
    setNotes(initialNotes);
    setSaveStatus('saved');
    const now = new Date();
    setLastSavedTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  }, [module.id, initialNotes]);

  // Debounced auto-save (800ms)
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setNotes(val);
    setSaveStatus('saving');

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      onSaveNotes(val);
      setSaveStatus('saved');
      const now = new Date();
      setLastSavedTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 800);
  };

  // Inserção de templates / snippets rápidos
  const insertSnippet = (snippet: string) => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = notes;
    const before = text.substring(0, start);
    const after = text.substring(end);
    const newText = `${before}${before.length > 0 && !before.endsWith('\n') ? '\n' : ''}${snippet}\n${after}`;
    
    setNotes(newText);
    onSaveNotes(newText);
    setSaveStatus('saved');
    const now = new Date();
    setLastSavedTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

    setTimeout(() => {
      textarea.focus();
      const cursorPosition = start + snippet.length + 1;
      textarea.setSelectionRange(cursorPosition, cursorPosition);
    }, 50);
  };

  const handleCopyNotes = () => {
    if (!notes.trim()) return;
    navigator.clipboard.writeText(notes);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    if (!notes.trim()) return;
    const blob = new Blob([
      `# Anotações de Estágio SEMOB-DF\n` +
      `**Módulo:** ${module.title}\n` +
      `**Data:** ${new Date().toLocaleDateString('pt-BR')}\n\n` +
      `---\n\n` +
      notes
    ], { type: 'text/markdown;charset=utf-8' });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `anotacoes-semob-${module.id}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearNotes = () => {
    if (!notes.trim()) return;
    const confirmClear = window.confirm('Deseja realmente limpar as anotações deste módulo?');
    if (confirmClear) {
      setNotes('');
      onSaveNotes('');
      setSaveStatus('saved');
    }
  };

  const wordCount = notes.trim() ? notes.trim().split(/\s+/).length : 0;
  const charCount = notes.length;

  return (
    <div className={`module-notes-container ${isSplitView ? 'is-split-view' : ''}`}>
      {/* Header do Bloco de Notas */}
      <div className="notes-header">
        <div className="notes-header-left">
          <div className="notes-badge-icon">
            <FileText size={18} className="text-primary" />
          </div>
          <div>
            <h3 className="notes-title">Caderno de Notas Técnicas</h3>
            <p className="notes-subtitle">Anotações pessoais salvas para: <strong>{module.shortTitle}</strong></p>
          </div>
        </div>

        <div className="notes-header-actions">
          {/* Status de Salvamento */}
          <div className="notes-save-indicator" title="Persistência contínua em LocalStorage">
            {saveStatus === 'saving' ? (
              <span className="save-status-saving">
                <span className="saving-spinner"></span>
                <span>Salvando...</span>
              </span>
            ) : (
              <span className="save-status-saved">
                <Check size={14} className="text-emerald" />
                <span>Salvo {lastSavedTime ? `às ${lastSavedTime}` : ''}</span>
              </span>
            )}
          </div>

          {/* Toggle Fonte Monospace */}
          <button
            type="button"
            onClick={() => setUseMonospace(!useMonospace)}
            className={`notes-btn-tool ${useMonospace ? 'active' : ''}`}
            title={useMonospace ? 'Mudar para fonte padrão' : 'Mudar para fonte mono (código)'}
          >
            <Code2 size={15} />
            <span className="btn-label-text">Mono</span>
          </button>

          {/* Copiar Tudo */}
          <button
            type="button"
            onClick={handleCopyNotes}
            disabled={!notes.trim()}
            className="notes-btn-tool"
            title="Copiar todas as anotações para a área de transferência"
          >
            {copied ? <Check size={15} className="text-emerald" /> : <Copy size={15} />}
            <span className="btn-label-text">{copied ? 'Copiado!' : 'Copiar'}</span>
          </button>

          {/* Baixar .md */}
          <button
            type="button"
            onClick={handleDownloadMarkdown}
            disabled={!notes.trim()}
            className="notes-btn-tool"
            title="Exportar anotações em arquivo Markdown (.md)"
          >
            <Download size={15} />
            <span className="btn-label-text">Baixar .md</span>
          </button>

          {/* Limpar */}
          {notes.trim() && (
            <button
              type="button"
              onClick={handleClearNotes}
              className="notes-btn-tool text-danger"
              title="Apagar anotações deste módulo"
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Barra de Snippets e Templates Rápidos */}
      <div className="notes-quick-toolbar">
        <span className="quick-toolbar-label">
          <Sparkles size={13} className="text-amber" />
          <span>Inserir Rápido:</span>
        </span>

        <button
          type="button"
          onClick={() => insertSnippet('```bash\n# Comando útil SUTINF:\n\n```')}
          className="snippet-tag-btn"
          title="Inserir bloco de terminal bash"
        >
          <Terminal size={12} />
          <span>Comando Bash</span>
        </button>

        <button
          type="button"
          onClick={() => insertSnippet('> **📌 Regra de Negócio SEMOB:**\n> ')}
          className="snippet-tag-btn"
          title="Inserir bloco de regra institucional"
        >
          <BookMarked size={12} />
          <span>Regra SEMOB</span>
        </button>

        <button
          type="button"
          onClick={() => insertSnippet('- [ ] Dúvida para tirar com supervisor:\n- [ ] Testar no ambiente local')}
          className="snippet-tag-btn"
          title="Inserir lista de pendências"
        >
          <ListTodo size={12} />
          <span>Checklist</span>
        </button>

        <button
          type="button"
          onClick={() => insertSnippet('```sql\n-- Consulta de apoio:\nSELECT * FROM \n```')}
          className="snippet-tag-btn"
          title="Inserir bloco de código SQL/NestJS"
        >
          <Code2 size={12} />
          <span>Query SQL</span>
        </button>
      </div>

      {/* Área de Edição */}
      <div className="notes-editor-wrapper">
        <textarea
          ref={textareaRef}
          value={notes}
          onChange={handleNotesChange}
          placeholder={`Escreva aqui suas anotações pessoais sobre ${module.shortTitle}...\n\nExemplos de uso:\n• Comandos de terminal que você precisou rodar;\n• Regras e tabelas do banco de dados (ex: dados_mobilidade);\n• Dúvidas que quer tirar com seu supervisor na SUTINF;\n• Lembretes e atalhos para os testes do Quiz.`}
          className={`notes-textarea ${useMonospace ? 'font-mono' : ''}`}
          rows={isSplitView ? 18 : 12}
        />
      </div>

      {/* Rodapé do Bloco de Notas com Estatísticas e Dica */}
      <div className="notes-footer">
        <div className="notes-hint">
          <Info size={13} className="text-primary" />
          <span>Suas anotações são salvas localmente no navegador e preservadas entre sessões.</span>
        </div>

        <div className="notes-stats">
          <span>{wordCount} palavras</span>
          <span className="stats-dot">·</span>
          <span>{charCount} caracteres</span>
        </div>
      </div>
    </div>
  );
};
