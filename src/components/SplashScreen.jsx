import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export function SplashScreen({ onComplete }) {
  const [status, setStatus] = useState('')

  useEffect(() => {
    let isMounted = true
    const sequence = async () => {
      const statuses = [
        'boot seq ... ok',
        'local db ... mounted',
        'cache sync ... queued',
        'uplink ... re-establishing',
        'members ... verified',
        'doors ... unlocked',
      ]
      const dwell = [720, 1180, 860, 1060, 920, 1220] // varied, more OS-like pacing

      for (let i = 0; i < statuses.length; i++) {
        if (!isMounted) return
        setStatus(statuses[i])
        await new Promise(resolve => setTimeout(resolve, dwell[i]))
      }

      if (!isMounted) return

      // Set as seen and complete after final delay
      sessionStorage.setItem('pharosysSplashSeen', '1')
      await new Promise(resolve => setTimeout(resolve, 1400))
      
      if (isMounted) {
        onComplete()
      }
    }

    // Safety timeout to ensure splash completes
    const safetyTimeout = setTimeout(() => {
      if (isMounted) {
        sessionStorage.setItem('pharosysSplashSeen', '1')
        onComplete()
      }
    }, 12000)

    sequence().catch(err => {
      console.error('Splash sequence error:', err)
      if (isMounted) {
        sessionStorage.setItem('pharosysSplashSeen', '1')
        onComplete()
      }
    })

    return () => {
      isMounted = false
      clearTimeout(safetyTimeout)
    }
  }, [onComplete])

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.9, delay: 0.25 }}
      className="fixed inset-0 bg-black z-50 flex items-center justify-center overflow-hidden"
    >
      {/* Logo and text */}
      <div className="relative z-10 text-center space-y-2">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative"
        >
          <h1 className="text-6xl md:text-8xl font-light text-orange-light">
            Pharosys
          </h1>
        </motion.div>

        {/* Status display - below logo */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="font-mono text-xs text-cyan leading-relaxed pt-4"
        >
          <motion.span
            key={status}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            &gt; {status}
          </motion.span>
        </motion.div>
      </div>
    </motion.div>
  )
}
