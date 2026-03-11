import { motion } from 'framer-motion'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

export function MetricsSection() {
  const metrics = [
    { value: '99.95%', label: 'Uptime target' },
    { value: '< 90s', label: 'Warm boot' },
    { value: '0', label: 'Data loss incidents' },
    { value: 'TLS 1.3', label: 'End-to-end' },
  ]

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
      className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-8"
    >
      {metrics.map((metric, i) => (
        <motion.div
          key={i}
          variants={itemVariants}
          className="flex flex-col items-center justify-center p-4 rounded-md transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
          onHoverStart={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255, 107, 26, 0.5)'
          }}
          onHoverEnd={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'
          }}
        >
          <div className="text-2xl md:text-3xl font-light text-orange-accent mb-2">
            {metric.value}
          </div>
          <div className="text-xs text-text-muted text-center uppercase tracking-wider">
            {metric.label}
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}
