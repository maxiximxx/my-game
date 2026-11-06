interface GameHeaderProps {
  levelId: number;
  foundCount: number;
  totalCount: number;
  onBackToLevelSelect: () => void;
}

export function GameHeader({
  levelId,
  foundCount,
  totalCount,
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
    </header>
  );
}
