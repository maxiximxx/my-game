import { describe, expect, it } from 'vitest';
import { createProgress, getBestTimeMs, isLevelUnlocked, recordLevelCleared } from './progress';
import { createLocalProgressStore, createMemoryProgressStore } from './progressStore';
import type { StorageLike } from './progressStore';

function createFakeStorage(): StorageLike {
  const items = new Map<string, string>();
  return {
    getItem: (key) => items.get(key) ?? null,
    setItem: (key, value) => {
      items.set(key, value);
    },
    removeItem: (key) => {
      items.delete(key);
    },
  };
}

const clearedOnceWithBestTime = recordLevelCleared(createProgress(), 1, 42000);

describe('进度存储：内存实现', () => {
  it('没有保存过时读取到初始进度', () => {
    expect(createMemoryProgressStore().load()).toEqual(createProgress());
  });

  it('保存后读取到相同的解锁状态和最佳用时', () => {
    const store = createMemoryProgressStore();
    store.save(clearedOnceWithBestTime);

    expect(store.load()).toEqual(clearedOnceWithBestTime);
  });

  it('清除后读取到初始进度：只有第 1 关开放，最佳用时为空', () => {
    const store = createMemoryProgressStore();
    store.save(clearedOnceWithBestTime);
    store.clear();

    const progress = store.load();
    expect(isLevelUnlocked(progress, 2)).toBe(false);
    expect(getBestTimeMs(progress, 1)).toBeNull();
  });
});

describe('进度存储：浏览器本地存储', () => {
  it('刷新页面（重新创建存储实例）后，解锁状态和最佳用时保留', () => {
    const storage = createFakeStorage();
    createLocalProgressStore(storage).save(clearedOnceWithBestTime);

    const reloaded = createLocalProgressStore(storage).load();

    expect(reloaded).toEqual(clearedOnceWithBestTime);
  });

  it('旧版本保存的数据（带 clearedCount 字段）仍然能读出最佳用时和解锁状态', () => {
    const storage = createFakeStorage();
    storage.setItem('zhao-cha-progress', '{"clearedCount":1,"bestTimesMs":{"1":42000}}');

    const progress = createLocalProgressStore(storage).load();

    expect(getBestTimeMs(progress, 1)).toBe(42000);
    expect(isLevelUnlocked(progress, 2)).toBe(true);
  });

  it('本地数据损坏时回到初始进度', () => {
    const storage = createFakeStorage();
    storage.setItem('zhao-cha-progress', '{不是 JSON');

    expect(createLocalProgressStore(storage).load()).toEqual(createProgress());
  });

  it('清除后刷新页面，仍然是初始进度', () => {
    const storage = createFakeStorage();
    const store = createLocalProgressStore(storage);
    store.save(clearedOnceWithBestTime);
    store.clear();

    expect(createLocalProgressStore(storage).load()).toEqual(createProgress());
  });
});
