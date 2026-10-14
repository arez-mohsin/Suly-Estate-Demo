import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './PrivateConsultation.module.css';
import { Button } from '../components/Button';
import { Stagger, StaggerItem, EditorialImageReveal, TextReveal } from '../components/Motion';
import { ResponsiveImage } from '../components/ResponsiveImage';

export const PrivateConsultation = () => {
  const { t } = useTranslation();

  return (
    <section className={styles.section} id="contact" data-header-theme="dark">
      <div className={styles.container}>
        <Stagger className={styles.content} staggerDelay={0.06}>
          <StaggerItem>
            <p className={`eyebrow ${styles.eyebrow}`}>{t('consultationSection.eyebrow')}</p>
          </StaggerItem>
          
          <TextReveal as="h2" text={t('consultationSection.title')} className={`display-2 ${styles.title}`} />
          
          <StaggerItem y={12}>
            <p className={styles.description}>
              {t('consultationSection.description')}
            </p>
          </StaggerItem>
          
          <StaggerItem y={12}>
            <Button variant="outline" onClick={() => window.dispatchEvent(new Event('open-consultation'))}>
              {t('consultationSection.cta')}
            </Button>
          </StaggerItem>
        </Stagger>

        <div className={styles.imageWrapper}>
          <EditorialImageReveal delay={0.1} theme="dark">
            <ResponsiveImage 
              src="/images/consultation-bg.jpg" 
              alt={t('consultationSection.imageAlt')} 
              preset="editorial"
              loading="lazy"
              decoding="async"
              className={styles.image}
              width={1024}
              height={1024}
            />
          </EditorialImageReveal>
        </div>
      </div>
    </section>
  );
};
