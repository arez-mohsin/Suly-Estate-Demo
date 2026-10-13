import { useTranslation } from 'react-i18next';
import { properties as rawProperties } from '../data/properties';
import { locations as rawLocations } from '../data/locations';

const SLUG_TO_KEY = {
  'goizha-residence': 'goizha',
  'sarchinar-house': 'sarchinar',
  'tasluja-villa': 'tasluja',
  'bakrajo-residence': 'bakrajo',
};

const LOCATION_ID_TO_KEY = {
  1: 'goizha',
  2: 'sarchinar',
  3: 'tasluja',
  4: 'bakrajo',
};

export function localizeProperty(property, t) {
  if (!property) return null;
  const propKey = SLUG_TO_KEY[property.slug] || property.slug;
  const data = t(`propertiesData.${propKey}`, { returnObjects: true });
  if (!data || typeof data === 'string') return property;

  const galleryAlts = Array.isArray(data.galleryAlt) ? data.galleryAlt : [];

  return {
    ...property,
    name: data.name || property.name,
    neighborhood: data.neighborhood || property.neighborhood,
    city: data.city || property.city,
    type: data.type || property.type,
    approximateLocation: data.approximateLocation || property.approximateLocation,
    description: data.description || property.description,
    highlights: Array.isArray(data.highlights) ? data.highlights : property.highlights,
    amenities: Array.isArray(data.amenities) ? data.amenities : property.amenities,
    heroImageAlt: galleryAlts[0] || data.name || property.name,
    gallery: property.gallery.map((g, idx) => ({
      ...g,
      alt: galleryAlts[idx] || g.alt,
    })),
  };
}

export function localizeLocation(location, t) {
  if (!location) return null;
  const locKey = LOCATION_ID_TO_KEY[location.id];
  const item = locKey ? t(`neighborhoods.items.${locKey}`, { returnObjects: true }) : null;
  if (!item || typeof item === 'string') return location;

  return {
    ...location,
    name: item.name || location.name,
    description: item.desc || location.description,
    imageAlt: item.alt || location.imageAlt,
  };
}

export function useLocalizedProperties() {
  const { t } = useTranslation();
  return rawProperties.map((p) => localizeProperty(p, t));
}

export function useLocalizedProperty(slug) {
  const { t } = useTranslation();
  const raw = rawProperties.find((p) => p.slug === slug);
  return raw ? localizeProperty(raw, t) : null;
}

export function useLocalizedLocations() {
  const { t } = useTranslation();
  return rawLocations.map((l) => localizeLocation(l, t));
}
