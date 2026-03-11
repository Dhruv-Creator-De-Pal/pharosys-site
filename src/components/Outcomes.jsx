import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

export function Outcomes() {
  const marqueeRef = useRef(null)
  const pillRefs = useRef([])
  const activeIndexRef = useRef(0)
  const [activeIndex, setActiveIndex] = useState(0)
  const buzzWords = [
    'Automation',
    'AI Ops',
    'MLOps',
    'Infra-as-Code',
    'Observability',
    'Platform Engineering',
    'Resilience',
    'Latency < 50ms',
  ]

  // Track which pill is closest to the center of the marquee
  useEffect(() => {
    let rafId
    const measure = () => {
      const container = marqueeRef.current
      if (!container) {
        rafId = requestAnimationFrame(measure)
        return
      }

      const centerX = container.getBoundingClientRect().left + container.offsetWidth / 2
      let closestBaseIdx = activeIndexRef.current
      let minDist = Infinity

      pillRefs.current.forEach((el, idx) => {
        if (!el) return
        const rect = el.getBoundingClientRect()
        const pillCenter = rect.left + rect.width / 2
        const dist = Math.abs(pillCenter - centerX)
        if (dist < minDist) {
          minDist = dist
          closestBaseIdx = idx % buzzWords.length
        }
      })

      if (closestBaseIdx !== activeIndexRef.current) {
        activeIndexRef.current = closestBaseIdx
        setActiveIndex(closestBaseIdx)
      }
      rafId = requestAnimationFrame(measure)
    }

    rafId = requestAnimationFrame(measure)
    return () => cancelAnimationFrame(rafId)
  }, [buzzWords.length])

  return (
    <section
      className="relative min-h-screen max-h-screen overflow-hidden flex items-center px-4 md:px-10 py-12"
      style={{ backgroundColor: '#F2EFEE' }}
    >
      <div className="relative z-10 w-full max-w-6xl mx-auto space-y-8">
        {/* Section Header */}
        <motion.div
          className="text-center space-y-2"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-slate-900">
            <motion.span
              className="bg-gradient-to-r from-[#0f172a] via-[#1f2a44] to-[#0f172a] bg-clip-text text-transparent"
              animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              style={{ backgroundSize: '200% 200%' }}
            >
              Outcomes you can count on
            </motion.span>
          </h2>
          <motion.p
            className="text-slate-700 text-base md:text-lg max-w-3xl mx-auto font-normal leading-relaxed"
            animate={{ opacity: [0.7, 1, 0.7], y: [0, -2, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            Practical automation and infrastructure support tailored to the team in front of me.
          </motion.p>
        </motion.div>

        {/* Lightweight spotlight area */}
        <motion.div
          className="relative px-2 md:px-4 py-6 md:py-7"
          whileHover={{ scale: 1.01 }}
          transition={{ type: 'spring', stiffness: 120, damping: 12 }}
        >
          <motion.p
            className="text-center text-2xl md:text-3xl font-semibold text-slate-900 leading-relaxed max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Helping you ship reliable products with sensible automation and scalable infrastructure.
          </motion.p>

          {/* Buzzword marquee */}
          <div className="mt-8">
            <div
              ref={marqueeRef}
              className="overflow-hidden"
            >
              <motion.div
                className="flex gap-6 md:gap-7 py-3 px-2 md:px-4 text-sm md:text-base text-slate-700 whitespace-nowrap"
                animate={{ x: ['0%', '-50%'] }}
                transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
                style={{ width: '200%' }}
              >
                {[...buzzWords, ...buzzWords].map((word, idx) => (
                  <motion.span
                    key={`${word}-${idx}`}
                    ref={(el) => {
                      pillRefs.current[idx] = el
                    }}
                    className="relative inline-flex items-center justify-center px-2.5 md:px-3.5 py-1 font-semibold tracking-wide text-slate-700"
                    animate={
                      activeIndex === idx % buzzWords.length
                        ? {
                            scale: 1.08,
                            y: -3,
                            color: '#0f172a',
                            textShadow: '0 6px 14px rgba(15,23,42,0.12)',
                          }
                        : {
                            scale: 1,
                            y: 0,
                            color: '#6b7b8f',
                            textShadow: '0 0 0 rgba(0,0,0,0)',
                          }
                    }
                    transition={{ type: 'spring', stiffness: 240, damping: 22, mass: 0.9 }}
                  >
                    {word}
                  </motion.span>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

    </section>
  )
}
