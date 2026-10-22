import * as THREE from 'three';
import * as P from '../core/props.js';
import { tween } from '../core/fx.js';
const { M } = P;

const tag = (obj, label, explain, wrong) => { obj.userData.label = label; if (explain) obj.userData.explain = explain; if (wrong) obj.userData.wrong = wrong; return obj; };

function strap(w, h, mat, pos, rot) {
  const g = P.group([], { pos, rot });
  g.add(P.box(w, h, 0.006, mat, { r: 0.001 }));
  // costura amarilla en los bordes
  g.add(P.box(0.003, h - 0.01, 0.0065, M.plastic(0xE8C21A), { pos: [w / 2 - 0.005, 0, 0], r: 0 }));
  g.add(P.box(0.003, h - 0.01, 0.0065, M.plastic(0xE8C21A), { pos: [-w / 2 + 0.005, 0, 0], r: 0 }));
  return g;
}

function snapHook(mat = M.steel()) {
  const g = P.group();
  g.add(P.box(0.03, 0.08, 0.016, mat, { r: 0.004 }));
  g.add(P.mesh(new THREE.TorusGeometry(0.03, 0.006, 10, 24, Math.PI * 1.6), mat, { pos: [0, 0.065, 0], rot: [0, 0, -0.3] }));
  g.add(P.box(0.008, 0.045, 0.012, M.darkMetal(), { pos: [0.028, 0.06, 0] }));
  return g;
}

function buildHarness() {
  const g = P.group([], { name: 'arnes' });
  const webbing = M.fabric(0x1f2f4a);
  // perchero
  g.add(P.cyl(0.02, 0.02, 1.95, M.darkMetal(), { pos: [0, 0.975, 0] }));
  g.add(P.cyl(0.2, 0.22, 0.02, M.darkMetal(), { pos: [0, 0.01, 0] }));
  g.add(P.box(0.03, 0.03, 0.22, M.darkMetal(), { pos: [0, 1.95, 0.1], r: 0.004 }));
  g.add(P.mesh(new THREE.TorusGeometry(0.03, 0.006, 8, 20, Math.PI), M.darkMetal(), { pos: [0, 1.92, 0.2], rot: [0, Math.PI / 2, 0] }));
  const z = 0.2;
  // anillo D dorsal oxidado (defecto)
  const dring = P.group([], { pos: [0, 1.86, z] });
  dring.add(P.mesh(new THREE.TorusGeometry(0.038, 0.007, 10, 28), M.metal(0x7a4a2e, { roughness: 0.85, metalness: 0.5 }), {}));
  dring.add(P.box(0.09, 0.025, 0.008, M.metal(0x8a5a3a, { roughness: 0.9, metalness: 0.4 }), { pos: [0, -0.04, 0], r: 0.003 }));
  tag(dring, 'Anillo D dorsal', 'Anillo D con corrosión y deformación: el herraje no soporta la carga de una caída. El arnés sale de servicio.');
  g.add(dring);
  // correas de hombro
  const left = strap(0.045, 0.78, webbing, [-0.1, 1.42, z], [0, 0, 0.06]);
  // corte: muesca y deshilachado
  const cut = P.group([], { pos: [0.005, 0.02, 0.004] });
  cut.add(P.box(0.04, 0.016, 0.005, M.matte(0xb9c3d1), { rot: [0, 0, 0.5], r: 0 }));
  cut.add(P.box(0.046, 0.004, 0.006, M.matte(0xe8eef5), { pos: [0, 0.006, 0.001], rot: [0, 0, 0.5], r: 0 }));
  cut.add(P.box(0.02, 0.006, 0.004, M.matte(0xd9dee6), { pos: [0.012, -0.012, 0.001], rot: [0, 0, -0.4], r: 0 }));
  for (let i = 0; i < 5; i++) cut.add(P.cyl(0.0012, 0.0012, 0.03, M.matte(0xd9dee6), { pos: [0.02 + i * 0.002, -0.02 - i * 0.004, 0.002], rot: [0, 0, 0.3 + i * 0.1] }));
  left.add(cut);
  tag(left, 'Correa de hombro izquierda', 'Correa con corte y deshilachado: una correa cortada, quemada o desgastada deja el arnés fuera de servicio.');
  const right = strap(0.045, 0.78, webbing, [0.1, 1.42, z], [0, 0, -0.06]);
  tag(right, 'Correa de hombro derecha', null, 'Esta correa está íntegra: sin cortes, quemaduras ni desgaste.');
  g.add(left, right);
  // etiqueta
  const lbl = P.sign([{ text: 'ANSI Z359.11', size: 28 }, { text: 'Insp. 05/2026', size: 24, weight: 400 }], 0.04, 0.05, { bg: '#f6f6f6', fg: '#222' });
  lbl.position.set(0.12, 1.2, z + 0.005); tag(lbl, 'Etiqueta', null, 'La etiqueta legible, con norma y fecha de inspección, es un requisito. No es un defecto.');
  g.add(lbl);
  // correa pectoral con hebilla
  g.add(strap(0.4, 0.04, webbing, [0, 1.5, z - 0.002]));
  const buckle = P.group([], { pos: [0, 1.5, z + 0.006] });
  buckle.add(P.box(0.06, 0.05, 0.012, M.steel(), { r: 0.004 }));
  buckle.add(P.box(0.02, 0.035, 0.014, M.darkMetal(), { pos: [0.012, 0, 0], r: 0.002 }));
  tag(buckle, 'Hebilla pectoral', null, 'La hebilla está completa, sin deformación, y cierra bien. No es un defecto.');
  g.add(buckle);
  // cinturón subpélvico y correas de pierna
  g.add(strap(0.045, 0.42, webbing, [0, 1.04, z], [0, 0, Math.PI / 2]));
  const legL = P.group([], { pos: [-0.1, 0.86, z] });
  legL.add(strap(0.045, 0.3, webbing, [0, 0, 0], [0, 0, 0]));
  legL.add(strap(0.045, 0.18, webbing, [0.03, -0.14, 0], [0, 0, Math.PI / 2]));
  tag(legL, 'Correa de pierna', null, 'La correa de pierna está íntegra y con su hebilla. No es un defecto.');
  const legR = legL.clone(); legR.position.x = 0.1; legR.children.forEach(c => { c.position.x *= -1; });
  g.add(legL, legR);
  // eslinga con gancho
  g.add(P.tube([[0.12, 1.02, z], [0.2, 0.9, z + 0.02], [0.22, 0.7, z + 0.03], [0.2, 0.55, z + 0.02]], 0.012, webbing));
  const hook = snapHook(); hook.position.set(0.2, 0.47, z + 0.02); hook.rotation.z = Math.PI;
  tag(hook, 'Gancho de seguridad', null, 'El gancho tiene doble seguro, cierra solo y no está deformado. Está en buen estado.');
  g.add(hook);
  return { group: g, defects: [left, dring], decoys: [right, lbl, buckle, legL, legR, hook] };
}

function buildScaffold() {
  const g = P.group([], { name: 'andamio' });
  const st = M.steel(), r = 0.024, W = 0.75, D = 0.6, H = 2.0, PLAT = 1.0;
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    g.add(P.cyl(r, r, H, st, { pos: [sx * W, H / 2, sz * D] }));
    g.add(P.box(0.14, 0.02, 0.14, M.darkMetal(), { pos: [sx * W, 0.01, sz * D], r: 0.003 }));
  }
  const hRail = (x1, x2, y, z) => P.cyl(r * 0.8, r * 0.8, Math.abs(x2 - x1), st, { pos: [(x1 + x2) / 2, y, z], rot: [0, 0, Math.PI / 2] });
  const dRail = (z1, z2, y, x) => P.cyl(r * 0.8, r * 0.8, Math.abs(z2 - z1), st, { pos: [x, y, (z1 + z2) / 2], rot: [Math.PI / 2, 0, 0] });
  // largueros de plataforma
  for (const sz of [-1, 1]) g.add(hRail(-W, W, PLAT - 0.03, sz * D));
  for (const sx of [-1, 1]) g.add(dRail(-D, D, PLAT - 0.03, sx * W));
  // barandales
  const rails = [];
  for (const y of [PLAT + 0.5, H]) {
    rails.push(hRail(-W, W, y, -D));            // atrás
    rails.push(hRail(-W, W, y, D));             // frente
    rails.push(dRail(-D, D, y, -W));            // izquierda
  }
  rails.push(dRail(-D, D, PLAT + 0.5, W));      // derecha, intermedio
  rails.forEach(rl => g.add(rl));
  const okRail = rails[1]; tag(okRail, 'Barandal frontal', null, 'Este barandal está firme y a la altura correcta. No es un peligro.');
  // barandal superior derecho desprendido (peligro)
  const loose = P.group([], { pos: [W, H, -D] });
  loose.add(P.cyl(r * 0.8, r * 0.8, 2 * D, st, { pos: [0, 0, D], rot: [Math.PI / 2, 0, 0] }));
  loose.rotation.x = 0.42; // cae hacia el frente
  tag(loose, 'Barandal superior desprendido', 'Barandal desprendido: sin protección perimetral completa hay riesgo de caída a distinto nivel. Se repara antes de subir.');
  g.add(loose);
  // diagonales traseras
  g.add(P.cyl(r * 0.7, r * 0.7, Math.hypot(2 * W, PLAT), st, { pos: [0, PLAT / 2, -D], rot: [0, 0, Math.atan2(2 * W, PLAT)] }));
  g.add(P.cyl(r * 0.7, r * 0.7, Math.hypot(2 * W, PLAT), st, { pos: [0, PLAT / 2, -D - 0.03], rot: [0, 0, -Math.atan2(2 * W, PLAT)] }));
  // tablones
  const wood = M.wood();
  const planks = [];
  for (let i = 0; i < 5; i++) {
    const z = -0.48 + i * 0.24;
    if (i === 3) {
      const broken = P.group([], { pos: [0, PLAT, z] });
      broken.add(P.box(0.8, 0.04, 0.22, wood, { pos: [-0.35, 0, 0], r: 0.003 }));
      const piece = P.box(0.7, 0.04, 0.22, wood, { pos: [0.4, -0.08, 0], rot: [0, 0, -0.28], r: 0.003 });
      broken.add(piece);
      // astillas
      for (let k = 0; k < 4; k++) broken.add(P.box(0.08, 0.012, 0.02, M.matte(0xd8c3a0), { pos: [0.02 + k * 0.03, -0.01 - k * 0.012, -0.08 + k * 0.05], rot: [0, 0.3 * k, -0.2 - k * 0.1], r: 0 }));
      tag(broken, 'Tablón quebrado', 'Tablón quebrado: la plataforma debe estar completa, con tablas sanas, sin huecos ni desniveles.');
      planks.push(broken); g.add(broken);
    } else g.add(P.box(1.5, 0.04, 0.22, wood, { pos: [0, PLAT, z], r: 0.003 }));
  }
  // rodapié
  const toe = P.group();
  for (const sz of [-1, 1]) toe.add(P.box(1.5, 0.15, 0.025, wood, { pos: [0, PLAT + 0.095, sz * (D - 0.02)], r: 0.002 }));
  for (const sx of [-1, 1]) toe.add(P.box(0.025, 0.15, 1.2, wood, { pos: [sx * (W - 0.02), PLAT + 0.095, 0], r: 0.002 }));
  tag(toe, 'Rodapié', null, 'El rodapié está completo: evita que caigan objetos desde la plataforma. No es un peligro.');
  g.add(toe);
  // herramientas sueltas al borde
  const tools = P.group([], { pos: [0.5, PLAT + 0.02, 0.45] });
  tools.add(P.box(0.26, 0.025, 0.025, M.wood(), { pos: [0, 0.012, 0], rot: [0, 0.5, 0], r: 0.003 }));
  tools.add(P.box(0.08, 0.035, 0.03, M.darkMetal(), { pos: [0.11, 0.018, -0.06], rot: [0, 0.5, 0], r: 0.003 }));
  tools.add(P.box(0.2, 0.012, 0.035, M.steel(), { pos: [-0.08, 0.006, 0.05], rot: [0, -0.4, 0], r: 0.002 }));
  tools.add(P.cyl(0.03, 0.03, 0.06, M.plastic(0xd61f1f), { pos: [0.02, 0.03, 0.1] }));
  tag(tools, 'Herramientas sueltas al borde', 'Herramientas sueltas al borde: riesgo de caída de objetos sobre quienes están abajo. Use portaherramientas y amarres.');
  g.add(tools);
  return { group: g, hazards: [loose, tools, planks[0]], decoys: [okRail, toe] };
}

function buildAnchors() {
  const g = P.group([], { name: 'anclajes' });
  const col = P.steelColumn(2.7, 0.22); col.position.set(-0.65, 0, -3.15); g.add(col);
  // placa de anclaje certificada
  const anchor = P.group([], { pos: [-0.65, 2.25, -3.03] });
  anchor.add(P.box(0.14, 0.14, 0.012, M.paint(0xF28C28), { r: 0.004 }));
  anchor.add(P.mesh(new THREE.TorusGeometry(0.045, 0.009, 10, 28), M.steel(), { pos: [0, -0.02, 0.03], rot: [0.5, 0, 0] }));
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) anchor.add(P.cyl(0.008, 0.008, 0.01, M.darkMetal(), { pos: [sx * 0.05, sy * 0.05, 0.008], rot: [Math.PI / 2, 0, 0] }));
  const lbl = P.sign([{ text: 'ANCLAJE', size: 52 }, { text: '22 kN · 1 persona', size: 40, weight: 400 }], 0.22, 0.1, { bg: '#F28C28', fg: '#111', highlight: false });
  lbl.position.set(0, 0.15, 0); anchor.add(lbl);
  tag(anchor, 'Punto de anclaje certificado', 'Punto de anclaje identificado y certificado para 22 kN (5 000 lb) por persona. Aquí se conecta la línea de vida.');
  g.add(anchor);
  // tubería de agua
  const pipe = P.group([], { pos: [0.4, 2.4, -3.38] });
  pipe.add(P.cyl(0.03, 0.03, 3.4, M.paint(0x2f6fb5, { roughness: 0.4 }), { rot: [0, 0, Math.PI / 2] }));
  for (const x of [-1.4, 0, 1.4]) pipe.add(P.box(0.08, 0.1, 0.05, M.darkMetal(), { pos: [x, 0, -0.02], r: 0.004 }));
  const pl = P.sign([{ text: 'AGUA', size: 60 }], 0.2, 0.07, { bg: '#2f6fb5', fg: '#fff', highlight: false });
  pl.position.set(0.7, -0.09, 0.03); pipe.add(pl);
  tag(pipe, 'Tubería de agua', null, 'Una tubería no es un anclaje: no se conoce su resistencia y puede romperse con la carga de una caída.');
  g.add(pipe);
  // pared de fondo ligera para dar contexto
  const wall = P.mesh(new THREE.PlaneGeometry(4.2, 2.8), M.wall([4, 2]), { pos: [0.5, 1.4, -3.42], cast: false });
  wall.name = 'pared'; g.add(wall);
  return { group: g, anchor, pipe };
}

function buildConnectors() {
  const g = P.group([], { name: 'conectores' });
  const tbl = P.table(1.1, 0.55, 0.85); g.add(tbl);
  const y = 0.85;
  // (a) eslinga 1.8 m con absorbedor
  const lan = P.group([], { pos: [-0.36, y, 0] });
  const pts = []; for (let i = 0; i < 40; i++) { const a = i / 40 * Math.PI * 6; pts.push([Math.cos(a) * 0.09, 0.012 + i * 0.0015, Math.sin(a) * 0.09]); }
  lan.add(P.tube(pts, 0.011, M.fabric(0xE8C21A)));
  lan.add(P.box(0.08, 0.05, 0.16, M.fabric(0x1f2f4a), { pos: [0.02, 0.045, 0.02], r: 0.01 }));
  const h1 = snapHook(); h1.position.set(-0.12, 0.05, 0.1); h1.rotation.set(Math.PI / 2, 0, 0.6); lan.add(h1);
  tag(lan, 'Eslinga de 1.8 m con absorbedor', null, 'A 4 m no hay claro suficiente: 1.8 m de eslinga + 1.2 m del absorbedor + 1.8 m de su cuerpo superan 4.8 m. Golpearía el piso.');
  g.add(lan);
  // (b) SRL
  const srl = P.group([], { pos: [0, y, 0] });
  srl.add(P.cyl(0.085, 0.085, 0.07, M.paint(0xF28C28), { pos: [0, 0.035, 0], rot: [Math.PI / 2, 0, 0] }));
  srl.add(P.cyl(0.03, 0.03, 0.08, M.darkMetal(), { pos: [0, 0.035, 0], rot: [Math.PI / 2, 0, 0] }));
  srl.add(P.box(0.03, 0.04, 0.04, M.steel(), { pos: [0, 0.12, 0], r: 0.004 }));
  srl.add(P.tube([[0, 0.035, 0.03], [0.12, 0.02, 0.12], [0.2, 0.012, 0.08]], 0.004, M.steel()));
  const h2 = snapHook(); h2.position.set(0.22, 0.03, 0.06); h2.rotation.set(Math.PI / 2, 0, 1.3); srl.add(h2);
  const sl = P.sign([{ text: 'SRL', size: 60 }, { text: '2.5 m', size: 40, weight: 400 }], 0.09, 0.06, { bg: '#fff', fg: '#111', highlight: false });
  sl.position.set(0, 0.04, 0.0365); srl.add(sl);
  tag(srl, 'Línea de vida autorretráctil (SRL)', 'La línea autorretráctil detiene la caída en centímetros: es la opción segura cuando no hay claro suficiente para una eslinga con absorbedor.');
  g.add(srl);
  // (c) eslinga de posicionamiento
  const pos = P.group([], { pos: [0.36, y, 0] });
  const pts2 = []; for (let i = 0; i < 36; i++) { const a = i / 36 * Math.PI * 5; pts2.push([Math.cos(a) * 0.08, 0.012 + i * 0.0014, Math.sin(a) * 0.08]); }
  pos.add(P.tube(pts2, 0.009, M.fabric(0xd8c27a)));
  const h3 = snapHook(); h3.position.set(0.1, 0.05, 0.1); h3.rotation.set(Math.PI / 2, 0, 0.3); pos.add(h3);
  const h4 = snapHook(); h4.position.set(-0.1, 0.05, -0.1); h4.rotation.set(Math.PI / 2, 0, -2.3); pos.add(h4);
  tag(pos, 'Eslinga de posicionamiento', null, 'La eslinga de posicionamiento no tiene absorbedor y no está diseñada para detener caídas: solo para posicionarse.');
  g.add(pos);
  // letreros
  const labels = [['Eslinga 1.8 m', 'con absorbedor'], ['Autorretráctil', 'SRL 2.5 m'], ['Posicionamiento', 'sin absorbedor']];
  labels.forEach((l, i) => {
    const s = P.plate([{ text: l[0], size: 44 }, { text: l[1], size: 34, weight: 400 }], 0.26, 0.09, { bg: '#F1F5FA', fg: '#0C1B30', highlight: false });
    s.position.set(-0.36 + i * 0.36, y + 0.05, 0.3); s.rotation.x = -0.35; g.add(s);
  });
  return { group: g, lan, srl, pos };
}

export default {
  id: 'altura', title: 'Trabajo en Altura', short: 'arnés, anclaje, conectores y plataforma', minutes: 6, exercises: 4, color: '#F28C28',
  intro: 'Trabajará sobre un andamio. Antes de subir debe inspeccionar su arnés, elegir un anclaje válido, seleccionar el conector correcto y revisar la plataforma.',
  build(ctx) {
    const g = ctx.group;
    const harness = buildHarness(); harness.group.position.set(-0.3, 0, -1.75); harness.group.rotation.y = 0.15; g.add(harness.group);
    const scaf = buildScaffold(); scaf.group.position.set(0.95, 0, -2.75); g.add(scaf.group);
    const anc = buildAnchors(); if (ctx.isAR) anc.group.getObjectByName('pared').visible = false; g.add(anc.group);
    const con = buildConnectors(); con.group.position.set(2.0, 0, -1.45); con.group.rotation.y = -0.65; g.add(con.group);
    const lad = P.ladder({ h: 2.4 }); lad.rotation.x = -0.22;
    const ladG = P.group([lad], { pos: [2.0, 0, -2.75], rot: [0, Math.PI / 2, 0] }); g.add(ladG);
    tag(lad, 'Escalera de acceso', null, 'La escalera no está fija ni certificada para detener una caída. Sirve para subir, no como anclaje.');
    const topRail = scaf.decoys[0];

    const steps = [
      {
        title: 'Inspección del arnés', kind: 'find',
        text: 'Revise el arnés colgado frente a usted. Encuentre los 2 defectos que lo dejan fuera de servicio.',
        hint: 'Mire correas, costuras y herrajes metálicos de cerca.',
        correct: harness.defects, targets: [...harness.defects, ...harness.decoys],
        explain: 'Dos defectos encontrados. Un arnés con correas dañadas o herrajes corroídos se retira, se etiqueta "fuera de servicio" y se reemplaza.',
        onExit() { tween(0.8, k => { harness.group.position.y = -2.2 * k; }, () => { harness.group.visible = false; }); },
      },
      {
        title: 'Punto de anclaje', kind: 'pick',
        text: 'Elija dónde conectar su línea de vida antes de subir al andamio.',
        hint: 'Un anclaje debe resistir 22 kN (5 000 lb) por persona o estar certificado por una persona calificada.',
        correct: [anc.anchor], targets: [anc.anchor, topRail, anc.pipe, lad],
        onEnter() { topRail.userData.wrong = 'El barandal del andamio no está diseñado para detener una caída: se dobla o se desprende con la carga.'; },
        explain: 'Anclaje certificado seleccionado. Nunca use barandales, tuberías ni escaleras como punto de anclaje.',
      },
      {
        title: 'Conector adecuado', kind: 'pick',
        text: 'Trabajará a 4 metros de altura sobre piso de concreto. Seleccione sobre la mesa el conector que usará.',
        hint: 'Calcule la distancia de caída: eslinga + absorbedor desplegado + estatura + margen. Compare con los 4 m disponibles.',
        correct: [con.srl], targets: [con.lan, con.srl, con.pos],
        explain: 'Con poco claro de caída, la línea autorretráctil es la elección correcta. La eslinga con absorbedor exige cerca de 5.5 m libres.',
      },
      {
        title: 'Peligros en la plataforma', kind: 'find',
        text: 'Antes de subir, identifique los 3 peligros presentes en el andamio.',
        hint: 'Observe barandales, tablones de la plataforma y herramientas.',
        correct: scaf.hazards, targets: [...scaf.hazards, ...scaf.decoys, lad],
        onEnter() { topRail.userData.wrong = 'Este barandal está firme y a la altura correcta. No es un peligro.'; lad.userData.wrong = 'La escalera está íntegra y bien apoyada. No es un peligro.'; },
        explain: 'Tres peligros identificados. Un andamio se inspecciona antes de cada turno y se etiqueta: verde para usar, rojo para no usar.',
      },
    ];
    return { steps };
  },
};
