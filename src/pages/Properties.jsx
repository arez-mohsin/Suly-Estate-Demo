import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocalizedProperties } from '../hooks/useLocalizedProperties';
import { PropertyCard } from '../components/PropertyCard';
import { Reveal, TextReveal, Stagger, StaggerItem } from '../components/Motion';
import { PageTransition } from '../components/PageTransition';
import styles from './Properties.module.css';

export function Properties() {
  const { t } = useTranslation();
  const properties = useLocalizedProperties();

  useEffect(() => {
    document.title = t('meta.titleProperties');
  }, [t]);

  return (
    <PageTransition
      className={styles.page}
      data-header-theme="dark"
    >
      <div className={styles.container}>
        <div className={styles.header}>
          <TextReveal 
            as="h1" 
            className={`display-2 ${styles.title}`} 
            text={t('propertiesPage.title')} 
          />
          <Reveal delay={0.2}>
            <p className={styles.description}>
              {t('propertiesPage.description')}
            </p>
          </Reveal>
        </div>
        
        <Stagger staggerDelay={0.06} delay={0.3} className={styles.grid}>
          {properties.map((property) => (
            <StaggerItem key={property.id} y={16}>
              <PropertyCard property={property} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </PageTransition>
  );
}
