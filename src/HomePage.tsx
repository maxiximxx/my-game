interface HomePageProps {
  onStart: () => void;
}

export function HomePage({ onStart }: HomePageProps) {
  return (
    <main>
      <h1>大家来找茬</h1>
      <button type="button" onClick={onStart}>
        开始游戏
      </button>
    </main>
  );
}
