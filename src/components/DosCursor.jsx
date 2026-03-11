import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export function DosCursor() {
  const [visible, setVisible] = useState(false)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const spring = { stiffness: 280, damping: 22, mass: 0.6 }
  const sx = useSpring(x, spring)
  const sy = useSpring(y, spring)

  useEffect(() => {
    const handleMove = (e) => {
      const { innerWidth, innerHeight } = window
      const inside =
        e.clientX >= 0 &&
        e.clientY >= 0 &&
        e.clientX <= innerWidth &&
        e.clientY <= innerHeight

      if (!inside) {
        setVisible(false)
        return
      }

      x.set(e.clientX)
      y.set(e.clientY)
      setVisible(true)
    }
    const handleLeave = () => setVisible(false)
    const handleBlur = () => setVisible(false)

    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseenter', handleMove)
    window.addEventListener('mouseleave', handleLeave)
    window.addEventListener('mouseout', (e) => {
      if (!e.relatedTarget) setVisible(false)
    })
    window.addEventListener('blur', handleBlur)

    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseenter', handleMove)
      window.removeEventListener('mouseleave', handleLeave)
      window.removeEventListener('blur', handleBlur)
    }
  }, [x, y])

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[99999]"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <motion.div
        className="dos-caret w-3 h-6 rounded-[2px] bg-[#0f1f52] border border-[#0b173d]"
        style={{
          translateX: sx,
          translateY: sy,
          boxShadow: '0 0 6px rgba(15,31,82,0.4)',
          animation: 'dosBlink 1s steps(2,end) infinite',
        }}
      />
    </motion.div>
  )
}
