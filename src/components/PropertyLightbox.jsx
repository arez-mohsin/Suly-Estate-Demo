import React, { useEffect } from 'react';
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import { useTranslation } from 'react-i18next';
import { useSmoothScroll } from '../providers/SmoothScrollProvider';

import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import { getOptimizedImageUrl } from '../utils/imageCdn';

export default function PropertyLightbox({ 'data-qa': dataQa, open, slides = [], ...props }) {
  const { t } = useTranslation();
  const { lenis } = useSmoothScroll();

  useEffect(() => {
    if (open) {
      if (lenis) lenis.stop();
    } else {
      if (lenis) lenis.start();
    }
    return () => {
      if (lenis) lenis.start();
    };
  }, [open, lenis]);

  const labels = {
    Previous: t('lightbox.previous'),
    Next: t('lightbox.next'),
    Close: t('lightbox.close'),
    'Zoom in': t('lightbox.zoomIn'),
    'Zoom out': t('lightbox.zoomOut'),
    'Enter Fullscreen': t('lightbox.fullscreenEnter'),
    'Exit Fullscreen': t('lightbox.fullscreenExit'),
  };

  // Optimize lightbox slide sources to 1600px width with quality 82 for high DPI / crisp architecture
  const optimizedSlides = React.useMemo(() => {
    return slides.map(slide => ({
      ...slide,
      src: getOptimizedImageUrl(slide.src, { width: 1600, quality: 82 }),
      // Also provide thumbnail image for thumbnails plugin
      thumbnail: getOptimizedImageUrl(slide.src, { width: 320, quality: 75 })
    }));
  }, [slides]);

  return (
    <Lightbox
      open={open}
      slides={optimizedSlides}
      plugins={[Zoom, Thumbnails, Fullscreen]}
      animation={{ fade: 250 }}
      carousel={{ preload: 1, padding: "16px" }}
      styles={{ container: { backgroundColor: "rgba(11, 13, 12, 0.98)" } }}
      portal={{ container: { 'data-qa': dataQa } }}
      labels={labels}
      {...props}
    />
  );
}
