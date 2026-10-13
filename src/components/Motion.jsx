import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { usePerformanceProfile } from '../hooks/usePerformanceProfile';

import { EASE_PREMIUM, DURATION_REVEAL, DURATION_EDITORIAL, DURATION_IMAGE } from '../motion/tokens';

export const Reveal = ({ children, delay = 0, y = 16, duration = DURATION_REVEAL, className }) => {
  const { reduceMotion, constrainedDevice } = usePerformanceProfile();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const initialY = constrainedDevice ? 8 : y;

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: initialY }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: initialY }}
      transition={{ duration, delay, ease: EASE_PREMIUM }}
    >
      {children}
    </motion.div>
  );
};

export const TextReveal = ({ text, delay = 0, className, as: Component = 'div' }) => {
  const { reduceMotion } = usePerformanceProfile();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

  if (reduceMotion) {
    return <Component className={className}>{text}</Component>;
  }

  const lines = text.split('\n');
  const MotionComponent = typeof Component === 'string' ? motion[Component] : motion.div;

  return (
    <MotionComponent ref={ref} className={className}>
      {lines.map((line, i) => (
        <span key={i} style={{ display: 'block', overflow: 'hidden' }}>
          <motion.span
            style={{ display: 'block' }}
            initial={{ y: '105%', opacity: 0.35 }}
            animate={isInView ? { y: 0, opacity: 1 } : { y: '105%', opacity: 0.35 }}
            transition={{ duration: DURATION_EDITORIAL, delay: delay + (i * 0.07), ease: EASE_PREMIUM }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </MotionComponent>
  );
};

export const Stagger = ({ children, staggerDelay = 0.06, delay = 0, className, as: Component = 'div' }) => {
  const { reduceMotion } = usePerformanceProfile();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

  if (reduceMotion) {
    return <Component className={className}>{children}</Component>;
  }

  const MotionComponent = typeof Component === 'string' ? motion[Component] : motion.div;

  return (
    <MotionComponent
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: delay
          }
        }
      }}
    >
      {children}
    </MotionComponent>
  );
};

export const StaggerItem = ({ children, y = 14, className, as: Component = 'div' }) => {
  const { reduceMotion, constrainedDevice } = usePerformanceProfile();

  if (reduceMotion) {
    return <Component className={className}>{children}</Component>;
  }

  const initialY = constrainedDevice ? 8 : y;
  const MotionComponent = typeof Component === 'string' ? motion[Component] : motion.div;

  return (
    <MotionComponent
      variants={{
        hidden: { opacity: 0, y: initialY },
        visible: { opacity: 1, y: 0, transition: { duration: DURATION_REVEAL, ease: EASE_PREMIUM } }
      }}
      className={className}
    >
      {children}
    </MotionComponent>
  );
};

export const ImageReveal = ({ children, delay = 0, scale = 1.03, duration = DURATION_IMAGE, className }) => {
  const { reduceMotion, constrainedDevice } = usePerformanceProfile();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const initialScale = constrainedDevice ? 1 : scale;

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, scale: initialScale }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: initialScale }}
      transition={{ duration, delay, ease: EASE_PREMIUM }}
      style={{ overflow: 'hidden' }}
    >
      {children}
    </motion.div>
  );
};

export const EditorialImageReveal = ({ children, delay = 0, theme = 'dark', className }) => {
  const { reduceMotion, constrainedDevice } = usePerformanceProfile();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

  if (reduceMotion || constrainedDevice) {
    return <ImageReveal delay={delay} className={className}>{children}</ImageReveal>;
  }

  const coverColor = theme === 'light' ? 'var(--color-warm-ivory)' : 'var(--color-deep-charcoal)';
  const isRtl = typeof document !== 'undefined' && document.documentElement.dir === 'rtl';

  return (
    <div ref={ref} className={className} style={{ position: 'relative', overflow: 'hidden' }}>
      <motion.div
        initial={{ scaleX: 1 }}
        animate={isInView ? { scaleX: 0 } : { scaleX: 1 }}
        transition={{ duration: DURATION_IMAGE, delay, ease: EASE_PREMIUM }}
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: coverColor,
          transformOrigin: isRtl ? 'left' : 'right',
          zIndex: 10
        }}
      />
      <motion.div
        initial={{ scale: 1.025, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : { scale: 1.025, opacity: 0 }}
        transition={{ duration: DURATION_IMAGE, delay: delay + 0.1, ease: EASE_PREMIUM }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export const Divider = ({ className, delay = 0, duration = 0.8, color = 'var(--color-border-dark)' }) => {
  const { reduceMotion } = usePerformanceProfile();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

  if (reduceMotion) {
    return <div className={className} style={{ width: '100%', height: '1px', backgroundColor: color }} />;
  }

  const isRtl = typeof document !== 'undefined' && document.documentElement.dir === 'rtl';

  return (
    <div ref={ref} className={className} style={{ width: '100%', height: '1px', overflow: 'hidden' }}>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration, delay, ease: EASE_PREMIUM }}
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: color,
          transformOrigin: isRtl ? 'right' : 'left'
        }}
      />
    </div>
  );
};
