import { formatSeconds } from './format';
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
    <Modal title="通关" tone="success">
      <p className="modal-stat">
        通关用时 <strong>{formatSeconds(clearTimeMs)}</strong> 秒
      </p>
      <div className="modal-actions">
        <button type="button" className="btn" onClick={onReplay}>
          重玩
        </button>
        {onNextLevel ? (
          <button type="button" className="btn btn-primary" onClick={onNextLevel}>
            下一关
          </button>
        ) : (
          <button type="button" className="btn btn-primary" onClick={onBackToLevelSelect}>
            返回选关
          </button>
        )}
      </div>
    </Modal>
  );
}
