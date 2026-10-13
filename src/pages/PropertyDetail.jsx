import React, { useState, useEffect, Suspense, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { usePerformanceProfile } from '../hooks/usePerformanceProfile';
import { useLocalizedProperty, useLocalizedProperties } from '../hooks/useLocalizedProperties';
import { Button } from '../components/Button';
import { PropertyCard } from '../components/PropertyCard';
import { PropertyCarousel } from '../components/PropertyCarousel';
import { PhotoTour } from '../components/PhotoTour';
import { Reveal, TextReveal, Stagger, StaggerItem, Divider } from '../components/Motion';
import { PageTransition } from '../components/PageTransition';
import { InteractiveMap } from '../components/InteractiveMap';
import styles from './PropertyDetail.module.css';

// Lazy load the lightbox wrapper to prevent plugin loading errors
const PropertyLightbox = React.lazy(() => import('../components/PropertyLightbox'));

export function PropertyDetail() {
  const { slug } = useParams();
  const { t } = useTranslation();
  const property = useLocalizedProperty(slug);
  const allProperties = useLocalizedProperties();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isFooterVisible, setIsFooterVisible] = useState(false);

  useEffect(() => {
    if (property) {
      document.title = `${property.name} | SULY ESTATES`;
    }
  }, [property]);

  useEffect(() => {
    const footer = document.querySelector('footer');
    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFooterVisible(entry.isIntersecting);
      },
      { rootMargin: '0px', threshold: 0.01 }
    );

    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  });
  const { allowParallax } = usePerformanceProfile();
  
  const y = useTransform(scrollYProgress, [0, 1], ['0%', allowParallax ? '15%' : '0%']);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, allowParallax ? 0.5 : 1]);

  if (!property) {
    return (
      <main className={styles.notFound}>
        <h1 className="display-3">{t('propertyDetail.notFoundTitle')}</h1>
        <p>{t('propertyDetail.notFoundDesc')}</p>
        <div className={styles.notFoundActions}>
          <Button as={Link} to="/properties">{t('propertyDetail.browseProperties')}</Button>
          <Button as={Link} to="/" variant="transparent">{t('propertyDetail.returnHome')}</Button>
        </div>
      </main>
    );
  }

  const relatedProperties = allProperties.filter(p => p.id !== property.id).slice(0, 3);

  return (
    <PageTransition className={styles.detailPage}>
      <section ref={heroRef} className={styles.hero} data-header-theme="transparent">
        <motion.div style={{ y, opacity, width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
          <PropertyCarousel images={property.gallery} onImageClick={openLightbox} />
        </motion.div>
        
        <div className={styles.heroContent}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Link to="/properties" className={styles.backLink}>{t('propertyDetail.backLink')}</Link>
          </motion.div>
          <TextReveal
            as="h1"
            className={`display-2 ${styles.title}`}
            text={property.name}
          />
          <Reveal delay={0.2}>
            <div className={styles.heroMeta}>
              <span>{property.neighborhood}, {property.city}</span>
              <span className={styles.heroPrice}><bdi dir="ltr">{property.price}</bdi></span>
            </div>
          </Reveal>
        </div>
      </section>

      <div className={styles.contentGrid}>
        <div className={styles.mainContent}>
          <section className={styles.section} data-header-theme="dark">
            <Stagger staggerDelay={0.05} delay={0.1} className={styles.factsGrid}>
              <StaggerItem y={12} className={styles.fact}>
                <span className="eyebrow">{t('common.bedrooms')}</span>
                <span className={styles.factValue}><bdi dir="ltr">{property.bedrooms}</bdi></span>
              </StaggerItem>
              <StaggerItem y={12} className={styles.fact}>
                <span className="eyebrow">{t('common.bathrooms')}</span>
                <span className={styles.factValue}><bdi dir="ltr">{property.bathrooms}</bdi></span>
              </StaggerItem>
              <StaggerItem y={12} className={styles.fact}>
                <span className="eyebrow">{t('common.interiorArea')}</span>
                <span className={styles.factValue}><bdi dir="ltr">{property.interiorArea} m²</bdi></span>
              </StaggerItem>
              <StaggerItem y={12} className={styles.fact}>
                <span className="eyebrow">{t('common.plotArea')}</span>
                <span className={styles.factValue}><bdi dir="ltr">{property.plotArea} m²</bdi></span>
              </StaggerItem>
              <StaggerItem y={12} className={styles.fact}>
                <span className="eyebrow">{t('common.propertyType')}</span>
                <span className={styles.factValue}>{property.type}</span>
              </StaggerItem>
            </Stagger>
          </section>

          <section data-header-theme="dark">
            <Reveal delay={0.1}>
              <PhotoTour images={property.gallery} onImageClick={openLightbox} />
            </Reveal>
          </section>

          <section className={styles.descriptionSection} data-header-theme="dark">
            <TextReveal as="h2" text={t('propertyDetail.overview')} className="display-3" />
            <Reveal y={14} delay={0.1}>
              <div className={styles.descriptionText}>
                {property.description.split('\n\n').map((p, i) => <p key={i}>{p}</p>)}
              </div>
            </Reveal>
          </section>

          <section className={styles.featuresSection} data-header-theme="dark">
            <Stagger staggerDelay={0.03}>
              <div className={styles.featuresCol}>
                <StaggerItem y={12}>
                  <h3 className="eyebrow">{t('propertyDetail.highlights')}</h3>
                </StaggerItem>
                <ul className={styles.featureList}>
                  {property.highlights.map((h, i) => (
                    <StaggerItem as="li" key={i} y={10}>{h}</StaggerItem>
                  ))}
                </ul>
              </div>
            </Stagger>
            <Stagger staggerDelay={0.03} delay={0.1}>
              <div className={styles.featuresCol}>
                <StaggerItem y={12}>
                  <h3 className="eyebrow">{t('propertyDetail.amenities')}</h3>
                </StaggerItem>
                <ul className={styles.featureList}>
                  {property.amenities.map((a, i) => (
                    <StaggerItem as="li" key={i} y={10}>{a}</StaggerItem>
                  ))}
                </ul>
              </div>
            </Stagger>
          </section>

          <section className={styles.locationSection} data-header-theme="dark">
            <Reveal>
              <h2 className="display-3">{t('propertyDetail.approximateArea')}</h2>
              <p className={styles.locationMeta}>{property.approximateLocation}</p>
              <Reveal delay={0.2}>
                <div className={styles.mapContainer} data-qa="property-map-wrapper">
                  <InteractiveMap
                    src={property.mapUrl}
                    title={t('propertyDetail.mapTitle', { name: property.neighborhood })}
                    dataQaWrapper="property-map-wrapper"
                    dataQaIframe="property-map-iframe"
                  />
                </div>
              </Reveal>
              <div className={styles.mapDisclosure} data-qa="property-map-disclosure">
                {t('propertyDetail.mapDisclosure')}
              </div>
            </Reveal>
          </section>
        </div>

        <aside className={styles.sidebar}>
          <motion.div
            className={`${styles.stickyCard} ${isFooterVisible ? styles.hiddenMobile : ''}`}
            data-qa="property-sticky-inquiry-bar"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className={styles.stickyPrice}><bdi dir="ltr">{property.price}</bdi></h3>
            <Button 
              className={styles.inquireBtn}
              onClick={() => window.dispatchEvent(new CustomEvent('open-consultation', { detail: { intent: 'details', propertyName: property.name, propertySlug: property.slug } }))}
              data-qa="property-request-details"
            >
              {t('propertyDetail.requestDetails')}
            </Button>
            <Button 
              variant="transparent" 
              className={styles.viewingBtn}
              onClick={() => window.dispatchEvent(new CustomEvent('open-consultation', { detail: { intent: 'viewing', propertyName: property.name, propertySlug: property.slug } }))}
              data-qa="property-arrange-viewing"
            >
              {t('propertyDetail.arrangeViewing')}
            </Button>
          </motion.div>
        </aside>
      </div>
      
      <section className={styles.related} data-header-theme="dark">
        <Divider className={styles.relatedDivider} />
        <TextReveal as="h2" text={t('propertyDetail.youMayAlsoLike')} className="display-3" style={{marginBottom: '24px'}} />
        <Stagger staggerDelay={0.06} delay={0.1}>
          <div className={styles.relatedGrid}>
            {relatedProperties.map(p => (
              <StaggerItem key={p.id} y={14}>
                <PropertyCard property={p} />
              </StaggerItem>
            ))}
          </div>
        </Stagger>
      </section>

      {/* Lightbox Portal */}
      {lightboxOpen && (
        <Suspense fallback={null}>
          <PropertyLightbox
            open={lightboxOpen}
            close={() => setLightboxOpen(false)}
            index={lightboxIndex}
            slides={property.gallery}
            data-qa="property-lightbox"
          />
        </Suspense>
      )}
    </PageTransition>
  );
}
