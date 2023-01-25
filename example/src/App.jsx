import './App.css'
import { useEffect, useRef } from 'react'
import { Tyro2d, Stage, Sprite, Node, Tween, Ease } from '../tyro2d'

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
    node1.x = 100
    node1.y = 100
    node1.anchorX = 50
    node1.anchorY = 50
    node1.width = 100
    node1.height = 100
    node1.background = '#ff0000'
    stage.addChild(node1)

    const node2 = new Node()
    node2.x = 100
    node2.y = 300
    node2.anchorX = 50
    node2.anchorY = 50
    node2.width = 100
    node2.height = 100
    node2.background = '#00ff00'
    stage.addChild(node2)

    Tween.to(node1, {
      rotation: 360,
    }, {
      loop: true,
      duration: 2000,
      ease: Ease.cubicInOut,
      onComplete: (target) => {
        console.log(target)
      }
    }).link(Tween.to(node2, {
      x: 500,
    }, {
      loop: true,
      repeat: 3,
      reverse: true,
      duration: 2000
    }))

    

    // const node2Tween = new Tween(node2, null, {
    //   x: 500,
    // }, {
    //   loop: true,
    //   repeat: 3,
    //   reverse: true,
    //   duration: 2000
    // })

    const node3 = new Node()
    node3.x = 100
    node3.y = 500
    node3.anchorX = 50
    node3.anchorY = 50
    node3.width = 100
    node3.height = 100
    node3.background = '#0000ff'
    stage.addChild(node3)

    Tween.to(node3, {
      x: 500,
      y: 800
    }, {
      duration: 2000,
      ease: Ease.elasticInOut,
    })

    const node4 = new Node()
    node4.x = 300
    node4.y = 700
    node4.anchorX = 50
    node4.anchorY = 50
    node4.width = 100
    node4.height = 100
    node4.background = '#c65306'
    stage.addChild(node4)
    Tween.to(node4, {
      scaleX: 1.5,
      scaleY: 1.5
    }, {
      loop: true,
      duration: 1000,
      reverse: true,
      ease: Ease.linear,
    })
  }, [])

  return (
    <div className="App">
      <div ref={gameRef} className="gameBox"></div>
    </div>
  )
}

export default App
