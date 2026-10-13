import React from 'react';
import { Reveal, TextReveal } from '../components/Motion';
import { PageTransition } from '../components/PageTransition';
import styles from './LegalPage.module.css';

export const LegalPage = ({ title, type }) => {
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
              <p>
                This website is a demonstration and concept project.
              </p>
              <p>
                Form submissions are not actually delivered or processed. Any data entered into inquiry forms or elsewhere on this site is entirely local to your session and not stored, transmitted, or used for any production purpose.
              </p>
              <p>
                No production customer data processing occurs in this demo.
              </p>
            </>
          ) : (
            <>
              <p>
                This website is a demonstration and concept project designed for portfolio purposes.
              </p>
              <p>
                The properties, listings, prices, and specifications presented here are purely fictional or used for demonstration and do not represent actual real estate offerings.
              </p>
              <p>
                By using this demonstration, you acknowledge that Suly Estates is not a real entity and no real transactions, agreements, or obligations can be formed through this platform.
              </p>
            </>
          )}
        </div>
      </Reveal>
    </PageTransition>
  );
};
