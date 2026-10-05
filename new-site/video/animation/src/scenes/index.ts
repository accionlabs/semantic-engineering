import type { SceneDef } from '../engine/scene';
import { scene01 } from './s01-who-holds';
import { scene02 } from './s02-one-sprint';

/** Every scene built so far, in script order. */
export const DEFS: SceneDef[] = [scene01, scene02].sort((a, b) => a.n - b.n);
