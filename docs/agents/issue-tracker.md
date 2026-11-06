# 问题追踪：本地 Markdown

本仓库的 issue 和规格以 markdown 文件的形式存放在 `.scratch/` 中。

## 约定

- 每个功能使用一个目录：`.scratch/<功能-slug>/`
- 规格文件为 `.scratch/<功能-slug>/spec.md`
- 实现任务每个 ticket 对应一个文件，路径为 `.scratch/<功能-slug>/issues/<NN>-<slug>.md`，从 `01` 开始编号，不要合并成一个 tickets 文件
- 分类（triage）状态记录在每个 issue 文件顶部附近的 `Status:` 行中（角色对应的字符串见 `triage-labels.md`）
- 评论和对话记录追加到文件末尾，放在 `## Comments` 标题下

## 当技能提到"发布到 issue tracker"

在 `.scratch/<功能-slug>/` 下新建文件（目录不存在时先创建）。

## 当技能提到"获取相关 ticket"

读取指定路径的文件。用户通常会直接提供路径或 issue 编号。

## 寻路（wayfinding）操作

由 `/wayfinder` 使用。**地图（map）** 是一个文件，每个 ticket 对应一个 **子文件（child）**。

- **地图**：`.scratch/<effort>/map.md`。正文结构为 Notes / Decisions-so-far / Fog，即笔记、已做决定、迷雾。
- **子 ticket**：`.scratch/<effort>/issues/NN-<slug>.md`，从 `01` 开始编号，问题写在正文中。`Type:` 行记录 ticket 类型（`research`/`prototype`/`grilling`/`task`）；`Status:` 行记录 `claimed` 或 `resolved`。
- **阻塞关系**：文件顶部附近的 `Blocked by: NN, NN` 行。当它列出的所有文件都是 `resolved` 时，该 ticket 不再被阻塞。
- **前沿（frontier）**：扫描 `.scratch/<effort>/issues/`，找出未关闭、未被阻塞、未被认领的文件；编号最小者优先。
- **认领（claim）**：开始工作前，先将 `Status:` 设为 `claimed` 并保存。
- **解决（resolve）**：在 `## Answer` 标题下追加答案，将 `Status:` 设为 `resolved`，然后在 `map.md` 的 Decisions-so-far 中追加一条上下文指针（摘要加链接）。
