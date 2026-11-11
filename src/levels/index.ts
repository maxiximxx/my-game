import type { Level } from '../domain/types';
import { level01 } from './level-01';
import { level02 } from './level-02';
import { level03 } from './level-03';
import { level04 } from './level-04';
import { level05 } from './level-05';

/** 所有关卡，按关卡编号排列。新增关卡时新建 level-0N.ts 并在这里追加。 */
export const levels: readonly Level[] = [level01, level02, level03, level04, level05];
