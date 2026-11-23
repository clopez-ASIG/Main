# Implementation — Rediseño de asighn.com fuera de Wix

**Para Claude Code. Versión 2 · 2 nov 2026.** Reemplaza la versión 1 (27 oct), que era para Wix + Velo.
Regla del método: cada paso termina con revisión y pulido antes de abrir el siguiente. No se construye la página siguiente con la anterior a medias. Al cerrar cada paso, capturas en escritorio y móvil para que Christian apruebe.

Lo que manda sobre este archivo: `documentacion.md` (dirección), `asig-canon` (datos y marca), `voz-de-asig` (copy). Si algo acá choca con eso, gana eso y se reporta.

## Plataforma

| Pieza | Qué se usa | Por qué |
|---|---|---|
| Código | Astro, en un repositorio de GitHub de ASIG | HTML y CSS reales, sin editor visual de por medio. Cualquier desarrollador o IA lo puede abrir; no hay encierro de plataforma |
| Hosting | Cloudflare, conectado al repo (Pages o Workers con archivos estáticos, lo que Cloudflare ofrezca vigente) | Plan gratuito suficiente. Cada rama da una URL de vista previa; `main` es el sitio publicado |
| Contenido | Colecciones de Astro: archivos Markdown y JSON dentro del repo, con esquema validado | Si a una ficha le falta un campo, el sitio no compila. Una colección nueva es una carpeta nueva |
| Formularios | HubSpot, incrustado | Cada envío crea el contacto en el CRM y avisa a consultas@asighn.com |
| Agenda | Página de reservas de Google Calendar (Workspace de asighn.com), incrustada | Ya viene con Workspace; la cita cae en el calendario de Christian con enlace de Meet |
| Fuentes | Raleway y Nunito Sans alojadas en el propio sitio | Sin llamadas a terceros para cargar texto |
| Estado en vivo (juegos del aula) | Cloudflare Workers con almacenamiento (D1 o KV) | Lo único del sitio que necesita servidor. Ver paso 8b |

**Cómo se hacen los ajustes chicos.** Christian manda una captura con lo que quiere mover («esto un poco más arriba»). Todo espaciado sale de la escala del paso 1, así que un ajuste es un paso de la escala, nunca un valor inventado. Un editor visual sobre el repo (CloudCannon) queda como opción si los ajustes chicos se vuelven diarios; no se instala de entrada.

**Qué desaparece respecto de la versión 1.** La spec de sección para el editor de Wix, el mapeo de tokens al Tema de Wix y el prototipo HTML aparte. El prototipo es la página.

---

## Paso 0 — Preparación (el sitio de Wix no se toca)

0.1 Crear el repositorio y el proyecto Astro (TypeScript estricto). Estructura: `src/pages`, `src/components`, `src/content`, `src/styles/tokens.css`, `public/img`, `docs/` con `documentacion.md` y este archivo. Conectar a Cloudflare. Rama `redesign-2026`; su URL de vista previa es donde Christian revisa todo. El dominio no se toca hasta el paso 9.

0.2 Inventario del sitio actual: páginas con slug, secciones de cada página, apps instaladas, fuentes y colores. Guardar en `audit/inventario.md`. Exportar la copy actual de cada página a `audit/copy-actual/`. Listar todas las URLs públicas, incluidas las del blog (`/post/<slug>`) y `/juego`, en `audit/urls.md`: es el mapa de redirecciones del paso 8.

0.3 **Rescate de contenido de Wix.** Mientras el plan de Wix siga activo:
- Cada artículo del blog con título, fecha, texto, portada e imágenes internas, a `src/content/articulos/<slug>.md`.
- Los archivos de Descargas, a `public/descargas/`.
- Las imágenes del sitio que se conservan, a `public/img/` en su resolución original.
- El código de `/juego` (elemento HTML, código de página y estructura de las colecciones que usa), a `audit/juego/`.
Se puede hacer con la API de Wix (conector Wix) o con el export del blog. Verificar conteos: mismos artículos y archivos que en el sitio. Lo que no se pueda sacar se lista en `audit/rescate.md`, no se da por perdido en silencio.

0.4 DNS y dominio. Registrar dónde está registrado asighn.com, quién maneja hoy sus DNS y copiar todos los registros vigentes a `audit/dns.md`, en particular MX, SPF, DKIM y DMARC del correo de Google Workspace, y las verificaciones de Google y HubSpot. El correo no se puede caer en la mudanza.

0.5 Leer `asig-canon` completo y `voz-de-asig` completo. Anotar en `audit/reglas.md` las que afectan el sitio (ya listadas en `documentacion.md` §5; verificar que no haya cambiado nada).

0.6 Leer las cifras vigentes del Sheet (id en `documentacion.md`) y guardarlas en `src/content/cifras.json` con fecha de corte. Todo número del sitio se lee de ese archivo.

0.7 Confirmar con Christian los pendientes de `documentacion.md` §Pendientes. Lo que falte se marca como pendiente en la página, no se inventa.

**Revisión:** inventario completo, mapa de URLs, contenido rescatado con conteos que cuadran, DNS copiado, reglas anotadas, cifras con fecha. Christian ve `audit/inventario.md` y `audit/rescate.md`.

## Paso 1 — Tokens

1.1 `src/styles/tokens.css`: variables de color (los hex de `documentacion.md` §5), tipografía (Raleway 600/700, Nunito Sans 400/600, escala: 48/36/28/22/18/16/14), espaciado (base 8: 8/16/24/32/48/64/96), radios (0 y 4 px nada más), sombras (una sola, suave, para tarjetas elevadas), anchos (contenedor 1200, texto 680). Ningún componente usa un valor que no esté acá.

1.2 Fuentes alojadas en el sitio, solo los pesos declarados, con `font-display: swap`.

1.3 Estilos base: reset, tipografía, contenedor, enlaces, foco visible.

**Revisión:** página `/_prueba` con un título, un párrafo y un botón. Captura. Christian aprueba tipografía y azul.

## Paso 1b — Dirección con taste-skill

Herramienta: `design-taste-frontend` (https://github.com/Leonxlnx/taste-skill). Instalar como plugin de Claude Code (`/plugin marketplace add Leonxlnx/taste-skill` · `/plugin install taste-skill@taste-skill`). Necesita Node 22+ y Chrome/Chromium; no instala nada ni usa claves. Leer su `SKILL.md` completo antes de usarla.

Para qué se usa acá: darle a Claude Code un juez externo para la dirección de arte y un inspector que mide en navegador real lo que `documentacion.md` §10 pide por escrito. Reemplaza la intuición en el paso 2 y en cada página de los pasos 4 a 8. Como Astro produce HTML y CSS reales, el inspector corre sobre las páginas mismas (`astro dev` o la vista previa de Cloudflare), sin prototipo intermedio.

1b.1 Correr `draw.mjs` con `--keep palette,type` (la marca ya fija colores y tipografías: solo se reparte composición), `--sector` el más cercano a consultoría/ingeniería, `--have photography` (hay archivo propio de campo), sin `--tone`. Elegir entre las tres direcciones la que cargue algo que solo ASIG tiene; registrar por qué. Mapear navy/azul/celeste y Raleway/Nunito Sans sobre los roles del sheet.

1b.2 Hacer el inventario que la skill pide (ocho a doce cosas que solo este cliente tiene) desde `documentacion.md` y el canon: el instrumento con nombre, las cifras con unidad, el equipo de medición real en las fotos, los pilares, la escala de fuentes, el «mismo día». Escribir la frase de idea de la skill («en esta página, X se vuelve Y») y no construir hasta tenerla.

1b.3 **La cosa viva.** La skill exige una interacción hecha del contenido real. Para ASIG: un autodiagnóstico de cinco preguntas en el Inicio que termina en «Agendar 30 minutos». Preguntas y lógica las aprueba Christian antes de construirlo. Es un componente con el script mínimo; sin script muestra las preguntas y el botón Agendar. Funciona con el pulgar y no bloquea la lectura.

1b.4 Dos salvedades que mandan sobre la skill:
- **Movimiento.** La skill exige ocho o más elementos en movimiento y falla la página con menos. Acá el techo lo pone `documentacion.md` §10: entradas discretas de sección (opacidad y 16–32 px) y feedback en controles, nada más. Sin parallax, sin carruseles, sin contador de cifras. Si el inspector falla por eso, pasar `--allow` para esa regla y anotarlo en el reporte.
- **Imágenes de archivos abiertos.** La skill busca fotos en Wikimedia/Openverse cuando no hay propias. ASIG tiene archivo propio; no se usa ninguna foto externa. Si una página se queda sin foto, se le pide a Christian, no se busca afuera.

1b.5 Las reglas de la casa de la skill que coinciden con las nuestras se adoptan tal cual y el inspector las mide: sin gradientes, sin sombras en reposo, sin iconos sobre tarjetas, sin eyebrows, sin etiquetas pequeñas en mayúsculas, sin hairlines, sin numeración 01/02/03, titulares de dos líneas máximo, márgenes iguales, un `h1` claro por página, dos tipografías máximo. El proceso se muestra por posición y por el verbo de cada paso, en `<ol>` semántico sin número visible.

**Revisión:** dirección elegida con su razón, frase de idea, autodiagnóstico aprobado por Christian, el hero del Inicio con 0 FAIL en el inspector. Christian aprueba la dirección antes del paso 2.

## Paso 2 — Sistema de componentes

Un archivo por componente en `src/components/`, cada uno con un comentario de cabecera: propósito, anatomía, estados, reglas de contenido. Todos juntos en la página `/_componentes`, fuera del menú, con `noindex` y fuera del sitemap.

2.1 `Boton` — primario, secundario, sobre navy. Hover celeste. Texto en imperativo cordial.
2.2 `Hero` — foto propia + overlay navy 65% + titular Raleway 48 + subtítulo + dos botones. Altura al contenido, no 100vh.
2.3 `Cifra` — número Raleway 700 48, unidad Nunito Sans 16. Fila de 3 o 4. Sin animación. Lee de `cifras.json`.
2.4 `TarjetaServicio` — título, frase específica, un entregable, enlace. Sin icono genérico; foto recortada 3:2 o isotipo de área.
2.5 `Puertas` — tres bloques «si usted…» con un botón cada uno. Es la sección más importante del Inicio.
2.6 `Proceso` — pasos en `<ol>` sin número visible (ver 1b.5), máximo cinco, horizontal en escritorio, vertical en móvil.
2.7 `Testimonio` — cita, nombre, cargo, empresa. Lee de la colección.
2.8 `FichaCaso` — sector · problema · intervención · resultado · instrumento. Lee de la colección.
2.9 `BandaLogos` — monocromo, grilla estática, 4–6 por fila.
2.10 `Cierre` — banda navy con una frase, contacto y un botón.
2.11 `Formulario` — HubSpot incrustado con los estilos del sitio: nombre, empresa, correo, teléfono, necesidad. Cada envío entra al CRM y avisa a consultas@asighn.com. Confirmación en pantalla: «Respondemos el mismo día en horario hábil». Si el script de HubSpot no carga, el bloque muestra correo y WhatsApp.
2.12 `Cabecera` y `Pie` — menú con botón «Agendar 30 min»; pie con teléfono, WhatsApp, correos, LinkedIn de la empresa, legal.

**Revisión:** `/_componentes` con todos los componentes en escritorio y 390 px. Christian aprueba antes de armar la primera página. Esto es lo que evita rehacer todo después.

## Paso 3 — Colecciones

Definidas en la configuración de contenido de Astro, cada una con su esquema:

3.1 `servicios` — título, slug, frase, entregables (lista), formulación del canon aplicable, imagen, orden.
3.2 `casos` — sector, problema, intervención, resultado, instrumento, orden. Anónimos. Tres fichas iniciales del track record citable.
3.3 `testimonios` — cita, nombre, cargo, empresa, orden. Vacía hasta que Christian los consiga; la sección se oculta si está vacía.
3.4 `clientes` — nombre, logo monocromo, orden. Solo los autorizados.
3.5 `cifras.json` — indicador, valor, fecha de corte. Una entrada por indicador, cargada desde el Sheet. Todo número del sitio se lee de acá.
3.6 `articulos` — reemplaza Wix Blog. Título, fecha, portada, resumen, cuerpo, autor visible si es en primera persona de Christian, y campo opcional `descarga` (archivo en `public/descargas/`) que absorbe la página Descargas. Se llena con lo rescatado en 0.3.

**Revisión:** `astro build` sin errores, datos iniciales cargados, los artículos rescatados se ven completos en una lista de prueba con sus imágenes.

## Paso 4 — Inicio

Construir las diez secciones de `documentacion.md` §7 en orden, con los componentes del paso 2. Copy final escrito con `voz-de-asig` (prueba final de la skill antes de darlo por bueno). Cifras, logos y caso destacado desde las colecciones.

**Revisión:** 0 FAIL en `inspect.mjs` (1440/768/390) sobre la página real y crítica escrita según `references/critique.md` de la skill; capturas en escritorio y móvil. Prueba de los tres caminos de `documentacion.md` §9 desde el Inicio. Christian aprueba. Pulir. Solo entonces, paso 5. El mismo gate (inspector → crítica → capturas → aprobación) aplica a cada página de los pasos 5 a 8.

## Paso 5 — Metodología

Pilares 1 y 2 (el 3 solo si Christian lo aprobó). Proceso completo con los nombres de paso confirmados. Escala de fuentes con el cierre de tres tiempos. Los ASIGnados en la sección de formación (única página donde van). «Quién entrega» con credenciales pertinentes, sin hoja de vida. Cierre: Agendar.

**Revisión y pulido.**

## Paso 6 — Servicios y Medición de Cultura

6.1 `/servicios` madre con los cinco bloques desde la colección.
6.2 Las cinco subpáginas, slugs intactos, misma estructura: qué se mide o hace · cómo (formulación del canon donde aplique) · qué recibe · Cotizar.
6.3 `/medicion-de-cultura`: instrumento, entregables, cifras (desde `cifras.json`), Hudson-Parker acreditado si aparece, un caso, Agendar.

**Revisión y pulido.** Verificar que ninguna página diga «certificamos».

## Paso 7 — Casos, Clientes, Artículos

7.1 `/casos` desde la colección. Texto aprobado por Christian.
7.2 `/clientes`: banda de logos + testimonios (sección oculta si la colección está vacía).
7.3 `/articulos-y-novedades`: lista con portada propia; cada artículo en `/articulos-y-novedades/<slug>`; bloque «Descargas» al final con ancla `#descargas`.

**Revisión y pulido.** Cada artículo rescatado abre completo, con imágenes y fecha original.

## Paso 8 — Agenda y Contacto

8.1 Página de reservas de Google Calendar: un servicio «30 minutos», videollamada de Meet, disponibilidad definida por Christian, confirmación por correo.
8.2 `/diagnostico` y `/conversacion`: dos páginas, la misma reserva incrustada, copy distinto según `documentacion.md` §7. Sin la palabra «gratis» en `/conversacion`.
8.3 `/contacto`: formulario del paso 2.11, teléfono con enlace a WhatsApp, correos, ciudad. Dirección solo si Christian la confirma.
8.4 Redirecciones 301 en el archivo de redirecciones de Cloudflare: `/quienes-somos` → `/metodologia`; `/descargas` → `/articulos-y-novedades#descargas`; cada `/post/<slug>` → `/articulos-y-novedades/<slug>`; cualquier otra URL de `audit/urls.md` que cambie.

**Revisión:** reservar una cita de prueba de principio a fin; enviar el formulario de prueba y comprobar que llega a consultas@ y aparece en HubSpot.

## Paso 9 — QA y publicación

9.1 Lista de control, página por página: `inspect.mjs` con 0 FAIL · móvil 390 px sin desborde · ninguna foto de stock · ninguna cifra fuera de `cifras.json` · ninguna palabra de la lista de `documentacion.md` §10 · «usted» en todo el copy · cada página termina en Agendar o Cotizar · título y descripción SEO por página · alt en todas las imágenes · imágenes comprimidas, máximo 400 KB cada una · sitemap generado.
9.2 Cada URL de `audit/urls.md` responde 200 o redirige con 301. Nada útil se perdió: artículos, descargas, enlaces entrantes.
9.3 Christian revisa el sitio completo en su teléfono, en la URL de vista previa.
9.4 Mudanza del dominio:
- Agregar asighn.com en Cloudflare y recrear todos los registros de `audit/dns.md` antes de cambiar nada.
- Si el dominio está registrado en Wix, transferirlo al registrador que decida Christian. Una transferencia tarda días: arrancarla con margen, no el día de publicar.
- Apuntar el dominio al sitio nuevo. Enviar y recibir correo de prueba en @asighn.com antes y después del cambio.
- El sitio de Wix queda intacto hasta confirmar que el nuevo responde en el dominio.
9.5 Publicar `main`. Guardar la fecha y las cifras publicadas en `cifras.json` como corte de publicación.

## Después de publicar

- Testimonios: agregar el archivo a la colección cuando lleguen; la sección aparece sola.
- Cifras: actualizar `cifras.json` desde el Sheet con cada corte del canon, nunca a mano.
- Pilar 3: si Christian lo aprueba, entra en Metodología sin tocar nada más.
- Wix: cancelar la renovación del plan cuando Christian lo decida, con el sitio nuevo estable, el dominio mudado y el paso 8b aprobado.
- Editor visual: si los ajustes chicos se vuelven diarios, conectar CloudCannon al repo. Antes, probarlo con una página.
