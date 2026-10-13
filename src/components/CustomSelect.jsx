import React from 'react';
import * as Select from '@radix-ui/react-select';
import { Icons } from './Icons';
import { useModalPortal } from './Modal';
import styles from './CustomSelect.module.css';
import { motion } from 'framer-motion';

import { useTranslation } from 'react-i18next';

// Custom Chevron icon
const ChevronDown = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const CustomSelect = ({ 
  label, 
  name, 
  value, 
  onValueChange, 
  options = [], 
  placeholder, 
  id, 
  required, 
  disabled,
  dir
}) => {
  const portalContainer = useModalPortal();
  const { i18n } = useTranslation();
  const direction = dir || (i18n.language === 'en' ? 'ltr' : 'rtl');

  return (
    <div className={styles.wrapper}>
      {label && <label htmlFor={id} className={styles.label}>{label}</label>}
      <Select.Root 
        value={value} 
        onValueChange={onValueChange} 
        required={required}
        disabled={disabled}
        name={name}
        dir={direction}
      >
        <Select.Trigger className={styles.trigger} id={id} aria-label={label}>
          <Select.Value placeholder={placeholder} />
          <Select.Icon className={styles.icon}>
            <ChevronDown />
          </Select.Icon>
        </Select.Trigger>
        
        <Select.Portal container={portalContainer}>
          <Select.Content 
            className={styles.content} 
            position="popper" 
            sideOffset={4}
            collisionPadding={16}
            asChild
          >
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
            >
              <Select.Viewport className={styles.viewport}>
                {options.map((option) => (
                  <Select.Item 
                    key={option.value} 
                    value={option.value} 
                    className={styles.item}
                  >
                    <Select.ItemText>{option.label}</Select.ItemText>
                    <Select.ItemIndicator className={styles.itemIndicator}>
                      <Icons.Check size={14} />
                    </Select.ItemIndicator>
                  </Select.Item>
                ))}
              </Select.Viewport>
            </motion.div>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
};
