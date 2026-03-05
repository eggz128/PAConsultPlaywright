import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { Browser, BrowserContext, chromium, firefox, Page } from 'playwright';

export interface ICustomWorld extends World {
    // Define the 'shape' of your custom world here
    browserconfig?: string | undefined; // Browser CLI config may/may not be set
    initBrowser(): Promise<Browser>; // Async init method - call to init Playwright Browser
    browser: Browser | null; // Playwright Browser will be null if initBrowser not called
    context?: BrowserContext; // Playwright Browser Context
    page?: Page; // Playwright Page
}

export class CustomWorld extends World implements ICustomWorld { // Custom World implementation
    browser: Browser | null = null;

    constructor(options: IWorldOptions) {
        super(options);
        // Synchronous tasks can be done here
        // But constructors cannot be async, so no Playwright calls here
    }
    // Additional custom methods (including async) and properties can be added here
    async initBrowser(): Promise<Browser> {
        //this.browserconfig not directly accessible here, use this.parameters.browserconfig
        switch (this.parameters.browserconfig) { 
            case 'chrome':
                this.browser = await chromium.launch({ headless: false });
                break;
            case 'firefox':
                this.browser = await firefox.launch({ headless: false });
                break;
            default:
                this.log("No browser config found - defaulting to chromium");
                this.browser = await chromium.launch({ headless: false });
                break;
        }
        return this.browser;
    }


}

setWorldConstructor(CustomWorld); // Set Custom World as the World constructor