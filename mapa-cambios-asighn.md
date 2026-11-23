# Mapa de cambios — asighn.com

Revisión en vivo del 23-nov-2026: escritorio a 1440 px y móvil (iPhone). Página principal completa; páginas internas solo en lo que quedó abierto el 06-sep.
⚑ = decisión tuya antes de tocar.

---

## 1. Urgente: lo que expone clientes o te ancla en el pasado

| # | Dónde | Qué está mal | Cambio |
|---|---|---|---|
| 1.1 | Menú **móvil** → Descargas | Salen públicos: Taller de Comisiones Mixtas SeaJoy, SAEC, Webinar EPP Covid, Cementos del Norte, Evento Ferreterías, CHICO. En escritorio no se ven | Editor → Menús y páginas → cada una → **Ocultar del menú**. ⚑ Si esos clientes todavía descargan cosas, crear un solo botón «Portal de clientes» con contraseña |
| 1.2 | Sitemap (lo que lee Google) | `/culturaseajoy`, `/comisionesseajoy` y `/descargas` están indexadas | Cada página → Configuración → SEO → desactivar **«Permitir que los motores de búsqueda indexen esta página»**. ⚑ O borrarlas si ya no sirven |
| 1.3 | Encabezado **móvil** | «Sus mejores aliados para que la seguridad de su empresa no ocurra por accidente» repite el hero («La seguridad no ocurre por accidente») | Editor móvil → encabezado → quitar esa línea; dejar solo el logo |
| 1.4 | Asesorías en Higiene y Seguridad | «Sistemas de Gestión basados en **OHSAS 18001**»: la norma fue retirada en 2021. Este hallazgo sigue abierto desde el 06-sep | Cambiar a **ISO 45001** |
| 1.5 | Carrusel «Clientes que han confiado en ASIG» | Logos de Cervecería Hondureña, Pepsi, Gildan, DHL, Pollo Rey, Jaremar… La regla del canon para el sitio es que no se nombra a ningún cliente sin autorización escrita | ⚑ Confirmar que tienes la autorización de cada uno. Si no, se retira el logo |

## 2. Errores de texto (buscar → reemplazar)

| # | Bloque | Dice | Debe decir |
|---|---|---|---|
| 2.1 | Qué hacemos → Higiene | párticulas | partículas |
| 2.2 | ¿Por qué ASIG? → 01 | …ACGIH, NFPA." | …ACGIH, NFPA. |
| 2.3 | Qué hacemos → Cultura | Instrumento propio, sin equivalente identificado en la región. ↑ Vea el detalle completo más arriba. | Instrumento propio, sin equivalente identificado en la región. — y enlazar la tarjeta a un **ancla** puesta en el bloque Flagship |
| 2.4 | Qué hacemos → Investigación | …según el caso | …según el caso. |
| 2.5 | Flagship, subtítulo | …sin competidor en la región | …sin competidor en la región. |
| 2.6 | Flagship, cifra 1 | niveles - operativo y liderazgo | niveles: operativo y liderazgo |
| 2.7 | Cifras del hero | 4762 | 4,762 (mismo formato que 1,019) |
| 2.8 | Menú | Quienes Somos · Articulos y Novedades | Quiénes Somos · Artículos y Novedades |
| 2.9 | Blog → título | Salga de la cancha: Usted es el director técnico! | Salga de la cancha: ¡Usted es el director técnico! |
| 2.10 | Blog → «Salga de la cancha», primeras líneas | llamemosles · articulo · proximas · fuí | llamémosles · artículo · próximas · fui |
| 2.11 | Blog → «Su pirámide…», primera línea | ¿Me permite hacerle una pregunta? le pido… | ¿Me permite hacerle una pregunta? Le pido… |

Solo revisé las primeras líneas de cada artículo. ⚑ Conviene pasarles una revisión ortográfica completa.

## 3. Diseño: escritorio

| # | Bloque | Qué está mal | Cambio |
|---|---|---|---|
| 3.1 | Encabezado | El logo está cortado contra el borde izquierdo: solo se lee «SIG» | Mover el logo dentro del ancho de la página |
| 3.2 | Menú | Botones con degradado negro y amarillo: es otra época, al lado de un sitio plano | Estilo plano: texto blanco, y la página activa con subrayado amarillo #FFD800 |
| 3.3 | Hero | La cuña amarilla tapa el final de «Gestión»; debajo de la foto quedan unos 250 px vacíos | Bajar o achicar la cuña; recortar la altura de la franja hasta el pie de los botones |
| 3.4 | Toda la página | Cuatro familias de letra: Poppins (H1 y «Ideas que cuestionan…»), Avenir Heavy (títulos de sección), Raleway, y una fuente subida a mano («Asesores…», «01 / PERSONALIZACIÓN») | Títulos en **Raleway**, cuerpo en **Avenir Light** (canon). Poppins fuera. ⚑ Confirmar si la fuente subida es Raleway |
| 3.5 | Cifras del hero | Números en #3D9BE9, que no está en la paleta | #0086FC (celeste) |
| 3.6 | Flagship | «Flagship» y «1,019» en #BADA55, que no está en la paleta. Las tres cifras van en tres tamaños y colores, y el 1,019 queda más abajo que su etiqueta | Verde #72D353. Las tres cifras del mismo tamaño y color, alineadas a la derecha en una columna, en la misma línea que su etiqueta |
| 3.7 | ¿Por qué ASIG? → 3 tarjetas | El cuerpo va en Raleway Bold 16 px sobre foto: se lee pesado | Avenir Light 16–17 px |
| 3.8 | Qué hacemos → 6 tarjetas | Relleno gris #CCC sobre fondo lavanda; texto **justificado** que abre huecos; bordes amarillos y azules alternados sin significado | Relleno blanco, texto alineado a la izquierda, un solo color de borde. ⚑ Amarillo solo para Cultura, si quieres que la flagship se distinga |
| 3.9 | Carrusel de clientes | Cajas de distinto ancho (Pepsi ocupa el doble) y DHL con todo el fondo amarillo | Cajas iguales, fondo blanco y logos de la misma altura. Aplica solo si 1.5 queda en «sí» |
| 3.10 | Tarjetas de artículos | Al pie de cada tarjeta salen pastillas grises vacías | ⚑ Verificar en tu navegador. Si son contadores de vistas o «me gusta» que no cargan, apagarlos en los ajustes del widget del blog |

## 4. Diseño: móvil

| # | Bloque | Cambio |
|---|---|---|
| 4.1 | Hero | Solo aparece «Cotizar ahora»; falta «Nuestra Metodología». Volver a mostrarlo o decidir que en móvil no va |
| 4.2 | Qué hacemos | Lo justificado se ve peor aquí: hay líneas de tres palabras con huecos grandes. Lo resuelve 3.8 |
| 4.3 | Flagship | El «1,019» se monta sobre su etiqueta. Lo resuelve 3.6, revisando la vista móvil por separado |

## 5. SEO: texto alternativo de las imágenes

| Imagen | Alt hoy | Alt propuesto |
|---|---|---|
| Foto del hero (aula) | vacío | Capacitación de ASIG en sala de entrenamiento |
| Tarjeta 01 | IMG_5997_edited.jpg | Taller de seguridad ocupacional con equipo de protección |
| Tarjeta 02 | vacío | Entrenamiento con realidad virtual |
| Tarjeta 03 | vacío | Reunión de trabajo con gerencia |
| Fondo del bloque Flagship | ASIG_Cuna_Celeste_edited.png | vacío (es decorativa) |
| Logos de clientes | Picture2.png, Picture14.jpg o vacío | El nombre de cada cliente (solo si 1.5 queda en «sí») |

## 6. No toqué

- **Submenú de Servicios.** Gemini propone renombrarlo según la grilla de la página principal. Tú ya decidiste otra cosa el 06-sep: una arquitectura **Flagship / Troya / Comunes** que reemplaza la lista plana del sitio. Cuando se rehaga el submenú, va con esa estructura.
- **Cifras publicadas** (+50, 4,762, 868, 110, 17 años): son dato tuyo vigente. Solo cambia el formato en 2.7.
- **Textos nuevos.** Todo lo de arriba es corrección o reacomodo. Si quieres reescribir el hero o las tarjetas, eso se redacta aparte con la voz de ASIG.
