import * as THREE from 'three';
import * as P from '../core/props.js';
import { Sparks, tween } from '../core/fx.js';
const { M } = P;

const tag = (obj, label, explain, wrong) => { obj.userData.label = label; if (explain) obj.userData.explain = explain; if (wrong) obj.userData.wrong = wrong; return obj; };

function buildPanelBoard() {
  const g = P.group([], { name: 'tablero' });
  const grey = M.metal(0xb7bec7, { roughness: 0.45, metalness: 0.6 });
  // caja
  g.add(P.box(0.62, 0.92, 0.04, grey, { pos: [0, 0, -0.1], r: 0.006 }));                 // fondo
  g.add(P.box(0.62, 0.04, 0.22, grey, { pos: [0, 0.46, 0], r: 0.006 }));
  g.add(P.box(0.62, 0.04, 0.22, grey, { pos: [0, -0.46, 0], r: 0.006 }));
  g.add(P.box(0.04, 0.92, 0.22, grey, { pos: [-0.31, 0, 0], r: 0.006 }));
  g.add(P.box(0.04, 0.92, 0.22, grey, { pos: [0.31, 0, 0], r: 0.006 }));
  // puerta abierta (bisagra derecha)
  const door = P.group([], { pos: [0.31, 0, 0.11] });
  door.add(P.box(0.62, 0.92, 0.02, grey, { pos: [-0.31, 0, 0], r: 0.006 }));
  door.add(P.cyl(0.012, 0.012, 0.1, M.darkMetal(), { pos: [-0.56, 0, 0.015], rot: [Math.PI / 2, 0, 0] }));
  door.rotation.y = -1.9; g.add(door);
  // interior
  g.add(P.box(0.54, 0.84, 0.01, M.matte(0x2b3138), { pos: [0, 0, -0.075], r: 0 }));
  // interruptor principal
  const main = P.group([], { pos: [0, 0.3, -0.05] });
  main.add(P.box(0.2, 0.14, 0.06, M.plastic(0x1c1f24), { r: 0.006 }));
  const lever = P.box(0.05, 0.1, 0.03, M.plastic(0xd61f1f), { pos: [0, 0.03, 0.045], r: 0.006 });
  main.add(lever);
  const onLbl = P.sign([{ text: 'ON', size: 48, color: '#72D353' }], 0.06, 0.03, { bg: '#1c1f24', fg: '#72D353', highlight: false }); onLbl.position.set(-0.065, 0.045, 0.031); main.add(onLbl);
  const offLbl = P.sign([{ text: 'OFF', size: 48, color: '#E0352B' }], 0.06, 0.03, { bg: '#1c1f24', fg: '#E0352B', highlight: false }); offLbl.position.set(-0.065, -0.045, 0.031); main.add(offLbl);
  tag(main, 'Interruptor principal', 'Interruptor principal abierto: la fuente de energía queda aislada.', 'El interruptor principal del tablero es el medio de aislamiento, no un peligro en sí.');
  g.add(main);
  // breakers
  const grid = P.group([], { pos: [0, 0.02, -0.05] });
  for (let r = 0; r < 3; r++) for (let c = 0; c < 6; c++) {
    grid.add(P.box(0.06, 0.07, 0.04, M.plastic(0x1c1f24), { pos: [-0.17 + c * 0.068, 0.08 - r * 0.08, 0], r: 0.004 }));
    grid.add(P.box(0.02, 0.025, 0.012, M.plastic(c % 4 === 3 ? 0xd61f1f : 0xf1f1f1), { pos: [-0.17 + c * 0.068, 0.085 - r * 0.08, 0.025], r: 0.002 }));
  }
  g.add(grid);
  // zona inferior sin cubierta: barras de cobre expuestas (peligro)
  const bars = P.group([], { pos: [0, -0.3, -0.05] });
  for (let i = 0; i < 3; i++) bars.add(P.box(0.4, 0.025, 0.006, M.copper(), { pos: [0, 0.05 - i * 0.05, 0], r: 0.001 }));
  for (let i = 0; i < 3; i++) bars.add(P.cyl(0.006, 0.006, 0.12, M.darkMetal(), { pos: [-0.15 + i * 0.15, 0, -0.005], rot: [0, 0, 0] }));
  for (const x of [-0.15, 0, 0.15]) bars.add(P.tube([[x, -0.05, 0.005], [x + 0.03, -0.12, 0.02], [x + 0.02, -0.2, 0.0]], 0.006, M.rubber(0x202124)));
  tag(bars, 'Barras expuestas sin cubierta', 'Tablero sin cubierta muerta: partes vivas al alcance de la mano. Nadie trabaja cerca hasta reponer la cubierta.');
  g.add(bars);
  // marco del faltante
  g.add(P.box(0.5, 0.01, 0.03, M.matte(0x4a5059), { pos: [0, -0.22, -0.04], r: 0 }));
  // letrero
  const warn = P.sign([{ text: 'PELIGRO', size: 70, color: '#fff' }, { text: 'ALTO VOLTAJE · 480 V', size: 44, color: '#fff', weight: 700 }], 0.6, 0.18, { bg: '#d61f1f', border: '#ffffff', borderW: 8, highlight: false });
  warn.position.set(0, 0.6, -0.1); tag(warn, 'Letrero de advertencia', null, 'El letrero es la señalización requerida. No es un peligro.');
  g.add(warn);
  return { group: g, main, lever, bars, warn };
}

function buildMotor() {
  const g = P.group([], { name: 'motor' });
  g.add(P.box(0.9, 0.08, 0.5, M.paint(0x2d3238, { roughness: 0.6 }), { pos: [0, 0.04, 0], r: 0.006 }));
  g.add(P.cyl(0.17, 0.17, 0.5, M.paint(0x1f5fa8), { pos: [-0.15, 0.27, 0], rot: [0, 0, Math.PI / 2] }));
  for (let i = -5; i <= 5; i++) g.add(P.box(0.5, 0.006, 0.04, M.paint(0x1f5fa8), { pos: [-0.15, 0.27 + Math.cos(i * 0.28) * 0.17, Math.sin(i * 0.28) * 0.17], rot: [-i * 0.28, 0, 0], r: 0 }));
  g.add(P.cyl(0.1, 0.1, 0.1, M.darkMetal(), { pos: [-0.45, 0.27, 0], rot: [0, 0, Math.PI / 2] }));
  g.add(P.box(0.14, 0.12, 0.14, M.paint(0x1f5fa8), { pos: [-0.15, 0.5, 0], r: 0.01 }));
  g.add(P.cyl(0.05, 0.05, 0.3, M.steel(), { pos: [0.1, 0.27, 0], rot: [0, 0, Math.PI / 2] }));
  g.add(P.cyl(0.19, 0.19, 0.3, M.paint(0x3a9a4a), { pos: [0.32, 0.27, 0], rot: [0, 0, Math.PI / 2] }));
  g.add(P.cyl(0.06, 0.06, 0.4, M.steel(), { pos: [0.32, 0.5, 0] }));
  // lámpara de marcha
  const lamp = P.sphere(0.035, M.emissive(0x72D353, 1.5), { pos: [-0.15, 0.6, 0] });
  g.add(lamp);
  // caja de mando en pedestal
  const post = P.group([], { pos: [0.75, 0, 0.1] });
  post.add(P.cyl(0.03, 0.03, 1.0, M.darkMetal(), { pos: [0, 0.5, 0] }));
  post.add(P.box(0.18, 0.24, 0.1, M.paint(0xf1c40f, { roughness: 0.5 }), { pos: [0, 1.08, 0], r: 0.008 }));
  const start = P.cyl(0.03, 0.03, 0.03, M.plastic(0x1fa83a), { pos: [0, 1.14, 0.06], rot: [Math.PI / 2, 0, 0] });
  const stop = P.group([], { pos: [0, 1.02, 0.06] });
  stop.add(P.cyl(0.04, 0.04, 0.03, M.plastic(0xd61f1f), { rot: [Math.PI / 2, 0, 0] }));
  stop.add(P.cyl(0.05, 0.05, 0.008, M.plastic(0xf1c40f), { rot: [Math.PI / 2, 0, 0], pos: [0, 0, -0.012] }));
  tag(start, 'Botón de arranque', null, 'Arrancar es lo contrario de lo que necesita: primero se apaga el equipo con su control normal.');
  tag(stop, 'Botón de paro', 'Equipo apagado con su control normal. El paro no sustituye el aislamiento de energía.');
  post.add(start, stop);
  const l1 = P.sign([{ text: 'MARCHA', size: 40, color: '#fff' }], 0.12, 0.03, { bg: '#1c1f24', fg: '#fff', highlight: false }); l1.position.set(0, 1.185, 0.052); post.add(l1);
  const l2 = P.sign([{ text: 'PARO', size: 40, color: '#fff' }], 0.12, 0.03, { bg: '#1c1f24', fg: '#fff', highlight: false }); l2.position.set(0, 0.965, 0.052); post.add(l2);
  g.add(post);
  return { group: g, lamp, start, stop };
}

function buildLotoStation() {
  const g = P.group([], { name: 'estacion-bloqueo' });
  g.add(P.box(0.5, 0.72, 0.03, M.paint(0xd61f1f, { roughness: 0.5 }), { r: 0.006 }));
  const s = P.sign([{ text: 'ESTACIÓN DE', size: 40, color: '#fff' }, { text: 'BLOQUEO Y ETIQUETADO', size: 40, color: '#fff' }], 0.46, 0.14, { bg: '#d61f1f', fg: '#fff', highlight: false });
  s.position.set(0, 0.26, 0.016); g.add(s);
  const locks = P.group([], { pos: [0, -0.08, 0.03] });
  for (let i = 0; i < 4; i++) { const pl = P.padlock([0xd61f1f, 0xf1c40f, 0x1f5fa8, 0x1fa83a][i]); pl.position.set(-0.17 + i * 0.113, 0.0, 0); locks.add(pl); g.add(P.cyl(0.004, 0.004, 0.04, M.steel(), { pos: [-0.17 + i * 0.113, 0.04 - 0.08, 0.02], rot: [Math.PI / 2, 0, 0] })); }
  const tags = P.group([], { pos: [0, -0.2, 0.03] });
  for (let i = 0; i < 3; i++) { const t = P.tag(); t.position.set(-0.12 + i * 0.12, -0.02, 0); tags.add(t); }
  locks.add(tags);
  tag(locks, 'Candado y tarjeta personal', 'Candado y tarjeta personales colocados en el interruptor: nadie más puede reenergizar.');
  g.add(locks);
  return { group: g, locks };
}

function buildTable() {
  const g = P.group([], { name: 'mesa-herramientas' });
  g.add(P.table(1.0, 0.55, 0.85));
  const y = 0.85;
  // radio
  const radio = P.group([], { pos: [-0.38, y, -0.12] });
  radio.add(P.box(0.06, 0.13, 0.035, M.plastic(0x1c1f24), { pos: [0, 0.065, 0], r: 0.006 }));
  radio.add(P.cyl(0.004, 0.004, 0.12, M.plastic(0x1c1f24), { pos: [-0.02, 0.19, 0] }));
  radio.add(P.box(0.04, 0.03, 0.01, M.plastic(0x3a4047), { pos: [0, 0.1, 0.02], r: 0.002 }));
  const led = P.sphere(0.006, M.emissive(0x72D353, 0.2), { pos: [0.02, 0.125, 0.02] });
  radio.add(led);
  tag(radio, 'Radio: notificar al personal', 'Personal afectado notificado: todos saben que el equipo quedará fuera de servicio.');
  g.add(radio);
  // probador de tensión
  const tester = P.group([], { pos: [-0.2, y, 0.1] });
  tester.add(P.box(0.08, 0.03, 0.16, M.plastic(0xf1c40f), { pos: [0, 0.015, 0], r: 0.008 }));
  const d1 = P.sign([{ text: '480 V', size: 60, color: '#ffea80' }], 0.06, 0.03, { bg: '#1c1f24', fg: '#ffea80', highlight: false }); d1.rotation.x = -Math.PI / 2; d1.position.set(0, 0.031, -0.03); tester.add(d1);
  const d0 = P.sign([{ text: '0 V', size: 60, color: '#72D353' }], 0.06, 0.03, { bg: '#1c1f24', fg: '#72D353', highlight: false }); d0.rotation.x = -Math.PI / 2; d0.position.set(0, 0.031, -0.03); d0.visible = false; tester.add(d0);
  tester.add(P.tube([[-0.02, 0.02, 0.08], [-0.06, 0.01, 0.14], [-0.1, 0.012, 0.18]], 0.003, M.rubber(0xd61f1f)));
  tester.add(P.tube([[0.02, 0.02, 0.08], [0.06, 0.01, 0.14], [0.1, 0.012, 0.18]], 0.003, M.rubber(0x1c1f24)));
  tag(tester, 'Probador: verificar ausencia de tensión', 'Ausencia de tensión verificada en el punto de trabajo: 0 V. Pruebe el probador antes y después.');
  g.add(tester);
  // guantes dieléctricos
  const glovesD = P.group([], { pos: [0.1, y, -0.12] });
  for (const sx of [-1, 1]) { glovesD.add(P.box(0.09, 0.02, 0.2, M.rubber(0xb5261f), { pos: [sx * 0.06, 0.01, 0], r: 0.008 })); glovesD.add(P.box(0.03, 0.018, 0.08, M.rubber(0xb5261f), { pos: [sx * 0.11, 0.009, -0.03], rot: [0, sx * 0.4, 0], r: 0.006 })); }
  const gl = P.sign([{ text: 'CLASE 00 · 500 V', size: 34 }], 0.1, 0.025, { bg: '#f6f6f6', fg: '#111', highlight: false }); gl.rotation.x = -Math.PI / 2; gl.position.set(0.06, 0.021, 0.05); glovesD.add(gl);
  tag(glovesD, 'Guantes dieléctricos clase 00', 'Guantes dieléctricos clase 00 (hasta 500 V), inspeccionados e inflados antes de usar, con protector de cuero encima.');
  g.add(glovesD);
  // guantes de cuero
  const glovesL = P.group([], { pos: [0.36, y, -0.1] });
  for (const sx of [-1, 1]) { glovesL.add(P.box(0.09, 0.02, 0.2, M.fabric(0x8b5a2b), { pos: [sx * 0.055, 0.01, 0], r: 0.008 })); glovesL.add(P.box(0.03, 0.018, 0.08, M.fabric(0x8b5a2b), { pos: [sx * 0.1, 0.009, -0.03], rot: [0, sx * 0.4, 0], r: 0.006 })); }
  tag(glovesL, 'Guantes de cuero', null, 'El cuero no aísla: se usa como protector sobre el guante dieléctrico, nunca en su lugar.');
  g.add(glovesL);
  // destornillador aislado
  const screw = P.group([], { pos: [0.1, y, 0.14] });
  screw.add(P.cyl(0.014, 0.012, 0.11, M.plastic(0xd61f1f), { pos: [-0.055, 0.014, 0], rot: [0, 0, Math.PI / 2] }));
  screw.add(P.cyl(0.006, 0.006, 0.1, M.plastic(0xf1c40f), { pos: [0.05, 0.014, 0], rot: [0, 0, Math.PI / 2] }));
  screw.add(P.cyl(0.003, 0.003, 0.02, M.steel(), { pos: [0.11, 0.014, 0], rot: [0, 0, Math.PI / 2] }));
  tag(screw, 'Destornillador aislado 1 000 V', 'Herramienta aislada certificada para 1 000 V: evita el contacto accidental con partes vivas.');
  g.add(screw);
  // llave metálica
  const wrench = P.group([], { pos: [0.36, y, 0.16] });
  wrench.add(P.box(0.2, 0.008, 0.03, M.steel(), { pos: [0, 0.004, 0], r: 0.002 }));
  wrench.add(P.box(0.05, 0.008, 0.06, M.steel(), { pos: [0.11, 0.004, 0], r: 0.004 }));
  wrench.add(P.box(0.03, 0.01, 0.025, M.darkMetal(), { pos: [0.11, 0.004, 0.0], r: 0 }));
  tag(wrench, 'Llave metálica sin aislamiento', null, 'Herramienta metálica sin aislamiento: puentea conductores y provoca arco eléctrico.');
  g.add(wrench);
  return { group: g, radio, led, tester, d1, d0, glovesD, glovesL, screw, wrench };
}

export default {
  id: 'electrica', title: 'Seguridad Eléctrica', short: 'peligros, bloqueo y etiquetado, EPP', minutes: 7, exercises: 4, color: '#0070C4',
  intro: 'Debe intervenir un motor alimentado desde un tablero de 480 V. Identifique los peligros del área, ejecute el bloqueo y etiquetado, elija su protección y sepa qué hacer en una emergencia.',
  build(ctx) {
    const g = ctx.group;
    // pared de fondo
    if (!ctx.isAR) {
      g.add(P.mesh(new THREE.PlaneGeometry(4.4, 2.8), M.wall([4, 2]), { pos: [0.4, 1.4, -3.3], cast: false }));
      g.add(P.box(4.4, 0.12, 0.03, M.matte(0x5b6b7a), { pos: [0.4, 0.06, -3.285], r: 0 }));
    }
    const board = buildPanelBoard(); board.group.position.set(0.7, 1.45, -3.17); g.add(board.group);
    const motor = buildMotor(); motor.group.position.set(-0.55, 0, -2.75); motor.group.rotation.y = 0.25; g.add(motor.group);
    const loto = buildLotoStation(); loto.group.position.set(1.75, 1.45, -3.27); g.add(loto.group);
    const tbl = buildTable(); tbl.group.position.set(-1.1, 0, -1.75); tbl.group.rotation.y = 0.35; g.add(tbl.group);
    // extintor en pared (decoy)
    const ext = P.extinguisher(); ext.position.set(-1.15, 0.95, -3.2); tag(ext, 'Extintor', null, 'El extintor presente, señalizado y accesible es correcto. No es un peligro.'); g.add(ext);
    g.add(P.box(0.14, 0.14, 0.03, M.paint(0xc8181a), { pos: [-1.15, 0.85, -3.27] }));
    const es = P.sign([{ text: 'EXTINTOR', size: 50, color: '#fff' }], 0.2, 0.06, { bg: '#d61f1f', fg: '#fff', highlight: false }); es.position.set(-1.15, 1.9, -3.28); g.add(es);
    // cable pelado del motor al tablero (peligro)
    const cord = P.cable([[-0.1, 0.05, -2.7], [0.3, 0.02, -2.45], [0.8, 0.02, -2.6], [1.0, 0.1, -3.1], [0.95, 0.9, -3.2]], { r: 0.011, bareAt: 0.3 });
    tag(cord, 'Cable con aislamiento dañado', 'Conductor con el aislamiento roto y cobre expuesto: contacto directo con 480 V. Se retira del servicio y se reemplaza; no se encinta.');
    g.add(cord);
    const sparks = new Sparks(30); sparks.points.position.copy(cord.userData.bare.position); g.add(sparks.points);
    // charco con extensión (peligro) y multitoma sobrecargada (peligro)
    const pud = P.puddle(0.55, 0.38); pud.position.set(1.35, 0.004, -2.15); g.add(pud);
    const ext2 = P.cable([[1.9, 0.03, -3.25], [1.7, 0.02, -2.6], [1.35, 0.015, -2.15], [1.1, 0.02, -1.75], [1.4, 0.03, -1.45]], { r: 0.008, color: 0xf28c28 });
    const wet = P.group([], { name: 'extension-charco' }); wet.add(pud, ext2);
    tag(wet, 'Extensión sobre un charco', 'Extensión eléctrica tendida sobre agua: el agua conduce; al pisar o tocar hay riesgo de electrocución. Se desconecta y se drena el área.');
    g.add(wet);
    const strip = P.group([], { pos: [1.45, 0, -1.4] });
    strip.add(P.box(0.3, 0.04, 0.07, M.plastic(0xe9e9e9), { pos: [0, 0.02, 0], r: 0.006 }));
    for (let i = 0; i < 5; i++) { strip.add(P.box(0.03, 0.045, 0.03, M.plastic(0x1c1f24), { pos: [-0.1 + i * 0.05, 0.04, 0], r: 0.004 })); strip.add(P.tube([[-0.1 + i * 0.05, 0.06, 0], [-0.1 + i * 0.05 + 0.05, 0.03, 0.15 + i * 0.03], [-0.2 + i * 0.1, 0.01, 0.4]], 0.005, M.rubber(0x1c1f24))); }
    strip.add(P.box(0.12, 0.002, 0.08, M.matte(0x2a1d12), { pos: [0.05, 0.041, 0], r: 0 })); // marca de calor
    strip.add(P.box(0.08, 0.002, 0.05, M.matte(0x120c06), { pos: [0.08, 0.042, 0.005], r: 0 }));
    tag(strip, 'Multitoma sobrecargada', 'Multitoma con 5 cargas y marcas de calor: sobrecarga del circuito y riesgo de incendio. Una toma, una carga; nunca en cadena.');
    g.add(strip);
    // candado+tarjeta que aparecerán en el interruptor
    const lockOnBreaker = P.group([], { pos: [0.7, 1.45 + 0.3 - 0.04, -3.17 - 0.05 + 0.06] });
    const pl = P.padlock(0xd61f1f); pl.position.set(0, -0.03, 0.02); const tg = P.tag(); tg.position.set(0.06, -0.07, 0.02); tg.rotation.z = -0.2;
    lockOnBreaker.add(pl, tg); lockOnBreaker.visible = false; g.add(lockOnBreaker);
    // víctima para el ejercicio 4
    const victim = P.person({ vest: 0xf7a81b, hat: 0xffffff }); victim.position.set(0.1, 0, -2.9); victim.rotation.y = -0.6; victim.visible = false; g.add(victim);
    const vSparks = new Sparks(40); vSparks.points.position.set(0.32, 1.1, -3.05); vSparks.active = false; g.add(vSparks.points);

    let motorOn = true, t = 0;
    const steps = [
      {
        title: 'Peligros eléctricos del área', kind: 'find',
        text: 'Antes de acercarse al tablero, identifique los 4 peligros eléctricos presentes.',
        hint: 'Revise cables en el piso, agua, cubiertas del tablero y tomas múltiples.',
        correct: [cord, wet, board.bars, strip], targets: [cord, wet, board.bars, strip, ext, board.main, board.warn, loto.locks, motor.stop],
        onEnter() { board.main.userData.wrong = 'El interruptor principal del tablero es el medio de aislamiento, no un peligro en sí.'; loto.locks.userData.wrong = 'La estación de bloqueo es un control correcto. No es un peligro.'; motor.stop.userData.wrong = 'El botón de paro es un control del equipo, no un peligro.'; },
        explain: 'Cuatro peligros identificados. Se desenergiza, se repara y se cubre antes de que alguien trabaje en el área.',
      },
      {
        title: 'Bloqueo y etiquetado (LOTO)', kind: 'sequence',
        text: 'Ejecute el procedimiento de bloqueo y etiquetado seleccionando cada elemento en el orden correcto.',
        hint: 'Notificar, apagar, aislar, bloquear y etiquetar, verificar.',
        order: [tbl.radio, motor.stop, board.main, loto.locks, tbl.tester], decoys: [motor.start, tbl.glovesD, tbl.wrench],
        onEnter() { motorOn = true; motor.lamp.material.emissiveIntensity = 1.5; board.lever.position.y = 0.03; lockOnBreaker.visible = false; tbl.d1.visible = true; tbl.d0.visible = false; tbl.glovesD.userData.wrong = 'Los guantes son protección para el trabajo, no un paso del bloqueo.'; tbl.wrench.userData.wrong = 'La llave no forma parte del procedimiento de bloqueo.'; },
        onCorrect(obj, c, i) {
          if (i === 0) tween(0.4, k => { tbl.led.material.emissiveIntensity = 0.2 + k * 2; });
          if (i === 1) { motorOn = false; tween(0.6, k => { motor.lamp.material.emissiveIntensity = 1.5 * (1 - k); }); }
          if (i === 2) tween(0.5, k => { board.lever.position.y = 0.03 - 0.06 * k; });
          if (i === 3) { lockOnBreaker.visible = true; lockOnBreaker.scale.set(0.01, 0.01, 0.01); tween(0.5, k => lockOnBreaker.scale.set(k, k, k)); }
          if (i === 4) { tbl.d1.visible = false; tbl.d0.visible = true; }
        },
        explain: 'Energía cero verificada. Solo ahora se puede intervenir el equipo. Al terminar, se retira el bloqueo en orden inverso y se notifica.',
      },
      {
        title: 'Protección para trabajo eléctrico', kind: 'pick',
        text: 'Para trabajar en el tablero de 480 V, seleccione sobre la mesa los 2 elementos de protección correctos.',
        hint: 'Piense en aislamiento verificado: manos y herramienta.',
        correct: [tbl.glovesD, tbl.screw], targets: [tbl.glovesD, tbl.glovesL, tbl.screw, tbl.wrench],
        explain: 'Guantes dieléctricos con protector de cuero y herramienta aislada. Además: careta y ropa resistente al arco según el análisis de riesgo.',
      },
      {
        title: 'Emergencia eléctrica', kind: 'choice',
        text: 'Un compañero quedó en contacto con un conductor energizado y no responde. ¿Qué hace primero?',
        hint: 'Protéjase usted antes de ayudar: la víctima puede estar energizada.',
        options: [
          { label: 'Apartarlo con las manos de inmediato', correct: false, explain: 'Usted también quedaría energizado. Nunca toque a la víctima mientras siga en contacto.' },
          { label: 'Cortar la energía desde el interruptor', correct: true, explain: 'Primero desenergizar. Si no es posible, sepárelo con un material aislante seco. Luego active la emergencia y evalúe RCP.' },
          { label: 'Echarle agua para enfriar la quemadura', correct: false, explain: 'El agua conduce la electricidad y agrava la situación.' },
          { label: 'Esperar a que llegue el electricista', correct: false, explain: 'Cada segundo cuenta: se actúa de forma segura, sin esperar.' },
        ],
        onEnter() { victim.visible = true; vSparks.active = true; },
        onCorrect() { vSparks.active = false; tween(0.6, k => { board.lever.position.y = 0.03 - 0.06 * k; }); },
        onExit() { vSparks.active = false; },
      },
    ];
    return {
      steps,
      update(dt) { t += dt; sparks.update(dt); vSparks.update(dt); if (motorOn) motor.group.position.y = Math.sin(t * 60) * 0.0015; },
    };
  },
};
