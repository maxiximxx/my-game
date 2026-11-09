import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // 部署到子路径（如 GitHub Pages 项目页）时通过 VITE_BASE_PATH 设置，例如 /my-game/。
  base: process.env.VITE_BASE_PATH ?? '/',
});
