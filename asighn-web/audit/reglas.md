# Reglas que afectan el sitio y choques encontrados (paso 0.5)

Leído el 23 nov 2026: asig-canon v1 (16 nov), voz-de-asig, corpus de voz, Brief de gusto visual de Christian.

## Choques entre documentacion.md (2 nov) y el canon (16 nov). Manda el canon; se le reportan a Christian

| Tema | documentacion.md dice | El canon dice | Qué hice |
|---|---|---|---|
| Pilar 3, «Cumplimiento no es prevención» | No se imprime hasta que Christian lo apruebe | Aprobado en el Sello v3.1 (15 nov) | No lo puse en el Inicio porque no lleva pilares. Entra en Metodología si Christian confirma. |
| Logo horizontal en blanco | Falta, pendiente 1 | Existe: `ASIG_Logo_H_Blanco.png` y `ASIG_Logo_H_Colores_Blanco.png` | Usé el blanco en el pie. El pendiente 1 queda resuelto si Christian lo confirma. |
| Dirección física | Pendiente 8: confirmar si entra en Contacto | Dirección oficial confirmada el 16 nov: Colonia Universidad, 20 Calle A, #57, San Pedro Sula | Sigue sin ir en el sitio hasta que Christian diga si la quiere pública. |
| Nombrar clientes | La cartera se nombra con logo | En el sitio, ningún cliente sin autorización escrita (regla del 15 nov) | Banda de logos vacía hasta la lista autorizada, pendiente 7. |
| Comillas | No lo menciona | voz-de-asig: ningún texto publicable lleva « »; las comillas son “ ” | Todo el copy del sitio usa “ ”. |
| Estudios técnicos | Cifra vigente del Sheet: 240 informes | El Sheet marca 240 como candidato a reemplazar el 110 | Christian decidió el 23 nov mantener 110. |

## taste-skill

El plan pide `draw.mjs` e `inspect.mjs` de taste-skill. La versión publicada hoy (2.5.1) ya no los trae: tiene `layout/deal.mjs` y `layout/check.mjs`, y reglas de la casa nuevas que chocan con documentacion.md (una sección por pantalla, momentos animados en cada página, teléfono y dirección ficticios). No se instaló como plugin. Se usará `layout/check.mjs` como inspector de medidas y bordes, con las salvedades de 1b.4 y anotando cada regla que no aplica.

## Reglas activas en el código

- Paleta, tipografía y escala: `src/styles/tokens.css`, desde marca-visual.md.
- Raleway y Nunito Sans alojadas en `public/fonts`, desde asig-canon/assets/fonts.
- Todo número sale de `src/content/cifras.json`.
- Lo que falta decidir se marca con el componente `Pendiente`. Con `PUBLICAR=true` desaparece; si queda alguno, la página no está lista.
- Contacto: solo el bloque oficial de identidad.md (+504 9906-8668, consultas@asighn.com).
