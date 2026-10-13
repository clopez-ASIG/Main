"""Transcriptor local de audios (reemplazo de Otter). Corre en tu equipo, sin costo ni nube."""
import os
import tempfile

from faster_whisper import WhisperModel
from flask import Flask, jsonify, render_template_string, request

MODEL_SIZE = os.environ.get("WHISPER_MODEL", "small")  # tiny/base/small/medium/large-v3
app = Flask(__name__)
_model = None


def get_model():
    global _model
    if _model is None:
        _model = WhisperModel(MODEL_SIZE, device="auto", compute_type="auto")
    return _model


def ts(seconds):
    ms = int(seconds * 1000)
    h, ms = divmod(ms, 3600000)
    m, ms = divmod(ms, 60000)
    s, ms = divmod(ms, 1000)
    return f"{h:02}:{m:02}:{s:02},{ms:03}"


PAGE = """<!doctype html><meta charset=utf-8>
<title>Transcriptor</title>
<style>
body{font:16px system-ui;max-width:760px;margin:2rem auto;padding:0 1rem}
#drop{border:2px dashed #888;border-radius:12px;padding:2.5rem;text-align:center;cursor:pointer}
#drop.over{background:#eef}
textarea{width:100%;height:320px;margin-top:1rem;font:15px/1.5 system-ui}
button,select{font:inherit;padding:.4rem .8rem}
</style>
<h1>Transcriptor de audios</h1>
<label>Idioma: <select id=lang>
<option value=es>Español</option><option value=en>Inglés</option><option value="">Detectar</option>
</select></label>
<div id=drop>Arrastrá un audio acá o hacé clic<input id=f type=file accept="audio/*,video/*" hidden></div>
<p id=st></p>
<textarea id=out placeholder="La transcripción aparece acá"></textarea>
<p><button id=cp>Copiar</button> <button id=dl>Descargar .txt</button> <button id=srt>Descargar .srt</button></p>
<script>
let data={text:"",srt:""};
const $=i=>document.getElementById(i), drop=$("drop"), f=$("f");
drop.onclick=()=>f.click();
drop.ondragover=e=>{e.preventDefault();drop.classList.add("over")};
drop.ondragleave=()=>drop.classList.remove("over");
drop.ondrop=e=>{e.preventDefault();drop.classList.remove("over");send(e.dataTransfer.files[0])};
f.onchange=()=>send(f.files[0]);
async function send(file){
  if(!file)return;
  $("st").textContent="Transcribiendo "+file.name+"… (la primera vez descarga el modelo)";
  const fd=new FormData();fd.append("audio",file);fd.append("lang",$("lang").value);
  const r=await fetch("/transcribe",{method:"POST",body:fd});
  const j=await r.json();
  if(!r.ok){$("st").textContent="Error: "+j.error;return}
  data=j;$("out").value=j.text;$("st").textContent="Listo ("+j.language+")";
}
const save=(name,txt)=>{const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([txt]));a.download=name;a.click()};
$("cp").onclick=()=>navigator.clipboard.writeText($("out").value);
$("dl").onclick=()=>save("transcripcion.txt",$("out").value);
$("srt").onclick=()=>save("transcripcion.srt",data.srt);
</script>"""


@app.get("/")
def index():
    return render_template_string(PAGE)


@app.post("/transcribe")
def transcribe():
    up = request.files.get("audio")
    if not up:
        return jsonify(error="No llegó ningún archivo"), 400
    lang = request.form.get("lang") or None
    suffix = os.path.splitext(up.filename or "")[1] or ".audio"
    with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp:
        up.save(tmp.name)
    try:
        segments, info = get_model().transcribe(tmp.name, language=lang, vad_filter=True)
        segs = list(segments)
    except Exception as e:  # noqa: BLE001
        return jsonify(error=str(e)), 500
    finally:
        os.unlink(tmp.name)
    text = "\n".join(s.text.strip() for s in segs)
    srt = "\n".join(
        f"{i}\n{ts(s.start)} --> {ts(s.end)}\n{s.text.strip()}\n" for i, s in enumerate(segs, 1)
    )
    return jsonify(text=text, srt=srt, language=info.language)


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000)
