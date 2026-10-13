import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import styles from './OurApproach.module.css';
import { Reveal, TextReveal, EditorialImageReveal } from '../components/Motion';
import { usePerformanceProfile } from '../hooks/usePerformanceProfile';

const EASE_PREMIUM = [0.21, 0.47, 0.32, 0.98];

export const OurApproach = () => {
  const { t } = useTranslation();
  const { reduceMotion } = usePerformanceProfile();
  const quoteRef = useRef(null);
  const isQuoteInView = useInView(quoteRef, { once: true, margin: "-10% 0px" });

  return (
    <section className={styles.section} id="approach" data-header-theme="light">
      <div className={styles.container}>
        <div className={styles.content}>
          <TextReveal as="h2" text={t('approach.title')} className={`display-2 ${styles.title}`} />
          
          <Reveal y={14} delay={0.2}>
            <p className={styles.description}>
              {t('approach.description')}
            </p>
          </Reveal>
          
          <Reveal y={12} delay={0.3}>
            <blockquote className={styles.quote} ref={quoteRef}>
              {!reduceMotion && (
                <motion.div 
                  className={styles.quoteRule}
                  initial={{ scaleY: 0 }}
                  animate={isQuoteInView ? { scaleY: 1 } : { scaleY: 0 }}
                  transition={{ duration: 0.8, delay: 0.5, ease: EASE_PREMIUM }}
                />
              )}
              "{t('approach.quote')}"
            </blockquote>
          </Reveal>
        </div>
        
        <div className={styles.imageWrapper}>
          <EditorialImageReveal theme="light">
            <img 
              src="/images/approach.jpg" 
              alt={t('approach.imageAlt')} 
              loading="lazy"
              decoding="async"
              className={styles.image}
            />
          </EditorialImageReveal>
        </div>
      </div>
    </section>
  );
};
