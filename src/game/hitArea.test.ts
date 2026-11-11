import { describe, expect, it } from 'vitest';
import { locateClick, minHitRadiusFor } from './hitArea';

describe('手机端判定半径换算', () => {
  it('图片显示宽度为 400 像素时，直径 44 像素对应的相对半径为 0.055', () => {
    expect(minHitRadiusFor(400)).toBeCloseTo(0.055, 6);
  });

  it('图片显示宽度为 1000 像素时，直径 44 像素对应的相对半径为 0.022', () => {
    expect(minHitRadiusFor(1000)).toBeCloseTo(0.022, 6);
  });
});

describe('点击定位', () => {
  const rect = { left: 100, top: 50, width: 400, height: 300 };

  it('桌面布局：返回图片内的相对坐标，最小判定半径为 0', () => {
    expect(locateClick(300, 200, rect, false)).toEqual({ point: { x: 0.5, y: 0.5 }, minHitRadius: 0 });
  });

  it('手机布局：同一次点击返回相同的坐标，最小判定半径为 44 像素直径的一半除以图片宽度', () => {
    const result = locateClick(300, 200, rect, true);

    expect(result.point).toEqual({ x: 0.5, y: 0.5 });
    expect(result.minHitRadius).toBeCloseTo(0.055, 6);
  });
});
