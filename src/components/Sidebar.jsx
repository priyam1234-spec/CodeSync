import { Clock, Star, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { loadAllSnippets } from '../lib/snippetStorage'
import { isSupabaseConfigured } from '../lib/supabase'

const languageIcons = {
  java: '☕',
  javascript: '📜',
  typescript: '📘',
  python: '🐍',
  cpp: '⚡',
  go: '🔹',
  rust: '🦀',
}

function Sidebar({ isOpen, onSelectSnippet }) {
  const [activeSection, setActiveSection] = useState('recent')
  const [expandedCategory, setExpandedCategory] = useState(null)
  const [snippets, setSnippets] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const usingSupabase = isSupabaseConfigured()

  useEffect(() => {
    loadAllSnippets()
      .then(data => {
        setSnippets(data)
        setIsLoading(false)
      })
      .catch(err => {
        console.error('Failed to load snippets:', err)
        setIsLoading(false)
      })
  }, [])

  const sidebarVariants = {
    open: { x: 0, opacity: 1, display: 'block' },
    closed: { x: -280, opacity: 0, transitionEnd: { display: 'none' } }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          initial="closed"
          animate="open"
          exit="closed"
          variants={sidebarVariants}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="w-72 border-r border-[var(--border)] bg-[var(--bg-secondary)] flex flex-col"
        >
          <div className="flex-1 overflow-y-auto">
            {/* Tabs */}
            <div className="p-4 border-b border-[var(--border)]">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveSection('recent')}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    activeSection === 'recent'
                      ? 'bg-[var(--accent)] text-white'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
                  }`}
                >
                  Recent
                </button>
                <button
                  onClick={() => setActiveSection('saved')}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    activeSection === 'saved'
                      ? 'bg-[var(--accent)] text-white'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
                  }`}
                >
                  Saved
                </button>
              </div>
            </div>


            {/* Snippets List */}
            <div className="p-4">
              {isLoading ? (
                <div className="text-center text-[var(--text-secondary)] text-sm py-8">
                  Loading snippets...
                </div>
              ) : activeSection === 'recent' ? (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[var(--text-secondary)] text-xs uppercase tracking-wider mb-3">
                    <Clock className="w-3 h-3" />
                    Recent Snippets
                  </div>
                  {snippets.length === 0 ? (
                    <div className="text-center text-[var(--text-secondary)] text-sm py-8">
                      No snippets yet. Create one!
                    </div>
                  ) : (
                    snippets.slice(0, 10).map((snippet, index) => (
                      <motion.div
                        key={snippet.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => onSelectSnippet(snippet)}
                        whileHover={{ x: 4 }}
                        className="group flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--bg-tertiary)] cursor-pointer transition-colors"
                      >
                        <span className="text-lg">{languageIcons[snippet.language] || '📄'}</span>
                        <div className="flex-1 text-left">
                          <p className="text-sm text-[var(--text-primary)]">{snippet.title || 'Untitled'}</p>
                          <p className="text-xs text-[var(--text-secondary)] capitalize">{snippet.language}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[var(--text-secondary)] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </motion.div>
                    ))
                  )}
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[var(--text-secondary)] text-xs uppercase tracking-wider mb-3">
                    <Star className="w-3 h-3" />
                    All Snippets
                  </div>
                  {snippets.length === 0 ? (
                    <div className="text-center text-[var(--text-secondary)] text-sm py-8">
                      No saved snippets
                    </div>
                  ) : (
                    snippets.map((snippet, index) => (
                      <motion.div
                        key={snippet.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => onSelectSnippet(snippet)}
                        whileHover={{ x: 4 }}
                        className="group flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--bg-tertiary)] cursor-pointer transition-colors"
                      >
                        <span className="text-lg">{languageIcons[snippet.language] || '📄'}</span>
                        <div className="flex-1 text-left">
                          <p className="text-sm text-[var(--text-primary)]">{snippet.title || 'Untitled'}</p>
                          <p className="text-xs text-[var(--text-secondary)] capitalize">{snippet.language}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[var(--text-secondary)] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </motion.div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}

export default Sidebar
