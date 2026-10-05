"""Prepares the site's media from the latest voiced render: the fallback MP4, the narration track
the live player follows, a poster, a thumbnail per scene, and WebVTT captions.

  python3 scripts/prepare-media.py <voiced-render.mp4>
"""
import json, pathlib, re, subprocess, sys

HERE = pathlib.Path(__file__).parent
PUB = HERE / '../public/media'
ANIM = HERE / '../../../video/animation'
src = pathlib.Path(sys.argv[1]).resolve()
chapters = json.loads(src.with_name(src.name.replace('.mp4', '.chapters.json').replace('review-cut-voiced.chapters', 'review-cut-voiced.chapters')).read_text()) if src.with_suffix('.chapters.json').exists() else json.loads((HERE / '../src/content/chapters.json').read_text())
(PUB / 'thumbs').mkdir(parents=True, exist_ok=True)
ff = lambda *a: subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', *a], check=True)

ff('-i', str(src), '-vf', 'scale=1280:-2', '-c:v', 'libx264', '-crf', '28', '-preset', 'slow', '-c:a', 'aac', '-b:a', '96k', '-movflags', '+faststart', str(PUB / 'explainer-720p.mp4'))
ff('-i', str(src), '-vn', '-c:a', 'aac', '-b:a', '96k', '-movflags', '+faststart', str(PUB / 'narration.m4a'))
for c in chapters:
    if c.get('n'):
        ff('-ss', f"{c['start'] + c['duration'] * 0.62:.2f}", '-i', str(src), '-frames:v', '1', '-vf', 'scale=640:-2', '-q:v', '4', str(PUB / f"thumbs/s{c['n']:02d}.jpg"))
first = next(c for c in chapters if c.get('n') == 1)
ff('-ss', f"{first['start'] + first['duration'] * 0.95:.2f}", '-i', str(src), '-frames:v', '1', '-vf', 'scale=1280:-2', '-q:v', '3', str(PUB / 'poster.jpg'))

# Captions, from the same timing the animation uses.
nar = json.loads((ANIM / 'src/narration.json').read_text())
vt = json.loads((ANIM / 'src/voice-timing.json').read_text())
def chunk(sentence, mx=13):
    w = sentence.split(); out = []; cur = []
    for i, x in enumerate(w):
        cur.append(x)
        if len(cur) >= mx or (re.search(r'[,:;]$', x) and len(cur) >= 6 and len(w) - i - 1 >= 4): out.append(' '.join(cur)); cur = []
    if cur:
        if len(cur) < 4 and out: out[-1] += ' ' + ' '.join(cur)
        else: out.append(' '.join(cur))
    return out
ts = lambda t: f"{int(t // 3600):02d}:{int(t % 3600 // 60):02d}:{t % 60:06.3f}"
lines = ['WEBVTT', '']
for c in chapters:
    n = c.get('n')
    if not n: continue
    scene = next(s for s in nar['scenes'] if s['n'] == n)
    lens = vt['scenes'][str(n)]
    t = c['start'] + vt['lead']
    for sent, d in zip(scene['sentences'], lens):
        parts = chunk(sent); total = sum(len(p.split()) for p in parts); u = t
        for p in parts:
            dur = len(p.split()) / total * d
            lines += [f'{ts(u)} --> {ts(u + dur)}', p, '']; u += dur
        t += d + vt['gap']
(PUB / 'captions.vtt').write_text('\n'.join(lines))
(HERE / '../src/content/chapters.json').write_text(json.dumps(chapters, indent=1))
for f in sorted(PUB.glob('*')):
    if f.is_file(): print(f.name, round(f.stat().st_size / 1048576, 1), 'MB')
