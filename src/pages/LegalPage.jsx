import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Reveal, TextReveal } from '../components/Motion';
import { PageTransition } from '../components/PageTransition';
import styles from './LegalPage.module.css';

export const LegalPage = ({ type }) => {
  const { t } = useTranslation();
  const title = type === 'privacy' ? t('legal.privacyTitle') : t('legal.termsTitle');

  useEffect(() => {
    document.title = type === 'privacy' ? t('meta.titlePrivacy') : t('meta.titleTerms');
  }, [type, t]);

  return (
    <PageTransition 
      className={styles.legalPage}
      data-header-theme="dark"
    >
      <Reveal>
        <TextReveal as="h1" className="display-2" text={title} />
      </Reveal>
      <Reveal delay={0.2}>
        <div className={styles.content}>
          {type === 'privacy' ? (
            <>
              <p>{t('legal.privacyP1')}</p>
              <p>{t('legal.privacyP2')}</p>
              <p>{t('legal.privacyP3')}</p>
            </>
          ) : (
            <>
              <p>{t('legal.termsP1')}</p>
              <p>{t('legal.termsP2')}</p>
              <p>{t('legal.termsP3')}</p>
            </>
          )}
        </div>
      </Reveal>
    </PageTransition>
  );
};
