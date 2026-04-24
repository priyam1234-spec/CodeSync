import { useState, useEffect } from 'react'
import { Palette, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const themes = [
  { id: 'midnight', name: 'Midnight Pro', color: '#7199FF' },
  { id: 'cyberpunk', name: 'Cyberpunk', color: '#FF007F' },
  { id: 'nordic', name: 'Nordic Frost', color: '#88C0D0' },
  { id: 'hacker', name: 'Hacker Green', color: '#00FF41' },
  { id: 'paperback', name: 'Paperback', color: '#944421' },
]

function ThemeSelector({ currentTheme, onThemeChange }) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleClickOutside = () => setIsOpen(false)
    if (isOpen) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [isOpen])

  const handleSelect = (themeId, e) => {
    e.stopPropagation()
    onThemeChange(themeId)
    setIsOpen(false)
  }

  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"
        aria-label="Change theme"
      >
        <Palette className="w-5 h-5 text-[var(--text-secondary)]" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            onClick={(e) => e.stopPropagation()}
            className="absolute right-0 top-full mt-2 py-2 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg shadow-lg z-50 min-w-[180px]"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
          >
            <div className="px-3 py-2 text-xs font-medium text-[var(--text-secondary)] border-b border-[var(--border)]">
              Select Theme
            </div>
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={(e) => handleSelect(theme.id, e)}
                className="w-full px-3 py-2.5 text-left text-sm hover:bg-[var(--bg-tertiary)] transition-colors flex items-center gap-3"
              >
                <span
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: theme.color }}
                />
                <span className={currentTheme === theme.id ? 'text-[var(--accent)] font-medium' : 'text-[var(--text-primary)]'}>
                  {theme.name}
                </span>
                {currentTheme === theme.id && (
                  <Check className="w-4 h-4 ml-auto text-[var(--accent)]" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ThemeSelector
