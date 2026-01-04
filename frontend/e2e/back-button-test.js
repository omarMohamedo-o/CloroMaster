const puppeteer = require('puppeteer');

const BASE = 'http://localhost:3003';
const results = [];
const logs = [];

function log(msg) {
    console.log(msg);
    logs.push(msg);
}

(async () => {
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();

    page.on('console', msg => {
        const text = msg.text();
        logs.push('[console] ' + text);
    });

    const mkdirp = require('fs').mkdirSync;
    try { mkdirp('e2e/screenshots', { recursive: true }); } catch (e) { /* ignore */ }

    // Test 1: Home -> Service -> Back to list
    try {
        await page.goto(BASE, { waitUntil: 'networkidle0' });
        await page.screenshot({ path: 'e2e/screenshots/home.png', fullPage: true });
        await page.waitForSelector('a[href^="/service/"]', { timeout: 5000 });
        const serviceHref = await page.$eval('a[href^="/service/"]', a => a.getAttribute('href'));
        log('Found service link: ' + serviceHref);
        await Promise.all([
            page.click('a[href^="/service/"]'),
            page.waitForNavigation({ waitUntil: 'networkidle0' })
        ]);
        log('Navigated to service detail: ' + page.url());
        await page.screenshot({ path: 'e2e/screenshots/service-detail.png', fullPage: true });

        // click back
        await page.waitForSelector('button[data-back-button="true"]', { timeout: 2000 });
        await Promise.all([
            page.click('button[data-back-button="true"]'),
            page.waitForNavigation({ waitUntil: 'networkidle0' })
        ]);
        const urlAfterBack = page.url();
        log('After back click URL: ' + urlAfterBack);
        results.push({ test: 'ServiceList -> Service -> Back', pass: urlAfterBack === BASE + '/' || urlAfterBack === BASE });
    } catch (e) {
        results.push({ test: 'ServiceList -> Service -> Back', pass: false, error: e.message });
        log('Error test1: ' + e.stack);
    }

    // Test 2: Deep link equipment -> Back to parent service
    try {
        const equipmentSlug = 'drum-lifting-beam';
        await page.goto(BASE + '/equipment/' + equipmentSlug, { waitUntil: 'networkidle0' });
        log('Opened equipment deep link: ' + page.url());
        await page.screenshot({ path: 'e2e/screenshots/equipment.png', fullPage: true });
        await page.waitForSelector('button[data-back-button="true"]', { timeout: 2000 });
        await Promise.all([
            page.click('button[data-back-button="true"]'),
            page.waitForNavigation({ waitUntil: 'networkidle0' })
        ]);
        const urlAfterBack2 = page.url();
        log('After back from equipment: ' + urlAfterBack2);
        const expectedService = BASE + '/service/chlorine-system-solutions';
        results.push({ test: 'Equipment deep link -> Back to parent', pass: urlAfterBack2 === expectedService, expected: expectedService, got: urlAfterBack2 });
    } catch (e) {
        results.push({ test: 'Equipment deep link -> Back to parent', pass: false, error: e.message });
        log('Error test2: ' + e.stack);
    }

    // Test 3: Admin submission detail -> Back to submissions (set token to bypass auth)
    try {
        await page.goto(BASE + '/admin/submissions/1', { waitUntil: 'networkidle0' });
        // set token and reload
        await page.evaluate(() => localStorage.setItem('adminToken', 'dummy'));
        await page.reload({ waitUntil: 'networkidle0' });
        log('Opened admin submission detail: ' + page.url());
        await page.screenshot({ path: 'e2e/screenshots/admin-detail.png', fullPage: true });
        await page.waitForSelector('button[data-back-button="true"]', { timeout: 2000 });
        await Promise.all([
            page.click('button[data-back-button="true"]'),
            page.waitForNavigation({ waitUntil: 'networkidle0' })
        ]);
        const urlAfterBack3 = page.url();
        log('After admin back: ' + urlAfterBack3);
        results.push({ test: 'Admin submission detail -> Back to submissions', pass: urlAfterBack3.endsWith('/admin/submissions'), got: urlAfterBack3 });
    } catch (e) {
        results.push({ test: 'Admin submission detail -> Back to submissions', pass: false, error: e.message });
        log('Error test3: ' + e.stack);
    }

    // Test 4: Not Found service & equipment
    try {
        await page.goto(BASE + '/service/does-not-exist', { waitUntil: 'networkidle0' });
        await page.screenshot({ path: 'e2e/screenshots/service-notfound.png', fullPage: true });
        await page.waitForSelector('button[data-back-button="true"]', { timeout: 2000 });
        await Promise.all([
            page.click('button[data-back-button="true"]'),
            page.waitForNavigation({ waitUntil: 'networkidle0' })
        ]);
        const urlAfterBack4 = page.url();
        log('After back from service not found: ' + urlAfterBack4);
        results.push({ test: 'Service not found -> Back', pass: urlAfterBack4 === BASE + '/' || urlAfterBack4 === BASE, got: urlAfterBack4 });

        await page.goto(BASE + '/equipment/does-not-exist', { waitUntil: 'networkidle0' });
        await page.screenshot({ path: 'e2e/screenshots/equipment-notfound.png', fullPage: true });
        await page.waitForSelector('button[data-back-button="true"]', { timeout: 2000 });
        await Promise.all([
            page.click('button[data-back-button="true"]'),
            page.waitForNavigation({ waitUntil: 'networkidle0' })
        ]);
        const urlAfterBack5 = page.url();
        log('After back from equipment not found: ' + urlAfterBack5);
        results.push({ test: 'Equipment not found -> Back', pass: urlAfterBack5 === BASE + '/' || urlAfterBack5 === BASE, got: urlAfterBack5 });
    } catch (e) {
        results.push({ test: 'NotFound tests', pass: false, error: e.message });
        log('Error test4: ' + e.stack);
    }

    await browser.close();

    console.log('\n=== TEST RESULTS ===');
    console.log(JSON.stringify(results, null, 2));
    console.log('\n=== CONSOLE LOGS (collected) ===');
    console.log(logs.join('\n'));

    // write to file
    const fs = require('fs');
    fs.writeFileSync('e2e/results.json', JSON.stringify({ results, logs }, null, 2));
    process.exit(0);
})();
