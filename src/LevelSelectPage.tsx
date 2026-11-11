import type { Level } from './game/types';
import { formatSeconds } from './game/format';
import { getBestTimeMs, getClearedCount, isAllCleared, isLevelUnlocked } from './game/progress';
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
  const allCleared = isAllCleared(progress, levels.length);

  return (
    <main className="select-page">
      <header className="page-head">
        <h1>选关</h1>
        <p className={allCleared ? 'status-pill is-complete' : 'status-pill'}>
          {allCleared ? '全部通关' : `已通关 ${getClearedCount(progress)}/${levels.length}`}
        </p>
      </header>

      <ul className="level-grid">
        {levels.map((level) => {
          const unlocked = isLevelUnlocked(progress, level.id);
          const bestTimeMs = getBestTimeMs(progress, level.id);
          const tileClass = [
            'level-tile',
            unlocked ? '' : 'is-locked',
            bestTimeMs === null ? '' : 'is-cleared',
          ]
            .filter(Boolean)
            .join(' ');

          return (
            <li key={level.id}>
              <button
                type="button"
                className={tileClass}
                disabled={!unlocked}
                onClick={() => onSelectLevel(level)}
              >
                <span className="tile-frame">
                  <img src={level.originalImage} alt="" loading="lazy" />
                </span>
                <span className="tile-title">第 {level.id} 关</span>
                <span className="tile-meta">
                  {!unlocked && '锁定'}
                  {unlocked && bestTimeMs === null && '未通关'}
                  {unlocked && bestTimeMs !== null && `最佳 ${formatSeconds(bestTimeMs)} 秒`}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <footer className="page-foot">
        <button type="button" className="btn btn-ghost" onClick={onResetProgress}>
          清除进度
        </button>
      </footer>
    </main>
  );
}
