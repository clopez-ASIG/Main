import * as THREE from 'three';
import { Panel, Button, imageCard, loadImage } from './ui.js';
import * as P from './props.js';
import { audio } from './audio.js';
import { CONFIG } from '../config.js';

const C = CONFIG.colors;

/** Menú principal: encabezado, tarjetas de módulo, selector de modo. */
export class Lobby {
  constructor({ scene, interaction, modules, onStart }) {
    this.scene = scene; this.inter = interaction; this.modules = modules; this.onStart = onStart;
    this.mode = 'entrenamiento';
    this.group = new THREE.Group(); this.group.name = 'lobby';
    scene.add(this.group);
    this.interactives = [];
    this.build();
  }

  async build() {
    const g = this.group;
    // Encabezado
    const header = new Panel({ width: 1.7, height: 0.24, title: `${CONFIG.appTitle}`, body: CONFIG.tagline, align: 'left' });
    header.mesh.position.set(0, 1.76, -2.1); g.add(header.mesh);
    const img = await loadImage('assets/img/logo.png');
    const logo = imageCard(img, 0.66, 0.22);
    logo.position.set(-0.52, 2.08, -2.1); g.add(logo);

    // Tarjetas en arco
    const R = 2.05, angles = [-0.46, -0.155, 0.155, 0.46];
    this.modules.forEach((m, i) => {
      const a = angles[i] ?? 0;
      const b = new Button({ label: m.title, sub: `${m.exercises ?? 4} ejercicios · ${m.minutes} min`, width: 0.56, height: 0.3, color: m.color || C.azul, fontSize: 0.046,
        onSelect: () => { audio.click(); this.onStart(m, this.mode); } });
      b.mesh.position.set(Math.sin(a) * R, 1.3, -Math.cos(a) * R);
      b.mesh.rotation.y = -a;
      g.add(b.mesh); this.interactives.push(b.mesh);
    });

    // Selector de modo
    this.btnTrain = new Button({ label: 'Entrenamiento', sub: 'con pistas y explicaciones', width: 0.5, height: 0.11, color: 'rgba(0,112,196,0.95)', fontSize: 0.034, onSelect: () => this.setMode('entrenamiento') });
    this.btnExam = new Button({ label: 'Examen', sub: 'sin pistas, se califica', width: 0.5, height: 0.11, color: 'rgba(0,112,196,0.95)', fontSize: 0.034, onSelect: () => this.setMode('examen') });
    this.btnTrain.mesh.position.set(-0.27, 0.9, -1.95); this.btnExam.mesh.position.set(0.27, 0.9, -1.95);
    g.add(this.btnTrain.mesh, this.btnExam.mesh); this.interactives.push(this.btnTrain.mesh, this.btnExam.mesh);
    this.setMode('entrenamiento', true);

    const hint = new Panel({ width: 1.3, height: 0.1, bg: 'rgba(12,27,48,0.8)' });
    hint.set({ footer: 'Apunte y presione el gatillo, o pellizque con la mano, para seleccionar.' });
    hint.mesh.position.set(0, 0.72, -1.9); g.add(hint.mesh);

    // Utilería en el piso: tarima con casco, cono y extintor
    const pal = P.pallet(); pal.position.set(0, 0, -2.3); g.add(pal);
    const hat = P.hardHat(0xffffff); hat.position.set(-0.3, 0.15, -2.3); hat.rotation.y = 0.4; g.add(hat);
    const hat2 = P.hardHat(0xFFD800); hat2.position.set(0.05, 0.15, -2.45); hat2.rotation.y = -0.6; g.add(hat2);
    const cone = P.cone(); cone.position.set(0.42, 0.145, -2.2); g.add(cone);
    const ext = P.extinguisher(); ext.position.set(-0.05, 0.145, -2.05); ext.rotation.y = 0.3; g.add(ext);

    this.show();
  }

  setMode(mode, silent = false) {
    this.mode = mode;
    this.btnTrain.setSelected(mode === 'entrenamiento'); this.btnExam.setSelected(mode === 'examen');
    if (!silent) audio.click();
  }

  show() { this.group.visible = true; for (const o of this.interactives) this.inter.add(o); }
  hide() { this.group.visible = false; for (const o of this.interactives) this.inter.remove(o); }
}
