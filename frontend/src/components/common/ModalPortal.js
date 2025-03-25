import { createPortal } from 'react-dom';

const ModalPortal = ({ children }) => {
  if (typeof window === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      <div className="pointer-events-auto">
        {children}
      </div>
    </div>,
    document.body
  );
};

export default ModalPortal; 