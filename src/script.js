
import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import testVertexShader from './shader/vertex.glsl';
import testFragmentShader from './shader/fragment.glsl';


const canvas = document.querySelector("#canvas");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
const gui = new dat.GUI();
const scene = new THREE.Scene();
const clock = new THREE.Clock();

const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);
const texture = textureLoader.load('https://raw.githubusercontent.com/NataliaZhydeikina/images/main/ua%20Flag.png');

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(0, 0, -1);
scene.add(camera);
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
directionalLight.position.set(-4, 3, -2.25);
directionalLight.intensity = 1;
scene.add(ambientLight, directionalLight);

let planeGeometry = new THREE.PlaneGeometry(1, 1, 32, 32);
let planeMaterial = new THREE.ShaderMaterial({
    transparent: true,
    uniforms: {
        uFrequency: { value: new THREE.Vector2(10, 2.5) },
        uTime: { value: 0 },
        uTexture: { value: texture }
    },
    vertexShader: testVertexShader,
    fragmentShader: testFragmentShader,
});
gui.add(planeMaterial.uniforms.uFrequency.value, 'x').min(0).max(20).step(0.01).name('frequencyX');
gui.add(planeMaterial.uniforms.uFrequency.value, 'y').min(0).max(20).step(0.01).name('frequencyY');
let plane = new THREE.Mesh(
    planeGeometry,
    planeMaterial
);
plane.scale.y = 2 / 3;
scene.add(plane);
plane.rotation.set(0, Math.PI, 0);

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    planeMaterial.uniforms.uTime.value = elapsedTime;
    controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
}
tick();
