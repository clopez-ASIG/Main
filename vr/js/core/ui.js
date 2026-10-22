import * as THREE from 'three';
import { FONTS, wrap, roundRect } from './text.js';
import { CONFIG } from '../config.js';

const PX = 1200; // píxeles por metro en los paneles
const C = CONFIG.colors;

function makeCanvas(w, h) {
  const c = document.createElement('canvas');
  c.width = Math.round(w * PX); c.height = Math.round(h * PX);
  return c;
}

function uiTexture(c) {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  t.minFilter = THREE.LinearMipmapLinearFilter;
  return t;
}

/** Panel de texto: título, cuerpo, pie y etiqueta de progreso. */
export class Panel {
  constructor({ width = 1.0, height = 0.56, title = '', body = '', footer = '', tag = '', accent = C.azul, bg = 'rgba(12,27,48,0.93)', align = 'left' } = {}) {
    this.width = width; this.height = height; this.accent = accent; this.bg = bg; this.align = align;
    this.data = { title, body, footer, tag };
    this.canvas = makeCanvas(width, height);
    this.ctx = this.canvas.getContext('2d');
    this.texture = uiTexture(this.canvas);
    this.mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(width, height),
      new THREE.MeshBasicMaterial({ map: this.texture, transparent: true, toneMapped: false, side: THREE.DoubleSide }),
    );
    this.mesh.renderOrder = 10;
    this.mesh.name = 'panel';
    this.redraw();
  }
  set(data) { Object.assign(this.data, data); this.redraw(); }
  redraw() {
    const { ctx: x, canvas: c } = this;
    const W = c.width, H = c.height, pad = 0.045 * PX, r = 0.03 * PX;
    x.clearRect(0, 0, W, H);
    x.fillStyle = this.bg; roundRect(x, 0, 0, W, H, r); x.fill();
    // barra de acento
    x.fillStyle = this.accent; roundRect(x, pad, pad, 0.012 * PX, H - pad * 2, 6); x.fill();
    const left = pad + 0.035 * PX, maxW = W - left - pad;
    let y = pad - 6;
    // etiqueta (progreso)
    if (this.data.tag) {
      x.font = `700 ${0.028 * PX}px ${FONTS.body}`; x.fillStyle = C.celeste; x.textAlign = 'right'; x.textBaseline = 'top';
      x.fillText(this.data.tag.toUpperCase(), W - pad, y + 4);
    }
    x.textAlign = 'left'; x.textBaseline = 'top';
    if (this.data.title) {
      x.font = `700 ${0.048 * PX}px ${FONTS.display}`; x.fillStyle = '#ffffff';
      const titleMax = this.data.tag ? maxW - 0.3 * PX : maxW;
      for (const line of wrap(x, this.data.title, titleMax)) { x.fillText(line, left, y); y += 0.058 * PX; }
      y += 0.014 * PX;
    }
    if (this.data.body) {
      x.font = `400 ${0.036 * PX}px ${FONTS.body}`; x.fillStyle = C.claro;
      for (const para of String(this.data.body).split('\n')) {
        if (para.startsWith('Pista:')) { x.fillStyle = C.amarillo; } else { x.fillStyle = C.claro; }
        if (para === '') { y += 0.02 * PX; continue; }
        for (const line of wrap(x, para, maxW)) { x.fillText(line, left, y); y += 0.046 * PX; }
      }
    }
    if (this.data.footer) {
      x.font = `700 ${0.027 * PX}px ${FONTS.body}`; x.fillStyle = C.gris2 || '#9FB0C4'; x.textBaseline = 'bottom';
      x.fillText(this.data.footer, left, H - pad + 6);
    }
    this.texture.needsUpdate = true;
  }
  dispose() { this.texture.dispose(); this.mesh.geometry.dispose(); this.mesh.material.dispose(); }
}

/** Botón 3D con estados. */
export class Button {
  constructor({ label, sub = '', width = 0.44, height = 0.1, color = C.azul, fontSize = 0.036, onSelect = null, textColor = '#ffffff' } = {}) {
    this.width = width; this.height = height; this.color = color; this.baseColor = color; this.label = label; this.sub = sub;
    this.fontSize = fontSize; this.textColor = textColor;
    this.state = 'idle'; this.hovered = false; this.selected = false;
    this.canvas = makeCanvas(width, height);
    this.ctx = this.canvas.getContext('2d');
    this.texture = uiTexture(this.canvas);
    this.mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(width, height),
      new THREE.MeshBasicMaterial({ map: this.texture, transparent: true, toneMapped: false, side: THREE.DoubleSide }),
    );
    this.mesh.renderOrder = 11;
    this.mesh.name = 'button';
    this.mesh.userData.interactive = true;
    this.mesh.userData.label = label;
    this.mesh.userData.onSelect = () => { if (this.state !== 'disabled' && onSelect) onSelect(this); };
    this.mesh.userData.hover = (on) => { this.hovered = on; this.redraw(); };
    this.redraw();
  }
  setState(s) { this.state = s; this.redraw(); }
  setSelected(b) { this.selected = b; this.redraw(); }
  setLabel(label, sub) { this.label = label; if (sub !== undefined) this.sub = sub; this.mesh.userData.label = label; this.redraw(); }
  redraw() {
    const { ctx: x, canvas: c } = this, W = c.width, H = c.height, r = 0.022 * PX;
    x.clearRect(0, 0, W, H);
    let fill = this.baseColor;
    if (this.state === 'correct') fill = C.verde;
    else if (this.state === 'wrong') fill = C.rojo;
    else if (this.state === 'disabled') fill = 'rgba(107,122,143,0.6)';
    x.fillStyle = fill; roundRect(x, 2, 2, W - 4, H - 4, r); x.fill();
    if (this.hovered && this.state !== 'disabled') { x.fillStyle = 'rgba(255,255,255,0.18)'; roundRect(x, 2, 2, W - 4, H - 4, r); x.fill(); }
    if (this.selected) { x.strokeStyle = C.amarillo; x.lineWidth = 0.008 * PX; roundRect(x, 6, 6, W - 12, H - 12, r); x.stroke(); }
    else if (this.hovered) { x.strokeStyle = 'rgba(255,255,255,0.9)'; x.lineWidth = 0.005 * PX; roundRect(x, 4, 4, W - 8, H - 8, r); x.stroke(); }
    x.fillStyle = this.state === 'disabled' ? 'rgba(255,255,255,0.7)' : this.textColor; x.textAlign = 'center';
    const fs = this.fontSize * PX, pad = 0.03 * PX;
    x.font = `700 ${fs}px ${FONTS.body}`;
    let lines = wrap(x, this.label, W - pad * 2);
    // reduce si no cabe
    let size = fs;
    while (lines.length * size * 1.15 + (this.sub ? size * 0.9 : 0) > H - pad && size > fs * 0.6) { size *= 0.9; x.font = `700 ${size}px ${FONTS.body}`; lines = wrap(x, this.label, W - pad * 2); }
    const subH = this.sub ? size * 0.85 : 0;
    const total = lines.length * size * 1.15 + subH;
    let y = (H - total) / 2;
    x.textBaseline = 'top';
    for (const l of lines) { x.fillText(l, W / 2, y); y += size * 1.15; }
    if (this.sub) { x.font = `400 ${size * 0.68}px ${FONTS.body}`; x.fillStyle = 'rgba(255,255,255,0.85)'; x.fillText(this.sub, W / 2, y + size * 0.1); }
    this.texture.needsUpdate = true;
  }
  dispose() { this.texture.dispose(); this.mesh.geometry.dispose(); this.mesh.material.dispose(); }
}

/** Aviso flotante de retroalimentación. */
export class Toast {
  constructor({ width = 0.9, height = 0.13 } = {}) {
    this.panel = new Panel({ width, height, bg: 'rgba(12,27,48,0.95)', accent: C.verde });
    this.mesh = this.panel.mesh; this.mesh.visible = false; this.timer = 0;
  }
  show(text, ok = true, seconds = 2.2) {
    this.panel.accent = ok ? C.verde : C.rojo;
    this.panel.set({ title: '', body: text, tag: ok ? 'Correcto' : 'Incorrecto' });
    this.mesh.visible = true; this.timer = seconds;
  }
  hide() { this.mesh.visible = false; this.timer = 0; }
  update(dt) { if (this.timer > 0) { this.timer -= dt; if (this.timer <= 0) this.mesh.visible = false; } }
}

/** Tarjeta de imagen (logo) sobre fondo blanco redondeado. */
export function imageCard(image, width = 0.6, height = 0.2, bg = '#ffffff') {
  const c = makeCanvas(width, height), x = c.getContext('2d');
  x.fillStyle = bg; roundRect(x, 0, 0, c.width, c.height, 0.02 * PX); x.fill();
  if (image) {
    const pad = 0.02 * PX;
    const s = Math.min((c.width - pad * 2) / image.width, (c.height - pad * 2) / image.height);
    const w = image.width * s, h = image.height * s;
    x.drawImage(image, (c.width - w) / 2, (c.height - h) / 2, w, h);
  }
  const t = uiTexture(c);
  const m = new THREE.Mesh(new THREE.PlaneGeometry(width, height), new THREE.MeshBasicMaterial({ map: t, transparent: true, toneMapped: false }));
  m.renderOrder = 10;
  return m;
}

export function loadImage(src) {
  return new Promise((res) => { const im = new Image(); im.onload = () => res(im); im.onerror = () => res(null); im.src = src; });
}
