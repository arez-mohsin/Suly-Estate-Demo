import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Hero } from '../sections/Hero';
import { FeaturedListings } from '../sections/FeaturedListings';
import { SignatureResidence } from '../sections/SignatureResidence';
import { OurApproach } from '../sections/OurApproach';
import { Neighborhoods } from '../sections/Neighborhoods';
import { PropertyLocationMap } from '../sections/PropertyLocationMap';
import { About } from '../sections/About';
import { PrivateConsultation } from '../sections/PrivateConsultation';
import { PageTransition } from '../components/PageTransition';

export function Home() {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = t('meta.titleDefault');
  }, [t]);

  return (
    <PageTransition>
      <Hero />
      <FeaturedListings />
      <SignatureResidence />
      <OurApproach />
      <Neighborhoods />
      <PropertyLocationMap />
      <About />
      <PrivateConsultation />
    </PageTransition>
  );
}
