import { useEffect } from 'react'

function useKeyboardShortcuts(shortcuts) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = []
      if (e.ctrlKey || e.metaKey) key.push('mod')
      if (e.shiftKey) key.push('shift')
      if (e.altKey) key.push('alt')
      key.push(e.key.toLowerCase())

      const shortcutKey = key.join('+')
      if (shortcuts[shortcutKey]) {
        e.preventDefault()
        shortcuts[shortcutKey]()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [shortcuts])
}

export default useKeyboardShortcuts
