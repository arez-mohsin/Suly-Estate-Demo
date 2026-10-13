import React, { useEffect } from 'react';
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import { useTranslation } from 'react-i18next';
import { useSmoothScroll } from '../providers/SmoothScrollProvider';

import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

export default function PropertyLightbox({ 'data-qa': dataQa, open, ...props }) {
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

  return (
    <Lightbox
      open={open}
      plugins={[Zoom, Thumbnails, Fullscreen]}
      animation={{ fade: 250 }}
      carousel={{ preload: 2, padding: "16px" }}
      styles={{ container: { backgroundColor: "rgba(11, 13, 12, 0.98)" } }}
      portal={{ container: { 'data-qa': dataQa } }}
      labels={labels}
      {...props}
    />
  );
}
