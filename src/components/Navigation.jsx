import { useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'

export function Navigation() {
  const [showContact, setShowContact] = useState(false)
  const contactRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (contactRef.current && !contactRef.current.contains(event.target)) {
        setShowContact(false)
      }
    }

    // Only attach listener when dropdown is open
    if (showContact) {
      document.addEventListener('click', handleClickOutside, false)
      return () => {
        document.removeEventListener('click', handleClickOutside, false)
      }
    }
  }, [showContact])

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="sticky top-0 z-20 backdrop-blur border-b border-border"
      style={{ background: 'rgba(7, 11, 29, 0.92)' }}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <nav className="flex items-center justify-between py-3.5">
          <div className="flex items-center gap-2.5 font-light text-base md:text-lg">
            <span>Pharosys</span>
            <span className="px-2 py-1 text-cyan-light border border-cyan/35 rounded-full text-xs font-light"
              style={{ background: 'rgba(91, 225, 255, 0.14)' }}
            >
              Offline-first platform
            </span>
          </div>

          <div className="hidden md:flex items-center gap-5 text-text-muted text-sm">
            <a
              href="#features"
              className="hover:text-text-primary transition-colors"
            >
              Features
            </a>
            <a
              href="#reliability"
              className="hover:text-text-primary transition-colors"
            >
              Reliability
            </a>
            <a
              href="#security"
              className="hover:text-text-primary transition-colors"
            >
              Security
            </a>
            <a
              href="#contact"
              className="hover:text-text-primary transition-colors"
            >
              Contact
            </a>
          </div>

          <div className="flex items-center gap-2" data-no-draw>
            <div className="relative" ref={contactRef}>
              <button
                className="btn btn-ghost text-xs md:text-sm"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowContact((v) => !v)
                }}
              >
                Contact us
              </button>
              {showContact && (
                <div className="absolute right-0 mt-2 w-56 rounded-lg border border-white/10 bg-[#0a0f21]/95 backdrop-blur-sm shadow-[0_14px_30px_rgba(0,0,0,0.25)] p-3 text-sm text-white">
                  <p className="font-semibold mb-1">Email</p>
                  <a
                    href="mailto:dits.contactus@gmail.com"
                    className="text-cyan-200 underline underline-offset-2 break-all"
                  >
                    dits.contactus@gmail.com
                  </a>
                </div>
              )}
            </div>
            <button 
              className="btn btn-primary text-xs md:text-sm"
              onClick={() => setShowContact(true)}
            >
              Book a demo
            </button>
          </div>
        </nav>
      </div>
    </motion.header>
  )
}
