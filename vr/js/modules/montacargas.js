import * as THREE from 'three';
import * as P from '../core/props.js';
import { tween, flash } from '../core/fx.js';
const { M } = P;

const tag = (obj, label, explain, wrong) => { obj.userData.label = label; if (explain) obj.userData.explain = explain; if (wrong) obj.userData.wrong = wrong; return obj; };

function wheel(r, w, damaged = false) {
  const g = P.group();
  g.add(P.cyl(r, r, w, M.rubber(0x1b1b1d), { rot: [0, 0, Math.PI / 2], seg: 32 }));
  g.add(P.cyl(r * 0.55, r * 0.55, w + 0.01, M.paint(0xd9d9d9, { roughness: 0.5 }), { rot: [0, 0, Math.PI / 2], seg: 24 }));
  g.add(P.cyl(r * 0.18, r * 0.18, w + 0.02, M.darkMetal(), { rot: [0, 0, Math.PI / 2] }));
  for (let i = 0; i < 6; i++) g.add(P.cyl(0.012, 0.012, w + 0.025, M.darkMetal(), { pos: [0, Math.cos(i * 1.047) * r * 0.36, Math.sin(i * 1.047) * r * 0.36], rot: [0, 0, Math.PI / 2] }));
  if (damaged) {
    // desprendimiento de caucho
    g.add(P.box(w + 0.01, r * 0.35, r * 0.5, M.matte(0x6b6f75), { pos: [0, r * 0.75, r * 0.15], rot: [0.5, 0, 0], r: 0.01 }));
    for (let k = 0; k < 3; k++) g.add(P.box(0.03, 0.02, 0.08, M.rubber(0x3a3a3c), { pos: [-w / 2 + k * 0.08, r * 0.95, r * 0.3 + k * 0.03], rot: [0.4 + k * 0.3, 0.3, 0], r: 0 }));
  }
  return g;
}

function buildForklift() {
  const g = P.group([], { name: 'montacargas' });
  const yellow = M.paint(0xF2B207, { clearcoat: 0.5 }), dark = M.darkMetal();
  // chasis
  g.add(P.box(1.1, 0.5, 1.7, yellow, { pos: [0, 0.65, -0.05], r: 0.04 }));
  g.add(P.box(1.0, 0.25, 0.5, yellow, { pos: [0, 1.0, -0.7], r: 0.04 }));
  const counter = P.box(1.1, 0.75, 0.55, M.paint(0xd79b05, { clearcoat: 0.4 }), { pos: [0, 0.6, -0.95], r: 0.06 });
  tag(counter, 'Contrapeso', null, 'El contrapeso está íntegro. No es un defecto.'); g.add(counter);
  g.add(P.box(1.12, 0.12, 2.0, dark, { pos: [0, 0.3, -0.1], r: 0.01 }));
  // piso del operador y pedales
  g.add(P.box(0.9, 0.04, 0.5, M.matte(0x2a2d33), { pos: [0, 0.9, 0.2], r: 0.004 }));
  // ruedas
  const wFL = wheel(0.33, 0.24, true); wFL.position.set(-0.6, 0.33, 0.6);
  const wFR = wheel(0.33, 0.24); wFR.position.set(0.6, 0.33, 0.6);
  const wRL = wheel(0.27, 0.2); wRL.position.set(-0.56, 0.27, -0.75);
  const wRR = wheel(0.27, 0.2); wRR.position.set(0.56, 0.27, -0.75);
  tag(wFL, 'Llanta delantera izquierda', 'Llanta con desprendimiento de caucho: pierde estabilidad y frenado. Se reemplaza antes de operar.');
  tag(wFR, 'Llanta delantera derecha', null, 'Esta llanta está en buen estado, sin cortes ni desprendimientos.');
  g.add(wFL, wFR, wRL, wRR);
  // protector superior
  const guard = P.group();
  for (const sx of [-1, 1]) for (const sz of [0.45, -0.55]) guard.add(P.box(0.06, 1.25, 0.06, dark, { pos: [sx * 0.48, 1.52, sz], r: 0.006 }));
  for (const sx of [-1, 1]) guard.add(P.box(0.06, 0.06, 1.1, dark, { pos: [sx * 0.48, 2.15, -0.05], r: 0.006 }));
  for (const sz of [0.45, -0.55]) guard.add(P.box(1.02, 0.06, 0.06, dark, { pos: [0, 2.15, sz], r: 0.006 }));
  for (let i = 0; i < 5; i++) guard.add(P.box(0.03, 0.02, 1.1, dark, { pos: [-0.36 + i * 0.18, 2.17, -0.05], r: 0 }));
  tag(guard, 'Protector superior', null, 'El protector superior está firme y sin deformaciones. No es un defecto.');
  g.add(guard);
  // asiento, cinturón, volante
  const seat = P.group([], { pos: [0, 1.0, -0.35] });
  seat.add(P.box(0.5, 0.1, 0.5, M.fabric(0x2a2d33), { pos: [0, 0.05, 0], r: 0.03 }));
  seat.add(P.box(0.5, 0.55, 0.12, M.fabric(0x2a2d33), { pos: [0, 0.35, -0.22], r: 0.03 }));
  tag(seat, 'Asiento', null, 'El asiento está fijo y en buen estado. No es un defecto.');
  const belt = P.group([], { pos: [0, 1.1, -0.3] });
  belt.add(P.box(0.05, 0.5, 0.01, M.fabric(0xf28c28), { pos: [-0.2, 0.2, -0.05], rot: [0, 0, 0.5], r: 0 }));
  belt.add(P.box(0.08, 0.05, 0.03, M.steel(), { pos: [-0.12, 0.02, -0.02], r: 0.004 }));
  tag(belt, 'Cinturón de seguridad', null, 'El cinturón está presente y funcional: úselo siempre. No es un defecto.');
  g.add(seat, belt);
  g.add(P.box(0.5, 0.4, 0.3, yellow, { pos: [0, 1.1, 0.55], r: 0.03 }));
  g.add(P.cyl(0.02, 0.02, 0.35, dark, { pos: [0, 1.4, 0.45], rot: [0.6, 0, 0] }));
  g.add(P.mesh(new THREE.TorusGeometry(0.17, 0.02, 10, 28), M.rubber(0x1b1b1d), { pos: [0, 1.55, 0.37], rot: [0.6, 0, 0] }));
  // placa de capacidad en el poste izquierdo (mirando al operador... visible al frente)
  const plate = P.plate([{ text: 'CAPACIDAD NOMINAL', size: 30 }, { text: '2 000 kg', size: 54 }, { text: 'centro de carga 500 mm', size: 30, weight: 400 }, { text: 'altura máx. 3 300 mm', size: 30, weight: 400 }], 0.34, 0.26, { bg: '#F1F5FA', fg: '#0C1B30', highlight: false });
  plate.position.set(-0.52, 1.5, 0.45); plate.rotation.y = -Math.PI / 2; plate.rotation.y = -Math.PI / 2 - 0.0;
  tag(plate, 'Placa de capacidad', null, 'La placa de capacidad legible es un requisito, no un defecto.');
  g.add(plate);
  // extintor en poste derecho
  const ext = P.extinguisher(); ext.scale.set(0.6, 0.6, 0.6); ext.position.set(0.55, 0.95, 0.3); ext.rotation.y = Math.PI / 2;
  tag(ext, 'Extintor', null, 'Extintor presente, cargado y sujeto. No es un defecto.'); g.add(ext);
  // baliza rota
  const beacon = P.group([], { pos: [0, 2.19, -0.3] });
  beacon.add(P.cyl(0.06, 0.07, 0.03, dark, { pos: [0, 0.015, 0] }));
  beacon.add(P.mesh(new THREE.CylinderGeometry(0.05, 0.055, 0.1, 24, 1, false, 0, Math.PI * 1.3), M.plastic(0xf28c28, { roughness: 0.3 }), { pos: [0, 0.08, 0] }));
  beacon.add(P.cyl(0.015, 0.02, 0.07, M.matte(0x8a8d93), { pos: [0, 0.07, 0] }));
  for (let k = 0; k < 3; k++) beacon.add(P.box(0.03, 0.004, 0.02, M.plastic(0xf28c28, { roughness: 0.3 }), { pos: [0.06 + k * 0.03, 0.03, 0.04 + k * 0.02], rot: [0.4, k, 0.3], r: 0 }));
  tag(beacon, 'Baliza de advertencia', 'Baliza rota y sin funcionar: los peatones no reciben aviso visual. Se repara antes de operar.');
  g.add(beacon);
  // mástil
  const mast = P.group([], { pos: [0, 0, 0.95] });
  for (const sx of [-1, 1]) { mast.add(P.box(0.08, 2.4, 0.1, dark, { pos: [sx * 0.42, 1.2, 0], r: 0.006 })); mast.add(P.box(0.05, 2.3, 0.06, M.steel(), { pos: [sx * 0.33, 1.2, 0.03], r: 0.004 })); }
  for (const y of [0.3, 1.3, 2.3]) mast.add(P.box(0.92, 0.08, 0.08, dark, { pos: [0, y, 0], r: 0.006 }));
  mast.add(P.cyl(0.05, 0.05, 1.6, M.steel(), { pos: [0, 1.0, -0.06] }));
  // carro, respaldo y horquillas (grupo que sube)
  const carriage = P.group([], { pos: [0, 0, 0.12] });
  carriage.add(P.box(0.95, 0.5, 0.06, dark, { pos: [0, 0.4, 0], r: 0.006 }));
  for (let i = 0; i < 5; i++) carriage.add(P.box(0.04, 1.1, 0.04, dark, { pos: [-0.4 + i * 0.2, 1.1, 0.0], r: 0.004 }));
  for (const y of [0.9, 1.4, 1.6]) carriage.add(P.box(0.9, 0.04, 0.04, dark, { pos: [0, y, 0], r: 0.004 }));
  const forkMat = M.metal(0x4a4f57, { roughness: 0.45, metalness: 0.8 });
  const forkL = P.group([], { pos: [-0.3, 0, 0] });
  forkL.add(P.box(0.1, 0.045, 1.1, forkMat, { pos: [0, 0.07, 0.58], r: 0.004 }));
  forkL.add(P.box(0.1, 0.45, 0.05, forkMat, { pos: [0, 0.27, 0.05], r: 0.004 }));
  // grieta en el talón
  forkL.add(P.box(0.102, 0.004, 0.09, M.matte(0x111111), { pos: [0, 0.095, 0.08], rot: [0.5, 0, 0], r: 0 }));
  forkL.add(P.box(0.102, 0.003, 0.05, M.matte(0x111111), { pos: [0, 0.14, 0.045], rot: [0, 0, 0.1], r: 0 }));
  tag(forkL, 'Horquilla izquierda', 'Grieta en el talón de la horquilla: puede fracturarse con carga. El equipo se saca de servicio y se etiqueta.');
  const forkR = P.group([], { pos: [0.3, 0, 0] });
  forkR.add(P.box(0.1, 0.045, 1.1, forkMat, { pos: [0, 0.07, 0.58], r: 0.004 }));
  forkR.add(P.box(0.1, 0.45, 0.05, forkMat, { pos: [0, 0.27, 0.05], r: 0.004 }));
  tag(forkR, 'Horquilla derecha', null, 'Esta horquilla está sin grietas ni deformación. No es un defecto.');
  carriage.add(forkL, forkR);
  // carga: tarima con cajas sobre las horquillas
  const load = P.group([], { pos: [0, 0.1, 0.62] });
  load.add(P.pallet());
  const bx = P.boxStack({ w: 1.1, d: 0.9, layers: 3, height: 0.33 }); bx.position.y = 0.144; load.add(bx);
  const lbl = P.plate([{ text: 'PESO BRUTO', size: 30 }, { text: '1 800 kg', size: 54 }, { text: 'centro de carga 800 mm', size: 30, weight: 400 }], 0.4, 0.22, { bg: '#FFD800', fg: '#0C1B30', highlight: false });
  lbl.position.set(0, 0.75, 0.47); load.add(lbl);
  carriage.add(load);
  mast.add(carriage);
  g.add(mast);
  return { group: g, defects: [forkL, wFL, beacon], decoys: [forkR, wFR, counter, guard, seat, belt, plate, ext], mast, carriage, load };
}

export default {
  id: 'montacargas', title: 'Montacargas', short: 'inspección, carga, peatones y capacidad', minutes: 6, exercises: 4, color: '#FFD800',
  intro: 'Va a operar un montacargas en un pasillo con tránsito de personas. Inspeccione el equipo, decida cómo transportar la carga, responda ante un peatón y lea la placa de capacidad.',
  build(ctx) {
    const g = ctx.group;
    const fl = buildForklift(); fl.group.position.set(0.9, 0, -3.3); fl.group.rotation.y = 0.55; g.add(fl.group);
    // pasillo peatonal pintado
    const walk = P.group([], { pos: [-0.9, 0.003, -1.9] });
    for (let i = 0; i < 7; i++) walk.add(P.mesh(new THREE.PlaneGeometry(0.12, 1.6), M.matte(0xf1f1f1, { roughness: 0.6 }), { pos: [-0.6 + i * 0.2, 0, 0], rot: [-Math.PI / 2, 0, 0], cast: false }));
    g.add(walk);
    const ws = P.plate([{ text: 'PASO PEATONAL', size: 46 }], 0.5, 0.1, { bg: '#FFD800', fg: '#0C1B30', highlight: false }); ws.position.set(-2.0, 1.0, -2.6); ws.rotation.y = 0.5; g.add(ws);
    g.add(P.cyl(0.02, 0.02, 1.0, M.darkMetal(), { pos: [-2.0, 0.5, -2.6] }));
    // rack al fondo
    const rk = P.rack({ w: 2.6, d: 1.0, h: 3.0 }); rk.position.set(2.2, 0, -4.6); rk.rotation.y = 0.2; g.add(rk);
    for (let l = 0; l < 3; l++) { const s = P.boxStack({ w: 1.0, d: 0.8, layers: 2, height: 0.3 }); s.position.set(1.4 + l * 0.9, 0.19 + (l === 2 ? 1.35 : 0), -4.6); s.rotation.y = 0.2; g.add(s); }
    // peatón
    const ped = P.person({ vest: 0x72D353, hat: 0xFFD800 }); ped.position.set(-1.4, 0, -1.9); ped.rotation.y = Math.PI / 2; ped.visible = false; g.add(ped);
    let pedT = 0, pedWalking = false;

    const steps = [
      {
        title: 'Inspección previa al turno', kind: 'find',
        text: 'Haga la inspección antes de operar. Encuentre los 3 defectos que impiden usar este montacargas.',
        hint: 'Revise horquillas, llantas y luces de advertencia.',
        correct: fl.defects, targets: [...fl.defects, ...fl.decoys],
        explain: 'Tres defectos encontrados. Un montacargas con defectos se etiqueta "fuera de servicio" y se reporta; no se opera "con cuidado".',
      },
      {
        title: 'Transporte de la carga', kind: 'choice',
        text: 'Va a mover la tarima por el pasillo. ¿Cómo lleva las horquillas durante el recorrido?',
        hint: 'Piense en el centro de gravedad del conjunto y en la visibilidad.',
        options: [
          { label: 'Elevadas a la altura del pecho, para ver la carga', correct: false, explain: 'Con la carga alta el centro de gravedad sube y el equipo puede volcar en una curva o frenada.' },
          { label: 'A 15–20 cm del piso, con el mástil inclinado hacia atrás', correct: true, explain: 'Carga baja y mástil hacia atrás: máxima estabilidad. Si la carga tapa la vista, se circula en reversa.' },
          { label: 'Al ras del piso, para no golpear nada', correct: false, explain: 'Al ras las horquillas se enganchan en rampas y desniveles y se pierde el control.' },
        ],
        onEnter() { fl.carriage.position.y = 0; fl.mast.rotation.x = 0; },
        onCorrect() { tween(1.2, k => { fl.carriage.position.y = 0.18 * k; fl.mast.rotation.x = 0.07 * k; }); },
      },
      {
        title: 'Peatón en el pasillo', kind: 'choice',
        text: 'Mientras avanza, un peatón cruza el paso frente a usted. ¿Qué hace?',
        hint: 'El peatón siempre tiene la prioridad.',
        options: [
          { label: 'Toca la bocina y continúa', correct: false, explain: 'La bocina no da derecho de paso. El peatón siempre tiene prioridad.' },
          { label: 'Se detiene por completo, cede el paso y espera contacto visual', correct: true, explain: 'Detenerse, ceder el paso y confirmar contacto visual antes de avanzar. A 3 m de distancia como mínimo.' },
          { label: 'Acelera para pasar antes que él', correct: false, explain: 'Acelerar reduce el tiempo de reacción y la distancia de frenado: riesgo de atropello.' },
        ],
        onEnter() { ped.visible = true; ped.position.x = -1.5; pedWalking = true; pedT = 0; },
        onWrong() { flash(ped, 0xE0352B, 0.8); },
        onCorrect() { pedWalking = false; },
        onExit() { ped.visible = false; pedWalking = false; },
      },
      {
        title: 'Placa de capacidad', kind: 'choice',
        text: 'La placa indica 2 000 kg con centro de carga a 500 mm. La tarima pesa 1 800 kg con centro de carga a 800 mm. ¿Es seguro levantarla?',
        hint: 'Capacidad real ≈ capacidad nominal × centro de carga nominal ÷ centro de carga real.',
        options: [
          { label: 'Sí: 1 800 kg es menos que 2 000 kg', correct: false, explain: 'La capacidad nominal solo vale al centro de carga de la placa. Con la carga más lejos, la capacidad baja.' },
          { label: 'No: a 800 mm la capacidad real baja a unos 1 250 kg', correct: true, explain: '2 000 × 500 ÷ 800 ≈ 1 250 kg. Con 1 800 kg el equipo volcaría hacia adelante. Se divide la carga o se usa otro equipo.' },
          { label: 'Sí, si se levanta despacio y sin inclinar', correct: false, explain: 'La velocidad no cambia el momento de vuelco; el centro de carga sí.' },
        ],
        onWrong() { tween(0.9, k => { fl.group.rotation.x = -0.12 * Math.sin(k * Math.PI); }); },
      },
    ];
    return {
      steps,
      update(dt) {
        if (pedWalking) { pedT += dt; ped.position.x = -1.5 + Math.min(1.3, pedT * 0.35); ped.position.y = Math.abs(Math.sin(pedT * 6)) * 0.02; }
      },
    };
  },
};
