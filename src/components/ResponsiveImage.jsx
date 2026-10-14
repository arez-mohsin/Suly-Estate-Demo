import React from 'react';
import { getOptimizedImageUrl, getImageSrcSet, RESPONSIVE_PRESETS, DEFAULT_QUALITY } from '../utils/imageCdn';

/**
 * ResponsiveImage Component
 * 
 * Standardized responsive image wrapper that automatically attaches
 * Netlify Image CDN srcset, sizes, and fallback src, while preserving all native
 * <img> attributes, aspect ratios, decoding, and lazy-loading semantics.
 */
export const ResponsiveImage = React.forwardRef(function ResponsiveImage(
  {
    src,
    alt = '',
    preset = 'card',
    widths,
    sizes,
    quality = DEFAULT_QUALITY,
    format = 'avif',
    fallbackWidth,
    loading = 'lazy',
    decoding = 'async',
    fetchPriority,
    className,
    style,
    width,
    height,
    ...rest
  },
  ref
) {
  const presetConfig = RESPONSIVE_PRESETS[preset] || {};
  const effectiveWidths = widths || presetConfig.widths || [480, 768, 1024];
  const effectiveSizes = sizes || presetConfig.sizes;
  const effectiveQuality = quality || presetConfig.quality || DEFAULT_QUALITY;

  // Use highest width variant or fallbackWidth as base src
  const baseWidth = fallbackWidth || effectiveWidths[effectiveWidths.length - 1];
  const optimizedSrc = getOptimizedImageUrl(src, { width: baseWidth, quality: effectiveQuality, format });
  const srcSet = getImageSrcSet(src, effectiveWidths, { quality: effectiveQuality, format });

  return (
    <img
      ref={ref}
      src={optimizedSrc}
      srcSet={srcSet}
      sizes={srcSet ? effectiveSizes : undefined}
      alt={alt}
      loading={loading}
      decoding={decoding}
      fetchPriority={fetchPriority}
      className={className}
      style={style}
      width={width}
      height={height}
      {...rest}
    />
  );
});
