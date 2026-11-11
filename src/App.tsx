import { useState } from 'react';
import { GamePage } from './pages/GamePage';
import { HomePage } from './pages/HomePage';
import { LevelSelectPage } from './pages/LevelSelectPage';
import type { ProgressStore } from './storage/progressStore';
import { useProgress } from './hooks/useProgress';
import type { Level } from './domain/types';
import { levels } from './levels';

type Screen =
  | { name: 'home' }
  | { name: 'levelSelect' }
  | { name: 'game'; level: Level };

interface AppProps {
  progressStore: ProgressStore;
}

export function App({ progressStore }: AppProps) {
  const [screen, setScreen] = useState<Screen>({ name: 'home' });
  const { progress, recordClear, resetProgress } = useProgress(progressStore);

  if (screen.name === 'game') {
    const currentId = screen.level.id;
    const nextLevel = levels.find((candidate) => candidate.id === currentId + 1) ?? null;
    return (
      <GamePage
        key={currentId}
        level={screen.level}
        nextLevel={nextLevel}
        onOpenLevel={(level) => setScreen({ name: 'game', level })}
        onBackToLevelSelect={() => setScreen({ name: 'levelSelect' })}
        onLevelCleared={recordClear}
      />
    );
  }

  if (screen.name === 'levelSelect') {
    return (
      <LevelSelectPage
        levels={levels}
        progress={progress}
        onSelectLevel={(level) => setScreen({ name: 'game', level })}
        onResetProgress={resetProgress}
      />
    );
  }

  return <HomePage onStart={() => setScreen({ name: 'levelSelect' })} />;
}
