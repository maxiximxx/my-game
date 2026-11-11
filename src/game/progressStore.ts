import { createProgress } from './progress';
import type { Progress } from './progress';

/** 进度存储：读取、保存和清除关卡进度。只保存解锁状态和最佳用时，不保存本关进行中的状态。 */
export interface ProgressStore {
  load(): Progress;
  save(progress: Progress): void;
  clear(): void;
}

/** localStorage 的最小子集，便于测试时替换。 */
export type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

const STORAGE_KEY = 'zhao-cha-progress';

/** 解析本地存储中的内容。格式不对时返回 null。 */
function parseProgress(raw: string): Progress | null {
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return null;
  }

  if (typeof data !== 'object' || data === null) {
    return null;
  }

  // 旧版本保存的数据还带有 clearedCount 字段，这里忽略它：通关数量由最佳用时推导。
  const record = data as { bestTimesMs?: unknown };
  if (typeof record.bestTimesMs !== 'object' || record.bestTimesMs === null) {
    return null;
  }

  const bestTimesMs: Record<number, number> = {};
  for (const [levelId, ms] of Object.entries(record.bestTimesMs)) {
    if (typeof ms === 'number' && Number.isFinite(ms)) {
      bestTimesMs[Number(levelId)] = ms;
    }
  }

  return { bestTimesMs };
}

/** 浏览器本地存储实现。数据损坏或缺失时读取到初始进度。 */
export function createLocalProgressStore(storage: StorageLike): ProgressStore {
  return {
    load() {
      const raw = storage.getItem(STORAGE_KEY);
      return (raw === null ? null : parseProgress(raw)) ?? createProgress();
    },
    save(progress) {
      storage.setItem(STORAGE_KEY, JSON.stringify(progress));
    },
    clear() {
      storage.removeItem(STORAGE_KEY);
    },
  };
}

/** 内存实现，用于测试。 */
export function createMemoryProgressStore(): ProgressStore {
  let current = createProgress();
  return {
    load: () => current,
    save: (progress) => {
      current = progress;
    },
    clear: () => {
      current = createProgress();
    },
  };
}
