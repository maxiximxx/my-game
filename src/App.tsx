import { useState } from 'react';
import { HomePage } from './HomePage';
import { LevelSelectPage } from './LevelSelectPage';

type Screen = 'home' | 'select';

export function App() {
  const [screen, setScreen] = useState<Screen>('home');

  if (screen === 'select') {
    return <LevelSelectPage />;
  }

  return <HomePage onStart={() => setScreen('select')} />;
}
