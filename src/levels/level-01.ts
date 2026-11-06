import type { Level } from '../game/types';

// 示例关卡数据，供第 02 项验证流程使用。正式素材由第 11 项替换。
// 差异点坐标按 800×600 的示例图换算：相对坐标 = 像素 / 图片尺寸，半径 = 像素 / 800。
export const level01: Level = {
  id: 1,
  originalImage: '/levels/level-01-original.svg',
  modifiedImage: '/levels/level-01-modified.svg',
  differences: [
    { id: 'sun', center: { x: 0.85, y: 0.1833 }, radius: 0.0875 },
    { id: 'door', center: { x: 0.375, y: 0.675 }, radius: 0.05 },
    { id: 'apple', center: { x: 0.7375, y: 0.4667 }, radius: 0.0375 },
    { id: 'flower', center: { x: 0.15, y: 0.8333 }, radius: 0.05 },
    { id: 'window', center: { x: 0.2688, y: 0.6083 }, radius: 0.05 },
  ],
};
