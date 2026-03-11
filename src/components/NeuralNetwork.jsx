import { useEffect, useRef, useState } from 'react'

export function NeuralNetwork() {
  const canvasRef = useRef(null)
  const particlesRef = useRef([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const animationRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: true })
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Generate particles
    const particleCount = 15
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      radius: Math.random() * 1.5 + 0.5,
      originalX: 0,
      originalY: 0,
    }))

    particlesRef.current.forEach((p) => {
      p.originalX = p.x
      p.originalY = p.y
    })

    // Mouse tracking
    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX
      mouseRef.current.y = e.clientY
    }

    window.addEventListener('mousemove', handleMouseMove)

    // Animation loop
    const animate = () => {
      // Clear with semi-transparent background for trail effect
      ctx.fillStyle = 'rgba(10, 14, 26, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const particles = particlesRef.current

      // Update particles
      particles.forEach((p) => {
        // Drift movement
        p.x += p.vx
        p.y += p.vy

        // Bounce off edges
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1

        // Keep in bounds
        p.x = Math.max(0, Math.min(canvas.width, p.x))
        p.y = Math.max(0, Math.min(canvas.height, p.y))

        // Slight pull towards original position (keeps them from drifting too far)
        p.x += (p.originalX - p.x) * 0.0005
        p.y += (p.originalY - p.y) * 0.0005

        // Attraction to mouse
        const dx = mouseRef.current.x - p.x
        const dy = mouseRef.current.y - p.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 250) {
          const force = (1 - distance / 250) * 0.05
          p.vx += (dx / distance) * force
          p.vy += (dy / distance) * force
        }

        // Damping
        p.vx *= 0.97
        p.vy *= 0.97
      })

      // Draw connections - only very close particles
      ctx.strokeStyle = 'rgba(100, 200, 255, 0.08)'
      ctx.lineWidth = 0.8

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            const opacity = (1 - distance / 100) * 0.12
            ctx.strokeStyle = `rgba(100, 200, 255, ${opacity})`
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }

      // Draw particles with glow
      particles.forEach((p) => {
        // Subtle glow effect
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 2)
        gradient.addColorStop(0, 'rgba(100, 200, 255, 0.4)')
        gradient.addColorStop(0.7, 'rgba(100, 200, 255, 0.1)')
        gradient.addColorStop(1, 'rgba(100, 200, 255, 0)')

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius * 2, 0, Math.PI * 2)
        ctx.fill()

        // Core particle
        ctx.fillStyle = 'rgba(150, 220, 255, 0.7)'
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fill()
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    // Handle resize
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none opacity-60"
      style={{
        mixBlendMode: 'lighten',
      }}
    />
  )
}
