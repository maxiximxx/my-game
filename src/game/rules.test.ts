import { describe, expect, it } from 'vitest';
import { advanceTime, clickPoint, startLevel } from './rules';
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

  it('点中圆形区域外的位置时，状态保持不变', () => {
    const initial = startLevel(fixtureLevel);
    const state = clickPoint(initial, { x: 0.5, y: 0.1 });

    expect(state).toEqual(initial);
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
