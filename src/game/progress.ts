/**
 * 关卡进度。每关的最佳用时（毫秒）是唯一的数据：有最佳用时的关卡就是已通关的关卡。
 * 关卡按编号线性通关，所以已通关的关卡总是从第 1 关起连续的一段，由此推导出通关数量。
 */
export interface Progress {
  readonly bestTimesMs: Readonly<Partial<Record<number, number>>>;
}

export function createProgress(): Progress {
  return { bestTimesMs: {} };
}

/** 从第 1 关起连续通关的关卡数量。 */
export function getClearedCount(progress: Progress): number {
  let count = 0;
  while (progress.bestTimesMs[count + 1] !== undefined) {
    count += 1;
  }
  return count;
}

/** 第 1 关默认开放；已通关的关卡之后的一关解锁。 */
export function isLevelUnlocked(progress: Progress, levelId: number): boolean {
  return levelId <= getClearedCount(progress) + 1;
}

export function isAllCleared(progress: Progress, levelCount: number): boolean {
  return getClearedCount(progress) >= levelCount;
}

/** 该关的最佳用时（毫秒）；未通关时为 null。 */
export function getBestTimeMs(progress: Progress, levelId: number): number | null {
  return progress.bestTimesMs[levelId] ?? null;
}

/**
 * 记录一次通关：解锁状态和最佳用时一起更新。
 * 只有已解锁的关卡可以记录通关；只有用时更短时才替换最佳用时。
 */
export function recordLevelCleared(progress: Progress, levelId: number, clearTimeMs: number): Progress {
  if (!isLevelUnlocked(progress, levelId)) {
    return progress;
  }

  const best = progress.bestTimesMs[levelId];
  if (best !== undefined && best <= clearTimeMs) {
    return progress;
  }

  return { bestTimesMs: { ...progress.bestTimesMs, [levelId]: clearTimeMs } };
}
