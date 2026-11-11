import { describe, expect, it, vi } from 'vitest';
import { createGameSession } from './gameSession';
import { getRemainingMs } from './rules';
import type { Level } from './types';

// 测试用的小关卡：2 处差异点，id 为 7，用来验证会话的行为而不依赖具体关卡。
const fixtureLevel: Level = {
  id: 7,
  originalImage: 'original.png',
  modifiedImage: 'modified.png',
  differences: [
    { id: 'left', center: { x: 0.25, y: 0.5 }, radius: 0.1 },
    { id: 'right', center: { x: 0.75, y: 0.5 }, radius: 0.1 },
  ],
};

function createSession() {
  const onLevelCleared = vi.fn();
  const session = createGameSession(fixtureLevel, { onLevelCleared });
  return { session, onLevelCleared };
}

describe('游戏会话：计时', () => {
  it('第一次 tick 只记录起点，之后相邻两次 tick 的间隔计入用时', () => {
    const { session } = createSession();

    session.tick(1000);
    session.tick(1500);
    session.tick(3000);

    expect(session.getState().elapsedMs).toBe(2000);
  });

  it('开始时剩余时间为 60 秒', () => {
    const { session } = createSession();

    expect(getRemainingMs(session.getState())).toBe(60000);
  });

  it('累计时间达到 60 秒时超时', () => {
    const { session } = createSession();

    session.tick(0);
    session.tick(60000);

    expect(session.getState().status).toBe('timeUp');
  });

  it('超时后 tick 不再推进时间', () => {
    const { session } = createSession();

    session.tick(0);
    session.tick(60000);
    session.tick(70000);

    expect(session.getState().elapsedMs).toBe(60000);
  });

  it('重新挑战后计时从头开始，不把超时前的时间带过来', () => {
    const { session } = createSession();

    session.tick(0);
    session.tick(60000);
    session.restart();
    session.tick(100000);
    session.tick(101000);

    expect(session.getState().status).toBe('playing');
    expect(getRemainingMs(session.getState())).toBe(59000);
  });
});

describe('游戏会话：点击与通关通知', () => {
  it('误点扣 5 秒，不计为找到', () => {
    const { session } = createSession();

    session.pick({ x: 0.5, y: 0.1 }, 0);

    expect(getRemainingMs(session.getState())).toBe(55000);
    expect(session.getState().foundIds).toEqual([]);
  });

  it('通关时只通知一次，并给出通关用时', () => {
    const { session, onLevelCleared } = createSession();

    session.tick(0);
    session.tick(42000);
    session.pick({ x: 0.25, y: 0.5 }, 0);
    session.pick({ x: 0.75, y: 0.5 }, 0);
    session.pick({ x: 0.25, y: 0.5 }, 0);

    expect(onLevelCleared).toHaveBeenCalledTimes(1);
    expect(onLevelCleared).toHaveBeenCalledWith(7, 42000);
  });

  it('超时不发出通关通知', () => {
    const { session, onLevelCleared } = createSession();

    session.tick(0);
    session.tick(60000);
    session.pick({ x: 0.25, y: 0.5 }, 0);

    expect(onLevelCleared).not.toHaveBeenCalled();
  });

  it('重玩后再次通关，会再次通知', () => {
    const { session, onLevelCleared } = createSession();

    session.pick({ x: 0.25, y: 0.5 }, 0);
    session.pick({ x: 0.75, y: 0.5 }, 0);
    session.restart();
    session.pick({ x: 0.25, y: 0.5 }, 0);
    session.pick({ x: 0.75, y: 0.5 }, 0);

    expect(onLevelCleared).toHaveBeenCalledTimes(2);
  });
});

describe('游戏会话：提示与订阅', () => {
  it('提示每关只能用 1 次，用完后再次使用没有效果', () => {
    const { session } = createSession();

    session.hint();
    session.hint();

    expect(session.getState().hintsLeft).toBe(0);
    expect(session.getState().elapsedMs).toBe(10000);
  });

  it('状态变化时通知订阅者，取消订阅后不再通知', () => {
    const { session } = createSession();
    const listener = vi.fn();

    const unsubscribe = session.subscribe(listener);
    session.tick(0);
    session.tick(1000);
    const callsBefore = listener.mock.calls.length;
    unsubscribe();
    session.tick(2000);

    expect(callsBefore).toBeGreaterThan(0);
    expect(listener.mock.calls.length).toBe(callsBefore);
  });
});
