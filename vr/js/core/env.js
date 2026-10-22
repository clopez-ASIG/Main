import * as THREE from 'three';
import * as M from './materials.js';
import * as P from './props.js';

/** Bodega de respaldo cuando no hay passthrough (VR o escritorio). */
export function buildWarehouse() {
  const g = new THREE.Group(); g.name = 'bodega';
  const size = 26, h = 6;
  const floor = P.mesh(new THREE.PlaneGeometry(size, size), M.epoxyFloor([size / 2, size / 2]), { rot: [-Math.PI / 2, 0, 0], cast: false });
  g.add(floor);
  const wallMat = M.wall([size / 3, h / 3]);
  const walls = [
    [[0, h / 2, -size / 2], [0, 0, 0]], [[0, h / 2, size / 2], [0, Math.PI, 0]],
    [[-size / 2, h / 2, 0], [0, Math.PI / 2, 0]], [[size / 2, h / 2, 0], [0, -Math.PI / 2, 0]],
  ];
  for (const [pos, rot] of walls) g.add(P.mesh(new THREE.PlaneGeometry(size, h), wallMat, { pos, rot, cast: false }));
  // franja gris baja en paredes
  for (const [pos, rot] of walls) {
    const m = P.mesh(new THREE.PlaneGeometry(size, 1.1), M.matte(0x5b6b7a), { pos: [pos[0], 0.55, pos[2]], rot, cast: false });
    m.position.add(new THREE.Vector3(0, 0, 0)); m.translateZ(0.01); g.add(m);
  }
  // techo con vigas y lucernarios
  g.add(P.mesh(new THREE.PlaneGeometry(size, size), M.matte(0xbfc5cc), { pos: [0, h, 0], rot: [Math.PI / 2, 0, 0], cast: false }));
  for (let x = -size / 2 + 2; x < size / 2; x += 4) {
    g.add(P.box(0.25, 0.45, size, M.paint(0x4a5563, { roughness: 0.6 }), { pos: [x, h - 0.22, 0], r: 0.01 }));
    g.add(P.mesh(new THREE.PlaneGeometry(1.6, size - 2), M.emissive(0xffffff, 1.6), { pos: [x + 2, h - 0.02, 0], rot: [Math.PI / 2, 0, 0], cast: false, recv: false }));
  }
  // columnas
  for (const x of [-8, 8]) for (const z of [-8, 0, 8]) { const c = P.steelColumn(h, 0.3); c.position.set(x, 0, z); g.add(c); }
  // racks al fondo
  for (let i = -2; i <= 2; i++) {
    const r = P.rack({ w: 2.6, d: 1.1, h: 3.4 }); r.position.set(i * 2.8, 0, -size / 2 + 0.8); g.add(r);
    for (let l = 0; l < 2; l++) { const s = P.boxStack({ w: 1.0, d: 0.8, layers: 2, height: 0.35 }); s.position.set(i * 2.8 - 0.65 + (l * 1.3), 0.19 + 0.0, -size / 2 + 0.8); g.add(s); }
  }
  // racks laterales
  for (const sx of [-1, 1]) for (let i = 0; i < 3; i++) {
    const r = P.rack({ w: 2.6, d: 1.1, h: 3.4 }); r.position.set(sx * (size / 2 - 0.8), 0, -6 + i * 3.2); r.rotation.y = sx * Math.PI / 2; g.add(r);
  }
  // detalles: tarima con cajas y conos lejos del área de trabajo
  const pal = P.pallet(); pal.position.set(-5.5, 0, -4); g.add(pal);
  const st = P.boxStack({ layers: 2 }); st.position.set(-5.5, 0.15, -4); g.add(st);
  const c1 = P.cone(); c1.position.set(5.5, 0, -5); g.add(c1);
  const ext = P.extinguisher(); ext.position.set(-7.95, 0.9, -2); ext.rotation.y = Math.PI / 2; g.add(ext);
  g.add(P.box(0.14, 0.14, 0.04, M.paint(0xc8181a), { pos: [-7.93, 0.82, -2], rot: [0, Math.PI / 2, 0] }));
  return g;
}

/** Plano que solo recibe sombra: ancla los objetos al piso real en passthrough. */
export function buildShadowCatcher(size = 10) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(size, size), new THREE.ShadowMaterial({ opacity: 0.35 }));
  m.rotation.x = -Math.PI / 2; m.receiveShadow = true; m.name = 'sombra';
  return m;
}

export function setupLights(scene) {
  const hemi = new THREE.HemisphereLight(0xdfe8f5, 0x5a5f66, 0.9);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xffffff, 2.2);
  sun.position.set(3, 6, 2);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.near = 0.5; sun.shadow.camera.far = 20;
  sun.shadow.camera.left = -6; sun.shadow.camera.right = 6; sun.shadow.camera.top = 6; sun.shadow.camera.bottom = -6;
  sun.shadow.bias = -0.0005; sun.shadow.normalBias = 0.02;
  scene.add(sun); scene.add(sun.target);
  sun.target.position.set(0.3, 0, -2.3);
  const fill = new THREE.DirectionalLight(0xbcd3ff, 0.5); fill.position.set(-4, 3, 3); scene.add(fill);
  return { hemi, sun, fill };
}
