import type { Level } from '../game/types';

// 第 5 关：夜晚小镇。圆形区域由像素配置换算得到，图片尺寸 1600×1200。
export const level05: Level = {
  id: 5,
  originalImage: `${import.meta.env.BASE_URL}levels/level-05-original.png`,
  modifiedImage: `${import.meta.env.BASE_URL}levels/level-05-modified.png`,
  differences: [
    { id: 'moon', center: { x: 0.2, y: 0.2167 }, radius: 0.0656 }, // 夜空中的弯月变成了圆形满月
    { id: 'lamp', center: { x: 0.2563, y: 0.4067 }, radius: 0.0313 }, // 路灯的灯光由暖黄色变成了浅蓝色
    { id: 'house', center: { x: 0.825, y: 0.6333 }, radius: 0.0625 }, // 右侧房屋的墙壁由蓝灰色变成了珊瑚红色
    { id: 'car', center: { x: 0.75, y: 0.8 }, radius: 0.0813 }, // 道路上的红色汽车消失了
    { id: 'cat', center: { x: 0.5081, y: 0.8467 }, radius: 0.0906 }, // 道路下方新增了一只黑色小猫
  ],
};
