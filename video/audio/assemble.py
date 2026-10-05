"""Lays the narration onto the film's timeline and muxes it with a rendered video.

Each sentence clip is placed at its scene's start plus the sentence start the animation used,
so voice, captions and motion share one clock. The track is loudness-normalised.

  python3 assemble.py ../renders/review-cut-voice.mp4
"""
import json, pathlib, subprocess, sys, array

HERE = pathlib.Path(__file__).parent
RATE = 44100
video = pathlib.Path(sys.argv[1]).resolve()
chapters = json.loads(video.with_suffix('.chapters.json').read_text())
manifest = json.loads((HERE / 'vo/manifest.json').read_text())
timing = json.loads((HERE / '../animation/src/voice-timing.json').read_text())
lead, gap = timing['lead'], timing['gap']
total = chapters[-1]['start'] + chapters[-1]['duration']
buf = array.array('h', bytes(int(total * RATE + RATE) * 2))

def pcm(file):
    raw = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', str(HERE / 'vo' / file), '-f', 's16le', '-ac', '1', '-ar', str(RATE), '-'], capture_output=True, check=True).stdout
    a = array.array('h'); a.frombytes(raw); return a

placed = 0
for ch in chapters:
    n = ch.get('n')
    if n is None:
        continue
    t = ch['start'] + lead
    for s in sorted(manifest[str(n)], key=lambda x: x['k']):
        clip = pcm(s['file'])
        at = int(round(t * RATE))
        for i, v in enumerate(clip):
            j = at + i
            if j < len(buf):
                buf[j] = max(-32768, min(32767, buf[j] + v))
        t += s['ms'] / 1000 + gap
        placed += 1

raw = HERE / 'narration-track.raw'
raw.write_bytes(buf.tobytes())
out = video.with_name(video.stem + '-with-voice.mp4')
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', str(video), '-f', 's16le', '-ar', str(RATE), '-ac', '1', '-i', str(raw),
                '-filter:a', 'loudnorm=I=-16:TP=-1.5:LRA=11', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000',
                '-shortest', '-movflags', '+faststart', str(out)], check=True)
raw.unlink()
print(f'placed {placed} sentences; wrote {out}')
