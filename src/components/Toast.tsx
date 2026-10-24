import React, { useEffect } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { InfoIcon } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClear: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClear }) => {
  const reduced = useReducedMotion();
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClear();
    }, 2400);
    return () => clearTimeout(timer);
  }, [message, onClear]);

  return (
    <AnimatePresence>
      {message && <motion.div key={message} className="toast-notification active toast-motion" id="app-toast"
        role="status" aria-live="polite"
        initial={{ opacity: 0, transform: reduced ? 'translateX(-50%)' : 'translate(-50%, 8px)' }}
        animate={{ opacity: 1, transform: 'translate(-50%, 0px)' }}
        exit={{ opacity: 0, transform: reduced ? 'translateX(-50%)' : 'translate(-50%, 8px)' }}
        transition={{ duration: 0.18 }}>
        <InfoIcon size={18} aria-hidden="true" /> <span>{message}</span>
      </motion.div>}
    </AnimatePresence>
  );
};
