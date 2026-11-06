import { GameBoard } from './game/GameBoard';
import { GameHeader } from './game/GameHeader';
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
      <GameHeader
        levelId={level.id}
        foundCount={state.foundIds.length}
        totalCount={level.differences.length}
        onBackToLevelSelect={onBackToLevelSelect}
      />
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
