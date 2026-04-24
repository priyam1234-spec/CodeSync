import Editor from '@monaco-editor/react'
import { useState } from 'react'

const languageOptions = [
  { value: 'java', label: 'Java', icon: '🍵' },
  { value: 'python', label: 'Python', icon: '🐍' },
  { value: 'javascript', label: 'JavaScript', icon: '📜' },
  { value: 'typescript', label: 'TypeScript', icon: '📘' },
  { value: 'go', label: 'Go', icon: '🔹' },
  { value: 'rust', label: 'Rust', icon: '🦀' },
  { value: 'cpp', label: 'C++', icon: '⚡' },
]

function CodeEditor({ code, setCode, language, setLanguage, isReadOnly = false }) {
  const [editorInstance, setEditorInstance] = useState(null)

  const handleEditorMount = (editor) => {
    setEditorInstance(editor)
    editor.focus()
  }

  const selectedLanguage = languageOptions.find(l => l.value === language)

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="h-12 border-b border-[var(--border)] bg-[var(--bg-secondary)] px-4 flex items-center gap-4">
        <label className="text-sm text-[var(--text-secondary)]">Language:</label>
        <div className="relative">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            disabled={isReadOnly}
            className="bg-[var(--bg-tertiary)] text-[var(--text-primary)] border border-[var(--border)] rounded-lg pl-8 pr-8 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {languageOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-lg pointer-events-none">
            {selectedLanguage?.icon}
          </span>
        </div>
      </div>
      <div className="flex-1 min-h-0 relative border border-[var(--border)] rounded-lg overflow-hidden">
        <Editor
          height="100%"
          language={language}
          value={code}
          onChange={(value) => setCode(value || '')}
          onMount={handleEditorMount}
          theme="vs-dark"
          options={{
            readOnly: isReadOnly,
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 16, bottom: 16 },
            renderWhitespace: 'selection',
            fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
            fontLigatures: true,
            roundedSelection: true,
            cursorBlinking: 'smooth',
            smoothScrolling: true,
            contextmenu: true,
            quickSuggestions: true,
            suggestOnTriggerCharacters: true,
            tabSize: 2,
          }}
        />
      </div>
    </div>
  )
}

export default CodeEditor
