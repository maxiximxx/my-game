import type { Level } from './game/types';
import { formatSeconds } from './game/format';
import { getBestTimeMs, isAllCleared, isLevelUnlocked } from './game/progress';
import type { Progress } from './game/progress';

interface LevelSelectPageProps {
  levels: readonly Level[];
  progress: Progress;
  onSelectLevel: (level: Level) => void;
  onResetProgress: () => void;
}

export function LevelSelectPage({
  levels,
  progress,
  onSelectLevel,
  onResetProgress,
}: LevelSelectPageProps) {
  return (
    <main>
      <h1>选关</h1>
      {isAllCleared(progress, levels.length) && <p>全部通关</p>}
      <button type="button" onClick={onResetProgress}>
        清除进度
      </button>
      <ul className="level-list">
        {levels.map((level) => {
          const unlocked = isLevelUnlocked(progress, level.id);
          const bestTimeMs = getBestTimeMs(progress, level.id);
          return (
            <li key={level.id}>
              <button
                type="button"
                disabled={!unlocked}
                onClick={() => onSelectLevel(level)}
              >
                {unlocked ? `第 ${level.id} 关` : `第 ${level.id} 关（锁定）`}
              </button>
              <span>
                {bestTimeMs === null ? '未通关' : `最佳用时 ${formatSeconds(bestTimeMs)} 秒`}
              </span>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
