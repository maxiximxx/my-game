import { Modal } from './Modal';

interface ResultModalProps {
  clearTimeMs: number;
  onBackToLevelSelect: () => void;
}

export function ResultModal({ clearTimeMs, onBackToLevelSelect }: ResultModalProps) {
  return (
    <Modal title="通关">
      <p>通关用时 {(clearTimeMs / 1000).toFixed(1)} 秒</p>
      <button type="button" onClick={onBackToLevelSelect}>
        返回选关
      </button>
    </Modal>
  );
}
