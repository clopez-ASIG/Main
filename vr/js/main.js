import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { loadFonts } from './core/text.js';
import { Interaction } from './core/interact.js';
import { Runner } from './core/runner.js';
import { Lobby } from './core/lobby.js';
import { buildWarehouse, buildShadowCatcher, setupLights } from './core/env.js';
import { audio } from './core/audio.js';
import { CONFIG } from './config.js';
import altura from './modules/altura.js';
import electrica from './modules/electrica.js';
import montacargas from './modules/montacargas.js';
import peligros from './modules/peligros.js';

const MODULES = [altura, electrica, montacargas, peligros];
const $ = (s) => document.querySelector(s);

async function boot() {
  $('#status').textContent = 'Cargando…';
  await loadFonts();

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.xr.enabled = true;
  renderer.xr.setReferenceSpaceType('local-floor');
  $('#app').appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.05, 80);
  camera.position.set(0.1, 1.65, 0.6);

  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.55;

  const lights = setupLights(scene);
  const warehouse = buildWarehouse(); scene.add(warehouse);
  const shadowCatcher = buildShadowCatcher(); shadowCatcher.visible = false; scene.add(shadowCatcher);
  const BG = new THREE.Color(0xcfd6de);
  scene.background = BG; scene.fog = new THREE.Fog(BG, 14, 40);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0.1, 1.2, -2.0); controls.enableDamping = true; controls.dampingFactor = 0.08;
  controls.maxPolarAngle = 1.62; controls.minDistance = 0.3; controls.maxDistance = 7;
  controls.update();

  const interaction = new Interaction(renderer, scene, camera);
  let isAR = false;

  const runner = new Runner({ scene, interaction, onExit: () => { lobby.show(); $('#hud').classList.remove('in-module'); } });
  runner.onResult = (r) => { try { const k = 'asig-vr-resultados'; const arr = JSON.parse(localStorage.getItem(k) || '[]'); arr.push({ ...r, at: new Date().toISOString() }); localStorage.setItem(k, JSON.stringify(arr.slice(-50))); } catch {} };
  const lobby = new Lobby({ scene, interaction, modules: MODULES, onStart: (m, mode) => { lobby.hide(); runner.start(m, mode, isAR); $('#hud').classList.add('in-module'); } });

  $('#btn-menu').addEventListener('click', () => runner.exit());

  // ---------- WebXR ----------
  async function supported(mode) { try { return !!(navigator.xr && await navigator.xr.isSessionSupported(mode)); } catch { return false; } }
  const arOK = await supported('immersive-ar'), vrOK = await supported('immersive-vr');
  $('#btn-ar').hidden = !arOK; $('#btn-vr').hidden = !vrOK;
  $('#status').textContent = arOK || vrOK ? 'Listo. Elija cómo entrar.' : 'Vista de escritorio: WebXR no disponible en este navegador.';

  async function enter(mode) {
    audio.unlock();
    const init = mode === 'immersive-ar'
      ? { requiredFeatures: ['local-floor'], optionalFeatures: ['hand-tracking', 'hit-test', 'dom-overlay'], domOverlay: { root: document.body } }
      : { requiredFeatures: ['local-floor'], optionalFeatures: ['hand-tracking', 'bounded-floor'] };
    try {
      const session = await navigator.xr.requestSession(mode, init);
      await renderer.xr.setSession(session);
    } catch (e) {
      // reintento sin funciones opcionales
      try { const session = await navigator.xr.requestSession(mode, { requiredFeatures: ['local-floor'] }); await renderer.xr.setSession(session); }
      catch (e2) { $('#status').textContent = 'No se pudo iniciar la sesión XR: ' + (e2.message || e2); }
    }
  }
  $('#btn-ar').addEventListener('click', () => enter('immersive-ar'));
  $('#btn-vr').addEventListener('click', () => enter('immersive-vr'));

  renderer.xr.addEventListener('sessionstart', () => {
    const s = renderer.xr.getSession();
    isAR = s.environmentBlendMode && s.environmentBlendMode !== 'opaque';
    document.body.classList.add('xr');
    if (isAR) {
      scene.background = null; scene.fog = null; warehouse.visible = false; shadowCatcher.visible = true;
      lights.hemi.intensity = 0.7; lights.sun.intensity = 1.8; scene.environmentIntensity = 0.45;
    } else {
      scene.background = BG; scene.fog = new THREE.Fog(BG, 14, 40); warehouse.visible = true; shadowCatcher.visible = false;
    }
    controls.enabled = false;
  });
  renderer.xr.addEventListener('sessionend', () => {
    isAR = false; document.body.classList.remove('xr');
    scene.background = BG; scene.fog = new THREE.Fog(BG, 14, 40); warehouse.visible = true; shadowCatcher.visible = false;
    lights.hemi.intensity = 0.9; lights.sun.intensity = 2.2; scene.environmentIntensity = 0.55;
    controls.enabled = true;
  });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  const clock = new THREE.Clock();
  renderer.setAnimationLoop(() => {
    const dt = Math.min(clock.getDelta(), 0.05);
    if (!renderer.xr.isPresenting) controls.update();
    interaction.update();
    runner.update(dt);
    renderer.render(scene, camera);
  });

  window.__asigvr = { scene, renderer, camera, runner, lobby, MODULES, interaction };
  $('#brand-title').textContent = `${CONFIG.brand} · ${CONFIG.appTitle}`;
}

boot().catch(e => { console.error(e); $('#status').textContent = 'Error al iniciar: ' + (e.message || e); });
