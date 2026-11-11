import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // 部署到子路径（如 GitHub Pages 项目页）时通过 VITE_BASE_PATH 设置，例如 /my-game/。
  base: process.env.VITE_BASE_PATH ?? '/',
  test: {
    // 布局契约测试需要读取 styles.css 的原始内容（?raw 导入的路径带有后缀，所以正则不能以 $ 结尾）。
    css: { include: [/styles\.css/] },
  },
});
