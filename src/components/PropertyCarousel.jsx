import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import styles from './PropertyCarousel.module.css';
import { ResponsiveImage } from './ResponsiveImage';

export const PropertyCarousel = ({ images, onImageClick }) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language !== 'en';
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [documentHidden, setDocumentHidden] = useState(false);
  
  const timerRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    // Do not auto-play if we want to pause
    if (shouldReduceMotion || isHovered || isFocused || documentHidden) {
      return;
    }

    timerRef.current = setTimeout(() => {
      nextSlide();
    }, 5500);
  }, [shouldReduceMotion, isHovered, isFocused, documentHidden, nextSlide]);

  useEffect(() => {
    resetTimer();
    return () => clearTimeout(timerRef.current);
  }, [resetTimer, currentIndex]);

  useEffect(() => {
    const handleVisibility = () => {
      setDocumentHidden(document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  const handleManualNext = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    nextSlide();
  };

  const handleManualPrev = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    prevSlide();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleManualNext();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handleManualPrev();
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onImageClick(currentIndex);
    }
  };

  const handleDragEnd = (event, info) => {
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold) {
      handleManualNext();
    } else if (info.offset.x > swipeThreshold) {
      handleManualPrev();
    }
  };

  return (
    <div 
      className={styles.carousel} 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      data-qa="property-carousel"
      data-active-index={currentIndex}
      data-active-src={images[currentIndex]?.src}
    >
      <motion.div 
        className={styles.slidesContainer}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        whileTap={{ cursor: "grabbing" }}
        style={{ cursor: 'grab' }}
      >
        {images.map((img, index) => {
          let className = styles.slide;
          if (index === currentIndex) className += ` ${styles.active}`;
          if (index === (currentIndex - 1 + images.length) % images.length) className += ` ${styles.prev}`;
          if (index === (currentIndex + 1) % images.length) className += ` ${styles.next}`;
          
          const shouldLoad = index === currentIndex || 
                            index === (currentIndex + 1) % images.length || 
                            index === (currentIndex - 1 + images.length) % images.length;
                            
          return (
            <div key={index} className={className}>
              {shouldLoad && (
                <ResponsiveImage 
                  src={img.src} 
                  alt={img.alt} 
                  preset="hero"
                  className={styles.image} 
                  loading={index === 0 ? "eager" : "lazy"} 
                  fetchPriority={index === 0 ? "high" : "auto"}
                  width={1024}
                  height={1024}
                />
              )}
            </div>
          );
        })}
      </motion.div>
      
      <div className={styles.overlay} />
      
      <div className={styles.controls}>
        <div className={styles.counter}>
          <bdi dir="ltr">{currentIndex + 1} / {images.length}</bdi>
        </div>
        <div className={styles.buttons}>
          <button 
            className={styles.navButton} 
            onClick={handleManualPrev}
            aria-label={t('common.previousImage')}
            data-qa="property-carousel-prev"
          >
            {isRtl ? '→' : '←'}
          </button>
          <button 
            className={styles.navButton} 
            onClick={handleManualNext}
            aria-label={t('common.nextImage')}
            data-qa="property-carousel-next"
          >
            {isRtl ? '←' : '→'}
          </button>
        </div>
      </div>
      
      <button 
        className={styles.affordance} 
        onClick={() => onImageClick(currentIndex)}
        aria-label={t('common.viewGallery')}
        data-qa="property-gallery-open"
      >
        {t('common.viewGallery')}
      </button>
    </div>
  );
};
