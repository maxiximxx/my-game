interface GameHeaderProps {
  levelId: number;
  foundCount: number;
  totalCount: number;
  remainingSeconds: number;
  onBackToLevelSelect: () => void;
}

export function GameHeader({
  levelId,
  foundCount,
  totalCount,
  remainingSeconds,
  onBackToLevelSelect,
}: GameHeaderProps) {
  return (
    <header className="game-header">
      <button type="button" onClick={onBackToLevelSelect}>
        返回选关
      </button>
      <span>第 {levelId} 关</span>
      <span>
        已找到 {foundCount}/{totalCount}
      </span>
      <span>剩余时间 {remainingSeconds} 秒</span>
    </header>
  );
}
