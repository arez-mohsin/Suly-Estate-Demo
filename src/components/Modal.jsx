/* eslint-disable react-refresh/only-export-components */
import React, { useEffect, useRef, useState, createContext, useContext } from 'react';
import { createPortal } from 'react-dom';
import styles from './Modal.module.css';
import { Icons } from './Icons';
import { motion, AnimatePresence } from 'framer-motion';
import { useSmoothScroll } from '../providers/SmoothScrollProvider';
import { useTranslation } from 'react-i18next';

const ModalPortalContext = createContext(null);
export const useModalPortal = () => useContext(ModalPortalContext);

export const Modal = ({ isOpen, onClose, children, dataQa }) => {
  const { t } = useTranslation();
  const dialogRef = useRef(null);
  const portalRef = useRef(null);
  const [portalElement, setPortalElement] = useState(null);
  const { lenis } = useSmoothScroll();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (lenis) lenis.stop();
      document.body.style.overflow = 'hidden';
      // showModal provides native backdrop, focus trap, and escape key handling
      dialog.showModal();
    } else {
      if (lenis) lenis.start();
      document.body.style.overflow = '';
      dialog.close();
    }

    return () => {
      if (lenis) lenis.start();
      document.body.style.overflow = '';
    };
  }, [isOpen, lenis]);

  useEffect(() => {
    if (portalRef.current) {
      setPortalElement(portalRef.current);
    }
  }, [isOpen]);

  // Handle click on backdrop to close
  const handleBackdropClick = (e) => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    
    const rect = dialog.getBoundingClientRect();
    const isInDialog = (
      rect.top <= e.clientY &&
      e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX &&
      e.clientX <= rect.left + rect.width
    );
    
    if (!isInDialog) {
      onClose();
    }
  };

  // Close event fired by native Escape key
  const handleNativeClose = () => {
    onClose();
  };

  return createPortal(
    <dialog 
      ref={dialogRef} 
      className={styles.dialog}
      onClick={handleBackdropClick}
      onClose={handleNativeClose}
      aria-modal="true"
      data-qa={dataQa}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className={styles.content}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] } }}
            exit={{ opacity: 0, y: 12, transition: { duration: 0.2, ease: 'easeIn' } }}
            onClick={(e) => e.stopPropagation()} // Prevent bubbling to backdrop
            data-lenis-prevent="true"
          >
            <button 
              className={styles.closeButton} 
              onClick={onClose}
              aria-label={t('common.close')}
              data-qa="consultation-close"
            >
              <Icons.Close />
            </button>
            <ModalPortalContext.Provider value={portalElement}>
              {children}
            </ModalPortalContext.Provider>
            <div ref={portalRef} className={styles.portalContainer} />
          </motion.div>
        )}
      </AnimatePresence>
    </dialog>,
    document.body
  );
};
