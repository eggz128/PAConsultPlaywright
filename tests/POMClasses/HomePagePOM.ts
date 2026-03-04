import { Page, Locator } from "@playwright/test";

export class HomePagePOM {
    HomePageLink: Locator;
    Page: Page;

    constructor(page: Page){
        this.HomePageLink = page.getByRole('link', {name: 'Login to restricted'});
        this.Page = page;
    }

    //Service Methods
    async goLogin(){
        await this.HomePageLink.click();
    }


} 