import { useEffect } from 'react';
import { GameBoard } from './game/GameBoard';
import { GameHeader } from './game/GameHeader';
import { ResultModal } from './game/ResultModal';
import { TimeUpModal } from './game/TimeUpModal';
import { getRemainingMs } from './game/rules';
import { useGameSession } from './game/useGameSession';
import type { Level } from './game/types';

interface GamePageProps {
  level: Level;
  onBackToLevelSelect: () => void;
  onLevelCleared: (levelId: number) => void;
}

export function GamePage({ level, onBackToLevelSelect, onLevelCleared }: GamePageProps) {
  const { state, pick, hint, retry } = useGameSession(level);
  const activeHintId = state.activeHint?.regionId;
  const hintRegion = level.differences.find((difference) => difference.id === activeHintId) ?? null;

  // 通关时把结果同步到进度存储（外部状态）。
  useEffect(() => {
    if (state.status === 'cleared') {
      onLevelCleared(level.id);
    }
  }, [state.status, level.id, onLevelCleared]);

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
          onBackToLevelSelect={onBackToLevelSelect}
        />
      )}
      {state.status === 'timeUp' && <TimeUpModal onRetry={retry} />}
    </main>
  );
}
