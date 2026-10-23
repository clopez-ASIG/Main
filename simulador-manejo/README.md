# Carretera Defensiva

Simulador de carretera para entrenamiento de manejo defensivo. Un solo archivo HTML, sin instalación.

Abrí `index.html` en Chrome. Conectá el timón USB, movelo, y calibralo en la pestaña Timón. Sin timón funciona con teclado (flechas o WASD, Q/E mirar, 1/2 responder mensajes).
Tecla L: modo alumno (oculta y bloquea la consola). Tecla M: silencio. El sonido es sintetizado con WebAudio, sin archivos. Un choque detiene el auto un segundo; tres choques, uno a más de 40 km/h contra algo duro o un atropello terminan el recorrido y la causa queda en los resultados.

Ejercicios: carretera libre, baches y animales, distancia de seguimiento, velocidad y frenado, punto ciego, percepción de peligro.
Condiciones: día, noche, lluvia, lluvia de noche.
Conductor: presets de alcohol, fatiga, distracción y reacción lenta, con deslizadores ajustables en vivo.

Auto: Ferrari 458 Italia de vicent091036 (Sketchfab, CC BY), tomado de los ejemplos de Three.js y comprimido con meshopt. Escenario: Kenney Car Kit y Nature Kit (CC0). Texturas: ambientCG (CC0). Están embebidos en `index.html`, así que abre con doble clic; la carpeta `assets` guarda los originales.

Necesita internet para cargar Three.js y GLTFLoader desde CDN.
