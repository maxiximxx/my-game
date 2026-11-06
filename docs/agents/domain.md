# 领域文档

工程类技能在探索代码库时，应如何使用本仓库的领域文档。

## 探索前先阅读

- 仓库根目录的 **`GLOSSARY.md`**；
- 若根目录存在 **`GLOSSARY-MAP.md`**，则阅读它：它指向每个上下文各自的 `GLOSSARY.md`。请阅读与当前主题相关的每一个文件。
- **`docs/adr/`**：阅读与你即将工作的领域相关的 ADR。在多上下文仓库中，还要检查 `src/<context>/docs/adr/` 中的上下文级决策。

如果上述任一文件不存在，**静默继续**。不要指出它们缺失，也不要预先建议创建。`/domain-modeling` 技能（通过 `/grill-with-docs` 和 `/improve-codebase-architecture` 调用）会在术语或决策真正确定时，按需创建这些文件。

## 文件结构

单上下文仓库（大多数仓库）：

```
/
├── GLOSSARY.md
├── docs/adr/
│   ├── 0001-event-sourced-orders.md
│   └── 0002-postgres-for-write-model.md
└── src/
```

多上下文仓库（根目录存在 `GLOSSARY-MAP.md`）：

```
/
├── GLOSSARY-MAP.md
├── docs/adr/                          ← 全局决策
└── src/
    ├── ordering/
    │   ├── GLOSSARY.md
    │   └── docs/adr/                  ← 上下文级决策
    └── billing/
        ├── GLOSSARY.md
        └── docs/adr/
```

## 使用术语表中的词汇

当你的输出涉及领域概念时（issue 标题、重构提案、假设、测试名称），请使用 `GLOSSARY.md` 中定义的术语。不要改用术语表明确避免的同义词。

如果你需要的概念尚未出现在术语表中，这是一个信号：要么你在使用项目中并不存在的说法（请重新考虑），要么确实存在缺口（记下来交给 `/domain-modeling` 处理）。

## 标记 ADR 冲突

如果你的输出与已有 ADR 相矛盾，应明确指出，而不是悄悄覆盖：

> _与 ADR-0007（事件溯源订单）相矛盾，但值得重新审视，原因是……_
