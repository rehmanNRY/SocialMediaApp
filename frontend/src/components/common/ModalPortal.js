import { createPortal } from 'react-dom';

const ModalPortal = ({ children, giveBg = false }) => {
  if (typeof window === 'undefined') return null;

  return createPortal(
    <div className={`fixed inset-0 z-[9999] pointer-events-none ${giveBg && 'bg-black/40 backdrop-blur-sm'}`}>
      <div className="pointer-events-auto">
        {children}
      </div>
    </div>,
    document.body
  );
};

export default ModalPortal; 