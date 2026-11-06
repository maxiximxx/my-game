interface GameHeaderProps {
  levelId: number;
  foundCount: number;
  totalCount: number;
  remainingSeconds: number;
  hintsLeft: number;
  onHint: () => void;
  onBackToLevelSelect: () => void;
}

export function GameHeader({
  levelId,
  foundCount,
  totalCount,
  remainingSeconds,
  hintsLeft,
  onHint,
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
      <button type="button" onClick={onHint} disabled={hintsLeft === 0}>
        提示（剩余 {hintsLeft} 次）
      </button>
    </header>
  );
}
