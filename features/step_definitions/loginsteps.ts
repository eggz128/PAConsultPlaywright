import { Given, When, Then, DataTable } from '@cucumber/cucumber'
import { chromium, Page, BrowserContext, Browser, expect } from '@playwright/test';

let browser: Browser
let context: BrowserContext
let page: Page

Given('the user is on the login page', async function () {
    // Write code here that turns the phrase above into concrete actions
    browser = await chromium.launch({ headless: false });
    context = await browser.newContext({});
    page = await context.newPage();

    this.page = page;

    await page.goto('https://www.edgewordstraining.co.uk/webdriver2/sdocs/auth.php');
});

When('the user enters valid credentials', async function () {
    // Write code here that turns the phrase above into concrete actions
    await page.getByRole('row', { name: 'User Name?' }).locator('#username').click();
    await page.getByRole('row', { name: 'User Name?' }).locator('#username').fill('edgewords');
    await page.locator('#password').click();
    await page.locator('#password').fill('edgewords123');
    await page.getByRole('link', { name: 'Submit' }).click();
});

Then('the user should be redirected to the Add A Record page', async () => {
    await expect(page.locator('h1')).toContainText('Add A Record To the Database');
})


// When(/the user logs in with the credentials \"(.*)\" and \"(.*)\"/, async function (string, string2) {
//     // Write code here that turns the phrase above into concrete actions
//     return 'pending';
// });

// Then('the user should be redirected to the Add A Record page', async function () {
//     // Write code here that turns the phrase above into concrete actions
//     return 'pending';
// });

Then('the page should have these links visible:', async function (dataTable: DataTable) {
    const expectedLinks = dataTable.hashes();
    //[ { text: 'Login' }, { text: 'Register' } ]
    for (const row of expectedLinks) {
        const linkText = row['Text'];
        //console.log("The link text is: " + linkText)
        const linkLocator = page.getByRole('link', { name: linkText });
        await expect(linkLocator).toBeVisible();
    }
});