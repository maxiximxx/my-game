# 12: 静态构建与发布

**What to build:** 暂缓实施，等第 1 至 11 项完成后再做。项目可以构建为静态文件，并提供部署到 GitHub Pages 或 Vercel 的配置。按 spec 中的手工验收项检查桌面端、iOS Safari 和 Android Chrome。实际部署需要你的托管账号，由你操作。

**Blocked by:** 04 误点扣时与点击反馈、05 提示功能、06 桌面与手机布局、08 结算弹窗与全部通关、10 进度保存与清除进度、11 正式关卡素材接入

**Status:** ready-for-agent

- [x] 构建命令生成静态文件（npm run build 已验证；子路径构建 VITE_BASE_PATH=/my-game/ 也已验证资源路径正确）
- [x] 本地预览可以完整玩完 5 关（用户确认）
- [x] 桌面主流浏览器，以及 iOS Safari 和 Android Chrome，手工验收通过（用户确认）
- [x] 部署配置已准备好：GitHub Pages 工作流 `.github/workflows/deploy.yml`，以及 `vite.config.ts` 的 base 设置。远程 origin 已指向 `https://github.com/maxiximxx/my-game.git`，推送与 Pages 设置由用户完成（用户确认）
