import type { SceneDef } from '../engine/scene';
import { scene01 } from './s01-who-holds';
import { scene02 } from './s02-one-sprint';
import { scene03 } from './s03-the-tax';
import { scene04 } from './s04-agents-mistakes';

/** Every scene built so far, in script order. */
export const DEFS: SceneDef[] = [scene01, scene02, scene03, scene04].sort((a, b) => a.n - b.n);
