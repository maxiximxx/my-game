import { GameBoard } from './game/GameBoard';
import { GameHeader } from './game/GameHeader';
import { ResultModal } from './game/ResultModal';
import { TimeUpModal } from './game/TimeUpModal';
import { getRemainingMs } from './game/rules';
import { useGameSession } from './game/useGameSession';
import type { Level } from './game/types';

interface GamePageProps {
  level: Level;
  nextLevel: Level | null;
  onOpenLevel: (level: Level) => void;
  onBackToLevelSelect: () => void;
  onLevelCleared: (levelId: number, clearTimeMs: number) => void;
}

export function GamePage({
  level,
  nextLevel,
  onOpenLevel,
  onBackToLevelSelect,
  onLevelCleared,
}: GamePageProps) {
  const { state, pick, hint, restart } = useGameSession(level, onLevelCleared);
  const activeHintId = state.activeHint?.regionId;
  const hintRegion = level.differences.find((difference) => difference.id === activeHintId) ?? null;

  return (
    <main>
      <GameHeader
        levelId={level.id}
        foundCount={state.foundIds.length}
        totalCount={level.differences.length}
        remainingSeconds={Math.ceil(getRemainingMs(state) / 1000)}
        hintsLeft={state.hintsLeft}
        onHint={hint}
        onBackToLevelSelect={onBackToLevelSelect}
      />
      <GameBoard
        level={level}
        foundIds={state.foundIds}
        missMarks={state.missMarks}
        hintRegion={hintRegion}
        onPick={pick}
      />
      {state.clearTimeMs !== null && (
        <ResultModal
          clearTimeMs={state.clearTimeMs}
          onNextLevel={nextLevel ? () => onOpenLevel(nextLevel) : null}
          onReplay={restart}
          onBackToLevelSelect={onBackToLevelSelect}
        />
      )}
      {state.status === 'timeUp' && <TimeUpModal onRetry={restart} />}
    </main>
  );
}
