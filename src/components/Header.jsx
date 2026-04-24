import { Plus, Code2, Menu, Lock } from 'lucide-react'
import { motion } from 'framer-motion'
import ThemeSelector from './ThemeSelector'

function Header({ onNewSnippet, onToggleSidebar, currentTheme, onThemeChange, currentId = null, isReadOnly = false }) {

  return (
    <header className="h-16 border-b border-[var(--border)] px-6 flex items-center justify-between bg-[var(--bg-secondary)]">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <motion.button
          onClick={onToggleSidebar}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors lg:hidden"
        >
          <Menu className="w-5 h-5 text-[var(--text-secondary)]" />
        </motion.button>
        
        <motion.div
          initial={{ rotate: -10 }}
          animate={{ rotate: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-3"
        >
          <Code2 className="w-8 h-8 text-[var(--accent)]" />
          <h1 className="text-xl font-semibold text-[var(--text-primary)] hidden sm:block">
            CodeSync
          </h1>
        </motion.div>

        <div className="hidden lg:flex items-center gap-4 ml-2">
          <div className="h-4 w-[1px] bg-[var(--border)]" />
          <span className="text-sm text-[var(--text-muted)]">
            Made with ❤️ by Priyam
          </span>

          {/* Read-Only Badge */}
          {isReadOnly && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-xs font-medium"
            >
              <Lock className="w-3 h-3" />
              <span>Read Only</span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        <ThemeSelector currentTheme={currentTheme} onThemeChange={onThemeChange} />
        
        <motion.a
          href="https://github.com/priyam1234-spec"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-3 py-2 hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"
          aria-label="GitHub"
        >
          <svg className="w-5 h-5 text-[var(--text-secondary)]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          <span className="text-sm text-[var(--text-secondary)] hidden md:inline">GitHub</span>
        </motion.a>

        <motion.button
          onClick={onNewSnippet}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Snippet</span>
        </motion.button>
      </div>
    </header>
  )
}

export default Header
