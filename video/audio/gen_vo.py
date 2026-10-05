"""Generates the narration one sentence at a time with fal.ai MiniMax Speech-02 HD.

Each sentence is cached by its text, so re-running regenerates only what changed. Writes the
clips to vo/, a manifest with measured durations, the timing file the animation reads, and a
line per call to the cost report. The fal key is read from ~/.fal_key and never printed.
"""
import concurrent.futures as cf, hashlib, json, os, re, urllib.request, datetime, pathlib

HERE = pathlib.Path(__file__).parent
NARRATION = HERE / '../animation/src/narration.json'
TIMING = HERE / '../animation/src/voice-timing.json'
MANIFEST = HERE / 'vo/manifest.json'
COST = HERE / '../cost-report.md'
MODEL = 'fal-ai/minimax/speech-02-hd'
PRICE_PER_1000 = 0.10
VOICE = {'voice_id': 'Deep_Voice_Man', 'speed': 0.96, 'vol': 1, 'pitch': 0, 'english_normalization': True}
AUDIO = {'sample_rate': 44100, 'bitrate': 256000, 'format': 'mp3', 'channel': 1}
LEAD, GAP, TAIL = 0.6, 0.7, 1.2  # the gap leaves room to cut a clip cleanly between sentences

# Spoken forms for words the voice reads badly. Captions keep the written form.
SAY = [(r'\bSaaS\b', 'sass'), (r'\bOn2Go\b', 'on-to-go'), (r'\bYAML\b', 'yammel'), (r'\bLSP\b', 'L S P')]

def spoken(text):
    for pat, rep in SAY:
        text = re.sub(pat, rep, text)
    return text

def key():
    return (pathlib.Path.home() / '.fal_key').read_text().strip()

def synth(job):
    n, k, text = job
    say = spoken(text)
    h = hashlib.sha1(json.dumps([say, VOICE, AUDIO]).encode()).hexdigest()[:12]
    out = HERE / f'vo/s{n:02d}-{k:02d}-{h}.mp3'
    meta = out.with_suffix('.json')
    if out.exists() and meta.exists():
        return n, k, text, say, out.name, json.loads(meta.read_text())['ms'], False
    body = json.dumps({'text': say, 'voice_setting': VOICE, 'audio_setting': AUDIO, 'output_format': 'url'}).encode()
    req = urllib.request.Request(f'https://fal.run/{MODEL}', data=body, headers={'Authorization': f'Key {key()}', 'Content-Type': 'application/json'})
    with urllib.request.urlopen(req, timeout=180) as r:
        res = json.loads(r.read().decode(), strict=False)
    urllib.request.urlretrieve(res['audio']['url'], out)
    meta.write_text(json.dumps({'ms': res['duration_ms'], 'text': text, 'spoken': say}))
    return n, k, text, say, out.name, res['duration_ms'], True

def main():
    scenes = json.loads(NARRATION.read_text())['scenes']
    jobs = [(s['n'], k, t) for s in scenes for k, t in enumerate(s['sentences'])]
    with cf.ThreadPoolExecutor(6) as ex:
        results = list(ex.map(synth, jobs))
    manifest, timing, new_chars = {}, {'lead': LEAD, 'gap': GAP, 'tail': TAIL, 'model': MODEL, 'voice': VOICE, 'scenes': {}}, 0
    for n, k, text, say, file, ms, fresh in results:
        manifest.setdefault(str(n), []).append({'k': k, 'text': text, 'spoken': say, 'file': file, 'ms': ms})
        timing['scenes'].setdefault(str(n), []).append(round(ms / 1000, 3))
        if fresh:
            new_chars += len(say)
    MANIFEST.write_text(json.dumps(manifest, indent=1))
    TIMING.write_text(json.dumps(timing, indent=1))
    fresh = sum(1 for r in results if r[6])
    if fresh:
        cost = new_chars / 1000 * PRICE_PER_1000
        if not COST.exists():
            COST.write_text('# fal.ai cost report\n\n| Date | Model | Purpose | Calls | Characters | Cost (USD) |\n|---|---|---|---|---|---|\n')
        with COST.open('a') as f:
            f.write(f'| {datetime.date.today()} | {MODEL} | Narration, voice {VOICE["voice_id"]}, per sentence | {fresh} | {new_chars} | {cost:.2f} |\n')
    total = sum(ms for *_, ms, _ in results) / 1000
    print(f'{len(results)} sentences, {fresh} generated now, {new_chars} characters; spoken length {total/60:.1f} min')

if __name__ == '__main__':
    main()
