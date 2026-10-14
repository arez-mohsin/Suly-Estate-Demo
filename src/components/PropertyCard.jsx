import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import styles from './PropertyCard.module.css';
import { Icons } from './Icons';
import { ImageReveal } from './Motion';
import { ResponsiveImage } from './ResponsiveImage';

const MotionLink = motion.create ? motion.create(Link) : motion(Link);

export const PropertyCard = ({ property }) => {
  const { t } = useTranslation();

  return (
    <MotionLink
      to={`/properties/${property.slug}`}
      className={styles.card}
      data-qa="property-card"
      data-qa-slug={property.slug}
      whileTap={{ scale: 0.995, transition: { duration: 0.1 } }}
    >
      <div className={styles.imageWrapper}>
        <ImageReveal scale={1.025} duration={1.0} className={styles.imageRevealContainer}>
          <ResponsiveImage 
            src={property.heroImage || property.image} 
            alt={property.heroImageAlt || property.name} 
            preset="card"
            loading="lazy"
            decoding="async"
            className={styles.image}
            width={896}
            height={1200}
          />
        </ImageReveal>
      </div>
      
      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.name}>{property.name}</h3>
          <span className={styles.location}>{property.approximateLocation || property.location}</span>
        </div>
        
        <div className={styles.facts}>
          <span><bdi dir="ltr">{property.bedrooms}</bdi> {t('common.beds')}</span>
          <span className={styles.dot}>•</span>
          <span><bdi dir="ltr">{property.bathrooms}</bdi> {t('common.baths')}</span>
          <span className={styles.dot}>•</span>
          <span><bdi dir="ltr">{property.interiorArea} m²</bdi></span>
        </div>

        <div className={styles.footer}>
          <span className={styles.price}><bdi dir="ltr">{property.price}</bdi></span>
          <span className={styles.arrow}><Icons.ArrowRight /></span>
        </div>
      </div>
    </MotionLink>
  );
};
