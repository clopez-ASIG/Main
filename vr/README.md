# Entrenamiento VR ASIG

Demo de entrenamiento en seguridad industrial para Meta Quest 3S (y cualquier visor WebXR), hecha con WebXR + Three.js. Corre en el navegador del visor, sin tienda ni instalación. Soporta realidad mixta (passthrough), VR y vista de escritorio.

## Módulos

| # | Módulo | Ejercicios |
|---|---|---|
| 1 | Trabajo en Altura | inspección del arnés · punto de anclaje · conector adecuado · peligros en la plataforma |
| 2 | Seguridad Eléctrica | peligros del área · bloqueo y etiquetado (secuencia) · EPP y herramienta · emergencia |
| 3 | Montacargas | inspección pre-uso · transporte de carga · peatón · placa de capacidad |
| 4 | Identificación de Peligros | búsqueda de 6 peligros · clasificación (×2) · jerarquía de controles |

Modos: **Entrenamiento** (con pistas y explicaciones) y **Examen** (sin pistas). Puntaje: 100 menos 10 por error; aprueba con 80. Los resultados se guardan en el navegador (`localStorage`, clave `asig-vr-resultados`).

## Cómo abrirlo en el Quest

WebXR exige HTTPS. La forma más simple es GitHub Pages:

1. Subir esta carpeta al repositorio y activar Pages (Settings → Pages → rama y carpeta `/vr`).
2. En el Quest, abrir el navegador, escribir la dirección y pulsar **Entrar en realidad mixta**.
3. Apuntar con el control (gatillo) o con la mano (pellizco) para seleccionar.

Alternativa local: `npx serve` o `python3 -m http.server` en la PC y un túnel HTTPS (ngrok, cloudflared) hacia esa dirección.

## Editar contenido

- Textos de marca, puntaje mínimo, voz y mensaje de cierre: `js/config.js`.
- Cada módulo es un archivo en `js/modules/`: escenario (`build`) + lista de ejercicios. Tipos de ejercicio: `find`/`pick` (seleccionar objetos), `sequence` (orden), `choice` (opciones de texto).
- Objetos reutilizables (tarima, extintor, cilindro, persona, rack, cables…): `js/core/props.js`.

## Desarrollo

```
npm install            # Three.js local para pruebas sin red
python3 tools/build.py # genera index.local.html y artifact.html
node tools/shots.mjs   # capturas y recorrido automático de los 4 módulos (Playwright)
```

`index.html` carga Three.js desde jsDelivr (versión fijada). Nada más sale a la red.
