import * as THREE from 'three'
import * as dat from 'dat.gui'
import { TextureLoader } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/*
 * Debug
 */
const gui = new dat.GUI()

const parameters = { 
    objcolor: 0xCAC6FB,
    spin: () => {
        gsap.to(mesh.rotation, {duration: 1, y:mesh.rotation.y + Math.PI * 2})
    },

    lghtcolor: 0xffffff,

    // enableSwoopingCamera: false,
    // enableRotation: false,
    
    transmission: 1,
    

    ior: 1.5,
    reflectivity: 0.5,
    thickness: 2.5,
    envMapIntensity: 1.5,
    clearcoatRoughness: 0.1,
    normalScale: 0.3,
    clearcoatNormalScale: 0.2,
    normalRepeat: 3,


    // attenuationTint: 0xffffff,
    // attenuationDistance: 0,
}

/*
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const gradientTexture = textureLoader.load('/textures/gradients/3.jpg')

gradientTexture.minFilter = THREE.NearestFilter
gradientTexture.magFilter = THREE.NearestFilter
gradientTexture.generateMipmaps = false


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


const material = new THREE.MeshPhysicalMaterial({
    metalness: 0.07,
    roughness: 0.2,
    clearcoat: 0,
    color:parameters.objcolor,
})

const eyeMaterial = new THREE.MeshBasicMaterial({
    color: 'black',
    side: THREE.DoubleSide
})


gui.add(material, 'metalness').min(0).max(1).step(0.0001)
gui.add(material, 'roughness').min(0).max(1).step(0.0001)
// gui.add(material,'').min(0).max(1).step(0.0001)
gui.add(material,'clearcoat').min(0).max(1).step(0.0001)
gui.addColor(parameters, 'objcolor').onChange(()=>
{
    material.color.set(parameters.objcolor)
})

const cuteThing = new THREE.Group()

const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(.5,16,16),
    material
)
sphere.scale.y = 0.9

sphere.geometry.setAttribute(
    'uv2', new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2)
    )

cuteThing.add(sphere)


//in degrees
const eyeSize = 0.03
const eyeSpacing = Math.PI/15
const forehead = Math.PI/8
const eyeProtrusion = 0.05 //higher number goes more in

const eyeGeometry = new THREE.SphereGeometry(eyeSize, 16, 16)
const Leye = new THREE.Mesh(
    eyeGeometry,
    eyeMaterial
)
Leye.position.z = (.5 - eyeProtrusion) *Math.cos(eyeSpacing)
Leye.position.x =  (.5 - eyeProtrusion) * Math.sin(eyeSpacing)
Leye.position.y = (.5 - eyeProtrusion) * Math.sin(-forehead)
cuteThing.add(Leye)
const Reye = new THREE.Mesh(
    eyeGeometry,
    eyeMaterial
)
Reye.position.z = (.5 - eyeProtrusion) *Math.cos(- eyeSpacing)
Reye.position.x =  (.5 - eyeProtrusion) * Math.sin(- eyeSpacing)
Reye.position.y = (.5 - eyeProtrusion) * Math.sin(-forehead)
cuteThing.add(Reye)

const mouthGeometry = new THREE.TorusGeometry(
    6,
    .3,
    16,
    50,
    1.87
)


const mouthPosition = 2 * Math.PI/15
const mouth = new THREE.Mesh(
    mouthGeometry,
    eyeMaterial
)
mouth.rotation.x += Math.PI/3 + Math.PI - Math.PI/9
mouth.rotation.z += Math.PI/5 
const mouthScale = 0.03
mouth.scale.set(mouthScale,mouthScale,mouthScale)
mouth.position.set(
    0,
    (0.5 + 0.1 - 6 * mouthScale) * Math.sin(-mouthPosition),
    (0.5 + 0.2 - 6 * mouthScale) * Math.cos(mouthPosition)
)

cuteThing.add(mouth)




scene.add(cuteThing)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(parameters.lghtcolor, .1)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)
gui.add(pointLight, 'intensity').min(0).max(1).step(0.0001)
gui.addColor(parameters, 'lghtcolor').onChange(()=>
{
    material.color.set(parameters.lghtcolor)
})



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
camera.position.y = -.74
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
    
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()