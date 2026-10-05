import type React from 'react';
import { D1 } from './D1';
import { D2 } from './D2';
import { D3 } from './D3';
import { D4 } from './D4';
import { D5 } from './D5';
import { D6 } from './D6';
import { D7 } from './D7';
import { D8 } from './D8';

export const DIAGRAMS: Record<string, React.FC> = { d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, d7: D7, d8: D8 };
export { D1, D2, D3, D4, D5, D6, D7, D8 };
