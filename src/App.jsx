import { useState, useEffect, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import { SplashScreen } from './components/SplashScreen'
import { DosCursor } from './components/DosCursor'
import { SkylineScene } from './components/Skyline'

function App() {
  const [splashComplete, setSplashComplete] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Only run on client side
  useEffect(() => {
    setIsClient(true)
    const alreadySeen = sessionStorage.getItem('pharosysSplashSeen') === '1'
    if (alreadySeen) {
      setSplashComplete(true)
    }
  }, [])

  const handleSplashComplete = useCallback(() => {
    setSplashComplete(true)
    sessionStorage.setItem('pharosysSplashSeen', '1')
  }, [])

  if (!isClient) return null

  return (
    <div className="bg-navy-dark min-h-screen">
      <DosCursor />
      <AnimatePresence mode="wait">
        {!splashComplete && (
          <SplashScreen key="splash" onComplete={handleSplashComplete} />
        )}
      </AnimatePresence>

      {splashComplete && (
        <SkylineScene />
      )}
    </div>
  )
}

export default App
