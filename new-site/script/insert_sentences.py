"""Inserts narration sentences after sentence k of a scene, with one storyboard beat each, and renumbers
the later beats (beat numbers and their (sN) references) so the storyboard stays in step.
Usage: python3 insert_sentences.py <draft.md> <scene> <after_k> <json list of [sentence, beat text]>"""
import json, re, sys
path, scene, after = sys.argv[1], sys.argv[2], int(sys.argv[3])
items = json.loads(sys.argv[4])
s = open(path).read()
a = s.index(f'### Scene {scene}:')
b = s.find('\n### ', a + 10); b = len(s) if b < 0 else b
part = s[a:b]
# narration
m = re.search(r'^> (.*)$', part, re.M)
sents = re.split(r'(?<=[.!?])\s+(?=[A-Z0-9"])', re.sub(r'\(s\d+\)\s*', '', m.group(1)))
sents[after:after] = [x[0] for x in items]
part = part[:m.start()] + '> ' + ' '.join(sents) + part[m.end():]
# beats: shift numbers above `after`, then insert the new beats
n = len(items)
def shift(mm):
    k = int(mm.group(2))
    return f'{mm.group(1)}{k + n if k > after else k}'
bm = re.search(r'^\| Beats \|(.*)$', part, re.M)
row = bm.group(1)
row = re.sub(r'(\b)(\d+)(?= \(s)', lambda mm: str(int(mm.group(2)) + n) if int(mm.group(2)) > after else mm.group(2), row)
row = re.sub(r'(\(s|\bs)(\d+)', shift, row)
new = ' '.join(f'{after + i + 1} (s{after + i + 1}): {x[1]}' for i, x in enumerate(items))
pos = re.search(rf'\b{after + n + 1} \(s{after + n + 1}', row)
row = (row[:pos.start()] + new + ' ' + row[pos.start():]) if pos else row.rstrip(' |') + ' ' + new + ' |'
part = part[:bm.start()] + '| Beats |' + row + part[bm.end():]
open(path, 'w').write(s[:a] + part + s[b:])
print(f'scene {scene}: {len(sents)} sentences')
