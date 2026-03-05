import { Given, When, Then, DataTable, world } from '@cucumber/cucumber'
import { chromium, Page, BrowserContext, Browser, expect } from '@playwright/test';

When('the user logs in with the credentials {string} and {string}', async function(username: string, password: string) {
    let page = this.page!;
    await page.getByRole('row', { name: 'User Name?' }).locator('#username').click();
    await page.getByRole('row', { name: 'User Name?' }).locator('#username').fill(username);
    await page.locator('#password').click();
    await page.locator('#password').fill(password);
    await page.getByRole('link', { name: 'Submit' }).click();
});