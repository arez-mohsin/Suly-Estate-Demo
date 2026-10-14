import { chromium } from 'playwright';

// Network conditions:
// Fast 4G: 1.6 Mbps download, 750 Kbps upload, 40ms RTT
// Slow 4G: 500 Kbps download, 500 Kbps upload, 200ms RTT (or 400 Kbps)
const NETWORK_PROFILES = {
  fast4G: {
    download: (1.6 * 1024 * 1024) / 8, // 200 KB/s
    upload: (750 * 1024) / 8,
    latency: 40
  },
  slow4G: {
    download: (500 * 1024) / 8, // 62.5 KB/s
    upload: (500 * 1024) / 8,
    latency: 200
  }
};

async function measureBaseline(viewport, networkProfile, profileName) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: viewport
  });

  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);

  if (networkProfile) {
    await cdp.send('Network.emulateNetworkConditions', {
      offline: false,
      downloadThroughput: networkProfile.download,
      uploadThroughput: networkProfile.upload,
      latency: networkProfile.latency
    });
  }

  const imageRequests = [];
  let totalImageBytes = 0;

  page.on('response', (response) => {
    const url = response.url();
    const contentType = response.headers()['content-type'] || '';
    if (url.includes('/images/') || contentType.startsWith('image/')) {
      const len = parseInt(response.headers()['content-length'] || '0', 10);
      totalImageBytes += len;
      imageRequests.push({
        url: url.replace('http://localhost:4173', ''),
        sizeKB: Math.round(len / 1024),
        status: response.status()
      });
    }
  });

  await page.goto('http://localhost:4173', { waitUntil: 'networkidle', timeout: 45000 });

  // Measure LCP using PerformanceObserver in page
  const lcp = await page.evaluate(() => {
    return new Promise((resolve) => {
      let lcpEntry = null;
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        if (entries.length > 0) {
          lcpEntry = entries[entries.length - 1];
        }
      });
      observer.observe({ type: 'largest-contentful-paint', buffered: true });

      setTimeout(() => {
        observer.disconnect();
        resolve(lcpEntry ? {
          startTime: Math.round(lcpEntry.startTime),
          size: lcpEntry.size,
          url: lcpEntry.url,
          element: lcpEntry.element ? lcpEntry.element.tagName : null
        } : null);
      }, 3000);
    });
  });

  await browser.close();

  return {
    viewport: `${viewport.width}x${viewport.height}`,
    profile: profileName,
    lcp,
    totalImageCount: imageRequests.length,
    totalImageKB: Math.round(totalImageBytes / 1024),
    images: imageRequests
  };
}

async function run() {
  console.log('--- BASELINE PERFORMANCE BENCHMARK ---');

  console.log('Testing 1440x900 (Fast 4G)...');
  const dFast = await measureBaseline({ width: 1440, height: 900 }, NETWORK_PROFILES.fast4G, 'Fast 4G');
  console.log(`Desktop Fast 4G LCP: ${dFast.lcp?.startTime}ms, Total Images: ${dFast.totalImageCount}, Total Image Size: ${dFast.totalImageKB} KB`);

  console.log('Testing 390x844 (Fast 4G)...');
  const mFast = await measureBaseline({ width: 390, height: 844 }, NETWORK_PROFILES.fast4G, 'Fast 4G');
  console.log(`Mobile Fast 4G LCP: ${mFast.lcp?.startTime}ms, Total Images: ${mFast.totalImageCount}, Total Image Size: ${mFast.totalImageKB} KB`);

  console.log('Testing 390x844 (Slow 4G)...');
  const mSlow = await measureBaseline({ width: 390, height: 844 }, NETWORK_PROFILES.slow4G, 'Slow 4G');
  console.log(`Mobile Slow 4G LCP: ${mSlow.lcp?.startTime}ms, Total Images: ${mSlow.totalImageCount}, Total Image Size: ${mSlow.totalImageKB} KB`);

  console.log('\nMobile Initial Images Loaded:');
  mFast.images.forEach(img => console.log(`  - ${img.url}: ${img.sizeKB} KB`));
}

run().catch(console.error);
