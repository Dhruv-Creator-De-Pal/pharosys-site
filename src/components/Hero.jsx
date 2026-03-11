import { motion } from 'framer-motion'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
}

export function Hero() {
  const handleLaunchDemo = () => {
    window.location.href = 'mailto:dits.contactus@gmail.com?subject=Launch%20Demo'
  }

  const handleSecurityProfile = () => {
    window.location.href = '#security'
  }

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={containerVariants}
      className="py-16 md:py-24 px-4"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left column - Text */}
          <motion.div variants={containerVariants} className="space-y-6">
            {/* Eyebrow */}
            <motion.div variants={itemVariants} className="flex items-center gap-2 w-fit">
              <span className="inline-flex items-center gap-2.5 px-3 py-2 border border-border rounded-full text-xs md:text-sm" style={{ background: 'rgba(255, 255, 255, 0.06)' }}>
                <span className="inline-block px-2 py-1 text-orange border rounded-full font-light text-xs" style={{ background: 'rgba(255, 107, 26, 0.16)', borderColor: 'rgba(255, 107, 26, 0.4)' }}>
                  BOOT SAFE
                </span>
                <span className="text-text-muted">
                  Built for operations that must stay online — even when the internet is not.
                </span>
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl lg:text-6xl font-light leading-tight">
              Offline-first operations platform for any business.
            </motion.h1>

            {/* Subheader */}
            <motion.p variants={itemVariants} className="text-base md:text-lg text-text-muted max-w-2xl leading-relaxed">
              Pharosys keeps transactions, data, operations, and workflows running locally and securely. When the network comes back, everything syncs automatically with no data loss.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-3 pt-2">
              <button className="btn btn-primary" onClick={handleLaunchDemo}>Launch demo</button>
              <button className="btn btn-ghost" onClick={handleSecurityProfile}>See security profile</button>
            </motion.div>

            {/* Feature pills */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-2 pt-4">
              {[
                { text: 'Local-first cache', status: true },
                { text: 'Auto-resync', status: 'sync' },
                { text: 'TLS 1.3 + HSTS', status: false },
                { text: 'Zero tracking', status: false },
              ].map((feat, i) => (
                <motion.span key={i} className="chip" whileHover={{ scale: 1.05 }}>
                  {feat.status && <span className={feat.status === true ? 'text-green-400' : 'text-yellow-400'}>●</span>} {feat.text}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>

          {/* Right column - Dashboard Card */}
          <motion.div variants={itemVariants} className="relative">
            <motion.div className="card" whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }} style={{ borderWidth: '2px', borderColor: 'rgba(91, 225, 255, 0.2)' }}>
              {/* Dashboard mockup */}
              <div className="space-y-3 font-mono text-xs">
                {[
                  { label: 'Node status', value: 'Synced · green', ok: true },
                  { label: 'Local queue', value: 'Queued (3)', ok: false },
                  { label: 'Access control', value: 'Offline approved', ok: false },
                ].map((row, i) => (
                  <motion.div key={i} className="flex justify-between text-text-muted" initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}>
                    <span>{row.label}</span>
                    <span className={row.ok ? 'text-green-400 font-light' : 'text-yellow-400 font-light'}>
                      {row.value}
                    </span>
                  </motion.div>
                ))}

                {/* Console output */}
                <motion.pre className="rounded text-cyan text-xs mt-3 overflow-auto max-h-40" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.3 }} viewport={{ once: true }} style={{ background: 'rgba(0, 0, 0, 0.4)', border: '1px solid rgba(255, 255, 255, 0.06)', padding: '12px' }}>
{`> boot seq ... ok
> local db ... mounted
> cache sync ... queued (3)
> uplink ... re-establishing
> members ... verified
> doors ... unlocked`}
                </motion.pre>
              </div>

              {/* Glow effect */}
              <motion.div className="absolute -inset-6 rounded-2xl -z-10 blur-2xl" animate={{ opacity: [0.5, 0.8, 0.5] }} transition={{ duration: 3, repeat: Infinity }} style={{ background: 'linear-gradient(to right, rgba(91, 225, 255, 0), rgba(91, 225, 255, 0.1), rgba(91, 225, 255, 0))' }} />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}
