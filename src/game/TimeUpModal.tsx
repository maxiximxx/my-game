import { Modal } from './Modal';

interface TimeUpModalProps {
  onRetry: () => void;
}

export function TimeUpModal({ onRetry }: TimeUpModalProps) {
  return (
    <Modal title="时间到">
      <button type="button" onClick={onRetry}>
        重新挑战
      </button>
    </Modal>
  );
}
