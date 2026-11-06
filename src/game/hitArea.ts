/** 手机端点击判定的最小直径（像素）。 */
export const MIN_TOUCH_DIAMETER_PX = 44;

/**
 * 把最小判定直径按图片当前显示宽度换算成相对图片宽度的半径。
 * 规则模块只认相对坐标，所以由页面在点击时传入这个值。
 */
export function minHitRadiusFor(
  displayWidthPx: number,
  minDiameterPx: number = MIN_TOUCH_DIAMETER_PX,
): number {
  return minDiameterPx / 2 / displayWidthPx;
}
