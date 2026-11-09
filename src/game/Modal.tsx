import type { ReactNode } from 'react';

interface ModalProps {
  title: string;
  /** 决定标题标签的颜色：success 为通关，warning 为超时。 */
  tone?: 'success' | 'warning';
  children: ReactNode;
}

export function Modal({ title, tone, children }: ModalProps) {
  const className = tone ? `modal is-${tone}` : 'modal';

  return (
    <div className="modal-backdrop">
      <div className={className} role="dialog" aria-modal="true" aria-label={title}>
        <h2 className="modal-title">{title}</h2>
        {children}
      </div>
    </div>
  );
}
