import { describe, expect, it } from 'vitest';

describe('测试框架', () => {
  it('运行在 jsdom 浏览器模拟环境中', () => {
    expect(typeof document).toBe('object');
  });
});
