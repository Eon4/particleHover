import { useRef } from 'react'
import './App.css'
import image from './assets/react.svg'

function App() {
  const imageRef = useRef(null)

  const handleMouseMove = (e) => {
    const el = imageRef.current
    const rect = el.getBoundingClientRect()

    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    el.style.setProperty('--mask-x', `${x}px`)
    el.style.setProperty('--mask-y', `${y}px`)
  }

  return (
    <div className="app">
      <div
        className="mask-container"
        onMouseMove={handleMouseMove}
        ref={imageRef}
      >
        <img src={image} alt="Reveal On Hover" />
      </div>
    </div>
  )
}

export default App

