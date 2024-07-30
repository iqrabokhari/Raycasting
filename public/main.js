import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Setup the renderer
const renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0x222230);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// Create a new scene
const scene = new THREE.Scene();

// Setup scene lighting
const light = new THREE.DirectionalLight();
light.intensity = 2;
light.position.set(2, 5, 10);
light.castShadow = true;
scene.add(light);
scene.add(new THREE.AmbientLight(0xffffff, 0.1));

// Setup camera
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(-5, 5, 12);
controls.target.set(-1, 2, 0);
controls.update();

// Render loop
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

// ========= END SCENE SETUP =========

// Geometry and material definitions
const floorGeometry = new THREE.PlaneGeometry(25, 20);
const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
const cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 2);
const ringGeometry = new THREE.RingGeometry(
  5, // innerRadius
  10, // outerRadius
  32, // thetaSegments
  1, // phiSegments
  0, // thetaStart
  Math.PI * 2 // thetaLength
);

const lambertMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
const basicMaterial = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  side: THREE.DoubleSide,
});

// Create floor mesh
const floorMesh = new THREE.Mesh(floorGeometry, lambertMaterial);
floorMesh.rotation.x = -Math.PI / 2.0;
floorMesh.name = 'Floor';
floorMesh.receiveShadow = true;
scene.add(floorMesh);

// Create and add ring mesh
const ring = new THREE.Mesh(ringGeometry, basicMaterial);
ring.position.set(0, 1, 0); // Adjust position if needed
ring.name = 'ring';
scene.add(ring);

// Create meshes with Lambert material
function createMesh(geometry, material, x, y, z, name, layer) {
  const mesh = new THREE.Mesh(geometry, material.clone());
  mesh.position.set(x, y, z);
  mesh.name = name;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.layers.set(layer);
  return mesh;
}

const cylinders = new THREE.Group();
cylinders.add(
  createMesh(cylinderGeometry, lambertMaterial, 3, 1, 0, 'Cylinder A', 0)
);
cylinders.add(
  createMesh(cylinderGeometry, lambertMaterial, 4.2, 1, 0, 'Cylinder B', 0)
);
cylinders.add(
  createMesh(cylinderGeometry, lambertMaterial, 3.6, 3, 0, 'Cylinder C', 0)
);
scene.add(cylinders);

const boxes = new THREE.Group();
boxes.add(createMesh(boxGeometry, lambertMaterial, -1, 1, 0, 'Box A', 0));
boxes.add(createMesh(boxGeometry, lambertMaterial, -4, 1, 0, 'Box B', 0));
boxes.add(createMesh(boxGeometry, lambertMaterial, -2.5, 3, 0, 'Box C', 0));
scene.add(boxes);

animate();

// ========= END SCENE SETUP =========

// Raycasting setup
const raycaster = new THREE.Raycaster();

document.addEventListener('mousedown', onMouseDown);

function onMouseDown(event) {
  // Calculate normalized device coordinates (-1 to +1) for both components
  const coords = new THREE.Vector2(
    (event.clientX / window.innerWidth) * 2 - 1,
    -((event.clientY / window.innerHeight) * 2 - 1)
  );

  // Update raycaster
  raycaster.setFromCamera(coords, camera);

  // Check for intersections
  const intersections = raycaster.intersectObjects(scene.children, true);
  if (intersections.length > 0) {
    const selectedObject = intersections[0].object;
    const color = new THREE.Color(Math.random(), Math.random(), Math.random());
    selectedObject.material.color = color;
    console.log(`${selectedObject.name} was clicked!`);
  }
}
