import { motion } from 'framer-motion'

export function CTA() {
  const handleStartPilot = () => {
    window.location.href = 'mailto:dits.contactus@gmail.com?subject=Start%20Pharosys%20Pilot'
  }

  const handleEmailTeam = () => {
    window.location.href = 'mailto:dits.contactus@gmail.com'
  }

  return (
    <motion.section
      id="contact"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true, margin: '-100px' }}
      className="py-16 md:py-24 px-4"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="p-8 md:p-12 rounded-2xl border shadow-glow-accent text-center"
          style={{
            background: 'linear-gradient(to right, rgba(91, 225, 255, 0.14), rgba(255, 122, 61, 0.18))',
            borderColor: 'rgba(255, 255, 255, 0.14)',
          }}
        >
          <h3 className="text-2xl md:text-3xl font-light mb-3">
            Ready to deploy Pharosys?
          </h3>
          <p className="text-text-muted mb-6 max-w-2xl mx-auto">
            Get a guided walkthrough of the offline-first operations platform and see how we
            keep your business running live even when the internet drops.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button className="btn btn-primary" onClick={handleStartPilot}>Start a pilot</button>
            <button className="btn btn-ghost" onClick={handleEmailTeam}>Email the team</button>
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
}
