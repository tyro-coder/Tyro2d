import './App.css'
import { useEffect, useRef } from 'react'
import { Tyro2d, Stage } from '../tyro2d'

function App() {
  const gameRef = useRef()

  useEffect(() => {
   if (gameRef.current.childNodes.length > 0) return

    const canvas = document.createElement('canvas')
    gameRef.current.appendChild(canvas)

    const stage = new Stage(
      canvas,
      750,
      1624,
      document.body.clientWidth,
      document.body.clientHeight,
    )
    Tyro2d.start(stage, 30)
  }, [])

  return (
    <div className="App">
      <div ref={gameRef} className="gameBox"></div>
    </div>
  )
}

export default App
