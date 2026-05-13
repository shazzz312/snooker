import React from 'react'
import ReactDOM from 'react-dom/client'
import { Scene } from 'rendering/src/index'
import { PowerMeter, SpinSelection, LiveScore, ChatUI } from 'ui/src/index'
import "./index.css"

const mockGameState = {
  viewMode: 'player',
  cueRotation: [0, 0, 0],
  isCueStriking: false,
  activeTargetBallId: 'red1'
}

const mockPhysicsState = {
  balls: [
    { id: 'cueball', position: [0, 0.5, 2], color: 'white' },
    { id: 'red1', position: [0, 0.5, -2], color: 'red' }
  ]
}

const App = () => {
  return (
    <div className="w-screen h-screen relative bg-black overflow-hidden font-sans">
      {/* 3D Scene Background */}
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <Scene gameState={mockGameState} physicsState={mockPhysicsState} />
      </div>

      {/* 2D UI Overlay - Let the components manage their own absolute positioning as defined in Tailwind classes */}
      <div className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none">
        {/* LiveScore contains PlayerProfiles inside it */}
        <div className="pointer-events-auto"><LiveScore /></div>

        {/* ChatUI already has top-right positioning */}
        <div className="pointer-events-auto"><ChatUI /></div>

        {/* Controls block since power meter / spin selection might assume relative container */}
        <div className="absolute bottom-10 right-10 flex items-center gap-10 pointer-events-auto">
          <div className="relative"><SpinSelection onSpinChange={() => {}} /></div>
          <div className="relative"><PowerMeter power={50} /></div>
        </div>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
