/** @type {import('@playwright/test').PlaywrightTestConfig} */
module.exports = {
    testDir: './frontend/tests',
    timeout: 30000,
    expect: { timeout: 5000 },
    reporter: [['list']],
    projects: [
        {
            name: 'chromium',
            use: { browserName: 'chromium' }
        }
    ]
};
