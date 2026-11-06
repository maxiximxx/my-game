/**
 * 关卡解锁进度。关卡按编号线性解锁：从第 1 关开始，已解锁的关卡数量就是 unlockedCount。
 */
export interface Progress {
  readonly unlockedCount: number;
}

export function createProgress(): Progress {
  return { unlockedCount: 1 };
}

export function isLevelUnlocked(progress: Progress, levelId: number): boolean {
  return levelId <= progress.unlockedCount;
}

/**
 * 记录一次通关。只有通关的是当前最远的已解锁关卡时，才解锁下一关；
 * 重玩已解锁的关卡不会改变进度。
 */
export function recordClear(progress: Progress, levelId: number, levelCount: number): Progress {
  if (levelId !== progress.unlockedCount || progress.unlockedCount >= levelCount) {
    return progress;
  }

  return { unlockedCount: progress.unlockedCount + 1 };
}
