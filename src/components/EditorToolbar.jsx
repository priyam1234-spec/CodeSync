import { Save, Share2, Check, Image as ImageIcon, Wand2, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

const LANGUAGES = [
  { value: 'java', label: 'Java' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'cpp', label: 'C++' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
]

function EditorToolbar({ onSave, onCopyLink, onFormatCode, isSaving, isFormatting, title, onTitleChange, onCopyAsImage, language, onLanguageChange, isReadOnly = false }) {
  const [copied, setCopied] = useState(false)

  const handleCopyLink = async () => {
    await onCopyLink()
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSave = () => {
    onSave()
  }

  const [showLangDropdown, setShowLangDropdown] = useState(false)
  const currentLang = LANGUAGES.find(l => l.value === language)?.label || language

  return (
    <div className="h-16 border-b border-[var(--border)] bg-[var(--bg-secondary)] px-6 flex items-center justify-between">
      {/* Left: Title and Language */}
      <div className="flex items-center gap-3 flex-1">
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Untitled Snippet"
          disabled={isReadOnly}
          className="bg-transparent text-[var(--text-primary)] text-lg font-medium border-none outline-none focus:ring-2 focus:ring-[var(--accent)] rounded-lg px-3 py-1.5 w-full max-w-md disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <div className="relative">
          <motion.button
            onClick={() => setShowLangDropdown(!showLangDropdown)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isReadOnly}
            className="flex items-center gap-2 px-3 py-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="capitalize">{currentLang}</span>
            <ChevronDown className="w-3 h-3" />
          </motion.button>
          <AnimatePresence>
            {showLangDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 mt-1 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-lg shadow-xl z-50 overflow-hidden"
              >
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.value}
                    onClick={() => {
                      onLanguageChange(lang.value)
                      setShowLangDropdown(false)
                    }}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-[var(--bg-hover)] transition-colors ${
                      language === lang.value ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)]'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <motion.button
          onClick={onFormatCode}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={isFormatting || isReadOnly}
          className="flex items-center gap-2 px-3 py-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Format Code (Ctrl+F)"
        >
          {isFormatting ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-4 h-4 border-2 border-[var(--text-secondary)]/30 border-t-[var(--text-secondary)] rounded-full"
            />
          ) : (
            <Wand2 className="w-4 h-4" />
          )}
          <span className="text-sm hidden lg:inline">{isFormatting ? 'Formatting...' : 'Format'}</span>
        </motion.button>

        <motion.button
          onClick={onCopyAsImage}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-3 py-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"
          title="Copy as Image"
        >
          <ImageIcon className="w-4 h-4" />
          <span className="text-sm hidden lg:inline">Export Image</span>
        </motion.button>

        <motion.button
          onClick={handleCopyLink}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={isSaving}
          className="flex items-center gap-2 px-3 py-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors disabled:opacity-50"
          title="Share"
        >
          {copied ? (
            <Check className="w-4 h-4 text-[var(--success)]" />
          ) : (
            <>
              <Share2 className="w-4 h-4" />
              <span className="text-sm hidden lg:inline">Share</span>
            </>
          )}
        </motion.button>

        <motion.button
          onClick={handleSave}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={isSaving || isReadOnly}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[var(--accent)]/25"
          title={isReadOnly ? "Only the author can edit this snippet" : "Save"}
        >
          {isSaving ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
            />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{isSaving ? 'Saving...' : 'Save'}</span>
        </motion.button>
      </div>
    </div>
  )
}

export default EditorToolbar
