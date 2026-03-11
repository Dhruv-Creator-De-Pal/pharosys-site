import { useState, useEffect, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import { SplashScreen } from './components/SplashScreen'
import { DosCursor } from './components/DosCursor'
import { SkylineScene } from './components/Skyline'

function App() {
  const [splashComplete, setSplashComplete] = useState(false)

  // Check if splash was already shown in this session
  useEffect(() => {
    const alreadySeen = sessionStorage.getItem('pharosysSplashSeen') === '1'
    if (alreadySeen) {
      setSplashComplete(true)
    }
  }, [])

  const handleSplashComplete = useCallback(() => {
    setSplashComplete(true)
  }, [])

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
