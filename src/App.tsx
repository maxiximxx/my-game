import { useState } from 'react';
import { HomePage } from './HomePage';
import { LevelSelectPage } from './LevelSelectPage';

type Screen = 'home' | 'levelSelect';

export function App() {
  const [screen, setScreen] = useState<Screen>('home');

  if (screen === 'levelSelect') {
    return <LevelSelectPage />;
  }

  return <HomePage onStart={() => setScreen('levelSelect')} />;
}
