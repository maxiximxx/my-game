import type { Level } from './game/types';

interface LevelSelectPageProps {
  levels: readonly Level[];
  onSelectLevel: (level: Level) => void;
}

export function LevelSelectPage({ levels, onSelectLevel }: LevelSelectPageProps) {
  return (
    <main>
      <h1>选关</h1>
      <ul className="level-list">
        {levels.map((level) => (
          <li key={level.id}>
            <button type="button" onClick={() => onSelectLevel(level)}>
              第 {level.id} 关
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
