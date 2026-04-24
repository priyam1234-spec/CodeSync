import { motion, AnimatePresence } from 'framer-motion'
import { Terminal, X, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

function ConsolePanel({ output, isOpen, onToggle, onClear }) {
  const [expanded, setExpanded] = useState(true)

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: expanded ? 200 : 48 }}
          exit={{ height: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="border-t border-[var(--border)] bg-[var(--bg-secondary)] flex flex-col"
        >
          {/* Header */}
          <div className="h-12 flex items-center justify-between px-4 border-b border-[var(--border)]">
            <div className="flex items-center gap-3">
              <Terminal className="w-4 h-4 text-[var(--text-secondary)]" />
              <span className="text-sm font-medium text-[var(--text-primary)]">Console</span>
              {output && (
                <span className="text-xs text-[var(--text-secondary)] bg-[var(--bg-tertiary)] px-2 py-0.5 rounded-full">
                  {output.length} lines
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onClear}
                className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                Clear
              </button>
              <button
                onClick={() => setExpanded(!expanded)}
                className="p-1 hover:bg-[var(--bg-tertiary)] rounded transition-colors"
              >
                {expanded ? (
                  <ChevronDown className="w-4 h-4 text-[var(--text-secondary)]" />
                ) : (
                  <ChevronUp className="w-4 h-4 text-[var(--text-secondary)]" />
                )}
              </button>
              <button
                onClick={onToggle}
                className="p-1 hover:bg-[var(--bg-tertiary)] rounded transition-colors"
              >
                <X className="w-4 h-4 text-[var(--text-secondary)]" />
              </button>
            </div>
          </div>

          {/* Content */}
          {expanded && (
            <div className="flex-1 overflow-y-auto p-4 font-mono text-sm">
              {output ? (
                output.map((line, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className="text-[var(--text-secondary)]"
                  >
                    <span className="text-[var(--text-secondary)] opacity-50 mr-3">
                      {String(index + 1).padStart(3, '0')}
                    </span>
                    {line}
                  </motion.div>
                ))
              ) : (
                <div className="text-[var(--text-secondary)] opacity-50 italic">
                  Run your code to see output here...
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ConsolePanel
