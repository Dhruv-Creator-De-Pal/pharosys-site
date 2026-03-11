import { motion } from 'framer-motion'

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="py-12 px-4 border-t border-border text-text-muted text-xs text-center"
    >
      <div className="max-w-6xl mx-auto">
        <p>
          Pharosys — Offline-first operations platform. No trackers. Secure by default.
        </p>
      </div>
    </motion.footer>
  )
}
