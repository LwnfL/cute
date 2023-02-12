import * as THREE from 'three'
import * as dat from 'dat.gui'
import { TextureLoader } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/*
 * Debug
 */
const gui = new dat.GUI()

/*
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')

// const matcapTexture = textureLoader.load('/textures/matcaps/3.png')
const gradientTexture = textureLoader.load('/textures/gradients/3.jpg')
gradientTexture.minFilter = THREE.NearestFilter
gradientTexture.magFilter = THREE.NearestFilter
gradientTexture.generateMipmaps = false

const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/1/px.jpg',
    '/textures/environmentMaps/1/nx.jpg',
    '/textures/environmentMaps/1/py.jpg',
    '/textures/environmentMaps/1/ny.jpg',
    '/textures/environmentMaps/1/pz.jpg',
    '/textures/environmentMaps/1/nz.jpg'
])
/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.background=new THREE.Color('white')

/**
 * Objects
 */

// const material = new THREE.MeshBasicMaterial()
// material.map = doorColorTexture
// material.color = new THREE.Color(0x00ff00)
// material.wireframe = true
// material.opacity = .5  // has to be used with transparent for effect to be visible
// material.transparent=true
// material.alphaMap = doorAlphaTexture

// const material = new THREE.MeshNormalMaterial()
// material.side = THREE.DoubleSide //will load material on inside ; GPU-intensive
// material.flatShading = true

// const material = new THREE.MeshDepthMaterial() // color the geometry in white if close to camera, vice versa

// const material  = new THREE.MeshLambertMaterial()

// const material = new THREE.MeshMatcapMaterial()
// material.matcap = matcapTexture

// const material = new THREE.MeshPhongMaterial()
// material.shininess = 100
// material.specular = new THREE.Color(0x1188f)

// const material = new THREE.MeshToonMaterial()
// material.gradientMap = gradientTexture

// const material = new THREE.MeshStandardMaterial()
const material = new THREE.MeshPhysicalMaterial({color: 0xffb5c3})

material.metalness = 0.07
material.roughness = 0.2
material.clearcoat = 0.7

// 
// material.envMap = environmentMapTexture

/**
 * Making the door realistic
 */
// material.map = doorColorTexture
// material.aoMap = doorAmbientOcclusionTexture
// material.aoMapIntensity=1
// material.displacementMap = doorHeightTexture
// material.displacementScale=0.1
// material.metalnessMap = doorMetalnessTexture
// material.roughnessMap = doorRoughnessTexture
// material.normalMap = doorNormalTexture
// material.normalScale.set(0.5,0.5)
// material.transparent = true
// material.alphaMap = doorAlphaTexture

gui.add(material, 'metalness').min(0).max(1).step(0.0001)
gui.add(material, 'roughness').min(0).max(1).step(0.0001)
gui.add(material,'aoMapIntensity').min(0).max(10).step(0.0001)
gui.add(material,'displacementScale').min(0).max(1).step(0.0001)

const sphere = new THREE.Mesh(
    new THREE.SphereBufferGeometry(.5,16,16),
    material
)
sphere.position.x = -1.5
sphere.geometry.setAttribute(
    'uv2', new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2)
    )

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1,1, 100, 100),
    material
)

plane.geometry.setAttribute(
    'uv2', new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2)
    )

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3,0.2,64,128),
    material
)
torus.position.x=1.5
torus.geometry.setAttribute(
    'uv2', new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2)
    )

scene.add(sphere, plane, torus)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, .5)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = 0.1*elapsedTime
    plane.rotation.y = 0.1*elapsedTime
    torus.rotation.y = 0.1*elapsedTime

    sphere.rotation.x = 0.15*elapsedTime
    plane.rotation.x = 0.15*elapsedTime
    torus.rotation.x = 0.15*elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()