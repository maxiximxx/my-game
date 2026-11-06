import { Modal } from './Modal';

interface ResultModalProps {
  clearTimeMs: number;
  /** 下一关的入口；本关是最后一关时为 null，此时弹窗改为"返回选关"。 */
  onNextLevel: (() => void) | null;
  onReplay: () => void;
  onBackToLevelSelect: () => void;
}

export function ResultModal({
  clearTimeMs,
  onNextLevel,
  onReplay,
  onBackToLevelSelect,
}: ResultModalProps) {
  return (
    <Modal title="通关">
      <p>通关用时 {(clearTimeMs / 1000).toFixed(1)} 秒</p>
      <button type="button" onClick={onReplay}>
        重玩
      </button>
      {onNextLevel ? (
        <button type="button" onClick={onNextLevel}>
          下一关
        </button>
      ) : (
        <button type="button" onClick={onBackToLevelSelect}>
          返回选关
        </button>
      )}
    </Modal>
  );
}
