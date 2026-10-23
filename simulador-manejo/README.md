# Carretera Defensiva

Simulador de carretera para entrenamiento de manejo defensivo. Un solo archivo HTML, sin instalación.

Abrí `index.html` en Chrome. Conectá el timón USB, movelo, y calibralo en la pestaña Timón. Sin timón funciona con teclado (flechas o WASD, Q/E mirar, 1/2 responder mensajes).
Tecla L: modo alumno (oculta y bloquea la consola). Tecla M: silencio. El sonido es sintetizado con WebAudio, sin archivos. Un choque detiene el auto un segundo; tres choques, uno a más de 40 km/h contra algo duro o un atropello terminan el recorrido y la causa queda en los resultados.

Ejercicios: carretera libre, baches y animales, distancia de seguimiento, velocidad y frenado, punto ciego, percepción de peligro.
En carretera libre, baches y percepción de peligro aparecen rótulos de límite (40, 60, 80 km/h) y se mide el tiempo por encima; se apagan desde la consola. Al terminar, un informe de instructor: semáforo por criterio, puntaje de 0 a 100 con cada deducción nombrada, observaciones redactadas a partir de lo medido (velocidad, centrado, curvas, distancia, rebases, espejos, frenadas, baches, peligros, celular) y bitácora cronológica de todo lo anotado durante el recorrido. Botones Repetir y Copiar informe (texto plano). La pantalla de inicio permite elegir ejercicio y condición.
Condiciones: día, noche, lluvia, lluvia de noche.
Carretera de dos carriles, uno por sentido, con línea central amarilla. Alterna rectas y curvas (se puede dejar recta en la pestaña Camino). Hay tráfico de frente en el carril izquierdo y, en carretera libre, baches y percepción de peligro, vehículos lentos en el tuyo: se mide la distancia de seguimiento, el tiempo invadiendo el carril contrario y si cada rebase salió con la vía libre. El ejercicio de rebase agrega autos que te rebasan por la izquierda. Los obstáculos son baches: bajan velocidad y dan un tirón al timón.
Conductor: presets de alcohol, fatiga, distracción y reacción lenta, con deslizadores ajustables en vivo.

Auto: Ferrari 458 Italia de vicent091036 (Sketchfab, CC BY), tomado de los ejemplos de Three.js y comprimido con meshopt. Escenario: Kenney Car Kit y Nature Kit (CC0). Texturas: ambientCG (CC0). Están embebidos en `index.html`, así que abre con doble clic; la carpeta `assets` guarda los originales.

Necesita internet para cargar Three.js y GLTFLoader desde CDN.
