#!/usr/bin/env python3
"""Genera variantes de index.html:
 - index.local.html: importa Three.js desde node_modules (pruebas sin red).
 - artifact.html: solo el contenido entre ARTIFACT-START/END (el publicador agrega el esqueleto)."""
import re, pathlib
root = pathlib.Path(__file__).resolve().parent.parent
src = (root / 'index.html').read_text(encoding='utf-8')
local = src.replace('https://cdn.jsdelivr.net/npm/three@0.170.0/', './node_modules/three/')
(root / 'index.local.html').write_text(local, encoding='utf-8')
m = re.search(r'<!-- ARTIFACT-START -->(.*)<!-- ARTIFACT-END -->', src, re.S)
(root / 'artifact.html').write_text(m.group(1).strip() + '\n', encoding='utf-8')
print('ok: index.local.html, artifact.html')
