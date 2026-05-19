import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
            onClick={onClose}
          />
          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-[0_24px_90px_rgba(15,23,42,0.28)] dark:border-white/10 dark:bg-[#111827]/95 dark:shadow-[0_24px_90px_rgba(0,0,0,0.48)]"
          >
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-6 py-5 dark:border-white/10 dark:bg-white/[0.025]">
              <h2
                id="modal-title"
                className="text-lg font-semibold tracking-normal text-slate-950 dark:text-white"
              >
                {title}
              </h2>
              <button
                onClick={onClose}
                aria-label="Close modal"
                className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-200/70 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:hover:bg-white/10 dark:hover:text-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="bg-white px-6 py-6 dark:bg-transparent">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
