import { describe, expect, it } from 'vitest';
import {
  advanceTime,
  clickPoint,
  getRemainingMs,
  requestHint,
  restartLevel,
  startLevel,
} from './rules';
import type { Level } from './types';

// 测试用的小关卡：只有 2 处差异点，证明规则不写死在某一关的数据上。
const fixtureLevel: Level = {
  id: 99,
  originalImage: 'original.svg',
  modifiedImage: 'modified.svg',
  differences: [
    { id: 'left', center: { x: 0.25, y: 0.5 }, radius: 0.1 },
    { id: 'right', center: { x: 0.75, y: 0.5 }, radius: 0.1 },
  ],
};

describe('核心规则：命中与非命中', () => {
  it('点中差异点的圆形区域内时，该差异点被记为已找到', () => {
    const state = clickPoint(startLevel(fixtureLevel), { x: 0.26, y: 0.52 });

    expect(state.foundIds).toEqual(['left']);
    expect(state.status).toBe('playing');
  });

  it('点中圆形区域外的位置时，不记为找到，仍在进行中', () => {
    const state = clickPoint(startLevel(fixtureLevel), { x: 0.5, y: 0.1 });

    expect(state.foundIds).toEqual([]);
    expect(state.status).toBe('playing');
  });

  it('重复点击已找到的差异点时，已找到数量不增加', () => {
    const once = clickPoint(startLevel(fixtureLevel), { x: 0.25, y: 0.5 });
    const twice = clickPoint(once, { x: 0.25, y: 0.5 });

    expect(twice.foundIds).toEqual(['left']);
  });

  it('圆形判定按 4:3 图片比例换算，纵向偏移超过半径时不命中', () => {
    // 图片宽高比为 4:3，纵向 0.12 的相对偏移约等于横向 0.09，仍在半径 0.1 内。
    const inside = clickPoint(startLevel(fixtureLevel), { x: 0.25, y: 0.62 });
    // 纵向 0.14 的相对偏移约等于横向 0.105，超出半径 0.1。
    const outside = clickPoint(startLevel(fixtureLevel), { x: 0.25, y: 0.64 });

    expect(inside.foundIds).toEqual(['left']);
    expect(outside.foundIds).toEqual([]);
  });
});

describe('核心规则：通关与用时', () => {
  it('找齐全部差异点后进入通关状态，通关用时为从开始到找齐的累计时间', () => {
    let state = startLevel(fixtureLevel);
    state = advanceTime(state, 4000);
    state = clickPoint(state, { x: 0.25, y: 0.5 });
    state = advanceTime(state, 3000);
    state = clickPoint(state, { x: 0.75, y: 0.5 });

    expect(state.status).toBe('cleared');
    expect(state.foundIds).toEqual(['left', 'right']);
    expect(state.clearTimeMs).toBe(7000);
  });

  it('通关后时间继续推进，通关用时不变', () => {
    let state = startLevel(fixtureLevel);
    state = advanceTime(state, 2000);
    state = clickPoint(state, { x: 0.25, y: 0.5 });
    state = clickPoint(state, { x: 0.75, y: 0.5 });
    state = advanceTime(state, 1000);

    expect(state.clearTimeMs).toBe(2000);
    expect(state.elapsedMs).toBe(2000);
  });

  it('通关后的点击不再改变状态', () => {
    let state = startLevel(fixtureLevel);
    state = clickPoint(state, { x: 0.25, y: 0.5 });
    state = clickPoint(state, { x: 0.75, y: 0.5 });
    const cleared = state;

    expect(clickPoint(cleared, { x: 0.5, y: 0.1 })).toEqual(cleared);
  });

  it('未通关时没有通关用时', () => {
    const state = clickPoint(startLevel(fixtureLevel), { x: 0.25, y: 0.5 });

    expect(state.clearTimeMs).toBeNull();
  });
});

describe('核心规则：限时与超时', () => {
  it('开始时剩余时间为 60 秒', () => {
    expect(getRemainingMs(startLevel(fixtureLevel))).toBe(60000);
  });

  it('推进时间后剩余时间递减', () => {
    const state = advanceTime(startLevel(fixtureLevel), 12000);

    expect(getRemainingMs(state)).toBe(48000);
  });

  it('倒计时归零时本关失败', () => {
    const state = advanceTime(startLevel(fixtureLevel), 60000);

    expect(state.status).toBe('timeUp');
    expect(getRemainingMs(state)).toBe(0);
  });

  it('一次推进的时间超过剩余时间（如切换标签页后）时同样超时，剩余时间为 0', () => {
    const state = advanceTime(startLevel(fixtureLevel), 75000);

    expect(state.status).toBe('timeUp');
    expect(getRemainingMs(state)).toBe(0);
  });

  it('超时后点击不再生效', () => {
    const timedOut = advanceTime(startLevel(fixtureLevel), 60000);

    expect(clickPoint(timedOut, { x: 0.25, y: 0.5 })).toEqual(timedOut);
  });

  it('59 秒内找齐全部差异点时正常通关，不触发超时', () => {
    let state = advanceTime(startLevel(fixtureLevel), 59000);
    state = clickPoint(state, { x: 0.25, y: 0.5 });
    state = clickPoint(state, { x: 0.75, y: 0.5 });

    expect(state.status).toBe('cleared');
    expect(state.clearTimeMs).toBe(59000);
  });

  it('超时后重新挑战，计时回到 60 秒，已找到的差异点清零', () => {
    let state = clickPoint(startLevel(fixtureLevel), { x: 0.25, y: 0.5 });
    state = advanceTime(state, 60000);
    state = restartLevel(state);

    expect(state.status).toBe('playing');
    expect(state.foundIds).toEqual([]);
    expect(getRemainingMs(state)).toBe(60000);
  });
});

describe('核心规则：误点与重复点击', () => {
  it('误点后剩余时间减少 5 秒，本关不会立即失败，已找到的差异点不变', () => {
    const state = clickPoint(startLevel(fixtureLevel), { x: 0.5, y: 0.1 });

    expect(getRemainingMs(state)).toBe(55000);
    expect(state.status).toBe('playing');
    expect(state.foundIds).toEqual([]);
  });

  it('误点位置显示红色叉号，约 600 毫秒后自动消失', () => {
    let state = clickPoint(startLevel(fixtureLevel), { x: 0.5, y: 0.1 });
    expect(state.missMarks.map((mark) => mark.point)).toEqual([{ x: 0.5, y: 0.1 }]);

    state = advanceTime(state, 599);
    expect(state.missMarks).toHaveLength(1);

    state = advanceTime(state, 1);
    expect(state.missMarks).toEqual([]);
  });

  it('剩余时间不足 5 秒时误点会归零并判定超时', () => {
    const state = clickPoint(advanceTime(startLevel(fixtureLevel), 57000), { x: 0.5, y: 0.1 });

    expect(getRemainingMs(state)).toBe(0);
    expect(state.status).toBe('timeUp');
  });

  it('误点后剩余时间恰好为 0 时判定超时', () => {
    const state = clickPoint(advanceTime(startLevel(fixtureLevel), 55000), { x: 0.5, y: 0.1 });

    expect(state.status).toBe('timeUp');
  });

  it('重复点击已找到的差异点没有任何效果，不扣时间，也不计为误点', () => {
    const once = clickPoint(startLevel(fixtureLevel), { x: 0.25, y: 0.5 });
    const twice = clickPoint(once, { x: 0.25, y: 0.5 });

    expect(twice).toEqual(once);
    expect(getRemainingMs(twice)).toBe(60000);
  });
});

describe('核心规则：判定半径', () => {
  it('最小判定半径生效时，标注圆之外但在最小半径内的点击也命中（手机端）', () => {
    // 左侧差异点标注半径 0.1，点击位于其右侧 0.13 处。
    const hit = clickPoint(startLevel(fixtureLevel), { x: 0.38, y: 0.5 }, 0.15);

    expect(hit.foundIds).toEqual(['left']);
  });

  it('没有最小判定半径时，标注圆之外的点击为误点（桌面端）', () => {
    const miss = clickPoint(startLevel(fixtureLevel), { x: 0.38, y: 0.5 });

    expect(miss.foundIds).toEqual([]);
    expect(miss.missCount).toBe(1);
  });

  it('标注半径更大时按标注半径判定，最小判定半径不会缩小判定范围', () => {
    // 标注半径 0.1 大于最小判定半径 0.05，点击位于右侧 0.11 处，超出标注圆。
    const state = clickPoint(startLevel(fixtureLevel), { x: 0.36, y: 0.5 }, 0.05);

    expect(state.foundIds).toEqual([]);
  });
});

describe('核心规则：提示', () => {
  it('每关开始时有 1 次提示', () => {
    expect(startLevel(fixtureLevel).hintsLeft).toBe(1);
  });

  it('使用提示后剩余时间减少 10 秒', () => {
    const state = requestHint(startLevel(fixtureLevel));

    expect(getRemainingMs(state)).toBe(50000);
    expect(state.hintsLeft).toBe(0);
  });

  it('提示高亮一处尚未找到的差异点', () => {
    let state = clickPoint(startLevel(fixtureLevel), { x: 0.25, y: 0.5 });
    state = requestHint(state);

    expect(state.activeHint?.regionId).toBe('right');
  });

  it('提示约 2 秒后消失', () => {
    let state = requestHint(startLevel(fixtureLevel));
    state = advanceTime(state, 1999);
    expect(state.activeHint).not.toBeNull();

    state = advanceTime(state, 1);
    expect(state.activeHint).toBeNull();
  });

  it('次数用完后再次使用提示没有任何效果', () => {
    const once = requestHint(startLevel(fixtureLevel));

    expect(requestHint(once)).toEqual(once);
  });

  it('超时重新挑战后，提示次数恢复为 1', () => {
    let state = requestHint(startLevel(fixtureLevel));
    state = advanceTime(state, 60000);
    state = requestHint(restartLevel(state));

    expect(getRemainingMs(state)).toBe(50000);
    expect(state.activeHint).not.toBeNull();
  });
});
