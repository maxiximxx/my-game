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
}

export function GamePage({ level, onBackToLevelSelect }: GamePageProps) {
  const { state, pick, retry } = useGameSession(level);

  return (
    <main>
      <GameHeader
        levelId={level.id}
        foundCount={state.foundIds.length}
        totalCount={level.differences.length}
        remainingSeconds={Math.ceil(getRemainingMs(state) / 1000)}
        onBackToLevelSelect={onBackToLevelSelect}
      />
      <GameBoard level={level} foundIds={state.foundIds} onPick={pick} />
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
