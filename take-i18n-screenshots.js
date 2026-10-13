/* global process */
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const OUTPUT_DIR = path.resolve('qa-screenshots/i18n-pass');
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const BASE_URL = 'http://localhost:4173';

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
  const docDir = await page.evaluate(() => ({
    lang: document.documentElement.lang,
    dir: document.documentElement.dir,
    dataLocale: document.documentElement.getAttribute('data-locale')
  }));
  console.log(`[${lang}] Document attributes:`, docDir);
}

// English leakage scanner
async function scanEnglishLeaks(page, lang) {
  if (lang === 'en') return [];

  const leaks = await page.evaluate(() => {
    const allowedPatterns = [
      /^suly(\s+estates)?$/i,
      /^whatsapp$/i,
      /^esc$/i,
      /^m²$/i,
      /^\$\d+[\d,]*$/,
      /^\d+(\s*\/\s*\d+)?$/,
      /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
      /^https?:\/\//i
    ];

    const elements = document.querySelectorAll('h1, h2, h3, h4, p, span, a, button, label');
    const detected = [];

    elements.forEach((el) => {
      // Ignore if element or ancestor is brand or explicitly dir=ltr
      if (el.closest('.brand-name') || el.closest('[dir="ltr"]') || el.classList.contains('brand-name')) {
        return;
      }
      const text = el.innerText?.trim();
      if (!text) return;

      // Check if text is predominantly Latin alphabetic (English leak)
      const isAllowed = allowedPatterns.some(p => p.test(text));
      if (isAllowed) return;

      const latinMatches = text.match(/[A-Za-z]{3,}/g);
      if (latinMatches && latinMatches.length > 0) {
        const allowedBrand = new Set(['suly', 'estates', 'whatsapp', 'esc']);
        const englishWords = latinMatches.filter(w => !allowedBrand.has(w.toLowerCase()));
        if (englishWords.length > 0) {
          detected.push({
            tag: el.tagName.toLowerCase(),
            className: el.className,
            text: text.substring(0, 80),
            words: englishWords
          });
        }
      }
    });

    return detected;
  });

  return leaks;
}

async function triggerAllScrollAnimations(page) {
  await page.evaluate(async () => {
    const scrollStep = 400;
    const scrollHeight = document.body.scrollHeight;
    for (let y = 0; y < scrollHeight; y += scrollStep) {
      window.scrollTo(0, y);
      await new Promise(r => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(400);
}

async function run() {
  console.log('Starting Playwright browser for i18n QA...');
  const browser = await chromium.launch({ headless: true });

  const leakReport = { ckb: [], ar: [] };

  try {
    // ----------------------------------------------------
    // 1. ENGLISH PASS
    // ----------------------------------------------------
    console.log('\n--- CAPTURING ENGLISH (EN) ---');
    {
      const context = await browser.newContext({ viewport: VIEWPORTS.desktop });
      const page = await context.newPage();
      await page.goto(BASE_URL);
      await setLanguage(page, 'en');

      // Home 1440 full page with animations triggered
      await triggerAllScrollAnimations(page);
      await page.screenshot({ path: path.join(OUTPUT_DIR, 'en-home-1440.png'), fullPage: true });
      console.log('Captured: en-home-1440.png');

      // Property detail
      await page.goto(`${BASE_URL}/properties/tasluja-villa`);
      await page.waitForLoadState('networkidle');
      await page.screenshot({ path: path.join(OUTPUT_DIR, 'en-property-1440.png') });
      console.log('Captured: en-property-1440.png');

      // Modal open
      await page.click('[data-qa="property-request-details"]');
      await page.waitForTimeout(400);
      await page.screenshot({ path: path.join(OUTPUT_DIR, 'en-modal-1440.png') });
      console.log('Captured: en-modal-1440.png');

      await context.close();

      // Mobile
      const mobContext = await browser.newContext({ viewport: VIEWPORTS.mobile });
      const mobPage = await mobContext.newPage();
      await mobPage.goto(BASE_URL);
      await setLanguage(mobPage, 'en');
      await mobPage.screenshot({ path: path.join(OUTPUT_DIR, 'en-home-390.png'), fullPage: true });
      console.log('Captured: en-home-390.png');
      await mobContext.close();
    }

    // ----------------------------------------------------
    // 2. KURDISH SORANI (CKB) PASS
    // ----------------------------------------------------
    console.log('\n--- CAPTURING KURDISH SORANI (CKB) ---');
    {
      const context = await browser.newContext({ viewport: VIEWPORTS.desktop });
      const page = await context.newPage();
      await page.goto(BASE_URL);
      await setLanguage(page, 'ckb');

      // Check leaks on home
      const homeLeaks = await scanEnglishLeaks(page, 'ckb');
      leakReport.ckb.push(...homeLeaks);

      // Home full page with animations triggered
      await triggerAllScrollAnimations(page);
      await page.screenshot({ path: path.join(OUTPUT_DIR, 'ckb-home-1440.png'), fullPage: true });
      console.log('Captured: ckb-home-1440.png');

      // Specific section captures for visual inspection
      const hero = await page.$('section[aria-label="Featured Properties Carousel"]');
      if (hero) await hero.screenshot({ path: path.join(OUTPUT_DIR, 'ckb-home-hero-1440.png') });

      const featured = await page.$('#properties');
      if (featured) await featured.screenshot({ path: path.join(OUTPUT_DIR, 'ckb-home-featured-1440.png') });

      const approach = await page.$('#approach');
      if (approach) await approach.screenshot({ path: path.join(OUTPUT_DIR, 'ckb-home-approach-1440.png') });

      const neigh = await page.$('#neighborhoods');
      if (neigh) await neigh.screenshot({ path: path.join(OUTPUT_DIR, 'ckb-home-neighborhoods-1440.png') });

      const locMap = await page.$('#locations');
      if (locMap) await locMap.screenshot({ path: path.join(OUTPUT_DIR, 'ckb-home-map-1440.png') });

      const about = await page.$('#about');
      if (about) await about.screenshot({ path: path.join(OUTPUT_DIR, 'ckb-home-about-1440.png') });

      const consult = await page.$('#contact');
      if (consult) await consult.screenshot({ path: path.join(OUTPUT_DIR, 'ckb-home-consultation-1440.png') });

      const footer = await page.$('footer');
      if (footer) await footer.screenshot({ path: path.join(OUTPUT_DIR, 'ckb-home-footer-1440.png') });

      // Language Switcher dropdown open
      await page.click('[data-qa="language-switcher-trigger"]');
      await page.waitForTimeout(200);
      await page.screenshot({ path: path.join(OUTPUT_DIR, 'ckb-lang-dropdown-1440.png') });
      console.log('Captured: ckb-lang-dropdown-1440.png');
      await page.keyboard.press('Escape');

      // Property detail
      await page.goto(`${BASE_URL}/properties/tasluja-villa`);
      await page.waitForLoadState('networkidle');
      const propLeaks = await scanEnglishLeaks(page, 'ckb');
      leakReport.ckb.push(...propLeaks);
      await page.screenshot({ path: path.join(OUTPUT_DIR, 'ckb-property-1440.png'), fullPage: true });
      console.log('Captured: ckb-property-1440.png');

      // Modal open
      await page.click('[data-qa="property-request-details"]');
      await page.waitForTimeout(400);
      const modalLeaks = await scanEnglishLeaks(page, 'ckb');
      leakReport.ckb.push(...modalLeaks);
      await page.screenshot({ path: path.join(OUTPUT_DIR, 'ckb-modal-1440.png') });
      console.log('Captured: ckb-modal-1440.png');

      // Open custom select inside modal
      const selectTrigger = await page.$('#modal-preferred-contact');
      if (selectTrigger) {
        await selectTrigger.click();
        await page.waitForTimeout(250);
        await page.screenshot({ path: path.join(OUTPUT_DIR, 'ckb-modal-select-1440.png') });
        console.log('Captured: ckb-modal-select-1440.png');
        await page.keyboard.press('Escape');
      }

      await page.click('[data-qa="consultation-close"]');
      await page.waitForTimeout(300);

      // Privacy legal page
      await page.goto(`${BASE_URL}/privacy`);
      await page.waitForLoadState('networkidle');
      const privLeaks = await scanEnglishLeaks(page, 'ckb');
      leakReport.ckb.push(...privLeaks);
      await page.screenshot({ path: path.join(OUTPUT_DIR, 'ckb-privacy-1440.png') });
      console.log('Captured: ckb-privacy-1440.png');

      await context.close();

      // Tablet (834)
      const tabContext = await browser.newContext({ viewport: VIEWPORTS.tablet });
      const tabPage = await tabContext.newPage();
      await tabPage.goto(BASE_URL);
      await setLanguage(tabPage, 'ckb');
      await tabPage.screenshot({ path: path.join(OUTPUT_DIR, 'ckb-home-834.png'), fullPage: true });
      console.log('Captured: ckb-home-834.png');
      await tabContext.close();

      // Mobile (390)
      const mobContext = await browser.newContext({ viewport: VIEWPORTS.mobile });
      const mobPage = await mobContext.newPage();
      await mobPage.goto(BASE_URL);
      await setLanguage(mobPage, 'ckb');
      await mobPage.screenshot({ path: path.join(OUTPUT_DIR, 'ckb-home-390.png'), fullPage: true });
      console.log('Captured: ckb-home-390.png');

      // Mobile menu
      await mobPage.click('[data-qa="mobile-menu-trigger"]');
      await mobPage.waitForTimeout(400);
      await mobPage.screenshot({ path: path.join(OUTPUT_DIR, 'ckb-mobile-menu-390.png') });
      console.log('Captured: ckb-mobile-menu-390.png');
      await mobPage.click('button[aria-label="داخستنی مێنیو"]');
      await mobPage.waitForTimeout(300);

      // Mobile property detail
      await mobPage.goto(`${BASE_URL}/properties/tasluja-villa`);
      await mobPage.waitForLoadState('networkidle');
      await mobPage.screenshot({ path: path.join(OUTPUT_DIR, 'ckb-property-390.png') });
      console.log('Captured: ckb-property-390.png');

      // Mobile modal
      await mobPage.click('[data-qa="property-request-details"]');
      await mobPage.waitForTimeout(400);
      await mobPage.screenshot({ path: path.join(OUTPUT_DIR, 'ckb-modal-390.png') });
      console.log('Captured: ckb-modal-390.png');

      await mobContext.close();
    }

    // ----------------------------------------------------
    // 3. ARABIC (AR) PASS
    // ----------------------------------------------------
    console.log('\n--- CAPTURING ARABIC (AR) ---');
    {
      const context = await browser.newContext({ viewport: VIEWPORTS.desktop });
      const page = await context.newPage();
      await page.goto(BASE_URL);
      await setLanguage(page, 'ar');

      // Check leaks on home
      const homeLeaks = await scanEnglishLeaks(page, 'ar');
      leakReport.ar.push(...homeLeaks);

      // Home full page with animations triggered
      await triggerAllScrollAnimations(page);
      await page.screenshot({ path: path.join(OUTPUT_DIR, 'ar-home-1440.png'), fullPage: true });
      console.log('Captured: ar-home-1440.png');

      // Specific section captures for visual inspection
      const hero = await page.$('section[aria-label="Featured Properties Carousel"]');
      if (hero) await hero.screenshot({ path: path.join(OUTPUT_DIR, 'ar-home-hero-1440.png') });

      const featured = await page.$('#properties');
      if (featured) await featured.screenshot({ path: path.join(OUTPUT_DIR, 'ar-home-featured-1440.png') });

      const approach = await page.$('#approach');
      if (approach) await approach.screenshot({ path: path.join(OUTPUT_DIR, 'ar-home-approach-1440.png') });

      const neigh = await page.$('#neighborhoods');
      if (neigh) await neigh.screenshot({ path: path.join(OUTPUT_DIR, 'ar-home-neighborhoods-1440.png') });

      const locMap = await page.$('#locations');
      if (locMap) await locMap.screenshot({ path: path.join(OUTPUT_DIR, 'ar-home-map-1440.png') });

      const about = await page.$('#about');
      if (about) await about.screenshot({ path: path.join(OUTPUT_DIR, 'ar-home-about-1440.png') });

      const consult = await page.$('#contact');
      if (consult) await consult.screenshot({ path: path.join(OUTPUT_DIR, 'ar-home-consultation-1440.png') });

      const footer = await page.$('footer');
      if (footer) await footer.screenshot({ path: path.join(OUTPUT_DIR, 'ar-home-footer-1440.png') });

      // Language Switcher dropdown open
      await page.click('[data-qa="language-switcher-trigger"]');
      await page.waitForTimeout(200);
      await page.screenshot({ path: path.join(OUTPUT_DIR, 'ar-lang-dropdown-1440.png') });
      console.log('Captured: ar-lang-dropdown-1440.png');
      await page.keyboard.press('Escape');

      // Property detail
      await page.goto(`${BASE_URL}/properties/tasluja-villa`);
      await page.waitForLoadState('networkidle');
      const propLeaks = await scanEnglishLeaks(page, 'ar');
      leakReport.ar.push(...propLeaks);
      await page.screenshot({ path: path.join(OUTPUT_DIR, 'ar-property-1440.png'), fullPage: true });
      console.log('Captured: ar-property-1440.png');

      // Modal open
      await page.click('[data-qa="property-request-details"]');
      await page.waitForTimeout(400);
      const modalLeaks = await scanEnglishLeaks(page, 'ar');
      leakReport.ar.push(...modalLeaks);
      await page.screenshot({ path: path.join(OUTPUT_DIR, 'ar-modal-1440.png') });
      console.log('Captured: ar-modal-1440.png');

      // Open custom select inside modal
      const selectTrigger = await page.$('#modal-preferred-contact');
      if (selectTrigger) {
        await selectTrigger.click();
        await page.waitForTimeout(250);
        await page.screenshot({ path: path.join(OUTPUT_DIR, 'ar-modal-select-1440.png') });
        console.log('Captured: ar-modal-select-1440.png');
        await page.keyboard.press('Escape');
      }

      await page.click('[data-qa="consultation-close"]');
      await page.waitForTimeout(300);

      // Privacy legal page
      await page.goto(`${BASE_URL}/privacy`);
      await page.waitForLoadState('networkidle');
      const privLeaks = await scanEnglishLeaks(page, 'ar');
      leakReport.ar.push(...privLeaks);
      await page.screenshot({ path: path.join(OUTPUT_DIR, 'ar-privacy-1440.png') });
      console.log('Captured: ar-privacy-1440.png');

      await context.close();

      // Tablet (834)
      const tabContext = await browser.newContext({ viewport: VIEWPORTS.tablet });
      const tabPage = await tabContext.newPage();
      await tabPage.goto(BASE_URL);
      await setLanguage(tabPage, 'ar');
      await tabPage.screenshot({ path: path.join(OUTPUT_DIR, 'ar-home-834.png'), fullPage: true });
      console.log('Captured: ar-home-834.png');
      await tabContext.close();

      // Mobile (390)
      const mobContext = await browser.newContext({ viewport: VIEWPORTS.mobile });
      const mobPage = await mobContext.newPage();
      await mobPage.goto(BASE_URL);
      await setLanguage(mobPage, 'ar');
      await mobPage.screenshot({ path: path.join(OUTPUT_DIR, 'ar-home-390.png'), fullPage: true });
      console.log('Captured: ar-home-390.png');

      // Mobile menu
      await mobPage.click('[data-qa="mobile-menu-trigger"]');
      await mobPage.waitForTimeout(400);
      await mobPage.screenshot({ path: path.join(OUTPUT_DIR, 'ar-mobile-menu-390.png') });
      console.log('Captured: ar-mobile-menu-390.png');
      await mobPage.click('button[aria-label="إغلاق القائمة"]');
      await mobPage.waitForTimeout(300);

      // Mobile property detail
      await mobPage.goto(`${BASE_URL}/properties/tasluja-villa`);
      await mobPage.waitForLoadState('networkidle');
      await mobPage.screenshot({ path: path.join(OUTPUT_DIR, 'ar-property-390.png') });
      console.log('Captured: ar-property-390.png');

      // Mobile modal
      await mobPage.click('[data-qa="property-request-details"]');
      await mobPage.waitForTimeout(400);
      await mobPage.screenshot({ path: path.join(OUTPUT_DIR, 'ar-modal-390.png') });
      console.log('Captured: ar-modal-390.png');

      await mobContext.close();
    }

  } finally {
    await browser.close();
  }

  // Save leak report
  fs.writeFileSync(path.join(OUTPUT_DIR, 'leak_report.json'), JSON.stringify(leakReport, null, 2));
  console.log('\n--- ENGLISH LEAKAGE REPORT ---');
  console.log(`Kurdish Sorani leaks detected: ${leakReport.ckb.length}`);
  if (leakReport.ckb.length > 0) console.log(leakReport.ckb);
  console.log(`Arabic leaks detected: ${leakReport.ar.length}`);
  if (leakReport.ar.length > 0) console.log(leakReport.ar);
  console.log('\nQA Screenshots and Leak Inspection complete!');
}

run().catch(err => {
  console.error('QA script failed:', err);
  process.exit(1);
});
