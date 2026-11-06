import type { Level } from '../game/types';
import { level01 } from './level-01';

/** 所有关卡，按关卡编号排列。新增关卡时在这里追加即可。 */
export const levels: readonly Level[] = [level01];
