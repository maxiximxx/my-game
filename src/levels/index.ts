import type { Level } from '../game/types';
import { level01 } from './level-01';

/**
 * 所有关卡，按关卡编号排列。新增关卡时在这里追加即可。
 * 第 2 至 5 关暂时复用第 1 关的示例素材，只用于验证选关与解锁流程；正式素材由第 11 项替换。
 */
export const levels: readonly Level[] = [
  level01,
  { ...level01, id: 2 },
  { ...level01, id: 3 },
  { ...level01, id: 4 },
  { ...level01, id: 5 },
];
