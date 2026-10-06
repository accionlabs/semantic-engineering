"""Builds the site's narration tracks from the voiced clips, laid on the film's timeline as the site plays it.

  python3 site_audio.py      writes site/app/public/media/narration.m4a (scenes 1 to 30, with the title and
                             act cards) and overview.m4a (the overview alone, no title)

Each sentence is placed at its scene's start plus the lead, then one after another with the gap, as the
animation times them (engine/cues.ts), so voice, captions and picture share one clock.
"""
import array, json, pathlib, subprocess

HERE = pathlib.Path(__file__).parent
ANIM = HERE.parent / 'animation'
OUT = HERE.parents[1] / 'site/app/public/media'
RATE = 44100
manifest = json.loads((HERE / 'vo/manifest.json').read_text())
timing = json.loads((ANIM / 'src/voice-timing.json').read_text())
lead, gap = timing['lead'], timing['gap']

def pcm(file):
    raw = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', str(HERE / 'vo' / file), '-f', 's16le', '-ac', '1', '-ar', str(RATE), '-'], capture_output=True, check=True).stdout
    a = array.array('h'); a.frombytes(raw); return a

def track(scenes, flags, name):
    chap_file = HERE / f'.chapters-{name}.json'
    subprocess.run(['node', 'scripts/render.mjs', '--scenes', scenes, *flags, '--chapters', str(chap_file)], cwd=ANIM, check=True, capture_output=True)
    film = json.loads(chap_file.read_text()); chap_file.unlink()
    buf = array.array('h', bytes(int(film['duration'] * RATE + RATE) * 2))
    placed = 0
    for ch in film['chapters']:
        n = ch.get('n')
        if n is None or str(n) not in manifest:
            continue
        t = ch['start'] + lead
        for s in sorted(manifest[str(n)], key=lambda x: x['k']):
            clip, at = pcm(s['file']), int(round(t * RATE))
            for i, v in enumerate(clip):
                j = at + i
                if j < len(buf): buf[j] = max(-32768, min(32767, buf[j] + v))
            t += s['ms'] / 1000 + gap
            placed += 1
    raw = HERE / f'.{name}.raw'; raw.write_bytes(buf.tobytes())
    OUT.mkdir(parents=True, exist_ok=True)
    subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-f', 's16le', '-ar', str(RATE), '-ac', '1', '-i', str(raw),
                    '-filter:a', 'loudnorm=I=-16:TP=-1.5:LRA=11', '-c:a', 'aac', '-b:a', '64k', '-ar', '48000',
                    '-movflags', '+faststart', str(OUT / f'{name}.m4a')], check=True)
    raw.unlink()
    print(f'{name}.m4a: {placed} sentences, {film["duration"]:.1f} s')

track('1-30', [], 'narration')
track('0-0', ['--notitle'], 'overview')
