import * as THREE from 'three'

let isRainy = false

export function initRainy() {
  if (typeof window === 'undefined' || isRainy) { return }
  isRainy = true
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.z = 20
  camera.position.y = 10

  const renderer = new THREE.WebGLRenderer({
    alpha: true, // enable transparent background
  })
  renderer.setClearColor(0x000000, 0) // set background color
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.domElement.style.position = 'fixed'
  renderer.domElement.style.top = 0
  renderer.domElement.style.left = 0
  renderer.domElement.style.zIndex = -1
  document.body.appendChild(renderer.domElement)
  // on resize
  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight)
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
  }, false)

  const raindropGeometry = new THREE.BufferGeometry()
  const vertices = []
  vertices.push(0, 0, 0)
  vertices.push(0, -2, 0) // the raindrop length

  raindropGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))

  const rainCount = 2000 // the number of raindrops
  for (let i = 0; i < rainCount; i++) {
    const raindropGeometry = new THREE.BufferGeometry()

    raindropGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))

    const pos = new THREE.Vector3(Math.random() * 200 - 100, Math.random() * 200 - 100, Math.random() * 200 - 100)

    const raindropMaterial = new THREE.LineBasicMaterial({
      color: 0xAAAAAA, // color
      transparent: true,
      opacity: (pos.z + 100) / 200 * 0.1 + 0.05,
    })

    const raindrop = new THREE.Line(raindropGeometry, raindropMaterial)

    raindrop.position.copy(pos)

    // 在雨滴对象中添加速度属性
    raindrop.velocity = new THREE.Vector3(
      Math.random() * 0.12 - 0.06, // X speed
      (Math.random() * 0.1 - 0.2) - 1.25, // Y speed
      Math.random() * 0.12 - 0.06, // Z speed
    )
    scene.add(raindrop)
  }

  function animate() {
    requestAnimationFrame(animate)
    scene.traverse((object) => {
      if (object instanceof THREE.Line) {
        object.position.add(object.velocity)
        if (object.position.y < -100) { object.position.copy(new THREE.Vector3(Math.random() * 200 - 100, Math.random() * 200 - 100, Math.random() * 200 - 100)) }
      }
    })
    renderer.render(scene, camera)
  }
  animate()
}
