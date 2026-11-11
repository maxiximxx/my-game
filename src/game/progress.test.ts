import { describe, expect, it } from 'vitest';
import {
  createProgress,
  getBestTimeMs,
  getClearedCount,
  isAllCleared,
  isLevelUnlocked,
  recordLevelCleared,
} from './progress';

const LEVEL_COUNT = 5;

/** 依次通关第 1 到第 count 关，每关用时 42 秒。 */
function clearLevels(count: number) {
  let progress = createProgress();
  for (let level = 1; level <= count; level += 1) {
    progress = recordLevelCleared(progress, level, 42000);
  }
  return progress;
}

describe('线性解锁', () => {
  it('开始时只有第 1 关开放', () => {
    const progress = createProgress();

    expect(isLevelUnlocked(progress, 1)).toBe(true);
    expect(isLevelUnlocked(progress, 2)).toBe(false);
    expect(isLevelUnlocked(progress, 5)).toBe(false);
  });

  it('通关第 1 关后第 2 关解锁，第 3 关仍然锁定', () => {
    const progress = recordLevelCleared(createProgress(), 1, 42000);

    expect(isLevelUnlocked(progress, 2)).toBe(true);
    expect(isLevelUnlocked(progress, 3)).toBe(false);
  });

  it('锁定的关卡不能记录通关', () => {
    const progress = createProgress();

    expect(recordLevelCleared(progress, 2, 30000)).toEqual(progress);
  });

  it('已解锁的关卡重复通关时，解锁状态不变', () => {
    const progress = recordLevelCleared(createProgress(), 1, 42000);

    expect(getClearedCount(recordLevelCleared(progress, 1, 30000))).toBe(1);
    expect(isLevelUnlocked(recordLevelCleared(progress, 1, 30000), 3)).toBe(false);
  });

  it('通关全部关卡后，已通关数量等于关卡总数', () => {
    expect(getClearedCount(clearLevels(LEVEL_COUNT))).toBe(LEVEL_COUNT);
  });
});

describe('全部通关', () => {
  it('通关第 4 关后，还没有全部通关', () => {
    expect(isAllCleared(clearLevels(4), LEVEL_COUNT)).toBe(false);
  });

  it('通关全部关卡后为全部通关，之后重玩任意关卡仍保持全部通关', () => {
    const progress = clearLevels(LEVEL_COUNT);

    expect(isAllCleared(progress, LEVEL_COUNT)).toBe(true);
    expect(isAllCleared(recordLevelCleared(progress, 3, 30000), LEVEL_COUNT)).toBe(true);
    expect(isLevelUnlocked(progress, 3)).toBe(true);
  });
});

describe('最佳用时', () => {
  it('未通关的关卡没有最佳用时', () => {
    expect(getBestTimeMs(createProgress(), 1)).toBeNull();
  });

  it('首次通关后，最佳用时等于本次通关用时', () => {
    const progress = recordLevelCleared(createProgress(), 1, 42000);

    expect(getBestTimeMs(progress, 1)).toBe(42000);
  });

  it('再次通关用时更短时，最佳用时更新', () => {
    let progress = recordLevelCleared(createProgress(), 1, 42000);
    progress = recordLevelCleared(progress, 1, 30000);

    expect(getBestTimeMs(progress, 1)).toBe(30000);
  });

  it('再次通关用时更长时，保留原来的最佳用时', () => {
    let progress = recordLevelCleared(createProgress(), 1, 42000);
    progress = recordLevelCleared(progress, 1, 50000);

    expect(getBestTimeMs(progress, 1)).toBe(42000);
  });

  it('各关的最佳用时互不影响', () => {
    const progress = recordLevelCleared(createProgress(), 1, 42000);

    expect(getBestTimeMs(progress, 2)).toBeNull();
  });
});
