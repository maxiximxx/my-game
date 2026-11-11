import { useCallback, useEffect, useState } from 'react';
import { createProgress, recordLevelCleared } from './progress';
import type { Progress } from './progress';
import type { ProgressStore } from './progressStore';

/**
 * 关卡进度的页面层入口：加载进度、把变化同步到存储（外部系统）、记录通关、重置进度。
 * 调用方只需要知道这三件事，不需要组合进度规则或关心存储细节。
 */
export function useProgress(store: ProgressStore) {
  const [progress, setProgress] = useState<Progress>(() => store.load());

  useEffect(() => {
    store.save(progress);
  }, [progress, store]);

  const recordClear = useCallback((levelId: number, clearTimeMs: number) => {
    setProgress((current) => recordLevelCleared(current, levelId, clearTimeMs));
  }, []);

  const resetProgress = useCallback(() => {
    store.clear();
    setProgress(createProgress());
  }, [store]);

  return { progress, recordClear, resetProgress };
}
