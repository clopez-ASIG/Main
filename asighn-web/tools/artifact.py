"""Empaqueta el Inicio compilado como vista previa de una sola página para el artifact «Rediseño asighn.com».

Uso: npm run build && python3 tools/artifact.py
Sale en dist-artifact/: index.html con el CSS adentro y rutas relativas, más img/, fonts/ y _astro/.
Los enlaces a páginas que todavía no existen llevan a una nota al pie de la vista previa; nada se inventa.
"""
import re, shutil, sys
from pathlib import Path

raiz = Path(__file__).resolve().parent.parent
dist, sal = raiz / 'dist', raiz / 'dist-artifact'
if not (dist / 'index.html').exists():
    sys.exit('Falta dist/index.html: correr npm run build primero.')
if sal.exists():
    shutil.rmtree(sal)
sal.mkdir()
for carpeta in ('img', 'fonts', '_astro'):
    if (dist / carpeta).exists():
        shutil.copytree(dist / carpeta, sal / carpeta)

html = (dist / 'index.html').read_text(encoding='utf-8')

# 1. Hojas de estilo adentro del documento.
def adentro(m):
    css = (dist / m.group(1).lstrip('/')).read_text(encoding='utf-8')
    return f'<style>{css}</style>'
html = re.sub(r'<link rel="stylesheet" href="(/_astro/[^"]+\.css)"\s*/?>', adentro, html)

# 2. Enlaces internos: lo que existe en esta página va a su ancla; lo demás, a la nota.
aqui = {
    '/': '#contenido', '/#sesion': '#sesion', '/#cursos': '#cursos', '/#ficha-del-proveedor': '#ficha-del-proveedor',
    '/servicios': '#servicios', '/capacitacionesyentrenamientos': '#cursos', '/herramientas': '#herramientas',
    '/clientes': '#confianza', '/articulos-y-novedades': '#articulos', '/contacto': '#contacto',
    '/medicion-de-cultura': '#cultura', '/diagnostico': '#sesion',
}
faltan = set()
def enlace(m):
    destino = m.group(1)
    if destino in aqui:
        return f'href="{aqui[destino]}"'
    faltan.add(destino)
    return 'href="#paginas-siguientes"'
html = re.sub(r'href="(/[^"]*)"(?=[^>]*>)', lambda m: m.group(0) if re.match(r'/(img|fonts|_astro)/', m.group(1)) else enlace(m), html)

# 3. Rutas de archivos, relativas.
html = re.sub(r'(src|href)="/(img|fonts|_astro)/', r'\1="\2/', html)
html = re.sub(r"url\((['\"]?)/(img|fonts|_astro)/", r'url(\1\2/', html)

# 4. Nota de vista previa, antes del pie.
nota = ('<aside id="paginas-siguientes" style="background:#FFF3B0;color:#0C1B30;padding:24px 0;font-size:14px;line-height:1.5">'
        '<div class="contenedor"><strong>Vista previa del Inicio.</strong> Las demás páginas son los pasos siguientes y todavía no existen: '
        'Metodología, las subpáginas de servicios, la calculadora de categoría ambiental, la página de reservas y las páginas propias de cada herramienta. '
        'Un enlace que lleva a una de ellas llega a esta nota.</div></aside>')
assert html.count('<footer') == 1
html = html.replace('<footer', nota + '<footer')
html = html.replace('<title>', '<title>Rediseño asighn.com · ', 1) if False else html

(sal / 'index.html').write_text(html, encoding='utf-8')
resto = sorted(set(re.findall(r'(?:src|href)="(/[^"#][^"]*)"', html)))
print('páginas que faltan:', sorted(faltan))
print('rutas absolutas que quedaron:', resto)
print('archivos:', sum(1 for p in sal.rglob('*') if p.is_file()), '· index.html', len(html) // 1024, 'KB')
