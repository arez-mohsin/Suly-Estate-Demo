import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './About.module.css';
import { Reveal, TextReveal } from '../components/Motion';

export const About = () => {
  const { t } = useTranslation();

  return (
    <section className={styles.section} id="about" data-header-theme="light">
      <div className={styles.container}>
        <div className={styles.content}>
          <TextReveal as="h2" className="display-3" text={t('about.title')} />
          <div className={styles.textColumns}>
            <Reveal delay={0.1} y={14}>
              <p className={styles.paragraph}>
                {t('about.p1')}
              </p>
            </Reveal>
            <Reveal delay={0.18} y={14}>
              <p className={styles.paragraph}>
                {t('about.p2')}
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
};
