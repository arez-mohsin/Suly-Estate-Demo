import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from './Modal';
import { Button } from './Button';
import { CustomSelect } from './CustomSelect';
import { AnimatePresence, motion } from 'framer-motion';
import styles from './GlobalConsultationModal.module.css';

export const GlobalConsultationModal = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [intent, setIntent] = useState('');
  const [propertyName, setPropertyName] = useState('');
  const [propertySlug, setPropertySlug] = useState('');

  const [contactMethod, setContactMethod] = useState('whatsapp');
  const [interest, setInterest] = useState('buy');
  
  const formRef = useRef(null);

  const contactOptions = [
    { value: 'whatsapp', label: t('modal.contactOptions.whatsapp') },
    { value: 'phone', label: t('modal.contactOptions.phone') },
    { value: 'email', label: t('modal.contactOptions.email') }
  ];

  const interestOptions = [
    { value: 'details', label: t('modal.interestOptions.details') },
    { value: 'buy', label: t('modal.interestOptions.buy') },
    { value: 'sell', label: t('modal.interestOptions.sell') },
    { value: 'viewing', label: t('modal.interestOptions.viewing') },
    { value: 'other', label: t('modal.interestOptions.other') }
  ];

  useEffect(() => {
    const handleOpen = (e) => {
      let newIntent = '';
      if (e.detail) {
        newIntent = e.detail.intent || '';
        setPropertyName(e.detail.propertyName || '');
        setPropertySlug(e.detail.propertySlug || '');
      } else {
        setPropertyName('');
        setPropertySlug('');
      }
      
      setIntent(newIntent);
      
      // Reset form state on open
      setIsSubmitted(false);
      setContactMethod('whatsapp');
      
      if (newIntent === 'viewing') {
        setInterest('viewing');
      } else if (newIntent === 'details') {
        setInterest('details');
      } else {
        setInterest('buy');
      }

      if (formRef.current) {
        formRef.current.reset();
      }

      setIsModalOpen(true);
    };
    window.addEventListener('open-consultation', handleOpen);
    return () => window.removeEventListener('open-consultation', handleOpen);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    // Let the exit animation finish before clearing success state
    setTimeout(() => setIsSubmitted(false), 300);
  };

  // Determine Title & Eyebrow semantics
  let eyebrow = t('modal.privateConsultation');
  let mainTitle = t('modal.requestConsultation');
  let subtitle = t('modal.consultationSubtitle');

  if (intent === 'viewing') {
    eyebrow = t('modal.privateViewing');
    mainTitle = t('modal.arrangeViewing');
    if (propertyName) subtitle = propertyName;
  } else if (intent === 'details') {
    eyebrow = t('modal.propertyInquiry');
    mainTitle = t('modal.requestDetails');
    if (propertyName) subtitle = propertyName;
  }

  return (
    <Modal isOpen={isModalOpen} onClose={closeModal} dataQa="consultation-dialog">
      <div className={styles.modalShell}>
        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.div 
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
              transition={{ duration: 0.3 }}
              className={styles.modalShell}
            >
              <div className={styles.header}>
                <p className={styles.eyebrow}>{eyebrow}</p>
                <h3 className={styles.formTitle}>{mainTitle}</h3>
                <p className={styles.formDesc}>{subtitle}</p>
              </div>

              <div className={styles.scrollArea}>
                <form ref={formRef} className={styles.form} onSubmit={handleSubmit}>
                  <input type="hidden" name="propertySlug" value={propertySlug} />
                  
                  <div className={styles.fieldGroup}>
                    <label htmlFor="modal-name">{t('modal.name')}</label>
                    <input type="text" id="modal-name" name="name" autoComplete="name" required />
                  </div>
                  
                  <div className={styles.fieldGroup}>
                    <label htmlFor="modal-email">{t('modal.email')}</label>
                    <input type="email" id="modal-email" name="email" autoComplete="email" dir="ltr" required />
                  </div>

                  <div className={styles.fieldGroup}>
                    <label htmlFor="modal-phone">{t('modal.phone')}</label>
                    <input type="tel" inputMode="tel" id="modal-phone" name="phone" autoComplete="tel" dir="ltr" required />
                  </div>

                  <div className={styles.fieldGroup}>
                    <CustomSelect 
                      id="modal-preferred-contact"
                      name="preferredContact"
                      label={t('modal.preferredContact')}
                      value={contactMethod}
                      onValueChange={setContactMethod}
                      options={contactOptions}
                      required
                    />
                  </div>
                  
                  <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
                    <CustomSelect 
                      id="modal-interest"
                      name="interest"
                      label={t('modal.interestedIn')}
                      value={interest}
                      onValueChange={setInterest}
                      options={interestOptions}
                      required
                    />
                  </div>
                  
                  <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
                    <label htmlFor="modal-message">{t('modal.message')}</label>
                    <textarea id="modal-message" name="message" required></textarea>
                  </div>
                  
                  <div className={styles.footer}>
                    <Button variant="primary" type="submit" className={styles.submitBtn}>
                      {t('modal.submitRequest')}
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="success"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={styles.successState}
            >
              <p className={styles.eyebrow}>{t('modal.requestReceived')}</p>
              <h3 className={styles.formTitle}>{t('modal.thankYou')}</h3>
              <p className={styles.formDesc}>
                {t('modal.successNotice')}
              </p>
              <Button variant="outline" onClick={closeModal} style={{ marginTop: '16px' }}>
                {t('modal.closeWindow')}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Modal>
  );
};
