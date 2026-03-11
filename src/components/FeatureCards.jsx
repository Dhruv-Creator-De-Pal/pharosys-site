import { motion } from 'framer-motion'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
}

export function FeatureCards({ title, description, cards, id }) {
  return (
    <motion.section
      id={id}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={containerVariants}
      className="py-16 md:py-24 px-4"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div variants={cardVariants} className="mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-light mb-4">{title}</h2>
          <p className="text-text-muted text-base md:text-lg max-w-2xl">
            {description}
          </p>
        </motion.div>

        {/* Card grid */}
        <motion.div
          variants={containerVariants}
          className="grid md:grid-cols-3 gap-5 md:gap-6"
        >
          {cards.map((card, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="card group cursor-pointer"
            >
              {/* Label */}
              <motion.small className="block text-xs font-light uppercase tracking-wider text-text-muted mb-2 group-hover:text-orange transition-colors">
                {card.label}
              </motion.small>

              {/* Title */}
              <h3 className="text-xl font-light mb-2 group-hover:text-orange transition-colors">
                {card.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-text-muted mb-4">
                {card.description}
              </p>

              {/* Optional pills */}
              {card.pills && (
                <motion.div className="flex flex-wrap gap-2">
                  {card.pills.map((pill, j) => (
                    <span key={j} className="chip text-xs">
                      {pill}
                    </span>
                  ))}
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  )
}
