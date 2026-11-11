import type { Level } from '../domain/types';

// 第 3 关：海边傍晚。圆形区域由像素配置换算得到，图片尺寸 1600×1200。
export const level03: Level = {
  id: 3,
  originalImage: `${import.meta.env.BASE_URL}levels/level-03-original.png`,
  modifiedImage: `${import.meta.env.BASE_URL}levels/level-03-modified.png`,
  differences: [
    { id: 'umbrella', center: { x: 0.2072, y: 0.3517 }, radius: 0.1594 }, // 沙滩遮阳伞由红白配色变成了蓝白配色
    { id: 'sailboat', center: { x: 0.7938, y: 0.3079 }, radius: 0.0969 }, // 海面右上方的帆船消失了
    { id: 'lounger', center: { x: 0.7313, y: 0.6042 }, radius: 0.075 }, // 沙滩椅上的蓝色布面变成了红色
    { id: 'shell', center: { x: 0.1278, y: 0.8117 }, radius: 0.0813 }, // 沙滩左下方新增一枚粉色贝壳
    { id: 'bucket', center: { x: 0.8688, y: 0.75 }, radius: 0.075 }, // 沙滩上的红色水桶向右侧移动了
  ],
};
