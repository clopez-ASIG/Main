import * as THREE from 'three';
import * as T from './textures.js';

const HOVER = new THREE.Color(0x0086FC);
const effects = new Set();
const markers = new Set();

function ensureOwnMaterial(m) {
  if (!m.material || !('emissive' in m.material)) return null;
  if (!m.userData.ownMat) { m.material = m.material.clone(); m.userData.ownMat = true; m.userData.em0 = m.material.emissive.clone(); m.userData.emi0 = m.material.emissiveIntensity; }
  return m.material;
}

/** Resaltado emisivo genérico al apuntar. */
export function setHover(root, on) {
  root.traverse(m => {
    if (!m.isMesh || m.userData.noHighlight) return;
    const mat = ensureOwnMaterial(m); if (!mat) return;
    if (on) { mat.emissive.copy(HOVER); mat.emissiveIntensity = 0.45; }
    else if (!m.userData.lockedEmissive) { mat.emissive.copy(m.userData.em0); mat.emissiveIntensity = m.userData.emi0; }
  });
}

/** Fija un color emisivo permanente (p. ej. verde al acertar). */
export function lockEmissive(root, color, intensity = 0.35) {
  root.traverse(m => {
    if (!m.isMesh || m.userData.noHighlight) return;
    const mat = ensureOwnMaterial(m); if (!mat) return;
    m.userData.lockedEmissive = true;
    mat.emissive.set(color); mat.emissiveIntensity = intensity;
  });
}

/** Destello temporal (rojo al errar). */
export function flash(root, color = 0xE0352B, duration = 0.5) {
  const meshes = [];
  root.traverse(m => { if (m.isMesh && !m.userData.noHighlight && ensureOwnMaterial(m)) meshes.push(m); });
  const fx = { t: 0, duration, update(dt) {
    fx.t += dt; const k = Math.max(0, 1 - fx.t / duration);
    for (const m of meshes) {
      if (m.userData.lockedEmissive) continue;
      m.material.emissive.set(color); m.material.emissiveIntensity = 0.9 * k;
      if (k <= 0) { m.material.emissive.copy(m.userData.em0); m.material.emissiveIntensity = m.userData.emi0; }
    }
    return fx.t < duration;
  } };
  effects.add(fx);
}

/** Marcador flotante sobre un objeto. kind: ok | bad | info. */
export function addMarker(root, kind = 'ok', { ttl = 0, size = 0.11, offset = 0.08 } = {}) {
  const box = new THREE.Box3().setFromObject(root);
  const center = box.getCenter(new THREE.Vector3());
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: T.markerTexture(kind), transparent: true, depthTest: false, toneMapped: false }));
  sprite.scale.set(size, size, 1);
  sprite.position.set(center.x, box.max.y + offset, center.z);
  sprite.renderOrder = 20;
  root.parent ? root.parent.add(sprite) : root.add(sprite);
  // convertir a espacio local del padre
  if (root.parent) root.parent.worldToLocal(sprite.position);
  const rec = { sprite, t: 0, ttl, base: sprite.position.y, update(dt) {
    rec.t += dt;
    sprite.position.y = rec.base + Math.sin(rec.t * 3) * 0.012;
    if (ttl && rec.t > ttl) { sprite.material.opacity = Math.max(0, 1 - (rec.t - ttl) / 0.4); if (rec.t > ttl + 0.4) { sprite.removeFromParent(); markers.delete(rec); } }
  } };
  markers.add(rec);
  return sprite;
}

export function clearMarkers() { for (const r of markers) r.sprite.removeFromParent(); markers.clear(); }

/** Chispas (eléctrico). */
export class Sparks {
  constructor(count = 40, color = 0xffd27a) {
    this.count = count;
    const geo = new THREE.BufferGeometry();
    this.pos = new Float32Array(count * 3); this.vel = new Float32Array(count * 3); this.life = new Float32Array(count);
    geo.setAttribute('position', new THREE.BufferAttribute(this.pos, 3));
    this.points = new THREE.Points(geo, new THREE.PointsMaterial({ color, size: 0.02, map: T.dot(), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false }));
    this.points.frustumCulled = false;
    for (let i = 0; i < count; i++) this._reset(i, true);
    this.light = new THREE.PointLight(color, 0, 0.8);
    this.points.add(this.light);
    this.t = 0; this.active = true;
  }
  _reset(i, rand = false) {
    this.pos[i * 3] = 0; this.pos[i * 3 + 1] = 0; this.pos[i * 3 + 2] = 0;
    const a = Math.random() * Math.PI * 2, s = 0.4 + Math.random() * 0.9;
    this.vel[i * 3] = Math.cos(a) * s; this.vel[i * 3 + 1] = 0.6 + Math.random() * 1.2; this.vel[i * 3 + 2] = Math.sin(a) * s;
    this.life[i] = rand ? Math.random() : 0;
  }
  update(dt) {
    if (!this.active) { this.points.visible = false; return; }
    this.points.visible = true; this.t += dt;
    for (let i = 0; i < this.count; i++) {
      this.life[i] += dt;
      if (this.life[i] > 0.6) { this._reset(i); continue; }
      this.vel[i * 3 + 1] -= 4.5 * dt;
      this.pos[i * 3] += this.vel[i * 3] * dt; this.pos[i * 3 + 1] += this.vel[i * 3 + 1] * dt; this.pos[i * 3 + 2] += this.vel[i * 3 + 2] * dt;
    }
    this.points.geometry.attributes.position.needsUpdate = true;
    this.light.intensity = (Math.random() > 0.7 ? 1.6 : 0.3);
  }
}

/** Pulso de escala suave para llamar la atención. */
export function pulse(obj, { amount = 0.06, speed = 2.5, duration = 3 } = {}) {
  const base = obj.scale.clone();
  const fx = { t: 0, update(dt) {
    fx.t += dt; const k = 1 + Math.sin(fx.t * speed * Math.PI) * amount;
    obj.scale.set(base.x * k, base.y * k, base.z * k);
    if (fx.t >= duration) { obj.scale.copy(base); return false; }
    return true;
  } };
  effects.add(fx);
}

/** Animación genérica. fn(t01) devuelve true al terminar. */
export function tween(duration, fn, onDone) {
  const fx = { t: 0, update(dt) {
    fx.t += dt; const k = Math.min(1, fx.t / duration);
    fn(k * k * (3 - 2 * k));
    if (k >= 1) { onDone?.(); return false; }
    return true;
  } };
  effects.add(fx);
}

export function updateFx(dt) {
  for (const fx of effects) { if (fx.update(dt) === false) effects.delete(fx); }
  for (const m of markers) m.update(dt);
}
