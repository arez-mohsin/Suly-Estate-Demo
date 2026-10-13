import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ScrollManager } from './components/ScrollManager';
import { GlobalConsultationModal } from './components/GlobalConsultationModal';
import { Home } from './pages/Home';
import { Properties } from './pages/Properties';
import { PropertyDetail } from './pages/PropertyDetail';
import { LegalPage } from './pages/LegalPage';

function App() {
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <>
      <ScrollManager />
      <Header />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/properties/:slug" element={<PropertyDetail />} />
          <Route path="/privacy" element={<LegalPage type="privacy" />} />
          <Route path="/terms" element={<LegalPage type="terms" />} />
          <Route path="*" element={
            <main style={{ paddingTop: '150px', paddingBottom: '100px', textAlign: 'center', minHeight: '80vh' }}>
              <h1 className="display-3" style={{ marginBottom: '1rem' }}>{t('notFound.title')}</h1>
              <p style={{ color: 'var(--color-muted-text)' }}>{t('notFound.description')}</p>
            </main>
          } />
        </Routes>
      </AnimatePresence>
      <GlobalConsultationModal />
      <Footer />
    </>
  );
}

export default App;
