import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import exslymImg from '../assets/images/exslym.jpg';
import moonImg from '../assets/images/moon.jpg';
import spaceImg from '../assets/images/space.jpg';
import textureImg from '../assets/images/texture.jpg';
import '../styles/style.scss';
// Setup

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1920);

const renderer = new THREE.WebGLRenderer({
	canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
camera.position.setX(-3);

renderer.render(scene, camera);

// Torus

const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
// const material = new THREE.MeshStandardMaterial({ color: 0xff6347 });
const material = new THREE.MeshBasicMaterial({ color: 0xff6347, wireframe: true });
const torus = new THREE.Mesh(geometry, material);

scene.add(torus);

// Lights

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// Helpers

// const lightHelper = new THREE.PointLightHelper(pointLight);
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper, gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);

const starGeometry = new THREE.SphereGeometry(0.2, 24, 24);
const starMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });

function addStar() {
	const star = new THREE.Mesh(starGeometry, starMaterial);
	const [x, y, z] = Array(3)
		.fill()
		.map(() => THREE.MathUtils.randFloatSpread(300));
	star.position.set(x, y, z);
	scene.add(star);
}

Array(300).fill().forEach(addStar);

// const starMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
// const stars = new THREE.Mesh(Array(300).fill().forEach(addStar), starMaterial);
// scene.add(stars);
// stars.position.z = -5;
// stars.position.x = 2;

// Background
const spaceTexture = new THREE.TextureLoader().load(spaceImg);
scene.background = spaceTexture;

// Avatar
const photoTexture = new THREE.TextureLoader().load(exslymImg);

const photo = new THREE.Mesh(
	new THREE.BoxGeometry(3, 3, 3),
	new THREE.MeshBasicMaterial({ map: photoTexture }),
);

scene.add(photo);
photo.position.z = -5;
photo.position.x = 2;

// Moon
const moonTexture = new THREE.TextureLoader().load(moonImg);
const normalTexture = new THREE.TextureLoader().load(textureImg);

const moon = new THREE.Mesh(
	new THREE.SphereGeometry(3, 32, 32),
	new THREE.MeshStandardMaterial({
		map: moonTexture,
		normalMap: normalTexture,
	}),
);

scene.add(moon);
moon.position.z = 25;
moon.position.setX(-10);

// Scroll Animation
function moveCamera() {
	const t = document.body.getBoundingClientRect().top;
	// moon.rotation.x += 0.05;
	// moon.rotation.y += 0.075;
	// moon.rotation.z += 0.05;

	// photo.rotation.y += 0.01;
	// photo.rotation.z += 0.01;

	camera.position.z = t * -0.01;
	camera.position.x = t * -0.0002;
	camera.rotation.y = t * -0.0002;
}
document.body.onscroll = moveCamera;
moveCamera();

// Animation Loop
function animate() {
	requestAnimationFrame(animate);

	torus.rotation.x += 0.01;
	torus.rotation.y += 0.005;
	torus.rotation.z += 0.01;

	photo.rotation.x += 0.005;
	photo.rotation.y -= 0.01;
	photo.rotation.z -= 0.005;

	moon.rotation.y += 0.008;

	// stars.rotation.y += 0.05;

	// controls.update();

	renderer.render(scene, camera);
}

animate();
