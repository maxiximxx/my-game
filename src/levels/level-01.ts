import type { Level } from '../game/types';

// 第 1 关：公园。圆形区域由像素配置换算得到，图片尺寸 1600×1200。
export const level01: Level = {
  id: 1,
  originalImage: `${import.meta.env.BASE_URL}levels/level-01-original.png`,
  modifiedImage: `${import.meta.env.BASE_URL}levels/level-01-modified.png`,
  differences: [
    { id: 'tree', center: { x: 0.2328, y: 0.2625 }, radius: 0.1969 }, // 公园大树的树冠由绿色变成了橙色
    { id: 'balloon', center: { x: 0.8, y: 0.2333 }, radius: 0.1406 }, // 天空中的红色、蓝色和黄色气球全部消失
    { id: 'bench', center: { x: 0.5625, y: 0.4417 }, radius: 0.1188 }, // 长椅上的两块橙黄色木板变成了青绿色
    { id: 'pinwheel', center: { x: 0.8031, y: 0.7058 }, radius: 0.0781 }, // 草地上的彩色风车叶片形状和方向发生了变化
    { id: 'flower', center: { x: 0.2, y: 0.8192 }, radius: 0.0594 }, // 草地左下方新增了一簇三朵彩色小花
  ],
};
