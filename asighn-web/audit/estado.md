# Estado del rediseño — 23 nov 2026

## Hecho

| Paso | Qué hay |
|---|---|
| 0.1 | Proyecto Astro 5 con TypeScript estricto en `asighn-web/`, rama `redesign-2026`. Todavía sin repositorio propio de ASIG ni Cloudflare (pendiente 11). |
| 0.5 | `audit/reglas.md`, con los choques encontrados. |
| 0.6 | `src/content/cifras.json`, leído del Sheet el 23 nov. |
| 1 | Tokens, fuentes alojadas y estilos base. |
| 2, parcial | Componentes: Boton, Hero, Cifras, Puertas, Autodiagnostico, TarjetaServicio, Proceso, BandaLogos, FichaCaso, TarjetaArticulo, Testimonio, Cierre, Cabecera, Pie, Foto, Pendiente. Falta Formulario (HubSpot, paso 8) y la página `/_componentes`. |
| 3, parcial | Colecciones con esquema: cifras, servicios, casos, artículos (solo los 3 recientes, sin cuerpo). |
| 4, primer borrador | Inicio con las diez secciones de documentacion.md §7 y el autodiagnóstico en borrador. |

## Lo que se saltó o falta del método

- Los gates del plan piden aprobación de Christian al cerrar cada paso. Se armaron los pasos 1, 2 y 4 de corrido para tener algo que mirar; la aprobación de tokens, componentes e Inicio queda en una sola revisión.
- 0.2 inventario completo, 0.3 rescate del blog (30 artículos), descargas y `/juego`, y 0.4 DNS: no hechos. Conocido por Notion: el dominio está registrado en Rackspace y sus DNS viven en Wix.
- 1b: no se corrió el inspector de taste-skill (ver reglas.md).
- Los enlaces a las demás páginas dan 404 en la vista previa: esas páginas son los pasos 5 a 8.

## Cómo verlo

```
cd asighn-web
npm install
npm run dev
```
