import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Header.module.css';
import { MenuIcon, CloseIcon } from './Icons';
import { Button } from './Button';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useSmoothScroll } from '../providers/SmoothScrollProvider';
import { LanguageSwitcher } from './LanguageSwitcher';

export const Header = () => {
  const [headerTheme, setHeaderTheme] = useState('transparent');
  const [activeSection, setActiveSection] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { lenis } = useSmoothScroll();

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (window.scrollY < 50 && location.pathname === '/') {
            setHeaderTheme('transparent');
            setActiveSection('');
            ticking = false;
            return;
          }

          const headerOffset = 60; // Probe point below top of screen
          const sections = document.querySelectorAll('[data-header-theme]');
          let currentSection = null;
          
          // Reverse order to pick the last one in DOM if there's overlap (though there shouldn't be)
          for (let i = sections.length - 1; i >= 0; i--) {
            const rect = sections[i].getBoundingClientRect();
            if (rect.top <= headerOffset && rect.bottom > headerOffset) {
              currentSection = sections[i];
              break;
            }
          }

          if (currentSection) {
            setHeaderTheme(currentSection.getAttribute('data-header-theme'));
            if (currentSection.id) setActiveSection(currentSection.id);
          } else if (location.pathname !== '/') {
            setHeaderTheme('dark'); // Default for non-home routes if nothing matches
          }
          
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Trigger once on mount/route change after a slight delay to let DOM settle
    const timeout = setTimeout(handleScroll, 100);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeout);
    };
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    
    if (menuOpen) {
      if (lenis) lenis.stop();
    } else {
      if (lenis) lenis.start();
    }
    
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && menuOpen) {
        setMenuOpen(false);
      }
    };
    
    if (menuOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (lenis) lenis.start();
      document.body.style.overflow = '';
    };
  }, [menuOpen, lenis]);

  const { t } = useTranslation();

  const navLinks = [
    { name: t('nav.properties'), href: '/#properties', id: 'properties' },
    { name: t('nav.neighborhoods'), href: '/#neighborhoods', id: 'neighborhoods' },
    { name: t('nav.approach'), href: '/#approach', id: 'approach' },
    { name: t('nav.about'), href: '/#about', id: 'about' },
  ];

  const headerClass = `${styles.header} ${styles[`theme-${headerTheme}`] || styles['theme-dark']}`;

  return (
    <>
      <header className={headerClass} data-qa="site-header" data-qa-header-theme={headerTheme}>
        <Link to="/" className={`${styles.logo} brand-name`} dir="ltr">
          <span>SULY</span>
          <span>ESTATES</span>
        </Link>

        <nav className={styles.desktopNav}>
          <ul className={styles.navLinks}>
            {navLinks.map((link) => {
              const isActive = activeSection === link.id && location.pathname === '/';
              return (
                <li key={link.id}>
                  <Link to={link.href} className={`${styles.navLink} ${isActive ? styles.active : ''}`}>
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className={styles.actions}>
          <LanguageSwitcher variant="header" />
          <Button 
            variant="outline" 
            className={styles.inquireBtn} 
            icon={false}
            onClick={() => window.dispatchEvent(new Event('open-consultation'))}
            data-qa="header-inquire"
          >
            {t('common.inquire')}
          </Button>
          <button 
            className={styles.mobileMenuBtn} 
            onClick={() => setMenuOpen(true)}
            aria-label={t('common.openMenu')}
            aria-expanded={menuOpen}
            data-qa="mobile-menu-trigger"
          >
            <MenuIcon size={28} />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            className={styles.mobileMenuOverlay}
            initial={{ opacity: 0, y: '-100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '-100%' }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            data-qa="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site Navigation"
          >
            <div className={styles.mobileMenuHeader}>
              <Link to="/" className={`${styles.logo} brand-name`} dir="ltr" onClick={() => setMenuOpen(false)}>
                <span>SULY</span>
                <span>ESTATES</span>
              </Link>
              <button 
                className={styles.mobileMenuBtn} 
                onClick={() => setMenuOpen(false)}
                aria-label={t('common.closeMenu')}
              >
                <CloseIcon size={28} />
              </button>
            </div>
            
            <nav className={styles.mobileNav}>
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + (i * 0.05), duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
                >
                  <Link 
                    to={link.href} 
                    className={styles.mobileNavLink}
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <LanguageSwitcher 
              variant="mobile" 
              onSelectLanguage={() => {
                setTimeout(() => setMenuOpen(false), 250);
              }} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
