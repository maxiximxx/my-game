import { useEffect, useRef, useState } from 'react';
import { advanceTime, clickPoint, requestHint, restartLevel, startLevel } from './rules';
import type { GameState, Level, Point } from './types';

type OnLevelCleared = (levelId: number, clearTimeMs: number) => void;

/**
 * 管理一局游戏的状态。
 * 权威副本保存在 ref 中：点击、提示、计时都先基于 ref 算出下一个状态，再写回 React state。
 * 这样通关可以在点击事件中直接通知外部，不需要 effect 去监听状态变化。
 */
export function useGameSession(level: Level, onLevelCleared: OnLevelCleared) {
  const [state, setState] = useState<GameState>(() => startLevel(level));
  const latest = useRef(state);
  const status = state.status;

  useEffect(() => {
    if (status !== 'playing') {
      return;
    }

    let frameId = 0;
    let previousTime = performance.now();
    const step = () => {
      const now = performance.now();
      const next = advanceTime(latest.current, now - previousTime);
      latest.current = next;
      setState(next);
      previousTime = now;
      frameId = requestAnimationFrame(step);
    };
    frameId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(frameId);
  }, [status]);

  const commit = (next: GameState) => {
    latest.current = next;
    setState(next);
  };

  const pick = (point: Point, minHitRadius: number) => {
    const before = latest.current;
    const next = clickPoint(before, point, minHitRadius);
    commit(next);
    if (before.clearTimeMs === null && next.clearTimeMs !== null) {
      onLevelCleared(level.id, next.clearTimeMs);
    }
  };

  const hint = () => commit(requestHint(latest.current));
  const restart = () => commit(restartLevel(latest.current));

  return { state, pick, hint, restart };
}
