import * as THREE from 'three';
import { Panel, Button, Toast } from './ui.js';
import { audio } from './audio.js';
import { addMarker, clearMarkers, flash, lockEmissive, updateFx } from './fx.js';
import { CONFIG } from '../config.js';

const C = CONFIG.colors;
// Ubicación del panel de instrucciones: a la izquierda del escenario, girado hacia la persona.
export const PANEL = { pos: [-1.05, 1.5, -1.45], rotY: 0.38 };

/**
 * Ejecuta un módulo: intro → ejercicios → resultados.
 * Contrato de módulo: { id, title, short, minutes, color, intro, build(ctx) -> { steps } }
 * Contrato de ejercicio: { title, text, hint, kind: pick|find|sequence|choice, targets, correct, order, options,
 *   onEnter, onCorrect(obj, ctx, i), onWrong(obj, ctx), onComplete, onExit, explain }
 */
export class Runner {
  constructor({ scene, interaction, onExit }) {
    this.scene = scene; this.inter = interaction; this.onExit = onExit;
    this.ui = new THREE.Group(); this.ui.name = 'runner-ui';
    this.ui.position.set(...PANEL.pos); this.ui.rotation.y = PANEL.rotY;
    this.panel = new Panel({ width: 1.0, height: 0.62 });
    this.ui.add(this.panel.mesh);
    this.toast = new Toast({ width: 1.0, height: 0.15 });
    this.toast.mesh.position.set(0, 0.46, 0.02);
    this.ui.add(this.toast.mesh);
    this.buttons = [];
    this.active = false;
    this.stage = null;
    this.menuBtn = new Button({ label: 'Menú', width: 0.26, height: 0.07, color: 'rgba(107,122,143,0.9)', fontSize: 0.03, onSelect: () => this.exit() });
    this.menuBtn.mesh.position.set(-0.37, -0.38, 0.01);
    this.ui.add(this.menuBtn.mesh);
    this.ui.visible = false;
    scene.add(this.ui);
  }

  start(def, mode = 'entrenamiento', isAR = false) {
    this.cleanupStage();
    this.def = def; this.mode = mode; this.isAR = isAR;
    this.stage = new THREE.Group(); this.stage.name = `modulo-${def.id}`;
    this.scene.add(this.stage);
    this.ctx = { group: this.stage, mode, isAR, runner: this, toast: (t, ok) => this.toast.show(t, ok) };
    const built = def.build(this.ctx);
    this.built = built;
    this.steps = built.steps;
    this.score = 100; this.hits = 0; this.errors = 0; this.startTime = null; this.stepIndex = -1;
    this.active = true; this.ui.visible = true;
    this.panel.accent = def.color || C.azul;
    this.showIntro();
  }

  // ---------- pantallas ----------
  showIntro() {
    this.clearButtons(); this.inter.clear(); this.inter.add(this.menuBtn.mesh);
    const n = this.steps.length;
    this.panel.set({
      tag: this.mode === 'examen' ? 'Modo examen' : 'Modo entrenamiento',
      title: this.def.title,
      body: this.def.intro,
      footer: `${n} ejercicios · ${this.def.minutes} min aprox. · Aprueba con ${CONFIG.passScore} puntos`,
    });
    this.addButton({ label: 'Comenzar', color: this.def.color || C.azul, onSelect: () => { audio.click(); this.enterStep(0); } });
    audio.speak(`${this.def.title}. ${this.def.intro}`);
  }

  enterStep(i) {
    if (i >= this.steps.length) return this.finish();
    if (this.startTime === null) this.startTime = performance.now();
    const prev = this.steps[this.stepIndex];
    if (prev) prev.onExit?.(this.ctx);
    this.stepIndex = i;
    const step = this.steps[i];
    this.clearButtons(); this.inter.clear(); this.inter.add(this.menuBtn.mesh); clearMarkers();
    this.remaining = new Set(step.correct || []);
    this.seqIndex = 0;
    this.locked = false;
    step.onEnter?.(this.ctx);
    this.redrawStep();
    const n = this.steps.length;
    audio.speak(`Ejercicio ${i + 1} de ${n}. ${step.title}. ${step.text}`);

    if (step.kind === 'choice') {
      step.options.forEach((opt) => {
        this.addButton({ label: opt.label, color: 'rgba(0,112,196,0.95)', onSelect: (btn) => this.onChoice(step, opt, btn) });
      });
    } else {
      const targets = step.targets || [...(step.correct || []), ...(step.order || []), ...(step.decoys || [])];
      for (const obj of targets) this.inter.add(obj, { onSelect: (o) => this.onPick(step, o) });
    }
  }

  redrawStep() {
    const step = this.steps[this.stepIndex], n = this.steps.length;
    let body = step.text;
    if (this.mode !== 'examen' && step.hint) body += `\n\nPista: ${step.hint}`;
    let footer = `${this.mode === 'examen' ? 'Examen' : 'Entrenamiento'} · Puntaje ${this.score} · Errores ${this.errors}`;
    if ((step.kind === 'pick' || step.kind === 'find') && step.correct.length > 1) {
      footer = `Encontrados ${step.correct.length - this.remaining.size} de ${step.correct.length} · ` + footer;
    }
    if (step.kind === 'sequence') footer = `Paso ${this.seqIndex + 1} de ${step.order.length} · ` + footer;
    this.panel.set({ tag: `Ejercicio ${this.stepIndex + 1} de ${n}`, title: step.title, body, footer });
  }

  // ---------- evaluación ----------
  onPick(step, obj) {
    if (this.locked) return;
    const label = obj.userData.label || 'elemento';
    if (step.kind === 'sequence') {
      const expected = step.order[this.seqIndex];
      if (obj === expected) {
        this.registerHit(obj, obj.userData.explain || label);
        step.onCorrect?.(obj, this.ctx, this.seqIndex);
        this.seqIndex++;
        if (this.seqIndex >= step.order.length) return this.completeStep(step);
        this.redrawStep();
      } else {
        const hint = this.mode !== 'examen' ? ` Primero: ${expected.userData.label}.` : '';
        this.registerMiss(obj, (obj.userData.wrong || `"${label}" no va en este momento.`) + hint);
        step.onWrong?.(obj, this.ctx);
      }
      return;
    }
    // pick / find
    if (this.remaining.has(obj)) {
      this.remaining.delete(obj);
      this.registerHit(obj, obj.userData.explain || `${label}: correcto.`);
      step.onCorrect?.(obj, this.ctx, step.correct.indexOf(obj));
      if (this.remaining.size === 0) return this.completeStep(step);
      this.redrawStep();
    } else if ((step.correct || []).includes(obj)) {
      this.toast.show(`${label}: ya lo había identificado.`, true, 1.4);
    } else {
      this.registerMiss(obj, this.mode !== 'examen' ? (obj.userData.wrong || `${label} no es la respuesta.`) : 'Esa no es la respuesta.');
      step.onWrong?.(obj, this.ctx);
    }
  }

  onChoice(step, opt, btn) {
    if (this.locked) return;
    if (opt.correct) {
      btn.setState('correct');
      this.buttons.forEach(b => { if (b !== btn) b.setState('disabled'); });
      this.hits++; audio.ok();
      this.toast.show(opt.explain || 'Correcto.', true, 3);
      step.onCorrect?.(opt, this.ctx);
      this.completeStep(step, 2.2);
    } else {
      btn.setState('wrong'); setTimeout(() => btn.setState('disabled'), 900);
      this.errors++; this.score = Math.max(0, this.score - CONFIG.errorPenalty); audio.bad();
      this.toast.show(this.mode !== 'examen' ? (opt.explain || 'Incorrecto.') : 'Incorrecto.', false, 3);
      step.onWrong?.(opt, this.ctx);
      this.redrawStep();
    }
  }

  registerHit(obj, text) {
    this.hits++; audio.ok();
    addMarker(obj, 'ok'); lockEmissive(obj, 0x72D353, 0.3);
    this.toast.show(text, true, 2.6);
  }
  registerMiss(obj, text) {
    this.errors++; this.score = Math.max(0, this.score - CONFIG.errorPenalty); audio.bad();
    flash(obj); addMarker(obj, 'bad', { ttl: 1.2 });
    this.toast.show(text, false, 2.8);
    this.redrawStep();
  }

  completeStep(step, delay = 1.6) {
    this.locked = true; this.inter.clear(); this.inter.add(this.menuBtn.mesh);
    step.onComplete?.(this.ctx);
    if (step.explain) { this.panel.set({ body: step.explain, footer: 'Ejercicio completado' }); audio.speak(step.explain); delay = Math.max(delay, 3.2); }
    const next = this.stepIndex + 1;
    this._timer = setTimeout(() => { if (this.active) this.enterStep(next); }, delay * 1000);
  }

  finish() {
    const step = this.steps[this.stepIndex]; step?.onExit?.(this.ctx);
    this.clearButtons(); this.inter.clear(); this.inter.add(this.menuBtn.mesh); clearMarkers();
    const secs = Math.round((performance.now() - this.startTime) / 1000);
    const mm = String(Math.floor(secs / 60)).padStart(2, '0'), ss = String(secs % 60).padStart(2, '0');
    const passed = this.score >= CONFIG.passScore;
    passed ? audio.success() : audio.fail();
    this.panel.set({
      tag: passed ? 'Aprobado' : 'No aprobado',
      title: `Resultado: ${this.score} / 100`,
      body: `${this.def.title} · Modo ${this.mode}\nAciertos: ${this.hits}   Errores: ${this.errors}   Tiempo: ${mm}:${ss}\n\n${CONFIG.bridge.title}. ${CONFIG.bridge.body}`,
      footer: `${CONFIG.brand} · ${CONFIG.appTitle}`,
    });
    this.addButton({ label: 'Repetir módulo', color: 'rgba(0,112,196,0.95)', width: 0.48, x: -0.26, onSelect: () => this.start(this.def, this.mode, this.isAR) });
    this.addButton({ label: 'Volver al menú', color: 'rgba(107,122,143,0.95)', width: 0.48, x: 0.26, row: 0, onSelect: () => this.exit() });
    audio.speak(`Resultado: ${this.score} de 100. ${passed ? 'Aprobado.' : 'No aprobado.'}`);
    this.onResult?.({ module: this.def.id, score: this.score, passed, hits: this.hits, errors: this.errors, seconds: secs, mode: this.mode });
  }

  exit() {
    audio.click(); audio.stopSpeech();
    this.cleanupStage();
    this.onExit?.();
  }

  // ---------- utilidades ----------
  addButton({ label, color, onSelect, width = 1.0, x = 0, row = null }) {
    const b = new Button({ label, width, height: 0.1, color, onSelect });
    const r = row ?? this.nextRow++;
    b.mesh.position.set(x, -this.panel.height / 2 - 0.08 - r * 0.125, 0.01);
    this.ui.add(b.mesh); this.buttons.push(b); this.inter.add(b.mesh);
    return b;
  }
  clearButtons() { this.nextRow = 0; for (const b of this.buttons) { this.inter.remove(b.mesh); b.mesh.removeFromParent(); b.dispose(); } this.buttons = []; }
  cleanupStage() {
    clearTimeout(this._timer);
    this.active = false; this.ui.visible = false; this.toast.hide(); this.clearButtons(); this.inter.clear(); clearMarkers();
    if (this.stage) {
      this.stage.traverse(o => { if (o.isMesh) { o.geometry?.dispose?.(); if (o.userData.ownMat) o.material.dispose(); } });
      this.stage.removeFromParent(); this.stage = null;
    }
  }
  update(dt) {
    this.toast.update(dt);
    if (this.active && this.steps) this.steps[this.stepIndex]?.update?.(dt, this.ctx);
    if (this.active && this.built?.update) this.built.update(dt, this.ctx);
    updateFx(dt);
  }
}
