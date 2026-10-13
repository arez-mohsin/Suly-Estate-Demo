/* global process */
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const OUTPUT_DIR = path.resolve('qa-screenshots/rtl-typography');
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const BASE_URL = 'http://localhost:5173';

const VIEWPORTS = {
  desktop: { width: 1440, height: 900 },
  tablet: { width: 834, height: 1194 },
  mobile: { width: 390, height: 844 },
  smallMobile: { width: 360, height: 800 }
};

async function setLanguage(page, lang) {
  await page.addInitScript((l) => {
    try {
      localStorage.setItem('suly-estates-language', l);
    } catch (e) {
      void e;
    }
  }, lang);
  await page.evaluate((l) => {
    try {
      localStorage.setItem('suly-estates-language', l);
    } catch (e) {
      void e;
    }
  }, lang);
  await page.reload({ waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(600);
}

async function run() {
  console.log('Capturing canonical RTL typography screenshots into qa-screenshots/rtl-typography/...');
  const browser = await chromium.launch({ headless: true });

  try {
    // 1. KURDISH SORANI (CKB)
    console.log('Testing Kurdish Sorani (CKB)...');
    
    // Desktop Hero
    {
      const context = await browser.newContext({ viewport: VIEWPORTS.desktop });
      const page = await context.newPage();
      await page.goto(BASE_URL);
      await setLanguage(page, 'ckb');
      const hero = await page.$('section[aria-label="Featured Properties Carousel"]');
      if (hero) {
        await hero.screenshot({ path: path.join(OUTPUT_DIR, 'ckb-hero-desktop.png') });
        console.log('Captured: ckb-hero-desktop.png');
      }

      // Kurdish Body Section (Our Approach)
      const approach = await page.$('#approach');
      if (approach) {
        await approach.scrollIntoViewIfNeeded();
        await page.waitForTimeout(600);
        await approach.screenshot({ path: path.join(OUTPUT_DIR, 'ckb-body.png') });
        console.log('Captured: ckb-body.png');
      }
      await context.close();
    }

    // Tablet Hero
    {
      const context = await browser.newContext({ viewport: VIEWPORTS.tablet });
      const page = await context.newPage();
      await page.goto(BASE_URL);
      await setLanguage(page, 'ckb');
      const hero = await page.$('section[aria-label="Featured Properties Carousel"]');
      if (hero) {
        await hero.screenshot({ path: path.join(OUTPUT_DIR, 'ckb-hero-tablet.png') });
        console.log('Captured: ckb-hero-tablet.png');
      }
      await context.close();
    }

    // Mobile Hero
    {
      const context = await browser.newContext({ viewport: VIEWPORTS.mobile });
      const page = await context.newPage();
      await page.goto(BASE_URL);
      await setLanguage(page, 'ckb');
      const hero = await page.$('section[aria-label="Featured Properties Carousel"]');
      if (hero) {
        await hero.screenshot({ path: path.join(OUTPUT_DIR, 'ckb-hero-mobile.png') });
        console.log('Captured: ckb-hero-mobile.png');
      }
      await context.close();
    }

    // 2. ARABIC (AR)
    console.log('Testing Arabic (AR)...');

    // Desktop Hero
    {
      const context = await browser.newContext({ viewport: VIEWPORTS.desktop });
      const page = await context.newPage();
      await page.goto(BASE_URL);
      await setLanguage(page, 'ar');
      const hero = await page.$('section[aria-label="Featured Properties Carousel"]');
      if (hero) {
        await hero.screenshot({ path: path.join(OUTPUT_DIR, 'ar-hero-desktop.png') });
        console.log('Captured: ar-hero-desktop.png');
      }

      // Arabic Body Section (Our Approach)
      const approach = await page.$('#approach');
      if (approach) {
        await approach.scrollIntoViewIfNeeded();
        await page.waitForTimeout(600);
        await approach.screenshot({ path: path.join(OUTPUT_DIR, 'ar-body.png') });
        console.log('Captured: ar-body.png');
      }
      await context.close();
    }

    // Tablet Hero
    {
      const context = await browser.newContext({ viewport: VIEWPORTS.tablet });
      const page = await context.newPage();
      await page.goto(BASE_URL);
      await setLanguage(page, 'ar');
      const hero = await page.$('section[aria-label="Featured Properties Carousel"]');
      if (hero) {
        await hero.screenshot({ path: path.join(OUTPUT_DIR, 'ar-hero-tablet.png') });
        console.log('Captured: ar-hero-tablet.png');
      }
      await context.close();
    }

    // Mobile Hero
    {
      const context = await browser.newContext({ viewport: VIEWPORTS.mobile });
      const page = await context.newPage();
      await page.goto(BASE_URL);
      await setLanguage(page, 'ar');
      const hero = await page.$('section[aria-label="Featured Properties Carousel"]');
      if (hero) {
        await hero.screenshot({ path: path.join(OUTPUT_DIR, 'ar-hero-mobile.png') });
        console.log('Captured: ar-hero-mobile.png');
      }
      await context.close();
    }

    // Small Mobile Safety Check (360x800)
    console.log('Running small mobile safety check (360x800)...');
    {
      const context = await browser.newContext({ viewport: VIEWPORTS.smallMobile });
      const page = await context.newPage();
      await page.goto(BASE_URL);
      await setLanguage(page, 'ckb');
      const heroCKB = await page.$('section[aria-label="Featured Properties Carousel"]');
      if (heroCKB) {
        await heroCKB.screenshot({ path: path.join(OUTPUT_DIR, 'ckb-hero-360-safety.png') });
      }

      await setLanguage(page, 'ar');
      const heroAR = await page.$('section[aria-label="Featured Properties Carousel"]');
      if (heroAR) {
        await heroAR.screenshot({ path: path.join(OUTPUT_DIR, 'ar-hero-360-safety.png') });
      }
      await context.close();
    }

    console.log('All RTL typography captures completed successfully.');
  } finally {
    await browser.close();
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
