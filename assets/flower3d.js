(function () {
  const container = document.getElementById('heroBouquet');
  if (!container || typeof THREE === 'undefined') return;

  const PETAL_WHITE = 0xFAF6F0;
  const PETAL_GREEN = 0xC3DCC2;
  const GREEN_DEEP = 0x2A4A2E;
  const GOLD = 0xE8C48F;
  const STEM_GREEN = 0x3F6B44;

  let width = container.clientWidth || 420;
  let height = container.clientHeight || 420;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
  camera.position.set(0, 0.35, 4.1);
  camera.lookAt(0, 0.35, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);

  // Lighting
  scene.add(new THREE.AmbientLight(0xffffff, 0.55));
  const keyLight = new THREE.DirectionalLight(0xffffff, 1.1);
  keyLight.position.set(2.5, 3, 3);
  scene.add(keyLight);
  const fillLight = new THREE.DirectionalLight(0xf3f7f0, 0.5);
  fillLight.position.set(-3, 1, -2);
  scene.add(fillLight);
  const rimLight = new THREE.PointLight(0xffffff, 0.6, 10);
  rimLight.position.set(0, 1.5, -3);
  scene.add(rimLight);

  // Petal shape, echoes the flat SVG petal but as real extruded geometry
  function makePetalGeometry() {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.bezierCurveTo(-0.34, 0.46, -0.34, 1.05, 0, 1.42);
    shape.bezierCurveTo(0.34, 1.05, 0.34, 0.46, 0, 0);
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.045,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 2,
      curveSegments: 12
    });
    geo.translate(0, 0, -0.022);
    return geo;
  }

  const petalGeo = makePetalGeometry();
  const petalMat = new THREE.MeshPhysicalMaterial({
    color: PETAL_WHITE,
    roughness: 0.45,
    metalness: 0,
    clearcoat: 0.25,
    clearcoatRoughness: 0.6,
    side: THREE.DoubleSide,
    emissive: GREEN_DEEP,
    emissiveIntensity: 0.03
  });

  const flowerGroup = new THREE.Group();
  scene.add(flowerGroup);

  // Stem
  const stemGeo = new THREE.CylinderGeometry(0.03, 0.045, 1.6, 8);
  const stemMat = new THREE.MeshStandardMaterial({ color: STEM_GREEN, roughness: 0.6 });
  const stem = new THREE.Mesh(stemGeo, stemMat);
  stem.position.y = -1.15;
  flowerGroup.add(stem);

  // Flower center (bloom origin)
  const bloomOrigin = new THREE.Group();
  bloomOrigin.position.y = -0.3;
  flowerGroup.add(bloomOrigin);

  const centerGeo = new THREE.SphereGeometry(0.16, 20, 20);
  const centerMat = new THREE.MeshStandardMaterial({ color: GOLD, roughness: 0.35, emissive: GOLD, emissiveIntensity: 0.15 });
  const centerSphere = new THREE.Mesh(centerGeo, centerMat);
  bloomOrigin.add(centerSphere);

  // Petals: each is a hinge group (angle placement) containing a bloom pivot (open/close hinge)
  const PETAL_COUNT = 8;
  const petals = [];
  for (let i = 0; i < PETAL_COUNT; i++) {
    const angle = (i / PETAL_COUNT) * Math.PI * 2;
    const placement = new THREE.Group();
    placement.rotation.y = angle;

    const bloomPivot = new THREE.Group();
    bloomPivot.rotation.x = 0.15;

    const mesh = new THREE.Mesh(petalGeo, petalMat.clone());
    mesh.scale.setScalar(0.62);
    bloomPivot.add(mesh);
    placement.add(bloomPivot);
    bloomOrigin.add(placement);

    petals.push({ pivot: bloomPivot, phase: i * 0.22 });
  }

  // Second, smaller inner ring for fullness
  const INNER_COUNT = 6;
  for (let i = 0; i < INNER_COUNT; i++) {
    const angle = (i / INNER_COUNT) * Math.PI * 2 + 0.3;
    const placement = new THREE.Group();
    placement.rotation.y = angle;

    const bloomPivot = new THREE.Group();
    bloomPivot.rotation.x = 0.1;

    const mesh = new THREE.Mesh(petalGeo, petalMat.clone());
    mesh.scale.setScalar(0.4);
    mesh.material.color.setHex(PETAL_GREEN);
    bloomPivot.add(mesh);
    placement.add(bloomPivot);
    bloomOrigin.add(placement);

    petals.push({ pivot: bloomPivot, phase: i * 0.3 + 0.5, inner: true });
  }

  flowerGroup.rotation.y = 0.35;
  flowerGroup.rotation.x = 0.08;

  // Interaction: slow auto-rotate, pauses and hands off to the user while dragging
  let isDragging = false, lastX = 0, lastY = 0;
  let autoAngle = flowerGroup.rotation.y;
  let tiltAngle = flowerGroup.rotation.x;

  function dragStart(x, y) {
    isDragging = true; lastX = x; lastY = y;
    container.style.cursor = 'grabbing';
  }
  function dragMove(x, y) {
    if (!isDragging) return;
    autoAngle += (x - lastX) * 0.01;
    tiltAngle -= (y - lastY) * 0.008;
    tiltAngle = Math.max(-0.6, Math.min(0.6, tiltAngle));
    lastX = x; lastY = y;
  }
  function dragEnd() {
    isDragging = false;
    container.style.cursor = 'grab';
  }

  container.addEventListener('pointerdown', e => { dragStart(e.clientX, e.clientY); container.setPointerCapture(e.pointerId); });
  container.addEventListener('pointermove', e => dragMove(e.clientX, e.clientY));
  container.addEventListener('pointerup', dragEnd);
  container.addEventListener('pointercancel', dragEnd);

  // Resize handling
  function handleResize() {
    width = container.clientWidth || width;
    height = container.clientHeight || height;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }
  window.addEventListener('resize', handleResize);

  const CLOSED = 0.18;
  const OPEN = 1.25;
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    if (!isDragging) {
      autoAngle += 0.0022;
    }
    flowerGroup.rotation.y += (autoAngle - flowerGroup.rotation.y) * 0.08;
    flowerGroup.rotation.x += (tiltAngle - flowerGroup.rotation.x) * 0.08;

    const cycle = (Math.sin(t * 0.55) + 1) / 2;
    petals.forEach(p => {
      const local = (Math.sin(t * 0.55 + p.phase) + 1) / 2;
      const blend = cycle * 0.65 + local * 0.35;
      p.pivot.rotation.x = CLOSED + (OPEN - CLOSED) * blend * (p.inner ? 0.82 : 1);
    });

    renderer.render(scene, camera);
  }
  animate();
})();
