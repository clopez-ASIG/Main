import * as THREE from 'three';
import { setHover } from './fx.js';
import { audio } from './audio.js';

function isVisible(o) { while (o) { if (o.visible === false) return false; o = o.parent; } return true; }

/**
 * Selección por rayo: controles y manos en XR (eventos select), ratón en escritorio.
 * Los objetos se registran con add(obj, {onSelect}). El hover llama a obj.userData.hover(bool)
 * si existe; si no, aplica un resaltado emisivo genérico.
 */
export class Interaction {
  constructor(renderer, scene, camera) {
    this.renderer = renderer; this.scene = scene; this.camera = camera;
    this.targets = new Set();
    this.raycaster = new THREE.Raycaster();
    this.raycaster.far = 8;
    this.mouse = new THREE.Vector2(-10, -10);
    this.hovered = [null, null, null]; // 0,1 controles; 2 ratón
    this.enabled = true;
    this.sources = [];
    this._setupXR();
    this._setupMouse();
  }

  _setupXR() {
    const rayGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -1)]);
    for (let i = 0; i < 2; i++) {
      const ctrl = this.renderer.xr.getController(i);
      const line = new THREE.Line(rayGeo, new THREE.LineBasicMaterial({ color: 0x0086FC, transparent: true, opacity: 0.75 }));
      line.scale.z = 3; line.name = 'ray';
      ctrl.add(line);
      const cursor = new THREE.Mesh(new THREE.SphereGeometry(0.012, 16, 12), new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false }));
      cursor.visible = false; cursor.name = 'cursor';
      this.scene.add(cursor);
      ctrl.userData.cursor = cursor; ctrl.userData.line = line; ctrl.userData.index = i;
      ctrl.addEventListener('connected', (e) => { ctrl.userData.inputSource = e.data; ctrl.userData.connected = true; });
      ctrl.addEventListener('disconnected', () => { ctrl.userData.connected = false; cursor.visible = false; });
      ctrl.addEventListener('selectstart', () => this._activate(i));
      this.scene.add(ctrl);
      this.sources.push(ctrl);
    }
  }

  _setupMouse() {
    const el = this.renderer.domElement;
    let down = null;
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      this.mouse.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    });
    el.addEventListener('pointerdown', (e) => { down = [e.clientX, e.clientY]; });
    el.addEventListener('pointerup', (e) => {
      if (!down) return;
      const moved = Math.hypot(e.clientX - down[0], e.clientY - down[1]);
      down = null;
      if (moved < 6) { audio.unlock(); this._activate(2); }
    });
  }

  add(obj, { onSelect } = {}) {
    obj.userData.interactive = true;
    if (onSelect) obj.userData.onSelect = onSelect;
    obj.traverse(o => { o.userData.interRoot = obj; });
    this.targets.add(obj);
  }
  remove(obj) { this.targets.delete(obj); this._unhoverAll(obj); }
  clear() { for (const t of [...this.targets]) this.remove(t); }

  _unhoverAll(obj) {
    this.hovered.forEach((h, i) => { if (h === obj) { this._setHover(obj, false); this.hovered[i] = null; } });
  }

  _setHover(obj, on) {
    if (!obj) return;
    if (obj.userData.hover) obj.userData.hover(on); else setHover(obj, on);
  }

  _activate(i) {
    if (!this.enabled) return;
    const obj = this.hovered[i];
    if (!obj || !obj.userData.onSelect) return;
    const src = this.sources[i];
    const gp = src?.userData?.inputSource?.gamepad;
    try { gp?.hapticActuators?.[0]?.pulse(0.7, 50); } catch {}
    obj.userData.onSelect(obj, i);
  }

  _cast(origin, dir) {
    this.raycaster.set(origin, dir);
    const hits = this.raycaster.intersectObjects([...this.targets], true);
    for (const h of hits) {
      if (!isVisible(h.object)) continue;
      let root = h.object.userData.interRoot;
      if (root && this.targets.has(root)) return { root, point: h.point, distance: h.distance };
    }
    return null;
  }

  _updateHover(i, hit) {
    const prev = this.hovered[i];
    const next = hit ? hit.root : null;
    if (prev !== next) {
      if (prev) this._setHover(prev, false);
      if (next) {
        this._setHover(next, true);
        const gp = this.sources[i]?.userData?.inputSource?.gamepad;
        try { gp?.hapticActuators?.[0]?.pulse(0.25, 20); } catch {}
      }
      this.hovered[i] = next;
    }
  }

  update() {
    const xr = this.renderer.xr.isPresenting;
    const origin = new THREE.Vector3(), dir = new THREE.Vector3(), q = new THREE.Quaternion();
    if (xr) {
      this.sources.forEach((ctrl, i) => {
        const cursor = ctrl.userData.cursor;
        if (!ctrl.userData.connected) { cursor.visible = false; this._updateHover(i, null); return; }
        ctrl.getWorldPosition(origin); ctrl.getWorldQuaternion(q);
        dir.set(0, 0, -1).applyQuaternion(q);
        const hit = this.enabled ? this._cast(origin, dir) : null;
        this._updateHover(i, hit);
        if (hit) { cursor.visible = true; cursor.position.copy(hit.point); ctrl.userData.line.scale.z = hit.distance; }
        else { cursor.visible = false; ctrl.userData.line.scale.z = 3; }
      });
      if (this.hovered[2]) this._updateHover(2, null);
    } else {
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const hits = this.enabled ? this.raycaster.intersectObjects([...this.targets], true) : [];
      let hit = null;
      for (const h of hits) { if (!isVisible(h.object)) continue; const root = h.object.userData.interRoot; if (root && this.targets.has(root)) { hit = { root, point: h.point }; break; } }
      this._updateHover(2, hit);
      this.renderer.domElement.style.cursor = hit ? 'pointer' : 'default';
    }
  }
}
