/** 手机端点击判定的最小直径（像素）。 */
const MIN_TOUCH_DIAMETER_PX = 44;

/**
 * 把最小判定直径按图片当前显示宽度换算成相对图片宽度的半径。
 * 规则模块只认相对坐标，所以由页面在点击时传入这个值。
 */
export function minHitRadiusFor(displayWidthPx: number): number {
  return MIN_TOUCH_DIAMETER_PX / 2 / displayWidthPx;
}

/** 图片在页面上的位置和大小（像素），通常来自 getBoundingClientRect()。 */
export interface DisplayRect {
  readonly left: number;
  readonly top: number;
  readonly width: number;
  readonly height: number;
}

/**
 * 把一次点击转换成规则模块需要的输入：图片内的相对坐标，以及本次点击的最小判定半径。
 * 手机布局下最小判定半径取 44 像素直径的一半；桌面布局下为 0，只按标注的圆判定。
 */
export function locateClick(
  clientX: number,
  clientY: number,
  rect: DisplayRect,
  mobileLayout: boolean,
): { point: { x: number; y: number }; minHitRadius: number } {
  return {
    point: {
      x: (clientX - rect.left) / rect.width,
      y: (clientY - rect.top) / rect.height,
    },
    minHitRadius: mobileLayout ? minHitRadiusFor(rect.width) : 0,
  };
}
