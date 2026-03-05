import { Page, Locator } from '@playwright/test'

export class LoginPagePOM {

    page: Page
    //Locator fields
    usernameField: Locator
    passwordField: Locator
    submitBtn: Locator
    #clearBtn: Locator //# makes this field a private element of the class. The test wont see this.
    private register: Locator //TS access modifier. Enforced by TS compiler but not at runtime.

    constructor(page: Page) {
        this.page = page;
        this.usernameField = page.locator('#username:visible');
        this.passwordField = page.locator('#password');
        this.submitBtn = page.getByRole('link', { name: 'Submit' });
        this.#clearBtn = page.getByRole('link', { name: 'Clear' });
        this.register = page.getByRole('link', { name: 'Register' })
    }

    //"Low level" service methods - have there return this to make fluid API
    async setUsername(username: string): Promise<this> {
        await this.usernameField.fill(username);
        return this; //But look at how this is used in the test...not great.
    }

    async setPassword(username: string): Promise<this> {
        await this.passwordField.fill(username);
        return this;
    }

    async submitForm() {
        await this.submitBtn.click();
    }

    async clearForm(username: string) {
        await this.#clearBtn.click();
    }



    //Service Methods - could use lower level methods above

    async login(username: string, password: string) {
        await this.usernameField.press('Control+A')
        await this.usernameField.press('Enter')
        await this.usernameField.pressSequentially(username, { delay: 500 });
        await this.passwordField.fill(password);
        await this.submitBtn.click();
    }
}