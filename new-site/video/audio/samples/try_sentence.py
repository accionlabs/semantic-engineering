"""Takes of one narration sentence with different spoken forms of a name, joined into one numbered file."""
import json, pathlib, subprocess, sys, urllib.request
sys.path.insert(0, str(pathlib.Path(__file__).parent.parent))
from gen_vo import MODEL, VOICE, AUDIO, key
HERE = pathlib.Path(__file__).parent
NUM = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight']
name, lines = sys.argv[1], json.loads(sys.argv[2])
parts, chars = [], 0
for i, line in enumerate(lines):
    text = f'Take {NUM[i]}. {line}'
    chars += len(text)
    body = json.dumps({'text': text, 'voice_setting': VOICE, 'audio_setting': AUDIO, 'output_format': 'url'}).encode()
    req = urllib.request.Request(f'https://fal.run/{MODEL}', data=body, headers={'Authorization': f'Key {key()}', 'Content-Type': 'application/json'})
    with urllib.request.urlopen(req, timeout=180) as r:
        url = json.loads(r.read().decode(), strict=False)['audio']['url']
    out = HERE / f'{name}-{i + 1}.mp3'; urllib.request.urlretrieve(url, out); parts.append(out)
lst = HERE / f'{name}.txt'
lst.write_text(''.join(f"file '{p.name}'\nfile 'gap.mp3'\n" for p in parts))
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', str(lst), '-c:a', 'libmp3lame', '-b:a', '192k', str(HERE.parent.parent / 'renders' / f'{name}.mp3')], check=True)
print('characters', chars)
