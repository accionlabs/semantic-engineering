import { gsap } from 'gsap';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import { TextPlugin } from 'gsap/TextPlugin';

gsap.registerPlugin(DrawSVGPlugin, MorphSVGPlugin, TextPlugin);
gsap.defaults({ ease: 'power2.inOut', duration: 0.6 });
// Rendering seeks the timeline frame by frame, so nothing may depend on wall-clock time.
gsap.ticker.lagSmoothing(0);
export { gsap };
export type TL = gsap.core.Timeline;
