import { Modal } from './Modal';

interface TimeUpModalProps {
  onRetry: () => void;
}

export function TimeUpModal({ onRetry }: TimeUpModalProps) {
  return (
    <Modal title="时间到" tone="warning">
      <p>这一关没有在 60 秒内找齐。</p>
      <div className="modal-actions">
        <button type="button" className="btn btn-primary" onClick={onRetry}>
          重新挑战
        </button>
      </div>
    </Modal>
  );
}
