import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { createLocalProgressStore } from './game/progressStore';
import './styles.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('找不到挂载节点 #root');
}

createRoot(rootElement).render(
  <StrictMode>
    <App progressStore={createLocalProgressStore(window.localStorage)} />
  </StrictMode>,
);
