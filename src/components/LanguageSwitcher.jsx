import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { SUPPORTED_LANGUAGES, LANGUAGE_CONFIG } from '../i18n';
import styles from './LanguageSwitcher.module.css';

export const LanguageSwitcher = ({ variant = 'header', onSelectLanguage }) => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'en';
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('touchstart', handleOutsideClick);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (code) => {
    if (code !== currentLang) {
      i18n.changeLanguage(code);
    }
    setIsOpen(false);
    if (onSelectLanguage) {
      onSelectLanguage(code);
    }
  };

  if (variant === 'mobile') {
    return (
      <div className={styles.mobileContainer} data-qa="mobile-language-switcher">
        <div className={styles.mobileList}>
          {SUPPORTED_LANGUAGES.map((code) => {
            const config = LANGUAGE_CONFIG[code];
            const isSelected = currentLang === code;
            return (
              <button
                key={code}
                className={`${styles.mobileOption} ${isSelected ? styles.mobileSelected : ''}`}
                onClick={() => handleSelect(code)}
                lang={code}
                dir={config.dir}
                aria-pressed={isSelected}
                data-qa={`lang-option-${code}`}
              >
                <span>{config.name}</span>
                {isSelected && <span className={styles.mobileIndicator}>●</span>}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Header compact dropdown
  const currentConfig = LANGUAGE_CONFIG[currentLang] || LANGUAGE_CONFIG.en;

  return (
    <div className={styles.wrapper} ref={containerRef} data-qa="language-switcher">
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Select language"
        data-qa="language-switcher-trigger"
      >
        <span className={styles.triggerLabel}>{currentConfig.shortLabel}</span>
        <svg
          className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.dropdown}
            role="listbox"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            data-qa="language-dropdown"
          >
            {SUPPORTED_LANGUAGES.map((code) => {
              const config = LANGUAGE_CONFIG[code];
              const isSelected = currentLang === code;
              return (
                <button
                  key={code}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  lang={code}
                  dir={config.dir}
                  className={`${styles.option} ${isSelected ? styles.selected : ''}`}
                  onClick={() => handleSelect(code)}
                  data-qa={`lang-choice-${code}`}
                >
                  <span className={styles.optionName}>{config.name}</span>
                  {isSelected && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={styles.checkIcon}>
                      <path d="M2.5 6.5L4.5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
