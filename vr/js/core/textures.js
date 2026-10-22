import * as THREE from 'three';

export function canvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  return c;
}

export function toTexture(c, { repeat = [1, 1], srgb = true, wrap = true } = {}) {
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  if (wrap) t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeat[0], repeat[1]);
  t.anisotropy = 8;
  t.needsUpdate = true;
  return t;
}

function rng(seed) {
  let s = seed % 2147483647; if (s <= 0) s += 2147483646;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}

const cache = new Map();
function memo(key, fn) { if (!cache.has(key)) cache.set(key, fn()); return cache.get(key); }

/** Franjas diagonales de advertencia. */
export function hazardStripes({ a = '#FFD800', b = '#141414', size = 256, repeat = [1, 1] } = {}) {
  return memo(`stripes${a}${b}${size}${repeat}`, () => {
    const c = canvas(size, size), x = c.getContext('2d');
    x.fillStyle = a; x.fillRect(0, 0, size, size);
    x.fillStyle = b;
    const w = size / 4;
    for (let i = -size; i < size * 2; i += w * 2) {
      x.beginPath();
      x.moveTo(i, 0); x.lineTo(i + w, 0); x.lineTo(i + w - size, size); x.lineTo(i - size, size);
      x.closePath(); x.fill();
    }
    return toTexture(c, { repeat });
  });
}

/** Ruido fino (para rugosidad o manchas). */
export function noise({ size = 256, base = 140, variation = 60, seed = 3, srgb = false, repeat = [1, 1] } = {}) {
  return memo(`noise${size}${base}${variation}${seed}${srgb}${repeat}`, () => {
    const c = canvas(size, size), x = c.getContext('2d');
    const img = x.createImageData(size, size), r = rng(seed);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = Math.max(0, Math.min(255, base + (r() - 0.5) * variation));
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255;
    }
    x.putImageData(img, 0, 0);
    return toTexture(c, { srgb, repeat });
  });
}

/** Concreto gris con manchas suaves. */
export function concrete({ size = 512, seed = 11, tint = [128, 130, 133], repeat = [1, 1] } = {}) {
  return memo(`concrete${seed}${tint}${repeat}`, () => {
    const c = canvas(size, size), x = c.getContext('2d'), r = rng(seed);
    x.fillStyle = `rgb(${tint[0]},${tint[1]},${tint[2]})`; x.fillRect(0, 0, size, size);
    for (let i = 0; i < 90; i++) {
      const g = x.createRadialGradient(r() * size, r() * size, 0, 0, 0, 0);
      const cx = r() * size, cy = r() * size, rad = 20 + r() * 120;
      const gg = x.createRadialGradient(cx, cy, 0, cx, cy, rad);
      const d = (r() - 0.5) * 30;
      gg.addColorStop(0, `rgba(${tint[0] + d},${tint[1] + d},${tint[2] + d},0.5)`);
      gg.addColorStop(1, 'rgba(0,0,0,0)');
      x.fillStyle = gg; x.fillRect(cx - rad, cy - rad, rad * 2, rad * 2);
      void g;
    }
    const img = x.getImageData(0, 0, size, size);
    for (let i = 0; i < img.data.length; i += 4) {
      const n = (r() - 0.5) * 22;
      img.data[i] += n; img.data[i + 1] += n; img.data[i + 2] += n;
    }
    x.putImageData(img, 0, 0);
    return toTexture(c, { repeat });
  });
}

/** Piso epóxico de bodega: gris con línea amarilla de pasillo cada 2 m (loseta de 2×2 m). */
export function epoxyFloor({ size = 1024, repeat = [1, 1] } = {}) {
  return memo(`epoxy${repeat}`, () => {
    const c = canvas(size, size), x = c.getContext('2d'), r = rng(21);
    x.fillStyle = '#8f949a'; x.fillRect(0, 0, size, size);
    const img = x.getImageData(0, 0, size, size);
    for (let i = 0; i < img.data.length; i += 4) {
      const n = (r() - 0.5) * 16;
      img.data[i] += n; img.data[i + 1] += n; img.data[i + 2] += n;
    }
    x.putImageData(img, 0, 0);
    // juntas de losa
    x.strokeStyle = 'rgba(60,62,66,0.55)'; x.lineWidth = 3;
    x.strokeRect(1, 1, size - 2, size - 2);
    x.beginPath(); x.moveTo(size / 2, 0); x.lineTo(size / 2, size); x.moveTo(0, size / 2); x.lineTo(size, size / 2); x.stroke();
    // línea amarilla de pasillo (10 cm sobre 2 m)
    x.fillStyle = '#e8c21a'; x.fillRect(0, 0, size * 0.05, size);
    x.fillStyle = 'rgba(0,0,0,0.12)';
    for (let i = 0; i < 40; i++) x.fillRect(r() * size, r() * size, 2 + r() * 6, 2 + r() * 6);
    return toTexture(c, { repeat });
  });
}

/** Pared industrial clara con juntas de panel. */
export function wallPanels({ size = 512, repeat = [1, 1] } = {}) {
  return memo(`wall${repeat}`, () => {
    const c = canvas(size, size), x = c.getContext('2d'), r = rng(5);
    x.fillStyle = '#d9dde3'; x.fillRect(0, 0, size, size);
    const img = x.getImageData(0, 0, size, size);
    for (let i = 0; i < img.data.length; i += 4) {
      const n = (r() - 0.5) * 10;
      img.data[i] += n; img.data[i + 1] += n; img.data[i + 2] += n;
    }
    x.putImageData(img, 0, 0);
    x.strokeStyle = 'rgba(90,95,105,0.35)'; x.lineWidth = 4;
    x.beginPath(); x.moveTo(0, 2); x.lineTo(size, 2); x.moveTo(2, 0); x.lineTo(2, size); x.stroke();
    return toTexture(c, { repeat });
  });
}

/** Tablas de madera (tarima). */
export function planks({ size = 512, repeat = [1, 1], seed = 9 } = {}) {
  return memo(`planks${seed}${repeat}`, () => {
    const c = canvas(size, size), x = c.getContext('2d'), r = rng(seed);
    const n = 5, h = size / n;
    for (let i = 0; i < n; i++) {
      const base = 150 + (r() - 0.5) * 40;
      x.fillStyle = `rgb(${base + 20},${base - 10},${base - 55})`;
      x.fillRect(0, i * h, size, h);
      x.strokeStyle = 'rgba(70,45,20,0.35)';
      for (let k = 0; k < 14; k++) {
        x.lineWidth = 1 + r() * 2;
        x.beginPath();
        const y = i * h + r() * h;
        x.moveTo(0, y); x.bezierCurveTo(size / 3, y + (r() - 0.5) * 10, size * 2 / 3, y + (r() - 0.5) * 10, size, y + (r() - 0.5) * 6);
        x.stroke();
      }
      x.fillStyle = 'rgba(40,25,10,0.55)'; x.fillRect(0, i * h, size, 4);
    }
    return toTexture(c, { repeat });
  });
}

/** Cartón corrugado con cinta. */
export function cardboard({ size = 256 } = {}) {
  return memo('cardboard', () => {
    const c = canvas(size, size), x = c.getContext('2d'), r = rng(31);
    x.fillStyle = '#b98f5b'; x.fillRect(0, 0, size, size);
    const img = x.getImageData(0, 0, size, size);
    for (let i = 0; i < img.data.length; i += 4) {
      const n = (r() - 0.5) * 18;
      img.data[i] += n; img.data[i + 1] += n; img.data[i + 2] += n;
    }
    x.putImageData(img, 0, 0);
    x.fillStyle = 'rgba(210,190,150,0.8)'; x.fillRect(size * 0.44, 0, size * 0.12, size);
    return toTexture(c);
  });
}

/**
 * Rótulo / etiqueta: líneas de texto sobre fondo. Devuelve textura (no repetida).
 * lines: string | string[]; cada línea puede ser {text, size, color, weight}
 */
export function label({ lines, w = 512, h = 256, bg = '#ffffff', fg = '#111111', font = 'Nunito Sans, Arial, sans-serif',
  size = 56, weight = 700, border = null, borderW = 12, pad = 24, align = 'center', stripes = false } = {}) {
  const c = canvas(w, h), x = c.getContext('2d');
  if (stripes) {
    const p = x.createPattern(hazardStripes().image, 'repeat');
    x.fillStyle = p; x.fillRect(0, 0, w, h);
    x.fillStyle = bg; x.fillRect(pad, pad, w - pad * 2, h - pad * 2);
  } else {
    x.fillStyle = bg; x.fillRect(0, 0, w, h);
  }
  if (border) { x.strokeStyle = border; x.lineWidth = borderW; x.strokeRect(borderW / 2, borderW / 2, w - borderW, h - borderW); }
  const arr = (Array.isArray(lines) ? lines : [lines]).map(l => typeof l === 'string' ? { text: l } : l);
  const sizes = arr.map(l => {
    let sz = l.size || size;
    x.font = `${l.weight || weight} ${sz}px ${l.font || font}`;
    const avail = w - pad * 2 - (border ? borderW * 2 : 0);
    const tw = x.measureText(l.text).width;
    if (tw > avail) sz = Math.floor(sz * avail / tw);
    return sz;
  });
  const total = sizes.reduce((a, b) => a + b * 1.25, 0);
  let y = (h - total) / 2;
  x.textAlign = align; x.textBaseline = 'top';
  const tx = align === 'center' ? w / 2 : align === 'left' ? pad : w - pad;
  arr.forEach((l, i) => {
    x.fillStyle = l.color || fg;
    x.font = `${l.weight || weight} ${sizes[i]}px ${l.font || font}`;
    x.fillText(l.text, tx, y);
    y += sizes[i] * 1.25;
  });
  const t = toTexture(c, { wrap: false });
  t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
  return t;
}

/** Textura radial suave para marcadores (sprites). */
export function markerTexture(kind = 'ok') {
  return memo(`marker${kind}`, () => {
    const s = 128, c = canvas(s, s), x = c.getContext('2d');
    x.beginPath(); x.arc(s / 2, s / 2, s / 2 - 4, 0, Math.PI * 2);
    x.fillStyle = kind === 'ok' ? '#72D353' : kind === 'bad' ? '#E0352B' : '#0086FC';
    x.fill();
    x.lineWidth = 6; x.strokeStyle = '#ffffff'; x.stroke();
    x.strokeStyle = '#fff'; x.lineWidth = 12; x.lineCap = 'round'; x.lineJoin = 'round';
    x.beginPath();
    if (kind === 'ok') { x.moveTo(34, 66); x.lineTo(56, 88); x.lineTo(96, 42); }
    else if (kind === 'bad') { x.moveTo(40, 40); x.lineTo(88, 88); x.moveTo(88, 40); x.lineTo(40, 88); }
    else { x.moveTo(64, 34); x.lineTo(64, 70); x.moveTo(64, 86); x.lineTo(64, 94); }
    x.stroke();
    return toTexture(c, { wrap: false });
  });
}

/** Punto suave para partículas. */
export function dot() {
  return memo('dot', () => {
    const s = 64, c = canvas(s, s), x = c.getContext('2d');
    const g = x.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.4, 'rgba(255,255,255,0.6)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = g; x.fillRect(0, 0, s, s);
    return toTexture(c, { wrap: false });
  });
}
