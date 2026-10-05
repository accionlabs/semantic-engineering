import React from 'react';
import type { SceneDef } from '../engine/scene';
import { appear, focusBeats } from '../engine/scene';
import { FigureChip, Frame, Svg } from '../parts/ui';
import { C, F } from '../theme';

// Scene 3. The premise the stack was built on starts to move: vendor reports of agents
// building whole applications, a crack in the premise, and the two questions that follow.
const CRACK = 'M 702 222 L 676 282 L 710 328 L 684 388 L 716 432 L 739 446';

export const scene03: SceneDef = {
  n: 3,
  id: 'shift',
  View: () => (
    <Frame act="Act 1" scene="Scene 3 · The premise shifts">
      <div className="r-premise" style={{ position: 'absolute', inset: 0 }}>
        <div className="pre card" data-target="rule.write-once" style={{ position: 'absolute', left: 120, top: 220, width: 620, height: 250, boxSizing: 'border-box',
          background: C.canvasRaised, border: `2px solid ${C.warn}`, borderRadius: 16, padding: '30px 34px' }}>
          <div style={{ fontFamily: F.mono, fontSize: 15, color: C.muted, letterSpacing: 1.5 }}>THE PREMISE</div>
          <div style={{ fontFamily: F.display, fontWeight: 700, fontSize: 52, lineHeight: 1.1, marginTop: 12 }}>Writing the code is the expensive part</div>
        </div>
        <Svg>
          <path className="crack" d={CRACK} fill="none" stroke={C.warn} strokeWidth={4} strokeLinejoin="round" />
        </Svg>
      </div>
      <div className="r-chips" style={{ position: 'absolute', inset: 0 }}>
        <FigureChip className="pre chip-a" x={820} y={210} w={960} tag="Vendor report" target="fig.anthropic-compiler"
          label="A 100,000-line C compiler that builds Linux 6.9, from about 2,000 Claude Code sessions, with people designing the tests"
          source="Anthropic, Building a C compiler with a team of parallel Claudes, February 2026" />
        <FigureChip className="pre chip-b" x={820} y={400} w={960} tag="Vendor report" target="fig.openai-codex"
          label="A design tool built from a blank repository in about 25 hours, described by its author as an experiment"
          source="OpenAI, Run long horizon tasks with Codex" />
      </div>
      <div className="r-q1" style={{ position: 'absolute', inset: 0 }}>
        <div className="pre q1" data-target="question.shared" style={{ position: 'absolute', left: 120, top: 630, width: 1680, fontFamily: F.display, fontWeight: 700, fontSize: 60, lineHeight: 1.1, color: C.text }}>
          Which layers should every customer still share?
        </div>
      </div>
      <div className="r-q2" style={{ position: 'absolute', inset: 0 }}>
        <div className="pre q2" data-target="question.value" style={{ position: 'absolute', left: 120, top: 740, width: 1680, fontFamily: F.display, fontWeight: 700, fontSize: 60, lineHeight: 1.1, color: C.invariantEdge }}>
          What is the product really selling?
        </div>
      </div>
    </Frame>
  ),
  build: (ctx) => {
    const { tl, q, cue } = ctx;
    const premise = cue('premise', 's0'), reports = cue('reports', 's1'), crack = cue('crack', 's2');
    const shared = cue('shared', 's3'), value = cue('value', 's4');
    focusBeats(ctx, [
      { id: 'premise', at: premise, regions: ['.r-premise'] },
      { id: 'reports', at: reports, regions: ['.r-chips'] },
      { id: 'crack', at: crack, regions: ['.r-premise'] },
      { id: 'shared', at: shared, regions: ['.r-q1'] },
      { id: 'value', at: value, regions: ['.r-q2'] },
    ], 0.25);

    appear(ctx, '.card', premise);
    appear(ctx, '.chip-a', reports + 0.3);
    appear(ctx, '.chip-b', reports + 1.6);

    // The premise cracks along one edge and tilts: the cost it assumed is moving.
    tl.fromTo(q('.crack'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 1.6, ease: 'power1.in' }, crack + 0.6);
    tl.to(q('.card'), { rotation: -1.5, duration: 1.2, ease: 'power2.out' }, crack + 1.6);
    tl.to(q('.crack'), { rotation: -1.5, svgOrigin: '430 345', duration: 1.2, ease: 'power2.out' }, crack + 1.6);

    appear(ctx, '.q1', shared + 0.2);
    appear(ctx, '.q2', value + 0.2);
  },
};
