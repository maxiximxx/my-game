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
  const timerClass = remainingSeconds <= 10 ? 'stat-panel timer is-low' : 'stat-panel timer';

  return (
    <header className="game-header">
      <button type="button" className="btn btn-ghost" onClick={onBackToLevelSelect}>
        返回选关
      </button>
      <p className="level-tag">第 {levelId} 关</p>
      <div className={timerClass}>
        <span className="stat-label">剩余时间</span>
        <span className="timer-value">
          {remainingSeconds}
          <span className="timer-unit">秒</span>
        </span>
      </div>
      <div className="stat-panel progress-block">
        <span className="stat-label">
          已找到 {foundCount}/{totalCount}
        </span>
        <div className="pips" aria-hidden="true">
          {Array.from({ length: totalCount }, (_, index) => (
            <span key={index} className={index < foundCount ? 'pip is-found' : 'pip'} />
          ))}
        </div>
      </div>
      <button
        type="button"
        className="btn btn-primary hint-button"
        onClick={onHint}
        disabled={hintsLeft === 0}
      >
        提示（剩余 {hintsLeft} 次）
      </button>
    </header>
  );
}
