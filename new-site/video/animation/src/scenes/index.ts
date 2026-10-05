import type { SceneDef } from '../engine/scene';
import { scene01 } from './s01-who-holds';
import { scene02 } from './s02-one-sprint';
import { scene03 } from './s03-the-tax';
import { scene04 } from './s04-agents-mistakes';
import { scene05 } from './s05-principles';
import { scene06 } from './s06-four-layers';
import { scene07 } from './s07-what-goes-in';
import { scene08 } from './s08-keeping-accurate';
import { scene09 } from './s09-two-kinds';

/** Every scene built so far, in script order. */
export const DEFS: SceneDef[] = [scene01, scene02, scene03, scene04, scene05, scene06, scene07, scene08, scene09].sort((a, b) => a.n - b.n);
