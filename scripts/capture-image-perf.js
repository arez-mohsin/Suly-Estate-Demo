import { chromium } from 'playwright';
import path from 'path';

const OUTPUT_DIR = path.resolve('qa-screenshots/image-performance');

async function captureScreenshots() {
  const browser = await chromium.launch({ headless: true });

  // 1. Desktop 1440x900
  const dPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await dPage.goto('http://localhost:4173', { waitUntil: 'networkidle' });
  await dPage.waitForTimeout(500);

  // homepage Hero desktop
  const dHero = await dPage.$('section[aria-label="Featured Properties Carousel"]');
  if (dHero) {
    await dHero.screenshot({ path: path.join(OUTPUT_DIR, 'homepage-hero-desktop.png') });
    console.log('Captured homepage-hero-desktop.png');
  }

  // Featured desktop
  const dFeatured = await dPage.$('#properties');
  if (dFeatured) {
    await dFeatured.scrollIntoViewIfNeeded();
    await dPage.waitForTimeout(400);
    await dFeatured.screenshot({ path: path.join(OUTPUT_DIR, 'featured-desktop.png') });
    console.log('Captured featured-desktop.png');
  }

  // Property detail desktop (Tasluja Villa)
  await dPage.goto('http://localhost:4173/properties/tasluja-villa', { waitUntil: 'networkidle' });
  await dPage.waitForTimeout(500);

  const dPropHero = await dPage.$('section[class*="hero"]');
  if (dPropHero) {
    await dPropHero.screenshot({ path: path.join(OUTPUT_DIR, 'property-hero-desktop.png') });
    console.log('Captured property-hero-desktop.png');
  }

  const dPhotoTour = await dPage.$('div[class*="photoTour"]');
  if (dPhotoTour) {
    await dPhotoTour.scrollIntoViewIfNeeded();
    await dPage.waitForTimeout(400);
    await dPhotoTour.screenshot({ path: path.join(OUTPUT_DIR, 'photo-tour-desktop.png') });
    console.log('Captured photo-tour-desktop.png');
  }

  // Open lightbox
  const firstThumb = await dPage.$('button[class*="thumbnailBtn"]');
  if (firstThumb) {
    await firstThumb.click();
    await dPage.waitForTimeout(600);
    const lightboxEl = await dPage.$('div[data-qa="property-lightbox"]');
    if (lightboxEl) {
      await lightboxEl.screenshot({ path: path.join(OUTPUT_DIR, 'lightbox-desktop.png') });
      console.log('Captured lightbox-desktop.png');
    }
  }

  await dPage.close();

  // 2. Mobile 390x844
  const mPage = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mPage.goto('http://localhost:4173', { waitUntil: 'networkidle' });
  await mPage.waitForTimeout(500);

  const mHero = await mPage.$('section[aria-label="Featured Properties Carousel"]');
  if (mHero) {
    await mHero.screenshot({ path: path.join(OUTPUT_DIR, 'homepage-hero-mobile.png') });
    console.log('Captured homepage-hero-mobile.png');
  }

  const mFeatured = await mPage.$('#properties');
  if (mFeatured) {
    await mFeatured.scrollIntoViewIfNeeded();
    await mPage.waitForTimeout(400);
    await mFeatured.screenshot({ path: path.join(OUTPUT_DIR, 'featured-mobile.png') });
    console.log('Captured featured-mobile.png');
  }

  await mPage.goto('http://localhost:4173/properties/tasluja-villa', { waitUntil: 'networkidle' });
  await mPage.waitForTimeout(500);
  const mPropHero = await mPage.$('section[class*="hero"]');
  if (mPropHero) {
    await mPropHero.screenshot({ path: path.join(OUTPUT_DIR, 'property-hero-mobile.png') });
    console.log('Captured property-hero-mobile.png');
  }

  await mPage.close();
  await browser.close();
  console.log('All QA screenshots captured successfully!');
}

captureScreenshots().catch(console.error);
