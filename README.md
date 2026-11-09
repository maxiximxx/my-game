# 大家来找茬

一款网页版找茬游戏：给出两张看起来几乎相同的图片，在 60 秒内找出其中的五处不同。

在线地址（GitHub Pages）：https://maxiximxx.github.io/my-game/

## 玩法

- 每关 5 处差异，找齐即通关，共 5 关。
- 每关限时 60 秒，计时不可暂停。
- 误点扣 5 秒，使用提示扣 10 秒。每关可以用 1 次提示。
- 关卡线性解锁：通关第 n 关后解锁第 n+1 关，已解锁的关卡可以随时重玩。
- 记录每关的最佳用时，进度保存在浏览器本地。

没有后端、账号和排行榜。详见 `docs/adr/0001-frontend-only-no-backend.md`。

## 技术栈

React、TypeScript、Vite，测试使用 Vitest。

## 本地运行

需要 Node.js 22 或更新版本。

```bash
npm install
npm run dev      # 开发服务器
npm run test     # 运行测试
npm run build    # 类型检查并构建静态文件到 dist/
npm run preview  # 预览构建结果
```

## 部署

构建产物是纯静态文件，可以部署到任何静态托管平台。

- **GitHub Pages**：仓库内的 `.github/workflows/deploy.yml` 会在推送到 `main` 分支时构建并发布。
  首次使用前，在仓库的 Settings → Pages 中把 Source 设为 "GitHub Actions"。
  构建时会通过环境变量 `VITE_BASE_PATH` 设置子路径（仓库名），所以站点地址是 `/my-game/`。
- **Vercel 或其他根路径托管**：直接构建即可，默认 base 为 `/`，不需要额外配置。

## 项目结构

```
src/
  App.tsx              页面切换与进度
  HomePage.tsx         首页
  LevelSelectPage.tsx  选关页
  GamePage.tsx         游戏页
  game/
    rules.ts           核心规则：计时、命中、误点、提示（纯函数，不依赖页面）
    progress.ts        线性解锁、最佳用时
    progressStore.ts   进度的读取、保存和清除（浏览器本地存储）
    hitArea.ts         手机端最小判定范围的换算
    useGameSession.ts  游戏状态与计时循环
    GameBoard.tsx      原图与改图、圆圈标记
  levels/              关卡数据（差异点的圆形区域）
public/levels/         关卡图片（原图与改图，4:3）
docs/                  领域术语、ADR 与代理技能配置
.scratch/zhao-cha/     规格说明与任务拆分
```

## 新增关卡

1. 把原图和改图放到 `public/levels/`，命名为 `level-0N-original.png` 和 `level-0N-modified.png`。图片需为 4:3，且两张图尺寸一致。
2. 在 `src/levels/` 新建 `level-0N.ts`，填入 5 处差异点。
3. 在 `src/levels/index.ts` 的数组中追加该关。

差异点的坐标换算方式：

- `center.x = 圆心横坐标（像素） / 图片宽度`
- `center.y = 圆心纵坐标（像素） / 图片高度`
- `radius = 半径（像素） / 图片宽度`

`center` 取值 0 到 1，原点在图片左上角。规则代码不需要改动。

## 规格与决策

- 规格说明：`.scratch/zhao-cha/spec.md`，任务拆分在 `.scratch/zhao-cha/issues/`。
- 术语表：`GLOSSARY.md`。
- 架构决策记录：`docs/adr/`。
