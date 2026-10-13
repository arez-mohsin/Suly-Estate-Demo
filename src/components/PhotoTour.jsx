import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Stagger } from './Motion';
import { usePerformanceProfile } from '../hooks/usePerformanceProfile';
import styles from './PhotoTour.module.css';

const EASE_PREMIUM = [0.21, 0.47, 0.32, 0.98];

export const PhotoTour = ({ images, onImageClick }) => {
  const { t } = useTranslation();
  const { reduceMotion } = usePerformanceProfile();

  const itemVariants = {
    hidden: { opacity: 0, scale: reduceMotion ? 1 : 0.985 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.6, ease: EASE_PREMIUM }
    }
  };

  return (
    <div className={styles.photoTour}>
      <div className={styles.header}>
        <h3 className="eyebrow">{t('propertyDetail.photoTour')}</h3>
      </div>
      <Stagger className={styles.rail} staggerDelay={0.05} delay={0.1}>
        {images.map((img, index) => (
          <motion.button 
            key={index} 
            className={styles.thumbnailBtn}
            onClick={() => onImageClick(index)}
            aria-label={t('common.viewFullImage', { alt: img.alt })}
            variants={itemVariants}
          >
            <img 
              src={img.src} 
              alt={img.alt} 
              loading="lazy" 
              className={styles.thumbnailImg}
            />
          </motion.button>
        ))}
      </Stagger>
    </div>
  );
};
