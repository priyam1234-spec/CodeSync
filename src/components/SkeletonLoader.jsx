import { motion } from 'framer-motion'

function SkeletonLoader() {
  return (
    <div className="flex-1 p-6 space-y-4">
      <motion.div
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
        className="h-8 bg-[var(--bg-tertiary)] rounded-lg w-1/3"
      />
      <motion.div
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse', delay: 0.1 }}
        className="h-64 bg-[var(--bg-tertiary)] rounded-lg"
      />
      <div className="flex gap-2">
        <motion.div
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse', delay: 0.2 }}
          className="h-10 bg-[var(--bg-tertiary)] rounded-lg w-24"
        />
        <motion.div
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse', delay: 0.3 }}
          className="h-10 bg-[var(--bg-tertiary)] rounded-lg w-32"
        />
      </div>
    </div>
  )
}

export default SkeletonLoader
