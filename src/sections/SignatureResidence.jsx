import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './SignatureResidence.module.css';
import { Button } from '../components/Button';
import { EditorialImageReveal, Stagger, StaggerItem, TextReveal, Divider } from '../components/Motion';

export const SignatureResidence = () => {
  const { t } = useTranslation();

  return (
    <section className={styles.section} data-header-theme="dark">
      <Divider className={styles.divider} />
      <div className={styles.container}>
        <div className={styles.imageWrapper}>
          <EditorialImageReveal theme="dark">
            <img 
              src="/images/goizha-living.jpg" 
              alt={t('signature.imageAlt')} 
              loading="lazy"
              decoding="async"
              className={styles.image}
            />
          </EditorialImageReveal>
        </div>
        
        <Stagger className={styles.content} staggerDelay={0.06} delay={0.1}>
          <StaggerItem>
            <p className={`eyebrow ${styles.eyebrow}`}>{t('signature.eyebrow')}</p>
          </StaggerItem>
          <TextReveal as="h2" text={t('signature.title')} className={`display-2 ${styles.title}`} />
          <StaggerItem y={12}>
            <p className={styles.location}>{t('signature.location')}</p>
          </StaggerItem>
          <StaggerItem y={12}>
            <p className={styles.description}>
              {t('signature.description')}
            </p>
          </StaggerItem>
          
          <StaggerItem y={12}>
            <div className={styles.actions}>
              <Button as={Link} to="/properties/goizha-residence" variant="primary">{t('signature.cta')}</Button>
            </div>
          </StaggerItem>
        </Stagger>
      </div>
    </section>
  );
};
