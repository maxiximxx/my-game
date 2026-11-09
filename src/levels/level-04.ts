import type { Level } from '../game/types';

// 第 4 关：教室。圆形区域由像素配置换算得到，图片尺寸 1600×1200。
export const level04: Level = {
  id: 4,
  originalImage: `${import.meta.env.BASE_URL}levels/level-04-original.png`,
  modifiedImage: `${import.meta.env.BASE_URL}levels/level-04-modified.png`,
  differences: [
    { id: 'clock', center: { x: 0.2, y: 0.2375 }, radius: 0.0563 }, // 左上方挂钟的白色表盘变成了蓝色
    { id: 'backpack', center: { x: 0.8641, y: 0.2583 }, radius: 0.1 }, // 教室右上方挂着的粉橙色书包消失了
    { id: 'plant', center: { x: 0.5359, y: 0.5813 }, radius: 0.05 }, // 黑板前方的花盆由珊瑚色变成了黄色
    { id: 'globe', center: { x: 0.1969, y: 0.7942 }, radius: 0.0906 }, // 教室左下方新增了一个蓝绿色地球仪
    { id: 'holder', center: { x: 0.8484, y: 0.8104 }, radius: 0.0719 }, // 右下方的圆角矩形笔筒变成了梯形笔筒
  ],
};
