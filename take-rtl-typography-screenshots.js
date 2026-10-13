/* global process */
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const OUTPUT_DIR = path.resolve('qa-screenshots/i18n-pass');
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const BASE_URL = 'http://localhost:5173';

const VIEWPORTS = {
  desktop: { width: 1440, height: 900 },
  tablet: { width: 834, height: 1194 },
  mobile: { width: 390, height: 844 }
};

async function setLanguage(page, lang) {
  await page.addInitScript((l) => {
    try {
      localStorage.setItem('suly-estates-language', l);
    } catch {
      // ignore
    }
  }, lang);
  await page.evaluate((l) => {
    try {
      localStorage.setItem('suly-estates-language', l);
    } catch {
      // ignore
    }
  }, lang);
  await page.reload({ waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(600);
}

async function run() {
  console.log('Starting Playwright browser for RTL Typography QA...');
  const browser = await chromium.launch({ headless: true });

  try {
    // ----------------------------------------------------
    // GLYPH QA CHECK (Kurdish Sorani glyph support)
    // ----------------------------------------------------
    console.log('\n--- GLYPH QA CHECK ---');
    {
      const context = await browser.newContext({ viewport: VIEWPORTS.desktop });
      const page = await context.newPage();
      await page.goto(BASE_URL);
      await setLanguage(page, 'ckb');

      const glyphVerification = await page.evaluate(async () => {
        await document.fonts.ready;
        const testChars = ['ڕ', 'ڵ', 'ۆ', 'ێ', 'ە', 'ڤ', 'گ', 'کوردی', 'سلێمانی', 'گۆیژە', 'سەرچنار', 'تەسلوجە', 'بەکرەجۆ'];
        const results = {};
        for (const word of testChars) {
          results[word] = {
            inDisplayFont: document.fonts.check(`24px 'IBM Plex Sans Arabic'`, word),
            inBodyFont: document.fonts.check(`16px 'IBM Plex Sans Arabic'`, word)
          };
        }
        return results;
      });

      console.log('Glyph QA Results in IBM Plex Sans Arabic:');
      console.log(JSON.stringify(glyphVerification, null, 2));

      // Inject temporary visual QA banner to capture proof, then remove it
      await page.evaluate(() => {
        const banner = document.createElement('div');
        banner.id = 'temporary-glyph-qa-banner';
        banner.style.position = 'fixed';
        banner.style.top = '100px';
        banner.style.left = '50%';
        banner.style.transform = 'translateX(-50%)';
        banner.style.zIndex = '9999';
        banner.style.background = 'rgba(11, 13, 12, 0.95)';
        banner.style.border = '1px solid #CDC6BA';
        banner.style.padding = '20px 30px';
        banner.style.fontFamily = 'var(--font-display)';
        banner.style.fontSize = '24px';
        banner.style.color = '#ECE9E2';
        banner.style.direction = 'rtl';
        banner.style.textAlign = 'center';
        banner.innerHTML = `
          <div style="font-size: 14px; opacity: 0.7; margin-bottom: 8px;">Kurdish Sorani Glyph QA (IBM Plex Sans Arabic)</div>
          <div style="font-size: 28px; margin-bottom: 8px;">ڕ ڵ ۆ ێ ە ڤ گ</div>
          <div style="font-size: 20px;">کوردی • سلێمانی • گۆیژە • سەرچنار • تەسلوجە • بەکرەجۆ</div>
        `;
        document.body.appendChild(banner);
      });

      const banner = await page.$('#temporary-glyph-qa-banner');
      if (banner) {
        await banner.screenshot({ path: path.join(OUTPUT_DIR, 'glyph-qa-proof.png') });
        console.log('Captured: glyph-qa-proof.png');
      }

      // Remove temporary QA banner
      await page.evaluate(() => {
        const banner = document.getElementById('temporary-glyph-qa-banner');
        if (banner) banner.remove();
      });

      await context.close();
    }

    // ----------------------------------------------------
    // KURDISH SORANI (CKB) HERO & BODY CAPTURES
    // ----------------------------------------------------
    console.log('\n--- CAPTURING KURDISH SORANI (CKB) TYPOGRAPHY ---');
    // Desktop Hero 1440
    {
      const context = await browser.newContext({ viewport: VIEWPORTS.desktop });
      const page = await context.newPage();
      await page.goto(BASE_URL);
      await setLanguage(page, 'ckb');

      const hero = await page.$('section[aria-label="Featured Properties Carousel"]');
      if (hero) {
        await hero.screenshot({ path: path.join(OUTPUT_DIR, 'ckb-hero-1440.png') });
        console.log('Captured: ckb-hero-1440.png');
      }

      // Body Section: Our Approach
      const approach = await page.$('#approach');
      if (approach) {
        await approach.scrollIntoViewIfNeeded();
        await page.waitForTimeout(600);
        await approach.screenshot({ path: path.join(OUTPUT_DIR, 'ckb-body-section.png') });
        console.log('Captured: ckb-body-section.png');
      }

      await context.close();
    }

    // Tablet Hero 834
    {
      const context = await browser.newContext({ viewport: VIEWPORTS.tablet });
      const page = await context.newPage();
      await page.goto(BASE_URL);
      await setLanguage(page, 'ckb');

      const hero = await page.$('section[aria-label="Featured Properties Carousel"]');
      if (hero) {
        await hero.screenshot({ path: path.join(OUTPUT_DIR, 'ckb-hero-834.png') });
        console.log('Captured: ckb-hero-834.png');
      }
      await context.close();
    }

    // Mobile Hero 390
    {
      const context = await browser.newContext({ viewport: VIEWPORTS.mobile });
      const page = await context.newPage();
      await page.goto(BASE_URL);
      await setLanguage(page, 'ckb');

      const hero = await page.$('section[aria-label="Featured Properties Carousel"]');
      if (hero) {
        await hero.screenshot({ path: path.join(OUTPUT_DIR, 'ckb-hero-390.png') });
        console.log('Captured: ckb-hero-390.png');
      }
      await context.close();
    }

    // ----------------------------------------------------
    // ARABIC (AR) HERO & BODY CAPTURES
    // ----------------------------------------------------
    console.log('\n--- CAPTURING ARABIC (AR) TYPOGRAPHY ---');
    // Desktop Hero 1440
    {
      const context = await browser.newContext({ viewport: VIEWPORTS.desktop });
      const page = await context.newPage();
      await page.goto(BASE_URL);
      await setLanguage(page, 'ar');

      const hero = await page.$('section[aria-label="Featured Properties Carousel"]');
      if (hero) {
        await hero.screenshot({ path: path.join(OUTPUT_DIR, 'ar-hero-1440.png') });
        console.log('Captured: ar-hero-1440.png');
      }

      // Body Section: Our Approach
      const approach = await page.$('#approach');
      if (approach) {
        await approach.scrollIntoViewIfNeeded();
        await page.waitForTimeout(600);
        await approach.screenshot({ path: path.join(OUTPUT_DIR, 'ar-body-section.png') });
        console.log('Captured: ar-body-section.png');
      }

      await context.close();
    }

    // Tablet Hero 834
    {
      const context = await browser.newContext({ viewport: VIEWPORTS.tablet });
      const page = await context.newPage();
      await page.goto(BASE_URL);
      await setLanguage(page, 'ar');

      const hero = await page.$('section[aria-label="Featured Properties Carousel"]');
      if (hero) {
        await hero.screenshot({ path: path.join(OUTPUT_DIR, 'ar-hero-834.png') });
        console.log('Captured: ar-hero-834.png');
      }
      await context.close();
    }

    // Mobile Hero 390
    {
      const context = await browser.newContext({ viewport: VIEWPORTS.mobile });
      const page = await context.newPage();
      await page.goto(BASE_URL);
      await setLanguage(page, 'ar');

      const hero = await page.$('section[aria-label="Featured Properties Carousel"]');
      if (hero) {
        await hero.screenshot({ path: path.join(OUTPUT_DIR, 'ar-hero-390.png') });
        console.log('Captured: ar-hero-390.png');
      }
      await context.close();
    }

    console.log('\nAll RTL typography screenshots captured successfully!');
  } finally {
    await browser.close();
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
