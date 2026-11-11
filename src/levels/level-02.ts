import type { Level } from '../domain/types';

// 第 2 关：早餐厨房。圆形区域由像素配置换算得到，图片尺寸 1600×1200。
export const level02: Level = {
  id: 2,
  originalImage: `${import.meta.env.BASE_URL}levels/level-02-original.png`,
  modifiedImage: `${import.meta.env.BASE_URL}levels/level-02-modified.png`,
  differences: [
    { id: 'curtain', center: { x: 0.2297, y: 0.3054 }, radius: 0.1406 }, // 窗户左侧窗帘由蓝色变成了黄色
    { id: 'bread', center: { x: 0.7853, y: 0.4829 }, radius: 0.1063 }, // 餐盘上的两块面包消失了
    { id: 'mug', center: { x: 0.5078, y: 0.5458 }, radius: 0.07 }, // 餐桌上的蓝色杯子变成了红色
    { id: 'fruit', center: { x: 0.2, y: 0.7275 }, radius: 0.1063 }, // 餐桌左下方新增了一盘彩色水果
    { id: 'kettle', center: { x: 0.785, y: 0.7833 }, radius: 0.0938 }, // 右下方的圆形水壶变成了棱角分明的方形水壶
  ],
};
