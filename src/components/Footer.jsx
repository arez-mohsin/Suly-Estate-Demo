import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './Footer.module.css';
import { Reveal, Stagger, StaggerItem } from './Motion';

export const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <Stagger className={styles.top} staggerDelay={0.05}>
          <StaggerItem y={10}>
            <Link to="/" className={`${styles.logo} brand-name`} dir="ltr">
              <span>SULY</span>
              <span>ESTATES</span>
            </Link>
          </StaggerItem>
          
          <StaggerItem y={10}>
            <div className={styles.address}>
              <p>{t('footer.city')}</p>
              <p>{t('footer.region')}</p>
            </div>
          </StaggerItem>
          
          <StaggerItem y={10} className={styles.links}>
            <div className={styles.linkGroup}>
              <Link to="/properties" className={styles.link}>{t('nav.properties')}</Link>
              <Link to="/#neighborhoods" className={styles.link}>{t('nav.neighborhoods')}</Link>
              <Link to="/#approach" className={styles.link}>{t('nav.approach')}</Link>
            </div>
            <div className={styles.linkGroup}>
              <Link to="/#about" className={styles.link}>{t('nav.about')}</Link>
              <Link to="/#contact" className={styles.link}>{t('common.contact')}</Link>
            </div>
          </StaggerItem>
        </Stagger>
        
        <Reveal y={0} duration={0.5} delay={0.2} className={styles.bottom}>
          <p className={styles.copyright}>{t('footer.rights', { year: new Date().getFullYear() })}</p>
          <div className={styles.legalLinks}>
            <Link to="/privacy" className={styles.link}>{t('footer.privacy')}</Link>
            <Link to="/terms" className={styles.link}>{t('footer.terms')}</Link>
          </div>
          <p className={styles.creatorCredit}>
            <span>{t('footer.builtBy')} </span>
            <span dir="ltr">Ahmed Wshyar</span>
          </p>
        </Reveal>
      </div>
    </footer>
  );
};
