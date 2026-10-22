// Fuentes de marca y utilidades de texto para canvas.
export const FONTS = {
  display: '"Raleway", "Century Gothic", Arial, sans-serif',
  body: '"Nunito Sans", Arial, sans-serif',
};

export async function loadFonts(base = 'assets/fonts/') {
  if (!('FontFace' in window)) return;
  const faces = [
    ['Raleway', 'raleway-latin-600-normal.ttf', '600'],
    ['Raleway', 'raleway-latin-700-normal.ttf', '700'],
    ['Nunito Sans', 'nunito-sans-latin-400-normal.ttf', '400'],
    ['Nunito Sans', 'nunito-sans-latin-700-normal.ttf', '700'],
  ];
  await Promise.all(faces.map(async ([family, file, weight]) => {
    try {
      const f = new FontFace(family, `url(${base}${file})`, { weight });
      await f.load();
      document.fonts.add(f);
    } catch (e) { /* fallback silencioso a la pila del sistema */ }
  }));
}

/** Parte texto en líneas que caben en maxW. Respeta saltos manuales. */
export function wrap(ctx, text, maxW) {
  const out = [];
  for (const para of String(text).split('\n')) {
    const words = para.split(' ');
    let line = '';
    for (const w of words) {
      const test = line ? line + ' ' + w : w;
      if (ctx.measureText(test).width > maxW && line) { out.push(line); line = w; }
      else line = test;
    }
    out.push(line);
  }
  return out;
}

export function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
