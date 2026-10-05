import type { SceneDef } from '../engine/scene';
import { scene02 } from './s02-accumulation';
import { scene07 } from './s07-rules-today';
import { GROUP_A } from './group-a';
import { GROUP_B } from './group-b';
import { GROUP_C } from './group-c';
import { GROUP_D } from './group-d';
import { scene30 } from './s30-tldr';

/** Every scene, in script order. */
export const DEFS: SceneDef[] = [scene02, scene07, ...GROUP_A, ...GROUP_B, ...GROUP_C, ...GROUP_D, scene30].sort((a, b) => a.n - b.n);
