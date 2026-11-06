import { describe, expect, it } from 'vitest';
import { createProgress, isAllCleared, isLevelUnlocked, recordClear } from './progress';

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
