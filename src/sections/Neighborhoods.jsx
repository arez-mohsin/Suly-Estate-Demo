import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './Neighborhoods.module.css';
import { useLocalizedLocations } from '../hooks/useLocalizedProperties';
import { Reveal, Stagger, StaggerItem, ImageReveal, TextReveal } from '../components/Motion';

export const Neighborhoods = () => {
  const { t } = useTranslation();
  const locations = useLocalizedLocations();

  return (
    <section className={styles.section} id="neighborhoods" data-header-theme="dark">
      <header className={styles.header}>
        <TextReveal as="h2" text={t('neighborhoods.title')} className={`display-3 ${styles.title}`} />
        <Reveal delay={0.1}>
          <p className={styles.description}>
            {t('neighborhoods.description')}
          </p>
        </Reveal>
      </header>
      
      <Stagger staggerDelay={0.06} delay={0.2} className={styles.grid}>
        {locations.map(location => (
          <StaggerItem key={location.id} y={16}>
            <Link to="/#locations" className={styles.card}>
              <ImageReveal scale={1.025} duration={1.0} className={styles.imageRevealContainer}>
                <img 
                  src={location.image} 
                  alt={location.imageAlt} 
                  loading="lazy"
                  decoding="async"
                  className={styles.image}
                />
              </ImageReveal>
              <div className={styles.overlay}>
                <h3 className={styles.name}>{location.name}</h3>
                <p className={styles.desc}>{location.description}</p>
              </div>
            </Link>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
};
