import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import styles from './Hero.module.css';
import { Button } from '../components/Button';
import { usePerformanceProfile } from '../hooks/usePerformanceProfile';
import { useTranslation } from 'react-i18next';

const SLIDE_TEMPLATES = [
  { id: 1, image: '/images/goizha-hero.jpg', key: 'goizha' },
  { id: 2, image: '/images/sarchinar-hero.jpg', key: 'sarchinar' },
  { id: 3, image: '/images/tasluja-hero.jpg', key: 'tasluja' },
];

export const Hero = () => {
  const { t } = useTranslation();
  const slides = React.useMemo(() => SLIDE_TEMPLATES.map((s) => ({
    ...s,
    location: t(`hero.slideLocations.${s.key}`),
    alt: t(`hero.slideAlts.${s.key}`),
  })), [t]);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const shouldReduceMotion = useReducedMotion();
  const timerRef = useRef(null);
  
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const startTimer = useCallback(() => {
    if (shouldReduceMotion) return; 
    
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5500); 
  }, [shouldReduceMotion, slides.length]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearTimeout(timerRef.current);
        setIsPlaying(false);
      } else {
        startTimer();
        setIsPlaying(true);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    startTimer();

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearTimeout(timerRef.current);
    };
  }, [startTimer, currentSlide]);

  useEffect(() => {
    const nextSlide = (currentSlide + 1) % slides.length;
    const img = new Image();
    img.src = slides[nextSlide].image;
  }, [currentSlide, slides]);

  const handleManualSelect = (index) => {
    setCurrentSlide(index);
    startTimer(); 
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].screenX;
    handleSwipe();
  };

  const handleSwipe = () => {
    const swipeThreshold = 50; 
    if (touchEndX.current < touchStartX.current - swipeThreshold) {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
      startTimer();
    } else if (touchEndX.current > touchStartX.current + swipeThreshold) {
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
      startTimer();
    }
  };

  const backgroundVariants = {
    initial: { 
      opacity: 0,
      scale: shouldReduceMotion ? 1 : 1.03 
    },
    animate: { 
      opacity: 1,
      scale: 1,
      transition: { 
        opacity: { duration: 1.0, ease: [0.21, 0.47, 0.32, 0.98] },
        scale: { duration: 6, ease: "easeOut" } 
      }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 1.0, ease: [0.21, 0.47, 0.32, 0.98] }
    }
  };

  const heroRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  });

  const { reduceMotion, constrainedDevice, saveData } = usePerformanceProfile();
  const [isDesktopWide, setIsDesktopWide] = useState(true);

  useEffect(() => {
    const checkWidth = () => setIsDesktopWide(window.innerWidth > 768);
    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  const allowParallax = !reduceMotion && !constrainedDevice && !saveData && isDesktopWide;

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', allowParallax ? '-2.5%' : '0%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0px', allowParallax ? '14px' : '0px']);
  const contentOpacity = useTransform(scrollYProgress, [0, 1], [1, allowParallax ? 0.9 : 1]);

  const EASE_PREMIUM = [0.21, 0.47, 0.32, 0.98];

  return (
    <section 
      ref={heroRef}
      className={styles.hero}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="Featured Properties Carousel"
      data-header-theme="transparent"
      data-active-slide={currentSlide + 1}
    >
      <motion.div className={styles.backgroundLayer} style={{ y: bgY }}>
        <AnimatePresence initial={false}>
          <motion.div 
            key={currentSlide}
            className={styles.background}
            variants={backgroundVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <img 
              src={slides[currentSlide].image} 
              alt={slides[currentSlide].alt} 
              className={styles.image}
              fetchPriority={currentSlide === 0 ? "high" : "auto"}
              loading={currentSlide === 0 ? "eager" : "lazy"}
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <div className={styles.overlay} />

      <motion.div className={styles.contentGrid} style={{ y: contentY, opacity: contentOpacity }}>
        <div className={styles.contentMain}>
          <motion.div 
            className={styles.eyebrow}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE_PREMIUM }}
          >
            <span className={styles.locationBadge}>
              <AnimatePresence mode="wait">
                <motion.span
                  key={slides[currentSlide].location}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {slides[currentSlide].location}
                </motion.span>
              </AnimatePresence>
            </span>
          </motion.div>
          
          <motion.h1 
            className={styles.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: EASE_PREMIUM }}
            style={{ whiteSpace: 'pre-line' }}
          >
            {t('hero.title')}
          </motion.h1>
          
          <div className={styles.contentFooter}>
            <motion.p 
              className={styles.description}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35, ease: EASE_PREMIUM }}
              style={{ whiteSpace: 'pre-line' }}
            >
              {t('hero.description')}
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: EASE_PREMIUM }}
            >
              <Button as={Link} to="/properties" variant="transparentOutline">{t('hero.exploreCta')}</Button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <div className={styles.sliderControls} role="tablist">
        {slides.map((slide, index) => (
          <React.Fragment key={slide.id}>
            <button
              role="tab"
              aria-selected={currentSlide === index}
              aria-label={t('common.viewSlide', { number: index + 1 })}
              className={`${styles.sliderButton} ${currentSlide === index ? styles.active : ''}`}
              onClick={() => handleManualSelect(index)}
              data-qa={`hero-slide-control-${index + 1}`}
            >
              <span className={styles.slideNumber}><bdi dir="ltr">0{index + 1}</bdi></span>
              {currentSlide === index && (
                <div className={styles.activeIndicatorContainer}>
                  {reduceMotion ? (
                    <div className={styles.activeIndicatorStatic} />
                  ) : (
                    <div 
                      key={`progress-${currentSlide}`}
                      className={`${styles.activeIndicatorProgress} ${!isPlaying ? styles.paused : ''}`}
                    />
                  )}
                </div>
              )}
            </button>
            {index < slides.length - 1 && <span className={styles.sliderDash} aria-hidden="true">—</span>}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
};
