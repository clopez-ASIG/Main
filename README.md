# Transcriptor de audios

App local con Whisper. Sin suscripción, el audio no sale de tu equipo.

Requiere Python 3.9+ y ffmpeg.

```
pip install -r requirements.txt
python app.py
```

Abrí http://127.0.0.1:5000, arrastrá el audio y listo. Exporta .txt y .srt.

Modelo: `WHISPER_MODEL=medium python app.py` (tiny, base, small, medium, large-v3).
Más grande = más preciso y más lento. Por defecto `small`.
