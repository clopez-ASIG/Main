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

## 23 nov, noche: se unen las dos líneas de documentos

- `docs/documentacion.md` y `docs/implementation.md` pasan a versión 3: la plataforma de la v2 del 2 nov (Astro) más el contenido de la v2 del 23 nov, que se había escrito sobre la línea vieja de Wix + Velo. Los pendientes nuevos de esa versión quedaron numerados 14 a 19.
- Entra `docs/prueba-visitantes-v8.md`.
- El artifact «Rediseño asighn.com» (v8, publicado a las 19:17) va adelante de este código: el bloque narrativo de cifras, el título «¿Cómo podemos comenzar a ayudarlo?», la sesión de 30 minutos y el hero recortado sobre la persona no están en la rama. El Inicio se rehace con la versión 3; de la v8 se recupera lo que sirva desde el HTML publicado.
- Assets de Christian en `docs/assets/`: `alternativas-cifras.html` (el archivo que él adjuntó) y `servicios-genspark.md` (resumen de la página de Genspark, no su copy literal).
- Sin revisar todavía contra el canon: lo que la versión 3 heredó de la línea de Wix y que `audit/reglas.md` ya marcaba (pilar 3, logo blanco, nombrar clientes, cifra de estudios).

## 23 nov, noche: Inicio rehecho con la versión 3 (artifact v9)

- `src/pages/index.astro` con las once secciones de documentacion.md §7. Componentes nuevos: `CifrasNarra`, `Situaciones`, `Cursos`, `FichaProveedor`. Cambiados: `Autodiagnostico` (resultado por pregunta), `Hero` (línea llana y foto centrada en la persona), `TarjetaServicio` (oración completa y cifra junto al servicio), `Cabecera` (menú nuevo y WhatsApp en móvil), `Cierre`.
- Colección `cursos` con los ocho candidatos de la documentación, sin horas, modalidad ni constancia (pendiente 15).
- Raleway 300 y 800 alojadas para el bloque de cifras.
- `tools/artifact.py` empaqueta el Inicio compilado como vista previa de una sola página; los enlaces a páginas que no existen llevan a una nota.
- Revisado: `astro build` sin errores; 1440 y 390 px sin desborde de página; 14.9 pantallas en móvil (la v8 medía 16); un solo contraste «no X, sino Y» en el texto visible; sin siglas sin explicar; autodiagnóstico probado con respuestas mixtas.
- No corrido: inspector de taste-skill (1b). Decisiones tomadas sin consulta, para que Christian las vea: el cierre lleva «Cotizar por WhatsApp» en vez de Agendar, porque el bloque de la sesión queda justo arriba; en móvil, servicios y artículos se recorren de lado; la cifra de estudios es 110 (cifras.json), no los 240 que mostraba la v8.
- Siguen sin usarse en el Inicio, guardados para Metodología: `Pilares`, `Cuadrante`, `Proceso`, `Puertas`.
