import { useState, useCallback, useEffect, useRef } from 'react'
import ThemeSelector from './components/ThemeSelector'
import LZString from 'lz-string'
import prettier from 'prettier/standalone'
import parserBabel from 'prettier/parser-babel'
import parserTypescript from 'prettier/parser-typescript'
import { toPng } from 'html-to-image'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import CodeEditor from './components/CodeEditor'
import EditorToolbar from './components/EditorToolbar'
import Toast from './components/Toast'
import SkeletonLoader from './components/SkeletonLoader'
import { saveSnippet, loadSnippet } from './lib/snippetStorage'
import { motion, AnimatePresence } from 'framer-motion'

const LANGUAGE_PATTERNS = {
  java: [/public\s+class/, /public\s+static\s+void\s+main/, /System\.out\.println/, /import\s+java\./],
  javascript: [/const\s+\w+\s*=/, /let\s+\w+\s*=/, /function\s*\w*\s*\(/, /=>\s*{/, /console\.log/],
  typescript: [/interface\s+\w+/, /type\s+\w+\s*=/, /:\s*(string|number|boolean|any)\b/, /<T>/],
  python: [/def\s+\w+\s*\(/, /import\s+\w+/, /from\s+\w+\s+import/, /print\s*\(/, /class\s+\w+:/],
  cpp: [/#include\s*</, /std::/, /cout\s*<</, /int\s+main\s*\(/],
  go: [/func\s+\w+\s*\(/, /package\s+main/, /fmt\.Print/, /var\s+\w+/],
  rust: [/fn\s+\w+\s*\(/, /let\s+mut/, /println!/, /impl\s+/],
}

function autoDetectLanguage(code) {
  const scores = {}
  for (const [lang, patterns] of Object.entries(LANGUAGE_PATTERNS)) {
    scores[lang] = patterns.filter(pattern => pattern.test(code)).length
  }
  const bestMatch = Object.entries(scores).reduce((a, b) => b[1] > a[1] ? b : a, ['java', 0])
  return bestMatch[1] > 0 ? bestMatch[0] : null
}

function estimateReadingTime(code) {
  const words = code.trim().split(/\s+/).length
  const wordsPerMinute = 200
  const minutes = Math.ceil(words / wordsPerMinute)
  if (minutes < 1) return '< 1 min'
  return `${minutes} min read`
}

async function formatCode(code, language) {
  const parserMap = {
    javascript: 'babel',
    typescript: 'typescript',
    json: 'json',
    css: 'css',
    html: 'html',
    markdown: 'markdown',
  }
  const parser = parserMap[language] || 'babel'

  try {
    return await prettier.format(code, {
      parser,
      plugins: { parsers: { babel: parserBabel, typescript: parserTypescript } },
      semi: true,
      singleQuote: true,
      tabWidth: 2,
      printWidth: 100,
    })
  } catch {
    return code
  }
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [code, setCode] = useState('// Write your code here...\n\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, CodeSync!");\n    }\n}')
  const [language, setLanguage] = useState('java')
  const [title, setTitle] = useState('Untitled Snippet')
  const [snippetId, setSnippetId] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [showMetadata, setShowMetadata] = useState(true)
  const [isFormatting, setIsFormatting] = useState(false)
  const [theme, setTheme] = useState(() => localStorage.getItem('codesync-theme') || 'midnight')
  const editorRef = useRef(null)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('codesync-theme', theme)

    // Update favicon color based on theme
    const faviconColors = {
      midnight: '#7199FF',
      cyberpunk: '#FF007F',
      nordic: '#88C0D0',
      hacker: '#00FF41',
      paperback: '#944421',
    }
    const color = faviconColors[theme]
    const favicon = document.querySelector("link[rel='icon']")
    if (favicon) {
      const newFavicon = favicon.cloneNode(true)
      newFavicon.href = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='48' height='46' viewBox='0 0 48 46'><path fill='${encodeURIComponent(color)}' d='M25.946 44.938c-.664.845-2.021.375-2.021-.698V33.937a2.26 2.26 0 0 0-2.262-2.262H10.287c-.92 0-1.456-1.04-.92-1.788l7.48-10.471c1.07-1.497 0-3.578-1.842-3.578H1.237c-.92 0-1.456-1.04-.92-1.788L10.013.474c.214-.297.556-.474.92-.474h28.894c.92 0 1.456 1.04.92 1.788l-7.48 10.471c-1.07 1.498 0 3.579 1.842 3.579h11.377c.943 0 1.473 1.088.89 1.83L25.947 44.94z'/></svg>`
      favicon.parentNode.replaceChild(newFavicon, favicon)
    }
  }, [theme])

const handleSave = useCallback(async () => {
  setIsSaving(true);
  try {
    const saved = await saveSnippet({ 
      title, 
      code, 
      language, 
      id: currentId 
    });
    
    setCurrentId(saved.id);
    setToast({ message: 'Saved successfully!', type: 'success' });
    
    // Update URL if it's a new save
    if (!window.location.pathname.includes(saved.id)) {
      window.history.pushState({}, '', `/s/${saved.id}`);
    }
  } catch (err) {
    // This catches the "Ownership" error we threw in snippetStorage.js
    setToast({ 
      message: err.message || 'Failed to save snippet', 
      type: 'error' 
    });
    console.error("Save error:", err);
  } finally {
    setIsSaving(false);
  }
}, [code, language, title, currentId]);

  const handleCopyLink = useCallback(async () => {
    if (snippetId) {
      const shortUrl = `${window.location.origin}/?id=${snippetId}`
      await navigator.clipboard.writeText(shortUrl)
      setToast({ message: 'Short link copied!', type: 'success' })
    } else {
      setToast({ message: 'Save first to get a short link', type: 'info' })
    }
  }, [snippetId])

  const handleCopyAsImage = useCallback(async () => {
    setToast({ message: 'Generating image...', type: 'info' })
    try {
      const editorElement = document.querySelector('.monaco-editor')
      if (!editorElement) throw new Error('Editor not found')

      const dataUrl = await toPng(editorElement, {
        backgroundColor: '#1e1e1e',
        quality: 1.0,
        pixelRatio: 2,
      })

      const blob = await (await fetch(dataUrl)).blob()
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob })
      ])
      setToast({ message: 'Image copied to clipboard!', type: 'success' })
    } catch (err) {
      console.error('Export failed:', err)
      setToast({ message: 'Failed to export image', type: 'error' })
    }
  }, [])

  const handleNewSnippet = useCallback(() => {
    setCode('// Write your code here...\n')
    setTitle('Untitled Snippet')
    setLanguage('java')
  }, [])

  const handleSelectSnippet = useCallback(async (snippet) => {
    setIsLoading(true)
    try {
      const loaded = await loadSnippet(snippet.id)
      if (loaded) {
        setCode(loaded.code)
        setTitle(loaded.title)
        setLanguage(loaded.language)
      } else {
        setCode(snippet.code || '// Snippet content')
        setTitle(snippet.title || snippet.name)
        setLanguage(snippet.language)
      }
    } catch (err) {
      console.error('Failed to load snippet:', err)
      setToast({ message: 'Failed to load snippet', type: 'error' })
    }
    setIsLoading(false)
  }, [])

  const handleFormatCode = useCallback(async () => {
    setIsFormatting(true)
    try {
      const formatted = await formatCode(code, language)
      setCode(formatted)
      setToast({ message: 'Code formatted!', type: 'success' })
    } catch (err) {
      setToast({ message: 'Format failed - check syntax', type: 'error' })
    }
    setIsFormatting(false)
  }, [code, language])

  const handleLanguageChange = useCallback((newLang) => {
    setLanguage(newLang)
  }, [])

  const handleCodeChange = useCallback((newCode) => {
    setCode(newCode)
    const detected = autoDetectLanguage(newCode)
    if (detected && detected !== language) {
      setLanguage(detected)
    }
  }, [language])

  // Load snippet from URL query param (?id=uuid) on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const id = params.get('id')
    if (id) {
      setIsLoading(true)
      loadSnippet(id)
        .then(data => {
          if (data) {
            setCode(data.code)
            setTitle(data.title)
            setLanguage(data.language)
            setSnippetId(data.id)
            setToast({ message: 'Snippet loaded', type: 'success' })
          }
        })
        .catch(err => {
          console.error('Failed to load snippet:', err)
          setToast({ message: 'Failed to load snippet', type: 'error' })
        })
        .finally(() => setIsLoading(false))
    }
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        handleSave()
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault()
        handleFormatCode()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleSave, handleFormatCode])

  const lineCount = code.split('\n').length
  const charCount = code.length
  const readingTime = estimateReadingTime(code)

  return (
    <div className="flex flex-col h-screen bg-[var(--bg-primary)]">
      <Header
        onNewSnippet={handleNewSnippet}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        currentTheme={theme}
        onThemeChange={setTheme}
      />

      <div className="flex-1 flex min-h-0">
        <Sidebar
          isOpen={sidebarOpen}
          onSelectSnippet={handleSelectSnippet}
        />

        <main className="flex-1 flex flex-col min-w-0">
          <EditorToolbar
            onSave={handleSave}
            onCopyLink={handleCopyLink}
            onFormatCode={handleFormatCode}
            onCopyAsImage={handleCopyAsImage}
            isSaving={isSaving}
            isFormatting={isFormatting}
            title={title}
            onTitleChange={setTitle}
            language={language}
            onLanguageChange={handleLanguageChange}
          />

          {isLoading ? (
            <SkeletonLoader />
          ) : (
            <motion.div
              className="flex-1 flex flex-col min-h-0 p-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <CodeEditor
                ref={editorRef}
                code={code}
                setCode={handleCodeChange}
                language={language}
                setLanguage={handleLanguageChange}
              />
            </motion.div>
          )}

          <AnimatePresence>
            {showMetadata && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="border-t border-[var(--border-primary)] bg-[var(--bg-secondary)] px-4 py-2"
              >
              <div className="flex items-center justify-between text-sm text-[var(--text-muted)]">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {lineCount} lines
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                    {charCount} chars
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {readingTime}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] text-xs">
                    #{language}
                  </span>
                </div>
                <button
                  onClick={() => setShowMetadata(false)}
                  className="hover:text-[var(--text-primary)] transition-colors"
                  title="Hide metadata"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </motion.div>
          )}
          </AnimatePresence>
        </main>
      </div>

      {!showMetadata && (
        <button
          onClick={() => setShowMetadata(true)}
          className="absolute bottom-4 right-4 p-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          title="Show metadata"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      )}

      <Toast
        message={toast?.message}
        type={toast?.type}
        onClose={() => setToast(null)}
      />
    </div>
  )
}
console.log("Supabase URL:", import.meta.env.VITE_SUPABASE_URL);
export default App
