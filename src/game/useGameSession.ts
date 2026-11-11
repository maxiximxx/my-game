import { useEffect, useState, useSyncExternalStore } from 'react';
import { createGameSession } from './gameSession';
import type { Level } from './types';

type OnLevelCleared = (levelId: number, clearTimeMs: number) => void;

/**
 * 把游戏会话接入 React。会话在组件挂载时创建一次；换关时 GamePage 由 key 重新挂载，会得到新会话。
 * 这里只做适配：订阅会话的状态，并在游戏进行中每帧把当前时间交给会话计时。
 */
export function useGameSession(level: Level, onLevelCleared: OnLevelCleared) {
  const [session] = useState(() => createGameSession(level, { onLevelCleared }));
  const state = useSyncExternalStore(session.subscribe, session.getState);
  const status = state.status;

  useEffect(() => {
    if (status !== 'playing') {
      return;
    }

    let frameId = 0;
    const step = () => {
      session.tick(performance.now());
      frameId = requestAnimationFrame(step);
    };
    frameId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(frameId);
  }, [session, status]);

  return { state, pick: session.pick, hint: session.hint, restart: session.restart };
}
