import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './FeaturedListings.module.css';
import { PropertyCard } from '../components/PropertyCard';
import { Button } from '../components/Button';
import { useLocalizedProperties } from '../hooks/useLocalizedProperties';
import { Reveal, Stagger, StaggerItem, TextReveal } from '../components/Motion';

export const FeaturedListings = () => {
  const { t } = useTranslation();
  const properties = useLocalizedProperties();

  return (
    <section className={styles.section} id="properties" data-header-theme="dark">
      <div className={styles.header}>
        <div>
          <Reveal y={16}>
            <p className="eyebrow">{t('featured.eyebrow')}</p>
          </Reveal>
          <TextReveal as="h2" text={t('featured.title')} delay={0.1} className={`display-3 ${styles.title}`} />
        </div>
        <Reveal delay={0.2} y={10}>
          <Button as={Link} to="/properties" variant="link">{t('featured.viewAll')}</Button>
        </Reveal>
      </div>

      <Stagger staggerDelay={0.06} delay={0.2} className={styles.grid}>
        {properties.map(property => (
          <StaggerItem key={property.id} y={14}>
            <PropertyCard property={property} />
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
};
