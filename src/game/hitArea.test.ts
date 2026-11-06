import { describe, expect, it } from 'vitest';
import { minHitRadiusFor } from './hitArea';

describe('手机端判定半径换算', () => {
  it('图片显示宽度为 400 像素时，直径 44 像素对应的相对半径为 0.055', () => {
    expect(minHitRadiusFor(400)).toBeCloseTo(0.055, 6);
  });

  it('图片显示宽度为 1000 像素时，直径 44 像素对应的相对半径为 0.022', () => {
    expect(minHitRadiusFor(1000)).toBeCloseTo(0.022, 6);
  });
});
