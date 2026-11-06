import { useState } from 'react';
import { GamePage } from './GamePage';
import { HomePage } from './HomePage';
import { LevelSelectPage } from './LevelSelectPage';
import type { Level } from './game/types';
import { levels } from './levels';

type Screen =
  | { name: 'home' }
  | { name: 'levelSelect' }
  | { name: 'game'; level: Level };

export function App() {
  const [screen, setScreen] = useState<Screen>({ name: 'home' });

  if (screen.name === 'game') {
    return (
      <GamePage
        level={screen.level}
        onBackToLevelSelect={() => setScreen({ name: 'levelSelect' })}
      />
    );
  }

  if (screen.name === 'levelSelect') {
    return (
      <LevelSelectPage
        levels={levels}
        onSelectLevel={(level) => setScreen({ name: 'game', level })}
      />
    );
  }

  return <HomePage onStart={() => setScreen({ name: 'levelSelect' })} />;
}
