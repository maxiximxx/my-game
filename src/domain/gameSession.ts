import { advanceTime, clickPoint, requestHint, restartLevel, startLevel } from './rules';
import type { GameState, Level, Point } from './types';

type Listener = () => void;

export interface GameSessionOptions {
  /** 每次通关只调用一次，参数为关卡编号和通关用时（毫秒）。创建会话时传入，之后不变。 */
  onLevelCleared: (levelId: number, clearTimeMs: number) => void;
}

/**
 * 一局游戏的会话：持有游戏状态，负责计时、通关判定和通关通知。
 * 不依赖 React。时间由外部以时间戳（毫秒）传入，会话自己计算经过的时间。
 */
export interface GameSession {
  getState(): GameState;
  /** 订阅状态变化，返回取消订阅的函数。 */
  subscribe(listener: Listener): () => void;
  pick(point: Point, minHitRadius: number): void;
  hint(): void;
  restart(): void;
  tick(nowMs: number): void;
}

export function createGameSession(level: Level, options: GameSessionOptions): GameSession {
  let state = startLevel(level);
  let lastTickMs: number | null = null;
  const listeners = new Set<Listener>();

  const commit = (next: GameState) => {
    if (next === state) {
      return;
    }

    state = next;
    listeners.forEach((listener) => listener());
  };

  return {
    getState: () => state,

    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },

    pick(point, minHitRadius) {
      const before = state;
      commit(clickPoint(state, point, minHitRadius));

      if (before.clearTimeMs === null && state.clearTimeMs !== null) {
        options.onLevelCleared(level.id, state.clearTimeMs);
      }
    },

    hint() {
      commit(requestHint(state));
    },

    restart() {
      // 重新开始后，计时的起点要重新记录，否则会把之前停止期间的时间算进来。
      lastTickMs = null;
      commit(restartLevel(state));
    },

    tick(nowMs) {
      if (state.status !== 'playing') {
        lastTickMs = null;
        return;
      }

      if (lastTickMs === null) {
        lastTickMs = nowMs;
        return;
      }

      const deltaMs = nowMs - lastTickMs;
      lastTickMs = nowMs;
      commit(advanceTime(state, deltaMs));
    },
  };
}
