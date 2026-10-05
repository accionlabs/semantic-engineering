"""Replaces narration sentences one for one in the per-act drafts, so storyboard beats tied to sentence
numbers stay valid.  Usage: python3 resentence.py <draft.md> <edits.json>, where edits.json maps
"scene.sentence" to the new sentence."""
import json, re, sys
path, edits = sys.argv[1], json.load(open(sys.argv[2]))
lines = open(path).read().split('\n')
scene = None
for k, l in enumerate(lines):
    m = re.match(r'### Scene (\d+)|## Overview', l)
    if m:
        scene = m.group(1) or '0'
        continue
    if l.startswith('>') and scene is not None:
        body = re.sub(r'\(s\d+\)\s*', '', l[1:].strip())
        ss = re.split(r'(?<=[.!?])\s+(?=[A-Z0-9"])', body)
        for key, new in edits.items():
            sc, i = key.split('.')
            if sc == scene:
                ss[int(i) - 1] = new
        lines[k] = '> ' + ' '.join(ss)
        scene = None
open(path, 'w').write('\n'.join(lines))
