interface ResultModalProps {
  clearTimeMs: number;
  onBackToLevelSelect: () => void;
}

export function ResultModal({ clearTimeMs, onBackToLevelSelect }: ResultModalProps) {
  return (
    <div className="modal-backdrop">
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="result-title">
        <h2 id="result-title">通关</h2>
        <p>通关用时 {(clearTimeMs / 1000).toFixed(1)} 秒</p>
        <button type="button" onClick={onBackToLevelSelect}>
          返回选关
        </button>
      </div>
    </div>
  );
}
