import './App.css'
import { useEffect, useRef } from 'react'
import { Tyro2d, Stage, Sprite } from '../tyro2d'

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

    console.log(stage)

    const bookSprite = new Sprite('//yun.dui88.com/cdfe/liaoningBOC-kanjia/shareIcon.png')
    bookSprite.x = 143
    bookSprite.y = 143
    // bookSprite.rotation = 15
    bookSprite.scaleX = 2
    bookSprite.scaleY = 2
    bookSprite.anchorX = 71
    bookSprite.anchorY = 71
    stage.addChild(bookSprite)

    const newSprite = new Sprite('//yun.dui88.com/cdfe/liaoningBOC-kanjia/shareIcon.png')
    newSprite.x = 0
    newSprite.y = 0
    bookSprite.addChild(newSprite)

    console.log(bookSprite.transform.matrix)
  }, [])

  return (
    <div className="App">
      <div ref={gameRef} className="gameBox"></div>
    </div>
  )
}

export default App
