import { describe, expect, it } from 'vitest';
import {
  createProgress,
  getBestTimeMs,
  isAllCleared,
  isLevelUnlocked,
  recordBestTime,
  recordClear,
} from './progress';

const LEVEL_COUNT = 5;

describe('线性解锁', () => {
  it('开始时只有第 1 关开放', () => {
    const progress = createProgress();

    expect(isLevelUnlocked(progress, 1)).toBe(true);
    expect(isLevelUnlocked(progress, 2)).toBe(false);
    expect(isLevelUnlocked(progress, 5)).toBe(false);
  });

  it('通关第 1 关后第 2 关解锁，第 3 关仍然锁定', () => {
    const progress = recordClear(createProgress(), 1, LEVEL_COUNT);

    expect(isLevelUnlocked(progress, 2)).toBe(true);
    expect(isLevelUnlocked(progress, 3)).toBe(false);
  });

  it('已解锁的关卡重复通关时，解锁状态不变', () => {
    const progress = recordClear(createProgress(), 1, LEVEL_COUNT);

    expect(recordClear(progress, 1, LEVEL_COUNT)).toEqual(progress);
  });

  it('通关最后一关后，解锁数量不超过关卡总数', () => {
    let progress = createProgress();
    for (let level = 1; level <= LEVEL_COUNT; level += 1) {
      progress = recordClear(progress, level, LEVEL_COUNT);
    }

    expect(isLevelUnlocked(progress, 5)).toBe(true);
    expect(recordClear(progress, 5, LEVEL_COUNT)).toEqual(progress);
  });
});

describe('全部通关', () => {
  it('通关第 4 关后，还没有全部通关', () => {
    let progress = createProgress();
    for (let level = 1; level <= 4; level += 1) {
      progress = recordClear(progress, level, LEVEL_COUNT);
    }

    expect(isAllCleared(progress, LEVEL_COUNT)).toBe(false);
  });

  it('通关全部关卡后为全部通关，之后重玩任意关卡仍保持全部通关', () => {
    let progress = createProgress();
    for (let level = 1; level <= LEVEL_COUNT; level += 1) {
      progress = recordClear(progress, level, LEVEL_COUNT);
    }

    expect(isAllCleared(progress, LEVEL_COUNT)).toBe(true);
    expect(isAllCleared(recordClear(progress, 3, LEVEL_COUNT), LEVEL_COUNT)).toBe(true);
    expect(isLevelUnlocked(progress, 3)).toBe(true);
  });
});

describe('最佳用时', () => {
  it('未通关的关卡没有最佳用时', () => {
    expect(getBestTimeMs(createProgress(), 1)).toBeNull();
  });

  it('首次通关后，最佳用时等于本次通关用时', () => {
    const progress = recordBestTime(createProgress(), 1, 42000);

    expect(getBestTimeMs(progress, 1)).toBe(42000);
  });

  it('再次通关用时更短时，最佳用时更新', () => {
    let progress = recordBestTime(createProgress(), 1, 42000);
    progress = recordBestTime(progress, 1, 30000);

    expect(getBestTimeMs(progress, 1)).toBe(30000);
  });

  it('再次通关用时更长时，保留原来的最佳用时', () => {
    let progress = recordBestTime(createProgress(), 1, 42000);
    progress = recordBestTime(progress, 1, 50000);

    expect(getBestTimeMs(progress, 1)).toBe(42000);
  });

  it('各关的最佳用时互不影响', () => {
    const progress = recordBestTime(createProgress(), 1, 42000);

    expect(getBestTimeMs(progress, 2)).toBeNull();
  });
});
