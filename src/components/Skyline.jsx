import { useEffect, useRef, useState, useCallback } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Outcomes } from './Outcomes'

const spring = { stiffness: 140, damping: 20, mass: 0.9 }

// Marketplace project data structure
const MARKETPLACE_PROJECTS = [
  {
    id: 'serment-quick',
    name: 'SERMENTQUICK',
    shortDesc: 'Smart membership management platform',
  },
]

const PROJECT_DETAILS = {
  'serment-quick': {
    title: 'SERMENTQUICK — Smart Membership Management Platform',
    description: 'SERMENTQUICK is a modern platform designed to help membership-based businesses manage their operations smoothly and efficiently. From managing members and subscriptions to tracking payments and activity, SERMENTQUICK brings everything together in one simple and reliable system.',
    sections: [
      { type: 'subheading', text: 'A Single Dashboard for Everything' },
      { type: 'list', items: ['Members', 'Membership Plans', 'Activity Tracking', 'Payments & Invoices', 'Business Analytics'] },
      { type: 'subheading', text: 'Custom Membership Plans' },
      { type: 'paragraph', text: 'Create flexible plans that fit your model with custom pricing and duration options.' },
      { type: 'subheading', text: 'Activity Tracking' },
      { type: 'list', items: ['Member check-ins and check-outs', 'Today\'s activity summary', 'Complete activity history'] },
    ],
  },
}

export function SkylineScene() {
  // === STATE MANAGEMENT ===
  const [marketplaceOpen, setMarketplaceOpen] = useState(false)
  const [windowStack, setWindowStack] = useState([])
  const [toast, setToast] = useState(null)
  const [glowPhase, setGlowPhase] = useState(0)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [currentTime, setCurrentTime] = useState(new Date())
  const [penActive, setPenActive] = useState(false)

  const [viewport, setViewport] = useState({
    w: typeof window !== 'undefined' ? window.innerWidth : 1280,
    h: typeof window !== 'undefined' ? window.innerHeight : 720
  })

  const marketBtnRef = useRef(null)
  const launcherBtnRef = useRef(null)
  const calendarRef = useRef(null)
  const canvasRef = useRef(null)
  const isDrawingRef = useRef(false)
  const lastPointRef = useRef(null)

  const px = useMotionValue(0)
  const py = useMotionValue(0)

  const phoneLx = useSpring(useTransform(px, [-0.5, 0.5], [-28, 28]), spring)
  const phoneLy = useSpring(useTransform(py, [-0.5, 0.5], [-14, 16]), spring)
  const phoneRx = useSpring(useTransform(px, [-0.5, 0.5], [-28, 28]), spring)
  const phoneRy = useSpring(useTransform(py, [-0.5, 0.5], [-14, 16]), spring)
  const tiltY = useSpring(useTransform(px, [-0.5, 0.5], [-18, 18]), spring)
  const tiltX = useSpring(useTransform(py, [-0.5, 0.5], [16, -16]), spring)

  // === REAL-TIME CLOCK ===
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date())
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // === AMBIENT BACKGROUND GLOW ANIMATION ===
  useEffect(() => {
    let frame = 0
    const interval = setInterval(() => {
      frame = (frame + 1) % 360
      setGlowPhase(frame)
    }, 80)
    return () => clearInterval(interval)
  }, [])

  // === MOUSE TRACKING ===
  useEffect(() => {
    let rafId = null
    let lastX = 0
    let lastY = 0
    let targetX = 0
    let targetY = 0

    const handleMove = (e) => {
      const { innerWidth, innerHeight } = window
      targetX = e.clientX / innerWidth - 0.5
      targetY = e.clientY / innerHeight - 0.5

      if (!rafId) {
        rafId = requestAnimationFrame(() => {
          lastX = targetX * 0.2 + lastX * 0.8
          lastY = targetY * 0.2 + lastY * 0.8
          px.set(lastX)
          py.set(lastY)
          rafId = null
        })
      }
    }

    const handleLeave = () => {
      px.set(0)
      py.set(0)
      if (rafId) {
        cancelAnimationFrame(rafId)
        rafId = null
      }
    }

    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseleave', handleLeave)
    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseleave', handleLeave)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [px, py])

  // === VIEWPORT RESIZE ===
  useEffect(() => {
    const handleResize = () => setViewport({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (!penActive) {
      isDrawingRef.current = false
      lastPointRef.current = null
    }
    // swap cursor globally so it works even though canvas doesn't receive pointer events
    document.body.style.cursor = penActive ? 'crosshair' : ''
    return () => {
      document.body.style.cursor = ''
    }
  }, [penActive])

  // === DRAWING CANVAS RESIZE ===
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1
      const width = window.innerWidth
      const height = Math.max(window.innerHeight, document.documentElement.scrollHeight || window.innerHeight)
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    return () => window.removeEventListener('resize', resizeCanvas)
  }, [penActive])

  // === DRAWING HANDLERS ===
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const getPos = (e) => {
      const rect = canvas.getBoundingClientRect()
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
    }

    const isUiElement = (target) => {
      return Boolean(target.closest('button, a, input, textarea, select, [role=\"button\"], [data-no-draw]'))
    }

    const handleDown = (e) => {
      if (!penActive || isUiElement(e.target)) return
      isDrawingRef.current = true
      lastPointRef.current = getPos(e)
    }

    const handleMove = (e) => {
      if (!penActive || !isDrawingRef.current) return
      const { x, y } = getPos(e)
      const last = lastPointRef.current
      if (!last) return

      // Higher-quality, solid black ink
      ctx.strokeStyle = '#0a0a0a'
      ctx.lineWidth = 3.2
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.shadowColor = 'rgba(0,0,0,0.15)'
      ctx.shadowBlur = 1.5
      ctx.beginPath()
      ctx.moveTo(last.x, last.y)
      ctx.lineTo(x, y)
      ctx.stroke()
      ctx.shadowBlur = 0
      lastPointRef.current = { x, y }
    }

    const handleUp = () => {
      isDrawingRef.current = false
      lastPointRef.current = null
    }

    window.addEventListener('pointerdown', handleDown)
    window.addEventListener('pointermove', handleMove)
    window.addEventListener('pointerup', handleUp)

    return () => {
      window.removeEventListener('pointerdown', handleDown)
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerup', handleUp)
    }
  }, [penActive, canvasRef])

  // === CALENDAR CLICK-OUTSIDE HANDLER ===
  useEffect(() => {
    if (!calendarOpen) return

    const handleClickOutside = (e) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target)) {
        setCalendarOpen(false)
      }
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setCalendarOpen(false)
      }
    }

    window.addEventListener('mousedown', handleClickOutside)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [calendarOpen])

  // === HANDLERS ===
  const handleMarketplaceClick = useCallback(() => {
    if (!marketplaceOpen && windowStack.length === 0) {
      setWindowStack([{
        id: 'marketplace-list',
        type: 'project-list',
        title: 'Marketplace',
      }])
      setMarketplaceOpen(true)
    }
  }, [marketplaceOpen, windowStack.length])

  const handleOpenProject = useCallback((projectId) => {
    if (!projectId || typeof projectId !== 'string') return
    
    setWindowStack((stack) => {
      const lastWindow = stack[stack.length - 1]
      if (lastWindow?.projectId === projectId && lastWindow?.type === 'project-detail') {
        return stack
      }

      const detailWindow = {
        id: `project-detail-${projectId}`,
        type: 'project-detail',
        projectId,
        title: MARKETPLACE_PROJECTS.find(p => p.id === projectId)?.name || 'Project',
      }
      return [...stack, detailWindow]
    })
  }, [])

  const handleCloseTopWindow = useCallback(() => {
    setWindowStack((stack) => {
      const remaining = stack.slice(0, -1)
      if (remaining.length === 0) {
        setMarketplaceOpen(false)
      }
      return remaining
    })
  }, [])

  const handleLabsClick = useCallback(() => {
    setToast({ id: 'labs', message: 'Labs • Coming soon' })
    const timeoutId = setTimeout(() => setToast(null), 2800)
    return () => clearTimeout(timeoutId)
  }, [])

  const handleFinanceClick = useCallback(() => {
    setToast({ id: 'finance', message: 'Finance • Coming soon' })
    const timeoutId = setTimeout(() => setToast(null), 2800)
    return () => clearTimeout(timeoutId)
  }, [])

  // === ESCAPE KEY HANDLER ===
  useEffect(() => {
    if (!marketplaceOpen) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && windowStack.length > 0) {
        handleCloseTopWindow()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [marketplaceOpen, windowStack.length, handleCloseTopWindow])

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#0a0e1a] via-[#1a1f3a] to-[#0f1728] pb-32 md:pb-36">
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-[999]"
        style={{
          pointerEvents: 'none', // keep UI clickable while showing strokes above everything
          touchAction: 'none',
        }}
      />

      <div className="relative z-10">
      {/* === PREMIUM GLOWING DOCK === */}
      <motion.div
        className="fixed inset-x-4 md:inset-x-10 bottom-4 z-50 pointer-events-none"
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, ease: 'easeOut', delay: 0.3 }}
      >
        <div className="mx-auto max-w-6xl relative pointer-events-auto">
          {/* Glow aura behind dock */}
          <motion.div
            className="absolute -inset-2 rounded-3xl blur-2xl -z-10"
            animate={{
              background: [
                'radial-gradient(ellipse at 50% 50%, rgba(100, 200, 255, 0.3) 0%, transparent 70%)',
                'radial-gradient(ellipse at 50% 50%, rgba(150, 100, 255, 0.25) 0%, transparent 70%)',
                'radial-gradient(ellipse at 50% 50%, rgba(100, 200, 255, 0.3) 0%, transparent 70%)',
              ]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />

          <motion.div
            className="rounded-3xl border backdrop-blur-3xl flex items-center gap-4 px-6 py-3.5 relative"
            style={{
              background: 'rgba(20, 25, 45, 0.7)',
              border: '1px solid rgba(100, 200, 255, 0.4)',
              boxShadow: '0 0 30px rgba(100, 200, 255, 0.2), inset 0 0 30px rgba(100, 200, 255, 0.05)',
            }}
            whileHover={{
              background: 'rgba(25, 30, 55, 0.8)',
              boxShadow: '0 0 50px rgba(100, 200, 255, 0.3), inset 0 0 30px rgba(100, 200, 255, 0.1)',
            }}
            transition={{ duration: 0.4 }}
          >
            {/* Pharosys Logo */}
            <motion.div
              className="px-4 py-2 rounded-xl border select-none font-semibold tracking-[0.2em] text-sm"
              style={{
                background: 'rgba(50, 120, 200, 0.2)',
                border: '1px solid rgba(100, 200, 255, 0.5)',
                color: '#64d9ff',
                textShadow: '0 0 10px rgba(100, 200, 255, 0.8)',
              }}
              ref={launcherBtnRef}
              whileHover={{
                background: 'rgba(70, 140, 220, 0.3)',
                boxShadow: '0 0 20px rgba(100, 200, 255, 0.6)',
              }}
              transition={{ duration: 0.3 }}
            >
              ◆ PHAROSYS
            </motion.div>

            {/* Date/Time Button with Calendar */}
            <div className="relative">
              <motion.button
                onClick={() => setCalendarOpen(!calendarOpen)}
                className="px-4 py-2 rounded-full border font-medium tracking-wide text-xs"
                style={{
                  background: 'rgba(100, 150, 255, 0.15)',
                  border: '1px solid rgba(100, 200, 255, 0.4)',
                  color: '#a0d9ff',
                }}
                whileHover={{
                  background: 'rgba(120, 170, 255, 0.25)',
                  boxShadow: '0 0 20px rgba(100, 200, 255, 0.4)',
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                🕐 {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </motion.button>

              {/* Calendar Dropdown */}
              <AnimatePresence>
                {calendarOpen && (
                  <motion.div
                    ref={calendarRef}
                    className="absolute bottom-full mb-3 left-0 z-[300]"
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div
                      className="p-5 rounded-2xl border backdrop-blur-xl"
                      style={{
                        background: 'rgba(15, 20, 40, 0.95)',
                        border: '2px solid rgba(100, 200, 255, 0.5)',
                        boxShadow: '0 0 40px rgba(100, 200, 255, 0.3), inset 0 0 20px rgba(100, 200, 255, 0.05)',
                        minWidth: '300px',
                      }}
                    >
                      <div className="space-y-4">
                        {/* Month/Year display */}
                        <div className="text-center">
                          <p className="text-sm font-semibold text-cyan-300">
                            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                          </p>
                          <p className="text-xs text-cyan-200/60 mt-1">
                            {currentDate.toLocaleString('default', { weekday: 'long', day: 'numeric' })}
                          </p>
                        </div>

                        {/* Clock display */}
                        <motion.div
                          className="text-center py-3 rounded-xl border"
                          style={{
                            background: 'rgba(100, 200, 255, 0.05)',
                            border: '1px solid rgba(100, 200, 255, 0.3)',
                          }}
                        >
                          <p className="text-2xl font-light text-cyan-300 tracking-widest">
                            {currentTime.toLocaleTimeString()}
                          </p>
                        </motion.div>

                        {/* Calendar grid */}
                        <div className="grid grid-cols-7 gap-1 text-center">
                          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                            <div key={day} className="text-xs font-semibold text-cyan-300/70 py-1">
                              {day}
                            </div>
                          ))}
                          {Array.from({ length: 35 }).map((_, i) => {
                            const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()
                            const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
                            const day = i - firstDay + 1

                            const isCurrentDay = day === currentDate.getDate() && day > 0 && day <= daysInMonth
                            const isValidDay = day > 0 && day <= daysInMonth

                            return (
                              <motion.div
                                key={i}
                                className={`py-2 rounded text-xs font-medium transition-all ${
                                  isCurrentDay
                                    ? 'text-white'
                                    : isValidDay
                                      ? 'text-cyan-300/80'
                                      : 'text-cyan-300/20'
                                }`}
                                style={{
                                  background: isCurrentDay ? 'rgba(100, 200, 255, 0.4)' : 'rgba(100, 200, 255, 0.05)',
                                  border: isCurrentDay ? '1px solid rgba(100, 200, 255, 0.6)' : 'none',
                                }}
                                whileHover={isValidDay ? { background: 'rgba(100, 200, 255, 0.2)' } : {}}
                              >
                                {isValidDay ? day : ''}
                              </motion.div>
                            )
                          })}
                        </div>

                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex-1 flex justify-center">
              <motion.button
                onClick={() => setPenActive((prev) => !prev)}
                className="px-4 py-2 rounded-full border font-medium tracking-wide text-xs flex items-center gap-2"
                style={{
                  background: penActive ? 'rgba(94, 234, 212, 0.18)' : 'rgba(100, 150, 200, 0.12)',
                  border: penActive ? '1px solid rgba(94, 234, 212, 0.7)' : '1px solid rgba(100, 200, 255, 0.4)',
                  color: penActive ? '#d9fff5' : '#a0d9ff',
                  boxShadow: penActive ? '0 0 18px rgba(94, 234, 212, 0.35)' : 'none',
                }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.2 }}
                aria-pressed={penActive}
              >
                <span className="text-base">✏️</span>
                <span>{penActive ? 'Drawing On' : 'Pen'}</span>
              </motion.button>
            </div>

            {/* Button group */}
            <div className="flex items-center gap-2 text-xs ml-auto">
              {/* Marketplace button */}
              <motion.button
                onClick={handleMarketplaceClick}
                ref={marketBtnRef}
                className="px-4 py-2 rounded-full border font-medium tracking-wide relative overflow-hidden group"
                style={{
                  background: 'rgba(100, 200, 255, 0.15)',
                  border: '1px solid rgba(100, 200, 255, 0.5)',
                  color: '#64d9ff',
                }}
                whileHover={{
                  background: 'rgba(100, 200, 255, 0.25)',
                  boxShadow: '0 0 20px rgba(100, 200, 255, 0.5)',
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-300/20 to-transparent"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
                <span className="relative">Marketplace</span>
              </motion.button>

              {/* Labs button */}
              <motion.button
                onClick={handleLabsClick}
                className="px-4 py-2 rounded-full border font-medium tracking-wide"
                style={{
                  background: 'rgba(70, 90, 130, 0.35)',
                  border: '1px solid rgba(70, 90, 130, 0.6)',
                  color: '#dbe7ff',
                }}
                whileHover={{
                  background: 'rgba(70, 90, 130, 0.45)',
                  boxShadow: '0 0 18px rgba(70, 90, 130, 0.55)',
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                Labs
              </motion.button>

              {/* Finance button */}
              <motion.button
                onClick={handleFinanceClick}
                className="px-4 py-2 rounded-full border font-medium tracking-wide"
                style={{
                  background: 'rgba(90, 70, 120, 0.35)',
                  border: '1px solid rgba(90, 70, 120, 0.6)',
                  color: '#e1d4ff',
                }}
                whileHover={{
                  background: 'rgba(90, 70, 120, 0.45)',
                  boxShadow: '0 0 18px rgba(90, 70, 120, 0.55)',
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                Finance
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* === COMING SOON TOAST === */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key={`toast-${toast.id}`}
            className="fixed bottom-24 left-1/2 z-[200] px-5 py-3 rounded-full border text-sm font-medium tracking-wide backdrop-blur-xl"
            style={{
              background: 'rgba(100, 200, 255, 0.15)',
              border: '1px solid rgba(100, 200, 255, 0.4)',
              color: '#a0d9ff',
              boxShadow: '0 0 30px rgba(100, 200, 255, 0.3)',
              x: '-50%',
            }}
            initial={{ opacity: 0, y: 20, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.92 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <motion.span
              className="inline-block"
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              ✨ {toast.message}
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* === MARKETPLACE WINDOW STACK === */}
      <AnimatePresence mode="popLayout">
        {marketplaceOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="marketplace-backdrop"
              className="fixed inset-0 z-[70]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              onClick={() => {
                if (windowStack.length > 0) {
                  handleCloseTopWindow()
                }
              }}
              style={{
                background: 'rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(8px)',
              }}
            />

            {/* Window stack */}
            {windowStack.map((window, index) => {
              const isTopWindow = index === windowStack.length - 1
              const stackOffset = 24 * index
              const zIndex = 71 + index

              return (
                <motion.div
                  key={window.id}
                  className="fixed"
                  initial={{
                    opacity: 0,
                    scale: 0.88,
                    y: 60,
                    filter: 'blur(8px)'
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    filter: 'blur(0px)'
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.88,
                    y: 60,
                    filter: 'blur(8px)'
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 280,
                    damping: 35,
                    mass: 0.9,
                  }}
                  style={{
                    zIndex,
                    left: `max(12px, calc(50% - 360px + ${stackOffset}px))`,
                    top: `max(12px, calc(50% - 280px + ${stackOffset}px))`,
                    right: 'auto',
                    bottom: 'auto',
                  }}
                >
                  <motion.div
                    className="w-[720px] max-w-[calc(100vw-24px)] h-[560px] max-h-[calc(100vh-48px)] rounded-3xl border overflow-hidden flex flex-col relative"
                    style={{
                      background: 'rgba(13, 19, 38, 0.92)',
                      border: '1px solid rgba(100, 200, 255, 0.3)',
                      backdropFilter: 'blur(20px)',
                      boxShadow: isTopWindow
                        ? '0 0 50px rgba(100, 200, 255, 0.4), 0 25px 120px rgba(0, 0, 0, 0.6)'
                        : '0 15px 80px rgba(0, 0, 0, 0.45)',
                    }}
                  >
                    {/* Soft inner glow */}
                    <div className="absolute inset-0 pointer-events-none rounded-3xl" style={{
                      background: 'radial-gradient(ellipse at 50% 0%, rgba(100, 200, 255, 0.1), transparent 60%)',
                    }} />

                    {/* Header */}
                    <motion.div
                      className="flex items-center justify-between px-6 py-4 border-b relative z-10"
                      style={{
                        background: 'rgba(50, 80, 120, 0.3)',
                        border: '1px solid rgba(100, 200, 255, 0.2)',
                      }}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15, duration: 0.4 }}
                    >
                      <h3 className="text-cyan-300 text-xs font-semibold tracking-[0.14em] uppercase">
                        {window.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <motion.button
                          className="px-3 py-1 rounded-full border text-xs font-medium text-cyan-300/80"
                          style={{
                            background: 'rgba(100, 150, 200, 0.2)',
                            border: '1px solid rgba(100, 200, 255, 0.3)',
                          }}
                          onClick={handleCloseTopWindow}
                          whileHover={{
                            background: 'rgba(100, 150, 200, 0.3)',
                            boxShadow: '0 0 15px rgba(100, 200, 255, 0.3)',
                          }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                        >
                          Close
                        </motion.button>
                      </div>
                    </motion.div>

                    {/* Project list view */}
                    {window.type === 'project-list' && (
                      <motion.div
                        className="flex-1 overflow-y-auto px-6 py-6 space-y-3 relative z-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.15, duration: 0.4 }}
                      >
                        {MARKETPLACE_PROJECTS.map((project) => (
                          <motion.button
                            key={project.id}
                            className="w-full text-left rounded-2xl border px-5 py-4 transition-all group relative overflow-hidden"
                            style={{
                              background: 'rgba(100, 150, 200, 0.1)',
                              border: '1px solid rgba(100, 200, 255, 0.2)',
                              color: '#a0d9ff',
                            }}
                            onClick={() => handleOpenProject(project.id)}
                            whileHover={{
                              background: 'rgba(100, 150, 200, 0.15)',
                              boxShadow: '0 0 20px rgba(100, 200, 255, 0.2)',
                              x: 4,
                            }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ duration: 0.3 }}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                          >
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-300/10 to-transparent"
                              initial={{ x: '-100%' }}
                              whileHover={{ x: '100%' }}
                              transition={{ duration: 0.6 }}
                            />

                            <div className="relative z-10">
                              <p className="font-semibold tracking-wide">
                                {project.name}
                              </p>
                              <p className="text-cyan-300/60 text-xs mt-1.5 leading-relaxed">
                                {project.shortDesc}
                              </p>
                            </div>
                          </motion.button>
                        ))}
                      </motion.div>
                    )}

                    {/* Project detail view */}
                    {window.type === 'project-detail' && (
                      <motion.div
                        className="flex-1 overflow-y-auto px-7 py-6 space-y-5 relative z-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.15, duration: 0.4 }}
                      >
                        <motion.h2
                          className="text-xl font-semibold text-cyan-300 tracking-tight"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2}}
                        >
                          {PROJECT_DETAILS[window.projectId]?.title || window.title}
                        </motion.h2>

                        <motion.p
                          className="text-cyan-200/80 leading-relaxed text-sm"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.25}}
                        >
                          {PROJECT_DETAILS[window.projectId]?.description}
                        </motion.p>

                        <div className="space-y-4">
                          {PROJECT_DETAILS[window.projectId]?.sections.map((section, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.3 + idx * 0.05 }}
                            >
                              {section.type === 'subheading' && (
                                <h4 className="text-base font-semibold text-cyan-300/90 mt-2">
                                  {section.text}
                                </h4>
                              )}
                              {section.type === 'list' && (
                                <ul className="list-disc list-inside space-y-1.5 text-cyan-200/70 text-sm pl-1">
                                  {section.items.map((item, i) => (
                                    <li key={i} className="leading-relaxed">{item}</li>
                                  ))}
                                </ul>
                              )}
                              {section.type === 'paragraph' && (
                                <p className="text-cyan-200/75 leading-relaxed text-sm">
                                  {section.text}
                                </p>
                              )}
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                </motion.div>
              )
            })}
          </>
        )}
      </AnimatePresence>

      {/* === OUTCOMES SECTION === */}
      <Outcomes />
      </div>
    </section>
  )
}
