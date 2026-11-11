import { describe, expect, it } from 'vitest';
import styles from '../styles.css?raw';
import { IMAGE_ASPECT_RATIO, MOBILE_BREAKPOINT_PX } from './layout';

// CSS 无法引用 TypeScript 常量（@media 条件也不能使用变量），所以用测试保证两边的值一致。
describe('布局常量：CSS 与 TypeScript 保持一致', () => {
  it('CSS 中的图片比例与 IMAGE_ASPECT_RATIO 相同，并且只声明在 --image-ratio 一处', () => {
    const match = styles.match(/--image-ratio:\s*(\d+)\s*\/\s*(\d+)\s*;/);
    if (!match) {
      throw new Error('styles.css 中缺少 --image-ratio 声明');
    }

    expect(Number(match[1]) / Number(match[2])).toBeCloseTo(IMAGE_ASPECT_RATIO);
    expect(styles).not.toMatch(/aspect-ratio:\s*4\s*\/\s*3/);
  });

  it('CSS 中所有手机断点都与 MOBILE_BREAKPOINT_PX 相同', () => {
    const breakpoints = [...styles.matchAll(/@media \(max-width: (\d+)px\)/g)].map((match) =>
      Number(match[1]),
    );

    expect(breakpoints.length).toBeGreaterThan(0);
    for (const breakpoint of breakpoints) {
      expect(breakpoint).toBe(MOBILE_BREAKPOINT_PX);
    }
  });
});
