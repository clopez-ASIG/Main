import * as THREE from 'three';
import * as P from '../core/props.js';
import { tween } from '../core/fx.js';
const { M } = P;

const tag = (obj, label, explain, wrong) => { obj.userData.label = label; if (explain) obj.userData.explain = explain; if (wrong) obj.userData.wrong = wrong; return obj; };

function grinder() {
  const g = P.group([], { name: 'esmeril' });
  g.add(P.box(0.22, 0.08, 0.26, M.darkMetal(), { pos: [0, 0.04, 0], r: 0.008 }));
  g.add(P.cyl(0.1, 0.1, 0.3, M.paint(0x1f5fa8), { pos: [0, 0.18, 0], rot: [0, 0, Math.PI / 2] }));
  g.add(P.cyl(0.02, 0.02, 0.6, M.steel(), { pos: [0, 0.18, 0], rot: [0, 0, Math.PI / 2] }));
  for (const sx of [-1, 1]) {
    g.add(P.cyl(0.11, 0.11, 0.025, M.matte(0x8f8f8f, { roughness: 0.95 }), { pos: [sx * 0.26, 0.18, 0], rot: [0, 0, Math.PI / 2], seg: 32 }));
    g.add(P.cyl(0.035, 0.035, 0.03, M.darkMetal(), { pos: [sx * 0.26, 0.18, 0], rot: [0, 0, Math.PI / 2] }));
  }
  g.add(P.box(0.06, 0.02, 0.04, M.plastic(0xd61f1f), { pos: [0.06, 0.29, 0.1], r: 0.004 }));
  return g;
}

function drum(color = 0x1f5fa8) {
  const g = P.group([], { name: 'tambor' });
  g.add(P.cyl(0.29, 0.29, 0.88, M.paint(color), { pos: [0, 0.44, 0] }));
  for (const y of [0.25, 0.6]) g.add(P.mesh(new THREE.TorusGeometry(0.295, 0.012, 8, 40), M.paint(color), { pos: [0, y, 0], rot: [Math.PI / 2, 0, 0] }));
  g.add(P.cyl(0.29, 0.29, 0.02, M.darkMetal(), { pos: [0, 0.89, 0] }));
  g.add(P.cyl(0.03, 0.03, 0.03, M.darkMetal(), { pos: [0.15, 0.91, 0] }));
  const l = P.sign([{ text: 'ACEITE', size: 50 }, { text: 'HIDRÁULICO', size: 40, weight: 400 }], 0.26, 0.12, { bg: '#f6f6f6', fg: '#111', highlight: false }); l.position.set(0, 0.45, 0.292); g.add(l);
  return g;
}

export default {
  id: 'peligros', title: 'Identificación de Peligros', short: 'búsqueda, clasificación y controles', minutes: 7, exercises: 4, color: '#72D353',
  intro: 'Recorrerá un taller con varias condiciones inseguras. Encuentre los peligros, clasifíquelos y elija el mejor control según la jerarquía.',
  build(ctx) {
    const g = ctx.group;
    // paredes en L
    if (!ctx.isAR) {
      g.add(P.mesh(new THREE.PlaneGeometry(4.6, 2.8), M.wall([4, 2]), { pos: [0.6, 1.4, -3.5], cast: false }));
      g.add(P.mesh(new THREE.PlaneGeometry(3.2, 2.8), M.wall([3, 2]), { pos: [2.9, 1.4, -1.9], rot: [0, -Math.PI / 2, 0], cast: false }));
      g.add(P.box(4.6, 0.12, 0.03, M.matte(0x5b6b7a), { pos: [0.6, 0.06, -3.485], r: 0 }));
      g.add(P.box(0.03, 0.12, 3.2, M.matte(0x5b6b7a), { pos: [2.885, 0.06, -1.9], r: 0 }));
    }
    // salida de emergencia bloqueada
    g.add(P.box(0.95, 2.1, 0.06, M.paint(0x7a8591, { roughness: 0.5 }), { pos: [1.6, 1.05, -3.46], r: 0.006 }));
    g.add(P.box(0.5, 0.04, 0.08, M.paint(0xd61f1f), { pos: [1.6, 1.0, -3.4], r: 0.006 }));
    const exitSign = P.sign([{ text: 'SALIDA', size: 60, color: '#fff' }], 0.5, 0.16, { bg: '#1fa83a', fg: '#fff', highlight: false }); exitSign.position.set(1.6, 2.35, -3.46); g.add(exitSign);
    const exitLight = new THREE.PointLight(0x72D353, 0.6, 1.5); exitLight.position.set(1.6, 2.3, -3.3); g.add(exitLight);
    const blocking = P.group([], { pos: [1.6, 0, -3.05] });
    blocking.add(P.cardboardBox(0.6, 0.45, 0.5, { pos: [-0.2, 0.225, 0] }));
    blocking.add(P.cardboardBox(0.5, 0.4, 0.45, { pos: [0.35, 0.2, 0.05], rot: [0, 0.3, 0] }));
    blocking.add(P.cardboardBox(0.55, 0.4, 0.45, { pos: [0.05, 0.65, 0.0], rot: [0, -0.2, 0] }));
    tag(blocking, 'Salida de emergencia bloqueada', 'Salida de emergencia obstruida: en una evacuación, segundos cuestan vidas. Las rutas y salidas se mantienen libres siempre.');
    g.add(blocking);
    // extintor obstruido
    const extG = P.group([], { pos: [-0.9, 0, -3.3] });
    const ex = P.extinguisher(); ex.position.set(0, 0.95, 0); extG.add(ex);
    extG.add(P.box(0.14, 0.14, 0.03, M.paint(0xc8181a), { pos: [0, 0.85, -0.1] }));
    const es = P.sign([{ text: 'EXTINTOR', size: 50, color: '#fff' }], 0.2, 0.06, { bg: '#d61f1f', fg: '#fff', highlight: false }); es.position.set(0, 1.9, -0.15); extG.add(es);
    extG.add(P.cardboardBox(0.5, 0.5, 0.4, { pos: [0, 0.25, 0.35] }));
    extG.add(P.cardboardBox(0.45, 0.45, 0.4, { pos: [0.05, 0.72, 0.33], rot: [0, 0.25, 0] }));
    tag(extG, 'Extintor obstruido', 'Extintor bloqueado por material: en un incendio no se alcanza a tiempo. Acceso libre de 1 m alrededor, siempre.');
    g.add(extG);
    // cilindros
    const cylFree = P.gasCylinder({ color: 0x2f7d3a, label: 'OXÍGENO' }); cylFree.position.set(1.0, 0, -2.75); cylFree.rotation.z = 0.06;
    tag(cylFree, 'Cilindro sin asegurar', 'Cilindro de gas de pie, sin cadena ni tapa: si cae, la válvula se rompe y el cilindro sale proyectado. Se asegura con cadena y se tapa.');
    const cylOk = P.gasCylinder({ color: 0x8a1f1f, chained: true, label: 'ACETILENO' }); cylOk.position.set(0.35, 0, -3.25);
    tag(cylOk, 'Cilindro encadenado', null, 'Este cilindro está encadenado a la pared y con su válvula protegida: correcto.');
    g.add(cylFree, cylOk);
    g.add(P.box(0.03, 0.03, 0.2, M.steel(), { pos: [0.35, 0.85, -3.4], r: 0 }));
    // tambor con derrame
    const dr = drum(); dr.position.set(0.15, 0, -2.85); dr.rotation.y = 0.4; g.add(dr);
    const spill = P.puddle(0.38, 0.26, 0x3a2f1a); spill.position.set(0.3, 0.004, -2.25); spill.material = spill.material.clone(); spill.material.color.set(0x3a2f1a); spill.material.opacity = 0.85;
    const drip = P.tube([[0.3, 0.3, -2.65], [0.33, 0.1, -2.5], [0.32, 0.005, -2.4]], 0.006, spill.material);
    const spillG = P.group([], { name: 'derrame' }); spillG.add(spill, drip);
    tag(spillG, 'Derrame de aceite en el piso', 'Derrame de aceite en zona de paso: caída al mismo nivel. Se contiene la fuga, se limpia con absorbente y se señaliza mientras tanto.');
    g.add(spillG);
    // banco de trabajo con esmeril sin guarda, gafas, martillo
    const bench = P.table(1.4, 0.6, 0.88, { top: 0x8b6b43, legs: 0x2d3238 }); bench.position.set(-1.3, 0, -2.9); g.add(bench);
    const gr = grinder(); gr.position.set(-1.3, 0.88, -2.95);
    tag(gr, 'Esmeril de banco sin guarda', 'Esmeril sin guardas ni pantalla: proyección de partículas y atrapamiento. No se usa hasta reinstalar las guardas.');
    g.add(gr);
    const goggles = P.group([], { pos: [-0.8, 0.9, -2.75] });
    goggles.add(P.box(0.16, 0.05, 0.02, M.glass(), { r: 0.01 })); goggles.add(P.tube([[-0.08, 0, 0], [-0.1, 0, -0.06], [-0.09, 0, -0.12]], 0.004, M.plastic(0x1c1f24))); goggles.add(P.tube([[0.08, 0, 0], [0.1, 0, -0.06], [0.09, 0, -0.12]], 0.004, M.plastic(0x1c1f24)));
    tag(goggles, 'Gafas de seguridad', null, 'Las gafas disponibles son protección, no un peligro.');
    g.add(goggles);
    const hat = P.hardHat(0xffffff); hat.position.set(-1.9, 1.6, -3.42); hat.rotation.x = 0.5;
    tag(hat, 'Casco colgado', null, 'El casco colgado en su sitio no es un peligro.');
    g.add(hat); g.add(P.cyl(0.01, 0.01, 0.1, M.darkMetal(), { pos: [-1.9, 1.55, -3.45], rot: [Math.PI / 2, 0, 0] }));
    // cable cruzando el pasillo
    const cab = P.cable([[-0.9, 0.86, -2.65], [-0.6, 0.02, -2.0], [0.4, 0.015, -1.45], [1.6, 0.02, -1.2], [2.85, 0.3, -1.3]], { r: 0.009, color: 0xf28c28 });
    tag(cab, 'Cable cruzando la zona de paso', 'Extensión atravesando el pasillo: tropiezo y daño al cable. Se canaliza por alto, se protege con pasacables o se reubica.');
    g.add(cab);
    g.add(P.box(0.1, 0.12, 0.04, M.plastic(0xf1f1f1), { pos: [2.86, 0.32, -1.3], r: 0.004 }));
    // rack ordenado (decoy)
    const rk = P.rack({ w: 2.0, d: 0.9, h: 2.6, levels: 3 }); rk.position.set(2.4, 0, -1.5); rk.rotation.y = -Math.PI / 2; g.add(rk);
    for (let l = 0; l < 2; l++) { const s = P.boxStack({ w: 0.8, d: 0.7, layers: 1, height: 0.35 }); s.position.set(2.4, 0.17 + l * 1.15, -2.0 + l * 0.9); g.add(s); }
    tag(rk, 'Estante', null, 'El estante está ordenado, anclado y dentro de su capacidad. No es un peligro.');
    // escalera íntegra (decoy)
    const lad = P.ladder({ h: 2.2 }); lad.position.set(-2.05, 0, -3.1); lad.rotation.x = -0.18; lad.rotation.y = 0.2;
    tag(lad, 'Escalera', null, 'La escalera está íntegra y bien apoyada. No es un peligro.');
    g.add(lad);
    // franja de paso peatonal
    for (let i = 0; i < 2; i++) g.add(P.mesh(new THREE.PlaneGeometry(4.2, 0.08), M.matte(0xe8c21a), { pos: [0.5, 0.003, -1.15 - i * 1.0], rot: [-Math.PI / 2, 0, 0], cast: false }));

    const hazards = [spillG, cylFree, extG, cab, blocking, gr];
    const steps = [
      {
        title: 'Búsqueda de peligros', kind: 'find',
        text: 'Recorra el taller con la vista e identifique los 6 peligros presentes.',
        hint: 'Piso, pasillos, cilindros, equipos de emergencia, salidas y máquinas.',
        correct: hazards, targets: [...hazards, cylOk, rk, lad, hat, goggles],
        explain: 'Seis peligros identificados. Lo que no se identifica no se controla: la inspección de rutina es el primer control.',
      },
      {
        title: 'Clasificación: esmeril sin guarda', kind: 'choice',
        text: 'El esmeril de banco sin guarda, ¿qué tipo de peligro representa?',
        hint: 'Piense en qué causa el daño: partes en movimiento y partículas.',
        options: [
          { label: 'Mecánico', correct: true, explain: 'Peligro mecánico: atrapamiento por partes en movimiento y proyección de partículas.' },
          { label: 'Químico', correct: false, explain: 'Lo químico implica sustancias: polvos, vapores, líquidos. No es el caso principal.' },
          { label: 'Ergonómico', correct: false, explain: 'Lo ergonómico refiere a posturas, fuerza y repetición. No es lo que daña aquí.' },
          { label: 'Biológico', correct: false, explain: 'Lo biológico implica agentes vivos: bacterias, virus, hongos.' },
        ],
      },
      {
        title: 'Clasificación: derrame en el piso', kind: 'choice',
        text: 'El derrame de aceite en la zona de paso, ¿qué tipo de peligro es?',
        hint: 'Piense en el evento más probable: resbalar y caer.',
        options: [
          { label: 'Locativo', correct: true, explain: 'Peligro locativo: superficie resbalosa, caída al mismo nivel.' },
          { label: 'Eléctrico', correct: false, explain: 'No hay energía eléctrica involucrada en el derrame.' },
          { label: 'Psicosocial', correct: false, explain: 'Lo psicosocial refiere a carga mental, acoso, turnos. No aplica.' },
          { label: 'Biológico', correct: false, explain: 'El aceite hidráulico no es un agente biológico.' },
        ],
      },
      {
        title: 'Jerarquía de controles', kind: 'choice',
        text: 'Para el derrame de aceite, ¿cuál es el mejor control según la jerarquía?',
        hint: 'Eliminación, sustitución, ingeniería, administrativo, EPP: de más a menos eficaz.',
        options: [
          { label: 'Colocar un cono y un letrero de piso resbaloso', correct: false, explain: 'Señalizar es un control administrativo: avisa, pero el peligro sigue ahí.' },
          { label: 'Reparar la fuga del tambor y limpiar el derrame', correct: true, explain: 'Eliminar la fuente es el nivel más alto de la jerarquía. Mientras se hace, se señaliza.' },
          { label: 'Exigir botas antideslizantes a todo el personal', correct: false, explain: 'El EPP es la última barrera: protege a una persona, no elimina el peligro.' },
        ],
        onCorrect() { tween(1.2, k => { spill.scale.set(0.38 * (1 - k), 0.26 * (1 - k), 1); drip.scale.set(1, 1 - k, 1); }); },
      },
    ];
    return { steps };
  },
};
