import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import * as M from './materials.js';
import * as T from './textures.js';

// Constructores de objetos. Todos devuelven Mesh o Group con sombras activas.

export function mesh(geo, mat, { pos, rot, cast = true, recv = true, name } = {}) {
  const m = new THREE.Mesh(geo, mat);
  if (pos) m.position.set(...pos);
  if (rot) m.rotation.set(...rot);
  m.castShadow = cast; m.receiveShadow = recv;
  if (name) m.name = name;
  return m;
}

export function box(w, h, d, mat, opts = {}) {
  const r = opts.r ?? Math.min(w, h, d) * 0.08;
  const geo = r > 0 ? new RoundedBoxGeometry(w, h, d, 2, r) : new THREE.BoxGeometry(w, h, d);
  return mesh(geo, mat, opts);
}

export function cyl(rt, rb, h, mat, opts = {}) {
  return mesh(new THREE.CylinderGeometry(rt, rb, h, opts.seg ?? 24), mat, opts);
}

export function sphere(r, mat, opts = {}) {
  return mesh(new THREE.SphereGeometry(r, 24, 16), mat, opts);
}

export function group(children = [], { pos, rot, name } = {}) {
  const g = new THREE.Group();
  children.forEach(c => c && g.add(c));
  if (pos) g.position.set(...pos);
  if (rot) g.rotation.set(...rot);
  if (name) g.name = name;
  return g;
}

/** Tubo que sigue puntos (cables, mangueras, eslingas). */
export function tube(points, radius, mat, { closed = false, seg = 48, cast = true } = {}) {
  const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)), closed);
  return mesh(new THREE.TubeGeometry(curve, seg, radius, 10, closed), mat, { cast });
}

/** Rótulo plano con texto. */
export function sign(lines, w, h, opts = {}) {
  const ppm = w < 0.3 ? 3000 : 1500, k = ppm / 1000;
  const scaled = (Array.isArray(lines) ? lines : [lines]).map(l => typeof l === 'string' ? { text: l, size: (opts.size || 56) * k } : { ...l, size: (l.size || opts.size || 56) * k });
  const mat = M.labelMat({ ...opts, lines: scaled, w: Math.round(w * ppm), h: Math.round(h * ppm), pad: (opts.pad ?? 24) * k, borderW: (opts.borderW ?? 12) * k, size: (opts.size || 56) * k });
  const m = mesh(new THREE.PlaneGeometry(w, h), mat, { cast: false, recv: false });
  m.userData.noHighlight = opts.highlight === false;
  return m;
}

/** Placa rígida con rótulo (letrero con marco fino). */
export function plate(lines, w, h, opts = {}) {
  const g = group();
  g.add(box(w + 0.02, h + 0.02, 0.01, M.plastic(opts.frame ?? 0x222222), { r: 0.004 }));
  const s = sign(lines, w, h, opts); s.position.z = 0.0065; g.add(s);
  return g;
}

export function pallet() {
  const g = group([], { name: 'tarima' });
  const wood = M.wood();
  for (let i = 0; i < 7; i++) g.add(box(1.2, 0.022, 0.1, wood, { pos: [0, 0.133, -0.45 + i * 0.15], r: 0.002 }));
  for (const x of [-0.55, 0, 0.55]) g.add(box(0.1, 0.09, 1.0, wood, { pos: [x, 0.067, 0], r: 0.002 }));
  for (const z of [-0.45, 0, 0.45]) g.add(box(1.2, 0.022, 0.1, wood, { pos: [0, 0.011, z], r: 0.002 }));
  return g;
}

export function cardboardBox(w = 0.4, h = 0.3, d = 0.4, opts = {}) {
  return box(w, h, d, M.cardboard(), { r: 0.006, ...opts });
}

export function boxStack({ w = 1.1, d = 0.9, layers = 3, height = 0.3 } = {}) {
  const g = group([], { name: 'cajas' });
  for (let l = 0; l < layers; l++) {
    const n = 2;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      g.add(cardboardBox(w / n - 0.02, height - 0.01, d / n - 0.02, { pos: [-w / 4 + i * w / 2, height / 2 + l * height, -d / 4 + j * d / 2] }));
    }
  }
  return g;
}

export function cone() {
  const g = group([], { name: 'cono' });
  g.add(box(0.36, 0.03, 0.36, M.plastic(0xf05a1a), { pos: [0, 0.015, 0] }));
  g.add(cyl(0.04, 0.16, 0.6, M.plastic(0xf05a1a), { pos: [0, 0.33, 0] }));
  g.add(cyl(0.085, 0.11, 0.1, M.plastic(0xffffff, { roughness: 0.3 }), { pos: [0, 0.4, 0] }));
  return g;
}

export function extinguisher() {
  const g = group([], { name: 'extintor' });
  g.add(cyl(0.085, 0.085, 0.5, M.paint(0xc8181a), { pos: [0, 0.3, 0] }));
  g.add(sphere(0.085, M.paint(0xc8181a), { pos: [0, 0.55, 0] }));
  g.add(cyl(0.085, 0.085, 0.02, M.paint(0xc8181a), { pos: [0, 0.055, 0] }));
  g.add(cyl(0.025, 0.025, 0.08, M.steel(), { pos: [0, 0.66, 0] }));
  g.add(box(0.03, 0.02, 0.14, M.darkMetal(), { pos: [0, 0.71, 0.03] }));
  g.add(tube([[0.03, 0.68, 0], [0.09, 0.6, 0.02], [0.1, 0.4, 0.04], [0.09, 0.25, 0.03]], 0.012, M.rubber()));
  const lbl = sign([{ text: 'EXTINTOR', size: 70 }, { text: 'ABC · 10 lb', size: 48, weight: 400 }], 0.12, 0.16, { bg: '#ffffff', fg: '#111', highlight: false });
  lbl.position.set(0, 0.32, 0.086); g.add(lbl);
  return g;
}

export function padlock(color = 0xd61f1f) {
  const g = group([], { name: 'candado' });
  g.add(box(0.05, 0.045, 0.02, M.paint(color), { r: 0.006 }));
  g.add(mesh(new THREE.TorusGeometry(0.016, 0.004, 10, 24, Math.PI), M.steel(), { pos: [0, 0.023, 0] }));
  return g;
}

export function tag() {
  const g = group([], { name: 'tarjeta' });
  const s = sign([{ text: 'PELIGRO', size: 60, color: '#fff' }, { text: 'NO OPERAR', size: 40, color: '#fff' }], 0.07, 0.12, { bg: '#d61f1f', border: '#ffffff', borderW: 6, highlight: false });
  g.add(s);
  g.add(mesh(new THREE.TorusGeometry(0.008, 0.002, 8, 16), M.steel(), { pos: [0, 0.068, 0] }));
  return g;
}

export function hardHat(color = 0xffffff) {
  const g = group([], { name: 'casco' });
  g.add(mesh(new THREE.SphereGeometry(0.12, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2), M.paint(color, { clearcoat: 0.6 })));
  g.add(cyl(0.16, 0.16, 0.012, M.paint(color, { clearcoat: 0.6 }), { pos: [0, 0.006, 0] }));
  return g;
}

/** Figura humana estilizada con chaleco y casco. */
export function person({ vest = 0xf7a81b, hat = 0xffffff, shirt = 0x3a4a5c, pants = 0x2a2d33, skin = 0xc7956b } = {}) {
  const g = group([], { name: 'persona' });
  g.add(cyl(0.09, 0.1, 0.8, M.fabric(pants), { pos: [-0.11, 0.4, 0] }));
  g.add(cyl(0.09, 0.1, 0.8, M.fabric(pants), { pos: [0.11, 0.4, 0] }));
  g.add(box(0.2, 0.08, 0.3, M.rubber(0x222), { pos: [-0.11, 0.04, 0.03] }));
  g.add(box(0.2, 0.08, 0.3, M.rubber(0x222), { pos: [0.11, 0.04, 0.03] }));
  g.add(box(0.42, 0.6, 0.26, M.fabric(shirt), { pos: [0, 1.1, 0], r: 0.06 }));
  const v = box(0.44, 0.5, 0.28, M.fabric(vest), { pos: [0, 1.12, 0], r: 0.06 });
  g.add(v);
  g.add(box(0.46, 0.04, 0.3, M.matte(0xdfe3e8), { pos: [0, 1.2, 0], r: 0.01 }));
  g.add(box(0.46, 0.04, 0.3, M.matte(0xdfe3e8), { pos: [0, 1.0, 0], r: 0.01 }));
  g.add(cyl(0.06, 0.06, 0.6, M.fabric(shirt), { pos: [-0.28, 1.05, 0] }));
  g.add(cyl(0.06, 0.06, 0.6, M.fabric(shirt), { pos: [0.28, 1.05, 0] }));
  g.add(sphere(0.055, M.matte(skin), { pos: [-0.28, 0.72, 0] }));
  g.add(sphere(0.055, M.matte(skin), { pos: [0.28, 0.72, 0] }));
  g.add(cyl(0.06, 0.07, 0.1, M.matte(skin), { pos: [0, 1.45, 0] }));
  g.add(sphere(0.12, M.matte(skin), { pos: [0, 1.6, 0] }));
  const h = hardHat(hat); h.position.set(0, 1.65, 0); g.add(h);
  return g;
}

/** Columna de acero (perfil I). */
export function steelColumn(h = 2.6, w = 0.2, color = 0x4a5563) {
  const g = group([], { name: 'columna' });
  const m = M.paint(color, { roughness: 0.6, clearcoat: 0.1 });
  g.add(box(w, h, 0.016, m, { pos: [0, h / 2, 0], r: 0.002 }));
  g.add(box(w, 0.016, w, m, { pos: [0, h / 2, 0], r: 0.002 }));
  g.add(box(w, h, 0.016, m, { pos: [0, h / 2, w / 2 - 0.008], r: 0.002 }));
  g.add(box(w, h, 0.016, m, { pos: [0, h / 2, -w / 2 + 0.008], r: 0.002 }));
  g.add(box(w + 0.1, 0.02, w + 0.1, m, { pos: [0, 0.01, 0], r: 0.002 }));
  return g;
}

export function gasCylinder({ color = 0x2f7d3a, chained = false, label = 'OXÍGENO' } = {}) {
  const g = group([], { name: 'cilindro' });
  g.add(cyl(0.115, 0.115, 1.25, M.paint(color), { pos: [0, 0.63, 0] }));
  g.add(mesh(new THREE.SphereGeometry(0.115, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), M.paint(color), { pos: [0, 1.255, 0] }));
  g.add(cyl(0.03, 0.03, 0.08, M.steel(), { pos: [0, 1.39, 0] }));
  g.add(box(0.1, 0.035, 0.035, M.steel(), { pos: [0.03, 1.42, 0] }));
  g.add(cyl(0.028, 0.012, 0.04, M.darkMetal(), { pos: [0, 1.46, 0] }));
  g.add(cyl(0.125, 0.125, 0.015, M.rubber(), { pos: [0, 0.008, 0] }));
  const lbl = sign([{ text: label, size: 56 }], 0.16, 0.08, { bg: '#f4f4f4', fg: '#111', highlight: false });
  lbl.position.set(0, 0.95, 0.116); g.add(lbl);
  if (chained) {
    const ch = mesh(new THREE.TorusGeometry(0.125, 0.008, 8, 32), M.steel(), { pos: [0, 0.85, 0], rot: [Math.PI / 2, 0, 0] });
    g.add(ch);
    g.add(box(0.03, 0.03, 0.14, M.steel(), { pos: [0, 0.85, -0.18] }));
  }
  return g;
}

export function ladder({ h = 2.2, w = 0.45, brokenRung = -1 } = {}) {
  const g = group([], { name: 'escalera' });
  const al = M.steel();
  g.add(box(0.035, h, 0.08, al, { pos: [-w / 2, h / 2, 0], r: 0.004 }));
  g.add(box(0.035, h, 0.08, al, { pos: [w / 2, h / 2, 0], r: 0.004 }));
  const n = Math.floor(h / 0.3);
  for (let i = 1; i <= n; i++) {
    const y = i * 0.3;
    if (i === brokenRung) {
      g.add(box(w * 0.4, 0.03, 0.06, al, { pos: [-w * 0.28, y - 0.03, 0], rot: [0, 0, 0.35], r: 0.003 }));
      g.add(box(w * 0.3, 0.03, 0.06, al, { pos: [w * 0.33, y, 0], r: 0.003 }));
    } else g.add(box(w - 0.03, 0.03, 0.06, al, { pos: [0, y, 0], r: 0.003 }));
  }
  g.add(box(0.05, 0.03, 0.1, M.rubber(), { pos: [-w / 2, 0.015, 0] }));
  g.add(box(0.05, 0.03, 0.1, M.rubber(), { pos: [w / 2, 0.015, 0] }));
  return g;
}

export function table(w = 1.2, d = 0.6, h = 0.85, { top = 0x7a8591, legs = 0x2d3238 } = {}) {
  const g = group([], { name: 'mesa' });
  g.add(box(w, 0.04, d, M.paint(top, { roughness: 0.5 }), { pos: [0, h - 0.02, 0], r: 0.006 }));
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) g.add(box(0.04, h - 0.04, 0.04, M.metal(legs), { pos: [sx * (w / 2 - 0.05), (h - 0.04) / 2, sz * (d / 2 - 0.05)], r: 0.004 }));
  g.add(box(w - 0.1, 0.03, d - 0.1, M.metal(legs), { pos: [0, 0.15, 0], r: 0.004 }));
  return g;
}

/** Cable eléctrico: tubo negro con opcional tramo pelado (cobre). */
export function cable(points, { r = 0.009, color = 0x1d1d1f, bareAt = null } = {}) {
  const g = group([], { name: 'cable' });
  g.add(tube(points, r, M.rubber(color)));
  if (bareAt) {
    const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)));
    const p = curve.getPoint(bareAt), t = curve.getTangent(bareAt);
    const seg = cyl(r * 0.75, r * 0.75, 0.09, M.copper());
    seg.position.copy(p); seg.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), t.normalize());
    seg.name = 'cobre'; g.add(seg);
    g.userData.bare = seg;
  }
  return g;
}

/** Charco en el piso. */
export function puddle(rx = 0.5, rz = 0.35, color = 0x4e6f9a) {
  const m = mesh(new THREE.CircleGeometry(1, 40), new THREE.MeshPhysicalMaterial({
    color, roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.7, clearcoat: 1, clearcoatRoughness: 0.02,
  }), { rot: [-Math.PI / 2, 0, 0], cast: false });
  m.scale.set(rx, rz, 1); m.position.y = 0.004; m.name = 'charco';
  return m;
}

/** Rack industrial de dos niveles. */
export function rack({ w = 2.4, d = 1.0, h = 3.0, levels = 3, color = 0x1f5fa8, beam = 0xf28c28 } = {}) {
  const g = group([], { name: 'rack' });
  const up = M.paint(color, { roughness: 0.5 }), bm = M.paint(beam, { roughness: 0.5 });
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) g.add(box(0.08, h, 0.08, up, { pos: [sx * (w / 2 - 0.04), h / 2, sz * (d / 2 - 0.04)], r: 0.004 }));
  for (let l = 0; l < levels; l++) {
    const y = 0.15 + l * (h - 0.3) / (levels - 1);
    for (const sz of [-1, 1]) g.add(box(w - 0.16, 0.1, 0.05, bm, { pos: [0, y, sz * (d / 2 - 0.04)], r: 0.004 }));
    g.add(box(w - 0.2, 0.02, d - 0.14, M.metal(0x6b7480), { pos: [0, y + 0.06, 0], r: 0.002 }));
  }
  return g;
}

export { T, M };
