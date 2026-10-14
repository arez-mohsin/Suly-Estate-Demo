/**
 * SULY ESTATES - Netlify Image CDN Helper
 * 
 * Provides responsive srcSet, sizes, and optimized image URLs using Netlify Image CDN:
 * /.netlify/images?url=<source>&w=<width>&q=<quality>&fm=<format>
 * 
 * In local Vite dev / preview, automatically falls back to raw source URL unless
 * VITE_ENABLE_NETLIFY_IMAGE_CDN=true or running on Netlify production.
 */

const IS_PROD = typeof window !== 'undefined' 
  ? (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1')
  : (import.meta.env?.PROD ?? false);

export const DEFAULT_QUALITY = 78;

/**
 * Builds a Netlify Image CDN URL.
 * If local dev and not forced, returns the original source.
 */
export function getOptimizedImageUrl(src, { width, quality = DEFAULT_QUALITY, format = 'avif' } = {}) {
  if (!src || typeof src !== 'string') return src;

  // Do not transform SVG or data URLs or external non-image URLs
  if (src.endsWith('.svg') || src.startsWith('data:') || src.startsWith('blob:')) {
    return src;
  }

  // If local development, keep raw source so localhost works seamlessly
  const forceCdn = typeof import.meta !== 'undefined' && import.meta.env?.VITE_ENABLE_IMAGE_CDN === 'true';
  if (!IS_PROD && !forceCdn) {
    return src;
  }

  const params = new URLSearchParams();
  params.set('url', src);
  if (width) params.set('w', String(width));
  if (quality) params.set('q', String(quality));
  if (format) params.set('fm', format);

  return `/.netlify/images?${params.toString()}`;
}

/**
 * Generates an image srcSet string for a given array of widths.
 */
export function getImageSrcSet(src, widths = [], { quality = DEFAULT_QUALITY, format = 'avif' } = {}) {
  if (!src || typeof src !== 'string' || !widths.length) return undefined;
  
  // Local dev fallback
  const forceCdn = typeof import.meta !== 'undefined' && import.meta.env?.VITE_ENABLE_IMAGE_CDN === 'true';
  if (!IS_PROD && !forceCdn) {
    return undefined;
  }

  return widths
    .map((w) => `${getOptimizedImageUrl(src, { width: w, quality, format })} ${w}w`)
    .join(', ');
}

/**
 * Predefined responsive widths tailored by component category
 */
export const RESPONSIVE_PRESETS = {
  hero: {
    widths: [480, 768, 1024, 1280, 1600, 1920],
    sizes: '100vw',
    quality: 80,
  },
  card: {
    widths: [360, 540, 720, 960],
    sizes: '(max-width: 767px) 85vw, (max-width: 1024px) 50vw, 25vw',
    quality: 78,
  },
  neighborhood: {
    widths: [360, 540, 720, 960],
    sizes: '(max-width: 767px) 100vw, (max-width: 1024px) 50vw, 25vw',
    quality: 78,
  },
  editorial: {
    widths: [480, 768, 1024, 1280],
    sizes: '(max-width: 767px) 100vw, (max-width: 1024px) 50vw, 600px',
    quality: 78,
  },
  thumbnail: {
    widths: [320, 480, 640],
    sizes: '(max-width: 767px) 240px, 320px',
    quality: 75,
  },
  lightbox: {
    widths: [1024, 1280, 1600, 1920],
    quality: 82,
  }
};
