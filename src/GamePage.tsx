import { GameBoard } from './game/GameBoard';
import { ResultModal } from './game/ResultModal';
import { useGameSession } from './game/useGameSession';
import type { Level } from './game/types';

interface GamePageProps {
  level: Level;
  onBackToLevelSelect: () => void;
}

export function GamePage({ level, onBackToLevelSelect }: GamePageProps) {
  const { state, pick } = useGameSession(level);

  return (
    <main>
      <header className="game-header">
        <button type="button" onClick={onBackToLevelSelect}>
          返回选关
        </button>
        <span>第 {level.id} 关</span>
        <span>
          已找到 {state.foundIds.length}/{level.differences.length}
        </span>
      </header>
      <GameBoard level={level} foundIds={state.foundIds} onPick={pick} />
      {state.clearTimeMs !== null && (
        <ResultModal
          clearTimeMs={state.clearTimeMs}
          onBackToLevelSelect={onBackToLevelSelect}
        />
      )}
    </main>
  );
}
