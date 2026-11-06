import type { Level } from './game/types';
import { isAllCleared, isLevelUnlocked } from './game/progress';
import type { Progress } from './game/progress';

interface LevelSelectPageProps {
  levels: readonly Level[];
  progress: Progress;
  onSelectLevel: (level: Level) => void;
}

export function LevelSelectPage({ levels, progress, onSelectLevel }: LevelSelectPageProps) {
  return (
    <main>
      <h1>选关</h1>
      {isAllCleared(progress, levels.length) && <p>全部通关</p>}
      <ul className="level-list">
        {levels.map((level) => {
          const unlocked = isLevelUnlocked(progress, level.id);
          return (
            <li key={level.id}>
              <button
                type="button"
                disabled={!unlocked}
                onClick={() => onSelectLevel(level)}
              >
                {unlocked ? `第 ${level.id} 关` : `第 ${level.id} 关（锁定）`}
              </button>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
