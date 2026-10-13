import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './PropertyLocationMap.module.css';
import { Stagger, StaggerItem, Reveal, TextReveal } from '../components/Motion';
import { InteractiveMap } from '../components/InteractiveMap';

export const PropertyLocationMap = () => {
  const { t } = useTranslation();

  return (
    <section className={styles.section} id="locations" data-header-theme="dark">
      <div className={styles.container}>
        <Stagger className={styles.header} staggerDelay={0.06}>
          <StaggerItem>
            <p className="eyebrow">{t('locationsMap.eyebrow')}</p>
          </StaggerItem>
          <TextReveal as="h2" text={t('locationsMap.title')} className="display-3" />
          <StaggerItem y={12}>
            <p className={styles.description}>
              {t('locationsMap.description')}
            </p>
          </StaggerItem>
        </Stagger>
        <Reveal y={8} delay={0.2} className={styles.mapWrapper}>
          <InteractiveMap
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d103328.71804598914!2d45.36780373024844!3d35.565403565135116!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40002d9bb47e3831%3A0xc36a75f8f845014b!2sSulaymaniyah%2C%20Kurdistan%20Region%2C%20Iraq!5e0!3m2!1sen!2sus!4v1714571987541!5m2!1sen!2sus"
            title={t('locationsMap.mapTitle')}
            dataQaWrapper="homepage-map-wrapper"
            dataQaIframe="homepage-map-iframe"
          />
        </Reveal>
      </div>
    </section>
  );
};
