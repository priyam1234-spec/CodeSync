import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, Info } from 'lucide-react'

function Toast({ message, type = 'success', onClose }) {
  const icons = {
    success: <Check className="w-4 h-4" />,
    error: <X className="w-4 h-4" />,
    info: <Info className="w-4 h-4" />,
  }

  const colors = {
    success: 'text-green-400',
    error: 'text-red-400',
    info: 'text-blue-400',
  }

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -20, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: -20, x: '-50%' }}
          className="fixed top-6 left-1/2 z-50 bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] px-4 py-3 rounded-lg shadow-2xl flex items-center gap-3 min-w-[300px]"
        >
          <span className={colors[type]}>{icons[type]}</span>
          <span className="text-sm font-medium flex-1">{message}</span>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 hover:bg-[var(--bg-tertiary)] rounded transition-colors"
            >
              <X className="w-4 h-4 text-[var(--text-secondary)]" />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Toast
