import * as THREE from 'three';
import * as T from './textures.js';

const cache = new Map();
function memo(key, fn) { if (!cache.has(key)) cache.set(key, fn()); return cache.get(key); }

/** Pintura industrial con barniz (metálica ligera). */
export function paint(color, { roughness = 0.42, metalness = 0.15, clearcoat = 0.35 } = {}) {
  return memo(`paint${color}${roughness}${metalness}${clearcoat}`, () => new THREE.MeshPhysicalMaterial({
    color, roughness, metalness, clearcoat, clearcoatRoughness: 0.25,
    roughnessMap: T.noise({ base: 150, variation: 70, seed: 2 }),
  }));
}

/** Acero galvanizado / aluminio. */
export function metal(color = 0x9aa3ad, { roughness = 0.38, metalness = 0.85 } = {}) {
  return memo(`metal${color}${roughness}${metalness}`, () => new THREE.MeshStandardMaterial({
    color, roughness, metalness, roughnessMap: T.noise({ base: 120, variation: 90, seed: 8 }),
  }));
}

export const darkMetal = () => metal(0x3a3f46, { roughness: 0.5, metalness: 0.7 });
export const steel = () => metal(0xb4bcc6, { roughness: 0.32 });
export const copper = () => metal(0xc8763a, { roughness: 0.35, metalness: 0.9 });

export function rubber(color = 0x1b1b1d) {
  return memo(`rubber${color}`, () => new THREE.MeshStandardMaterial({ color, roughness: 0.92, metalness: 0 }));
}

export function plastic(color, { roughness = 0.5 } = {}) {
  return memo(`plastic${color}${roughness}`, () => new THREE.MeshStandardMaterial({ color, roughness, metalness: 0.05 }));
}

export function matte(color, { roughness = 0.85 } = {}) {
  return memo(`matte${color}${roughness}`, () => new THREE.MeshStandardMaterial({ color, roughness, metalness: 0 }));
}

export function fabric(color) {
  return memo(`fabric${color}`, () => new THREE.MeshStandardMaterial({
    color, roughness: 0.95, metalness: 0, bumpMap: T.noise({ size: 128, base: 128, variation: 120, seed: 4, repeat: [8, 8] }), bumpScale: 0.002,
  }));
}

export function emissive(color, intensity = 1.2) {
  return memo(`emis${color}${intensity}`, () => new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: intensity, roughness: 0.4 }));
}

export function glass(color = 0xcfe8ff) {
  return memo(`glass${color}`, () => new THREE.MeshPhysicalMaterial({
    color, roughness: 0.05, metalness: 0, transmission: 0.6, transparent: true, opacity: 0.55, thickness: 0.01,
  }));
}

export function wood() {
  return memo('wood', () => new THREE.MeshStandardMaterial({ map: T.planks(), roughness: 0.8, metalness: 0 }));
}

export function cardboard() {
  return memo('cardboard', () => new THREE.MeshStandardMaterial({ map: T.cardboard(), roughness: 0.9, metalness: 0 }));
}

export function hazard(repeat = [2, 1]) {
  return memo(`hazard${repeat}`, () => new THREE.MeshStandardMaterial({ map: T.hazardStripes({ repeat }), roughness: 0.6, metalness: 0.1 }));
}

export function concreteFloor(repeat = [6, 6]) {
  return memo(`concrete${repeat}`, () => new THREE.MeshStandardMaterial({ map: T.concrete({ repeat }), roughness: 0.95, metalness: 0 }));
}

export function epoxyFloor(repeat = [12, 12]) {
  return memo(`epoxy${repeat}`, () => new THREE.MeshStandardMaterial({ map: T.epoxyFloor({ repeat }), roughness: 0.35, metalness: 0.05 }));
}

export function wall(repeat = [8, 2]) {
  return memo(`wall${repeat}`, () => new THREE.MeshStandardMaterial({ map: T.wallPanels({ repeat }), roughness: 0.9, metalness: 0 }));
}

/** Material de rótulo (textura de etiqueta, sin repetir). */
export function labelMat(opts) {
  return new THREE.MeshStandardMaterial({ map: T.label(opts), roughness: 0.6, metalness: 0.05 });
}

/** Material ligero sin iluminación para UI. */
export function uiMat(texture) {
  return new THREE.MeshBasicMaterial({ map: texture, transparent: true, toneMapped: false, side: THREE.DoubleSide });
}
