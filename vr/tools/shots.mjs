// Captura la vista de escritorio: menú y primer ejercicio de cada módulo. Uso: node tools/shots.mjs [modulo]
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';

const PORT = 8123, OUT = process.env.OUT || '/tmp/claude-0/-home-user-Main/aa7de100-cb7d-57fa-ac8d-9d86bb49d065/scratchpad/shots';
mkdirSync(OUT, { recursive: true });
const server = spawn('python3', ['-m', 'http.server', String(PORT), '--bind', '127.0.0.1'], { cwd: new URL('..', import.meta.url).pathname, stdio: 'ignore' });
await new Promise(r => setTimeout(r, 800));

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--no-sandbox'],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const logs = [];
page.on('console', m => { if (['error', 'warning'].includes(m.type())) logs.push(`[${m.type()}] ${m.text()}`); });
page.on('pageerror', e => logs.push(`[pageerror] ${e.message}`));
await page.goto(`http://127.0.0.1:${PORT}/index.local.html`);
await page.waitForFunction(() => window.__asigvr && window.__asigvr.lobby && window.__asigvr.lobby.group.children.length > 8, null, { timeout: 30000 }).catch(() => logs.push('[timeout] lobby'));
await page.waitForTimeout(1500);
await page.screenshot({ path: `${OUT}/00-lobby.png` });

const only = process.argv[2];
const ids = await page.evaluate(() => window.__asigvr.MODULES.map(m => m.id));
for (const [i, id] of ids.entries()) {
  if (only && id !== only) continue;
  await page.evaluate((i) => { const a = window.__asigvr; a.lobby.hide(); a.runner.start(a.MODULES[i], 'entrenamiento', false); }, i);
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${OUT}/${i + 1}0-${id}-intro.png` });
  await page.evaluate(() => window.__asigvr.runner.buttons[0].mesh.userData.onSelect());
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${OUT}/${i + 1}1-${id}-paso1.png` });
  // vista cercana del escenario
  await page.evaluate(() => { const a = window.__asigvr; a.camera.position.set(0.6, 1.5, -0.4); });
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}/${i + 1}2-${id}-cerca.png` });
  // recorrer ejercicios programáticamente para detectar errores de lógica
  const result = await page.evaluate(async () => {
    const r = window.__asigvr.runner; const out = [];
    const sleep = (ms) => new Promise(res => setTimeout(res, ms));
    for (let guard = 0; guard < 12 && r.active && r.stepIndex < r.steps.length; guard++) {
      for (let w = 0; w < 20 && r.locked; w++) await sleep(300);
      const step = r.steps[r.stepIndex]; if (!step || r.locked) break;
      out.push(`${r.stepIndex + 1}:${step.kind}:${step.title}`);
      if (step.kind === 'choice') { const b = r.buttons.find(b => step.options.find(o => o.label === b.label && o.correct)); if (!b) { out.push('SIN BOTON'); break; } b.mesh.userData.onSelect(); }
      else if (step.kind === 'sequence') { for (const o of step.order) r.onPick(step, o); }
      else { for (const o of step.correct) r.onPick(step, o); }
      await sleep(600);
    }
    return { out, score: r.score, hits: r.hits, errors: r.errors, title: r.panel.data.title };
  });
  logs.push(`[${id}] ${JSON.stringify(result)}`);
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}/${i + 1}3-${id}-resultado.png` });
  await page.evaluate(() => { const a = window.__asigvr; a.camera.position.set(0.1, 1.65, 0.6); a.runner.exit(); });
}
console.log(logs.join('\n') || 'sin errores de consola');
await browser.close(); server.kill();
