"""Pronunciation trials: one clip per option, joined into one file per name with a pause between."""
import json, pathlib, subprocess, sys, urllib.request
sys.path.insert(0, str(pathlib.Path(__file__).parent.parent))
from gen_vo import MODEL, VOICE, AUDIO, key
HERE = pathlib.Path(__file__).parent
NUM = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight']
TRIALS = {
    'asimov': [f'{w} runs the method for legacy modernization.' for w in ['Asimo', 'Ah-see-mow', 'Uh-see-mov', 'Aseemo', 'Asseemov', 'Ahsimov', 'Azeemov', 'Ah-SEE-mov']],
    'breeze': [f'{w} runs the method for new and existing applications.' for w in ['Breeze AI', 'Breeze A.I.', 'Breeze Ay-eye', 'Breeze Ayeye', 'BreezeAI', 'Breeze, A.I.']],
}
chars = 0
for name, lines in TRIALS.items():
    parts = []
    for i, line in enumerate(lines):
        text = f'Option {NUM[i]}. {line}'
        chars += len(text)
        body = json.dumps({'text': text, 'voice_setting': VOICE, 'audio_setting': AUDIO, 'output_format': 'url'}).encode()
        req = urllib.request.Request(f'https://fal.run/{MODEL}', data=body, headers={'Authorization': f'Key {key()}', 'Content-Type': 'application/json'})
        with urllib.request.urlopen(req, timeout=180) as r:
            url = json.loads(r.read().decode(), strict=False)['audio']['url']
        out = HERE / f'{name}-{i + 1}.mp3'
        urllib.request.urlretrieve(url, out)
        parts.append(out)
    lst = HERE / f'{name}.txt'
    gap = HERE / 'gap.mp3'
    if not gap.exists():
        subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-f', 'lavfi', '-i', 'anullsrc=r=44100:cl=mono', '-t', '1.2', '-b:a', '256k', str(gap)], check=True)
    lst.write_text(''.join(f"file '{p.name}'\nfile 'gap.mp3'\n" for p in parts))
    subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', str(lst), '-c:a', 'libmp3lame', '-b:a', '192k', str(HERE / f'{name}-options.mp3')], check=True)
    for i, line in enumerate(lines): print(name, i + 1, line.split(' runs')[0])
print('characters', chars, 'cost about', round(chars / 1000 * 0.10, 2))
