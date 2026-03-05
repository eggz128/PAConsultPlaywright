import { BeforeAll, Before, After, AfterAll, AfterStep, Status, setDefaultTimeout } from "@cucumber/cucumber";
import { Browser, chromium, firefox } from "playwright";
import { ICustomWorld } from "./customWorld";

//setDefaultTimeout(process.env.PWDEBUG ? -1 : 60 * 1000);
//Note that the timeout wont be configurable via a world parameter here
//But you could set it with an ENV var...

let browser: Browser;

BeforeAll({name: "Start browser based on browserconfig"},async function () {
    
    // Runs once before all scenarios

    console.log("Starting test suite");
    console.log("browserconfig param set to: ", this.parameters.browserconfig);
    switch (this.parameters.browserconfig) {
        case 'chrome':
            browser = await chromium.launch({ headless: false });
            break;
        case 'firefox':
            browser = await firefox.launch({ headless: false });
            break;
        default:
            console.log("No browser config found - defaulting to chromium");
            browser = await chromium.launch({ headless: false });
            break;
    }
});

Before({ tags: '@ignore' }, function () {
  return 'skipped'; // Skip scenarios tagged with @ignore - no need for cli
});

AfterStep({tags: '@web'}, async function(this: ICustomWorld,{result}){
    if(result.status === Status.FAILED) {
        let screenshot = await this.page?.screenshot();
        this.attach(screenshot!, 'image/png')
    }
})

Before(async function (this: ICustomWorld, { pickle }) {
    // Runs before each scenario
    console.log("Starting new scenario");
    let options = {};
    
    //Check if pickle.tags has @web, if so, create context and page
    const tags = pickle.tags.map(tag => tag.name);
    if (tags.includes('@mobileweb')) {
        //add {viewport: { width: 375, height: 667 }}; to options
        options = { viewport: { width: 375, height: 667 } };
    }
    this.context = await browser.newContext(options); //Establish fresh context per scenario
    this.page = await this.context.newPage(); //Establish fresh page per scenario
});

After(async function (this: ICustomWorld) {
    // Runs after each scenario
    console.log("Scenario complete");
    if (this.page) { //Destroy page and context after each scenario
        await this.page.close();
        await this.context?.close();
    }
});

AfterAll(async function () {
    // Runs once after all scenarios
    console.log("Test suite complete");
    await browser.close(); //Close the browser after all scenarios
});