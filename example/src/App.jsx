import './App.css'
import { useEffect, useRef } from 'react'
import { Tyro2d, Stage, Sprite, Node } from '../tyro2d'

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

    const node1 = new Node()
    node1.width = 500
    node1.height = 500
    node1.background = '#ff0000'
    stage.addChild(node1)

    setTimeout(() => {
      node1.x = 300
    }, 2000)

    const bookSprite = new Sprite('//yun.dui88.com/cdfe/liaoningBOC-kanjia/shareIcon.png')
    bookSprite.x = 71
    bookSprite.y = 71
    bookSprite.setScale(2, 2)
    bookSprite.anchorX = 0.5
    bookSprite.anchorY = 0.5
    // bookSprite.rotation = 45
    stage.addChild(bookSprite)

    const container = new Node()
    stage.addChild(container)

    const sprite = new Sprite('//yun.dui88.com/cdfe/liaoningBOC-kanjia/shareIcon.png')
    sprite.anchorX = 0
    sprite.anchorY = 35
    sprite.x = 0
    sprite.y = 143
    sprite.opacity = 0.5
    sprite.rotation = 45
    container.addChild(sprite)
  }, [])

  return (
    <div className="App">
      <div ref={gameRef} className="gameBox"></div>
    </div>
  )
}

export default App
