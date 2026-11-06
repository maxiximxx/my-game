import { useCallback, useState } from 'react';
import { GamePage } from './GamePage';
import { HomePage } from './HomePage';
import { LevelSelectPage } from './LevelSelectPage';
import { createProgress, recordClear } from './game/progress';
import type { Progress } from './game/progress';
import type { Level } from './game/types';
import { levels } from './levels';

type Screen =
  | { name: 'home' }
  | { name: 'levelSelect' }
  | { name: 'game'; level: Level };

export function App() {
  const [screen, setScreen] = useState<Screen>({ name: 'home' });
  const [progress, setProgress] = useState<Progress>(createProgress);

  const handleLevelCleared = useCallback((levelId: number) => {
    setProgress((current) => recordClear(current, levelId, levels.length));
  }, []);

  if (screen.name === 'game') {
    return (
      <GamePage
        level={screen.level}
        onBackToLevelSelect={() => setScreen({ name: 'levelSelect' })}
        onLevelCleared={handleLevelCleared}
      />
    );
  }

  if (screen.name === 'levelSelect') {
    return (
      <LevelSelectPage
        levels={levels}
        progress={progress}
        onSelectLevel={(level) => setScreen({ name: 'game', level })}
      />
    );
  }

  return <HomePage onStart={() => setScreen({ name: 'levelSelect' })} />;
}
