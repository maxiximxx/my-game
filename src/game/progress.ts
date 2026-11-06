/**
 * 关卡进度。关卡按编号线性通关：只有通关了第 n-1 关，第 n 关才会解锁，
 * 所以已通关的关卡总是从第 1 关起连续的一段，clearedCount 即为它的长度。
 * bestTimesMs 记录每关的最佳用时（毫秒），未通关的关卡没有对应条目。
 */
export interface Progress {
  readonly clearedCount: number;
  readonly bestTimesMs: Readonly<Partial<Record<number, number>>>;
}

export function createProgress(): Progress {
  return { clearedCount: 0, bestTimesMs: {} };
}

/** 第 1 关默认开放；已通关的关卡之后的一关解锁。 */
export function isLevelUnlocked(progress: Progress, levelId: number): boolean {
  return levelId <= progress.clearedCount + 1;
}

/**
 * 记录一次通关。只有通关的是当前最远的未通关关卡时，才推进进度；
 * 重玩已通关的关卡不会改变进度。
 */
export function recordClear(progress: Progress, levelId: number, levelCount: number): Progress {
  if (levelId !== progress.clearedCount + 1 || progress.clearedCount >= levelCount) {
    return progress;
  }

  return { ...progress, clearedCount: progress.clearedCount + 1 };
}

export function isAllCleared(progress: Progress, levelCount: number): boolean {
  return progress.clearedCount >= levelCount;
}

/** 只有用时更短时才替换该关的最佳用时。 */
export function recordBestTime(progress: Progress, levelId: number, clearTimeMs: number): Progress {
  const best = progress.bestTimesMs[levelId];
  if (best !== undefined && best <= clearTimeMs) {
    return progress;
  }

  return { ...progress, bestTimesMs: { ...progress.bestTimesMs, [levelId]: clearTimeMs } };
}

/** 该关的最佳用时（毫秒）；未通关时为 null。 */
export function getBestTimeMs(progress: Progress, levelId: number): number | null {
  return progress.bestTimesMs[levelId] ?? null;
}
