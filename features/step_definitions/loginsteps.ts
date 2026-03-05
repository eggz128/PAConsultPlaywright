import { Given, When, Then, DataTable } from '@cucumber/cucumber'
import { chromium, firefox, Page, BrowserContext, Browser, expect } from '@playwright/test';
import { ICustomWorld } from '../support/customWorld';
import { LoginPagePOM } from '../support/POMClasses/LoginPagePOM'

let browser: Browser
let context: BrowserContext
let page: Page

Given('the user is on the login page', async function (this: ICustomWorld) {
    // Bring up the browser, context and page manually as cucumber won't do it for us like PW Test did.
    // await this.initBrowser() // Call our custom world method to init the browser
    // this.context = await this.browser!.newContext();
    // this.page = await this.context.newPage();

    let page = this.page!

    await page.goto('https://www.edgewordstraining.co.uk/webdriver2/sdocs/auth.php');
});

When('the user enters valid credentials', async function (this: ICustomWorld) {
    // Write code here that turns the phrase above into concrete actions
    let page = this.page!;
    // await page.getByRole('row', { name: 'User Name?' }).locator('#username').click();
    // await page.getByRole('row', { name: 'User Name?' }).locator('#username').fill('edgewords');
    // await page.locator('#password').click();
    // await page.locator('#password').fill('edgewords123');
    // await page.getByRole('link', { name: 'Submit' }).click();
    const loginPage = new LoginPagePOM(page);
    await loginPage.login('edgewords','edgewords123');

});

Then('the user should be redirected to the Add A Record page', async function (this: ICustomWorld) {
    let page = this.page!;
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

Then('the page should have these links visible:', async function (this: ICustomWorld, dataTable: DataTable) {
    let page = this.page!;
    const expectedLinks = dataTable.hashes();
    //[ { text: 'Login' }, { text: 'Register' } ]
    for (const row of expectedLinks) {
        const linkText = row['Text'];
        //console.log("The link text is: " + linkText)
        const linkLocator = page.getByRole('link', { name: linkText });
        await expect(linkLocator).toBeVisible();
    }
});