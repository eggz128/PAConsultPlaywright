import { expect } from '@playwright/test'
import { HomePagePOM } from './POMClasses/HomePagePOM';
import { LoginPagePOM } from './POMClasses/LoginPagePOM';
import logins from './TestData/logins.json'
import {test} from './my-test'

test('Login with POM', async ({ page }) => {
    await page.goto('https://www.edgewordstraining.co.uk/webdriver2/');
    //Init HomepagePOM
    const home = new HomePagePOM(page);
    await home.goLogin();
    const loginPage = new LoginPagePOM(page);
    //"Object Repository" - use locators defined in the class directly for actions
    await loginPage.usernameField.fill('edgewords')
    //"Low level service methods"
    // await loginPage.setUsername('edgewords');
    // await loginPage.setPassword('edgewords123');
    // await loginPage.submitForm();
    //"High level" service methods
    // await loginPage.login('edgewords','edgewords123')

})

for (let data of logins) {

    test(`Login with POM using ${data.username}`, async ({ page }) => {
        await page.goto('https://www.edgewordstraining.co.uk/webdriver2/');
        //Init HomepagePOM
        const home = new HomePagePOM(page);
        await home.goLogin();
        const loginPage = new LoginPagePOM(page);

        await loginPage.setUsername(data.username);
        await loginPage.setPassword(data.password);
        await loginPage.submitForm();
    })
};


test(`Login with POM using ENV vars`, async ({ page }) => {
    await page.goto('https://www.edgewordstraining.co.uk/webdriver2/');
    //Init HomepagePOM
    const home = new HomePagePOM(page);
    await home.goLogin();
    const loginPage = new LoginPagePOM(page);

    await loginPage.setUsername(process.env.PWUSER ?? "");
    await loginPage.setPassword('edgewords123');
    await loginPage.submitForm();
})

test(`Login with POM using Parameterised`, async ({ page, person }) => {
    await page.goto('https://www.edgewordstraining.co.uk/webdriver2/');
    //Init HomepagePOM
    const home = new HomePagePOM(page);
    await home.goLogin();
    const loginPage = new LoginPagePOM(page);

    await loginPage.setUsername(person);
    await loginPage.setPassword('edgewords123');
    await loginPage.submitForm();
})