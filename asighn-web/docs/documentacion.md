# Documentación — Rediseño de asighn.com

**Versión 2 · 2 nov 2026 · Fuente: sesión de investigación con Christian López (27 oct). La versión 2 saca el sitio de Wix.**
Este archivo es la dirección del proyecto. `implementation.md` es la ruta. Ninguno de los dos se ejecuta en el chat: todo se construye desde Claude Code como un sitio nuevo en código (Astro), fuera de Wix. La plataforma completa está en `implementation.md`.

**Fuentes de verdad que mandan sobre este documento** (leerlas antes de escribir una sola línea de copy o CSS):
- `asig-canon` — identidad, contacto, paleta, tipografía, regla de nombrar clientes, prohibiciones de lenguaje.
- `voz-de-asig` — cómo escribe ASIG. Todo el copy del sitio sale de ahí. «Usted», tres tiempos, enseña antes de ofrecer, sin primera persona.
- Google Sheet «ASIG — Registro de Operación (cifras del canon)», id `1h24RHHYL4TaVHF_SEJ_ThrCVewIl3BJAgcS48H-2FaQ`, pestaña Cifras, columna Vigente. Ninguna cifra se escribe de memoria ni se copia del sitio actual.

Si este documento contradice una de esas fuentes, manda la fuente y se reporta el choque a Christian.

---

## 1. Para quién es el sitio

Tres visitantes, en orden de frecuencia real según Christian:

| Visitante | Quién decide | Qué busca al entrar | Acción que el sitio le pide |
|---|---|---|---|
| **EHS / RRHH / «no sé por dónde empezar»** | Llega él, decide su jefe | Orientación, saber que ASIG sabe más que él sin humillarlo, algo que llevarle a su gerencia | Agendar 30 minutos (entrada «diagnóstico») |
| **Dueño de contratista** | Él mismo | Cotización rápida, cumplir el requisito que le pidió su cliente grande, no perder el contrato | Cotizar. Promesa escrita: respuesta el mismo día |
| **Gerencia de empresa** | Él mismo o su comité | Verificar que ASIG es una firma seria antes de recibir a alguien | Agendar 30 minutos (entrada «conversación con el director») |

Los tres aterrizan en la misma portada. La portada no puede hablarle a uno solo.

## 2. Qué hace el negocio

ASIG Honduras (razón social EHS Honduras S. de R.L.), base en San Pedro Sula, cobertura nacional y Centroamérica. Consultoría en seguridad y salud ocupacional, gestión ambiental y sistemas de gestión. Ocho años operando.

Líneas de servicio vigentes (las cinco subpáginas actuales del sitio, mantener slugs):
1. Asesorías en higiene y seguridad — higiene ocupacional medible (ruido, iluminación, estrés térmico, partículas, químicos), investigación de accidentes, auditorías.
2. Sostenibilidad y ambiente — licencias, ICMAs y controles operacionales ante MIAMBIENTE.
3. Sistemas de gestión — preparación y acompañamiento para auditorías ISO (nunca «certificamos»).
4. Capacitaciones y entrenamientos — simuladores, realidad virtual, anclaje andragógico.
5. Programas e implementaciones.

Producto bandera: **Medición de Cultura de Seguridad**, instrumento propio (Calibración de Percepciones), aplicado a nivel operativo y de liderazgo. Sin equivalente identificado en la región.

Posicionamiento declarado (ya en el sitio, se mantiene): *instrumentos, no diapositivas; riesgo real, no temario genérico; medición propia, no encuesta de internet.* Todo contenido se valida contra fuentes primarias (ley local → OSHA → NIOSH/ACGIH → INSST, en ese orden de reconocibilidad; en límites de exposición manda ACGIH).

## 3. Personas

**A. Karla, coordinadora de RRHH con seguridad «encargada».** Empresa de 80–300 empleados, manufactura o servicios. No es técnica. Le pidieron «ver lo de seguridad» después de una visita de la STSS o de un accidente. Googlea de noche. Necesita entender qué le falta sin que la hagan sentir ignorante, y necesita algo con nombre y cifras para llevarle a su gerente general. Le gana: una ruta clara en pasos, un servicio de entrada barato, un sitio que explica antes de vender.

**B. Don Mario, dueño de contratista.** Electricidad, construcción, montaje. Su cliente grande (cervecería, cementera, agroindustria) le exige programa de seguridad, trabajo en altura certificado, contratistas al día. Tiene dos semanas. No lee: busca el botón de cotizar y un teléfono. Le gana: cotización el mismo día, lista de clientes grandes que ya confían en ASIG (eso le dice «esta gente conoce a mi cliente»), WhatsApp visible.

**C. Ing. Rodríguez, gerente general o de planta.** Ya le hablaron de ASIG. Entra a comprobar. Mira: ¿esto parece una empresa o un consultor con Wix? ¿Hay método? ¿Hay números? ¿A quién más le han trabajado? Le gana: hero declarativo, proceso con pasos, casos con resultado, una entrada que no diga «gratis».

## 4. Dirección visual

**Tesis:** una firma de ingeniería que mide, no un consultor que capacita. El visitante tiene que sentir que entró al sitio de una compañía fuerte, seria, que sabe lo que hace. Nada debe parecer hecho por el dueño.

Referencias que Christian eligió y lo que se toma de cada una:
- **Jensen Hughes** — orden del catálogo de servicios; legado y cifras sin adorno.
- **Exponent** — hero como postura en pocas palabras + tres cifras; fotografía de operación real.
- **Sentis** — ruta en tres pasos; el diagnóstico como puerta; prueba cuantificada del entrenamiento.
- **Krause Bell Group** — referencia doctrinal de Christian. Boutique con tesis; proceso en cuatro pasos; los artículos como producto de muestra.
- **PrevenControl** — espejo en español de «especialistas en cultura de seguridad». Sirve para ver qué prometen y no demuestran; ASIG sí tiene instrumento y datos.

Rechazadas (no usar como referencia de nada): Vanta, Examine, 37signals.

**Registro:** institucional. Habla ASIG, «nosotros», trato de «usted» al visitante. Sin caras: no hay página de equipo ni foto de Christian como protagonista. La fuerza viene del método, los instrumentos, las cifras y la trayectoria. Christian aparece como «quien entrega» donde el canon lo pide, con credenciales, no como personaje.

**Imagen:** fotografía propia de campo (Christian tiene archivo amplio: sonometría, simuladores, RV, auditorías, personas midiendo, permisos firmándose). Cero stock. Cero ilustración, con una excepción: los ASIGnados (chibis) viven solo en la página Metodología, donde ilustran el proceso de formación. En ninguna otra página.

**Composición:** una sola familia tipográfica dominante por nivel (Raleway títulos, Nunito Sans cuerpo), paleta corta, navy como color de peso, un acento por pantalla. Alineación a la izquierda por defecto; centrado solo en el hero y en bandas de cierre. Bloques con espacio generoso. Motivos de marca (rombo, cuña diagonal, retícula topográfica) con moderación, nunca como relleno.

## 5. Reglas de marca

Valores literales, del canon (`asig-canon/references/marca-visual.md`):

| Rol | Hex |
|---|---|
| Navy — fondos de peso, hero, cierre | `#0C1B30` |
| Azul — acento principal, enlaces, botón primario | `#0070C4` |
| Celeste — acento secundario, estados hover/activo | `#0086FC` |
| Verde — solo para señal positiva (nunca decorativo) | `#72D353` |
| Amarillo — reservado; no usar en el sitio salvo decisión de Christian | `#FFD800` |
| Neutros | `#F1F5FA` fondo claro · `#EAF0F6` relleno suave · `#DCE4EE` bordes · `#9FB0C4` gris medio · `#6B7A8F` gris texto secundario · `#5B6B7A` texto gris |
| Texto principal | `#2A3545` sobre claro · `#FFFFFF` sobre navy |

Tipografía: **Raleway** (títulos, 600/700) · **Nunito Sans** (cuerpo, 400/600). Ambas se alojan en el propio sitio. Avenir no se usa en web. Respaldo: Century Gothic + Arial.

Logos: horizontal a color (`0_ASIG_Logo_H_Original.png`, trae fondo blanco sólido: pedir versión transparente o recortar). **Falta el horizontal en blanco** para fondos navy — pendiente de Christian. Isotipos existen en Drive (`ASIG - Identidad Visual/3. Isotipo`), no en el skill.

Reglas de lenguaje (del canon y de `voz-de-asig`):
- Nunca «certificamos» respecto de ISO. Siempre «preparación y acompañamiento para auditorías de…».
- Nunca «nuestro equipo de especialistas», divisiones, cargos ni estructura que no existe.
- Cartera de clientes: sí se nombra con logo. Casos con hallazgos y cifras: anónimos, salvo autorización explícita de ese cliente.
- Marcos de terceros se acreditan: Hudson-Parker, FPSICO 4.1 (INSST), TapRooT. Propios: Calibración de Percepciones y la metodología de investigación de accidentes.
- Sin «soluciones integrales», «aliado estratégico», «en el mundo actual», «líderes en», listas de adjetivos.
- La oferta cierra la sección, no la abre. Ningún bloque empieza vendiendo.
- Sello: «La seguridad no ocurre por accidente.» Es cierre, no muletilla: una vez por página como máximo, y en Inicio va en el hero.
- Pilar 3 («Cumplimiento no es prevención») **no se imprime** hasta que Christian lo apruebe. Pilares 1 y 2 sí: «Verificamos antes de enseñar» y «Entrenamos con las manos».

Cifras vigentes (Sheet, corte 27 oct 2026 — releer antes de publicar):

| Indicador | Vigente |
|---|---|
| Personas capacitadas | 4,809 |
| Participaciones en formación | 8,415 |
| Horas-persona de formación | 37,286 |
| Clientes atendidos | 83 |
| Estudios de higiene | 68 |
| Áreas evaluadas en higiene | 952 |
| Puntos de medición en higiene | 3,020 |
| Auditorías | 113 |
| Informes técnicos entregados | 240 |
| Respuestas en medición de cultura | 1,019 |

El sitio actual muestra 50+ / 4,762 / 868 / 110: están viejas. Se reemplazan todas.

## 6. Páginas y estructura

Nueve páginas en el menú. Se conservan los slugs existentes donde hay equivalente para no romper enlaces ni SEO.

| # | Página | Slug | Estado |
|---|---|---|---|
| 1 | Inicio | `/` | Rediseño completo |
| 2 | Metodología | `/metodologia` | Nueva |
| 3 | Servicios | `/servicios` (madre) + `/asesorias-en-higiene-y-seguridad`, `/sostenibilidadyambiente`, `/sistemasdegestion`, `/capacitacionesyentrenamientos`, `/programaseimplementaciones` | Rediseño; slugs intactos |
| 4 | Medición de Cultura de Seguridad | `/medicion-de-cultura` | Nueva |
| 5 | Casos | `/casos` | Nueva |
| 6 | Clientes | `/clientes` | Rediseño |
| 7 | Artículos | `/articulos-y-novedades` y cada artículo en `/articulos-y-novedades/<slug>` | Ajuste: absorbe Descargas como bloque. Los artículos se rescatan de Wix Blog; sus URLs viejas `/post/<slug>` redirigen |
| 8 | Agenda 30 minutos | `/agenda` con dos entradas: `/diagnostico` y `/conversacion` (misma reserva, copy distinto) | Nueva |
| 9 | Contacto | `/contacto` | Rediseño |

Sale del menú: `/quienes-somos` (su contenido se reparte entre Inicio y Metodología; redirigir 301 a `/metodologia`) y `/descargas` (301 a `/articulos-y-novedades#descargas`).

Fuera del menú pero se conserva: `/juego`, el juego del aula (El Eslabón Más Débil). Mantiene su URL porque el código QR impreso apunta ahí. Hoy depende de las colecciones de Wix; se reconstruye en el paso 8b de `implementation.md`.

Menú superior: Metodología · Servicios · Cultura de Seguridad · Casos · Clientes · Artículos · **Agendar 30 min** (botón). Contacto va en el pie y en el botón secundario del hero.

## 7. Secciones núcleo por página

**Inicio**
1. Hero: foto de campo propia a pantalla, overlay navy. Titular: «La seguridad no ocurre por accidente.» Subtítulo de una línea con el contraste (instrumentos, no diapositivas). Dos botones: «Agendar 30 minutos» (primario) · «Cotizar» (secundario).
2. Cifras: cuatro, del Sheet, con unidad. Sin contador animado.
3. Tres puertas (una por visitante, sin nombrarlo como «persona»): «Me pidieron resolver la seguridad y no sé por dónde empezar» → Agenda; «Mi cliente me exige un programa de seguridad» → Cotizar; «Quiero conocer el método antes de recibirlos» → Metodología.
3b. Autodiagnóstico: cinco preguntas de sí/no sobre la operación del visitante (preguntas y lógica las aprueba Christian), resultado en una frase y botón «Agendar 30 minutos». Es la única interacción de la página; va dentro de la puerta 1 o justo debajo de las tres puertas. Ver `implementation.md` 1b.3.
4. Qué hacemos: seis tarjetas de servicio con una frase específica cada una (sin iconos de plantilla; foto recortada o isotipo de área del canon).
5. Flagship: Medición de Cultura de Seguridad, con sus tres cifras y enlace a la página propia.
6. Proceso en pasos (versión corta del de Metodología).
7. Clientes: banda de logos (cartera, sin frases).
8. Un caso destacado, anónimo, con resultado.
9. Artículos: tres más recientes.
10. Cierre navy: «Respondemos el mismo día.» Teléfono, correo consultas@, botón Agendar.

**Metodología**
Los dos pilares aprobados. El proceso completo en pasos (diagnóstico → medición → hallazgo → intervención → verificación; nombrar y confirmar con Christian). Escala de fuentes con el cierre de tres tiempos (por qué el parámetro · cuál fuente · por qué esa fuente). Los ASIGnados ilustrando la parte de formación. Quién entrega: Christian con credenciales pertinentes, sin hoja de vida.

**Servicios (madre)**
Cinco bloques con la frase específica, dos o tres entregables concretos cada uno, enlace a subpágina. Cada subpágina: qué se mide o se hace, cómo (una formulación del canon donde aplique: S-01, S-02, S-04, S-05, S-12), qué recibe el cliente, cierre con Cotizar.

**Medición de Cultura de Seguridad**
Qué es (instrumento propio, dos niveles, espejo operativo/liderazgo). Qué entrega (perfil, cuadrante de la matriz de calibración, recomendaciones). Cifras: 1,019 respuestas, rubros, niveles. Hudson-Parker acreditado si aparece. Un caso anónimo. Cierre: Agendar.

**Casos**
Tres fichas anónimas con la misma estructura: sector · problema · qué hizo ASIG · resultado · instrumento usado. Candidatos del track record citable del canon: estudio nacional de cultura (n=624, 16 ciudades) · FPSICO 4.1 (n≈291) · recertificación de contratistas en altura para multinacional. Texto final lo aprueba Christian.

**Clientes**
Banda de logos (cartera con nombre). Tres o cuatro testimonios con nombre, cargo y empresa (Christian los pide). Sin frases genéricas: cada testimonio dice algo concreto.

**Artículos**
Lista con portada propia. Bloque «Descargas» al final. Los artículos en primera persona de Christian se publican con atribución visible; la página los presenta en voz de ASIG.

**Agenda 30 minutos**
Una sola reserva (página de reservas de Google Calendar, con enlace de Meet), dos páginas de entrada:
- `/diagnostico`: para quien no sabe por dónde empezar. Qué pasa en los 30 minutos, qué se lleva.
- `/conversacion`: «30 minutos con el director». Para gerencia. Sin la palabra «gratis».

**Contacto**
Formulario corto de HubSpot (nombre, empresa, correo, teléfono, qué necesita); cada envío entra al CRM. «Respondemos el mismo día en horario hábil.» Teléfono con WhatsApp, consultas@asighn.com, San Pedro Sula. Sin mapa si no hay dirección pública.

## 8. Reglas de componentes

Cada componente se define una vez en `component-system/` (ver `implementation.md`) y se reutiliza. Reglas transversales:
- **Botón primario** azul `#0070C4` sobre claro, blanco sobre navy. Texto en imperativo cordial: «Agendar 30 minutos», «Cotizar», «Ver el método». Nunca «Click aquí», «Más info».
- **Tarjeta de servicio**: título Raleway, frase específica de una línea, un entregable concreto, enlace. Sin icono genérico.
- **Cifra**: número grande Raleway 700, unidad debajo en Nunito Sans. Sin animación. Siempre del Sheet.
- **Paso de proceso**: nombre + una frase, en `<ol>` sin número visible; el orden lo da la posición. Máximo cinco pasos por bloque.
- **Testimonio**: cita corta, nombre, cargo, empresa. Sin foto si no la hay; nunca avatar genérico.
- **Ficha de caso**: sector · problema · intervención · resultado · instrumento. Anónima.
- **Banda de logos**: monocromo gris sobre claro, tamaño uniforme, sin carrusel automático.
- **Cierre de sección**: la oferta en una o dos líneas al final, nunca arriba.
- **Imagen**: siempre propia; relación 16:9 o 3:2; overlay navy al 60–70% cuando lleva texto encima.
- **Espaciado**: escala única (8 px base). Secciones separadas por 96 px en escritorio, 64 px en móvil.
- **Móvil primero**: todo se revisa a 390 px antes que en escritorio.

## 9. Flujo del usuario

- Karla (EHS/RRHH): Inicio → puerta 1 → `/diagnostico` → reserva. Camino alterno: Inicio → Metodología → Agenda.
- Don Mario (contratista): Inicio → «Cotizar» → Contacto (o WhatsApp directo desde el pie). Debe lograrlo en dos toques desde móvil.
- Ing. Rodríguez (gerencia): Inicio → Metodología → Casos → Clientes → `/conversacion`. Cada página tiene un camino hacia la siguiente sin volver al menú.

Toda página termina en una de dos acciones: Agendar o Cotizar. Nunca las dos con el mismo peso.

## 10. Qué evitar

Decidido con Christian:
- Iconos de plantilla (Wix, Flaticon, emoji).
- Fotos de stock, en particular gente con casco blanco sonriendo.
- Gradientes, glow, sombras suaves de plantilla, bordes redondeados en todo.
- Contador animado de cifras; parallax; carruseles automáticos.
- «Certificamos», «nuestro equipo», «líderes en», «soluciones integrales», «aliado estratégico».
- Más de un acento de color por pantalla.
- Ilustración fuera de Metodología.
- Popups, chat flotante, barras de anuncio.
- Tres llamadas a la acción compitiendo en el hero.
- Primera persona de Christian en copy institucional.
- Cifras copiadas del sitio viejo o de memoria.
- Centrar todo.
- Caras: ni equipo, ni retrato de Christian como protagonista.
- Inter como tipografía (ni ninguna fuera de las declaradas).

## 11. Referencias

- Galería de investigación con capturas y notas: https://1846facf-ccf9-4ba5-9293-ee6c84a5853c.sandbox.floot.app/_cdn/static/galeria.html
- Sitio actual: https://www.asighn.com (auditado el 27 oct 2026).
- Jensen Hughes · Exponent · Sentis · Krause Bell Group · PrevenControl (ver §4).
- Skills: `asig-canon`, `voz-de-asig`, `pure-de-camote` (criterio de diseño de Christian, aplicable a composición).
- Herramienta de dirección e inspección: `design-taste-frontend` (https://github.com/Leonxlnx/taste-skill), con las dos salvedades de `implementation.md` 1b.5 (movimiento y fotos externas).
- Workflow de origen: hilo de r/webdesign «Built 10 websites for clients in 4 months» (investigación → dirección → documentación + implementation.md → sistema de componentes → construcción por pasos con revisión).

## Pendientes de Christian antes de construir

1. Logo horizontal en blanco (para hero y cierre en navy).
2. Selección de 12–20 fotos de campo con derecho de uso, mínimo 2000 px de ancho.
3. Nombre de los pasos del proceso (§7 Metodología).
4. Aprobación o rechazo del pilar 3.
5. Los tres casos: aprobar texto anónimo.
6. Pedir 3–4 testimonios con nombre y cargo.
7. Lista de clientes cuyo logo puede ir en la banda.
8. Confirmar si la dirección física entra en Contacto.
9. Aprobar las cinco preguntas y la lógica del autodiagnóstico del Inicio.
10. Dónde está registrado asighn.com y acceso a ese registrador (si es Wix, la transferencia tarda días).
11. Cuentas de GitHub y Cloudflare a nombre de ASIG. Las crea Christian; Claude Code no crea cuentas.
12. Disponibilidad para la página de reservas de Google Calendar.
13. Próxima clase que use `/juego`: fija la fecha límite del paso 8b.
