import { useEffect, useReducer } from 'react';
import { advanceTime, clickPoint, startLevel } from './rules';
import type { GameState, Level, Point } from './types';

type GameAction = { type: 'click'; point: Point } | { type: 'tick'; deltaMs: number };

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'click':
      return clickPoint(state, action.point);
    case 'tick':
      return advanceTime(state, action.deltaMs);
  }
}

/**
 * 管理一局游戏的状态。计时由页面驱动：游戏进行中每帧把真实经过的时间交给规则模块。
 */
export function useGameSession(level: Level) {
  const [state, dispatch] = useReducer(gameReducer, level, startLevel);
  const status = state.status;

  useEffect(() => {
    if (status !== 'playing') {
      return;
    }

    let frameId = 0;
    let previousTime = performance.now();
    const step = () => {
      const now = performance.now();
      dispatch({ type: 'tick', deltaMs: now - previousTime });
      previousTime = now;
      frameId = requestAnimationFrame(step);
    };
    frameId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(frameId);
  }, [status]);

  const pick = (point: Point) => dispatch({ type: 'click', point });

  return { state, pick };
}
