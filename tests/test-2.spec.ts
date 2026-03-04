import { test, expect } from '@playwright/test';

test("compare runtime images", async ({ page, browserName }, testInfo) => {
  await page.goto("https://www.edgewordstraining.co.uk/webdriver2/docs/forms.html");

  await page.locator('#textInput').fill("Hello World"); //Set intial state

  //ToDo: capture screenshot of text box in memory
  //Capture in mem is easy - doing the expect on it after, not so much as PlayWright expect .toMatchSnapshot() expects the screenshot to be on disk
  //See https://github.com/microsoft/playwright/issues/18937

  //const originalimage = await page.locator('#textInput').screenshot();
  //originalimage is now a buffer object with the screenshot. You could use a 3rd party js lib to do the comparison... but if we're sticking to Playwright only...

  //await expect(page.locator('#textInput')).toHaveScreenshot('textbox')
  //No good as PW wants to capture the screenshot on the first run and use that screenshot for following runs. We want to capture and use on this run. So...

  await page.locator('#textInput').screenshot({ path: `${testInfo.snapshotDir}/textbox2-${browserName}-${testInfo.snapshotSuffix}.png` })
  //screenshots will need to vary by browser and OS, and be saved in to the test snapshot directory for .toMatchSnapshot() to find them


  //Change element text
  await page.locator('#textInput').fill("Hello world"); //Alter the state (right now this is the same as initially set so following expect *should* pass)
  //change to e.g. "Hello world"

  //Recapture screenshot, compare to previous (on disk) version.
  expect(await page.locator('#textInput').screenshot()).toMatchSnapshot('textbox2.png')

  //Now go look at the html report
});

test('Capturing Text', async ({ page }) => {

  await page.goto("https://www.edgewordstraining.co.uk/webdriver2/docs/forms.html");
  await page.locator('#textInput').fill("Hello World");

  let textPromise = page.locator('#right-column').textContent();
  console.log("Without 'await'ing textContent() you get a 'promise' of the future text, not the actual text");
  console.log(textPromise);

  let rightColText = await page.locator('#right-column').textContent(); //Includes whitespace in HTML file

  console.log("The right column text is with textContent is: " + rightColText);

  rightColText = await page.locator('#right-column').innerText(); //Captures text after browser layout has happened (eliminating most whitespace)

  console.log("The right column text is with innertext is: " + rightColText);

  let textBoxText: string = await page.locator('#textInput').textContent() ?? ""; //TS: if textContent() returns null, retuen empty string "" instead
  console.log("The text box contains" + textBoxText); //blank as <input> has no inner text

  //Using generic $eval to get the browser to return the INPUT text
  //This will *not* retry or wait
  textBoxText = await page.$eval('#textInput', (el: HTMLInputElement) => el.value); //el is an in browser HTML element - not a Playwright object at all.
  
  console.log("The text box actually contains: " + textBoxText);

  await page.$eval('#textInput', elm => {
    console.log(typeof (elm)); //Writes to browser's console! Not NodeJS console.
  });

  await page.locator('#textInput').evaluate(elm => { //using locator().evaluate() the locator will be retried if no element found
    console.log(elm); //Also outputs to browser console.
  });

  expect(textBoxText).toBe("Hello World");
  await expect(page).toHaveTitle("Forms", { timeout: 5000 }) //Override global config with a custom expect timeout
});

test('Generic methods', { tag: ['@RunMe', '@Smoke'] }, async ({ page }) => {

  await page.goto("https://www.edgewordstraining.co.uk/webdriver2/docs/forms.html")

  const menuLinks = await page.$$eval('#menu a', (links) => links.map((link) => link.textContent))
  console.log(`There are ${menuLinks.length} links`)

  console.log("The link texts are:")

  for (const iterator of menuLinks) {
    console.log(iterator!.trim())
  }
  //$eval and $$eval DONT retry. If the locator doesnt find a matching element(s) then you get null.

  //Preferred - using retry-able Playwright locators
  const preferredLinks = await page.locator('#menu a').all();
  for (const elm of preferredLinks) {
    // const elmtext = await elm.textContent();
    // const elmtexttrimmed = elmtext?.trim(); //Combine these two steps below
    console.log(`${await elm.textContent().then(text => { return text?.trim() })}`)
  }
});

test('Waits', async ({ page }) => {
  //test.slow(); //Treble default test timeout
  //test.setTimeout(10000); //This test has 10s (instead of config set or default 30s)
  //page.setDefaultTimeout(6000) //Default action timeout for this test only
  await page.goto('https://www.edgewordstraining.co.uk/webdriver2/');
  await page.getByRole('link', { name: 'Access Basic Examples Area' }).click();
  await page.getByRole('link', { name: 'Dynamic Content' }).click();

  await page.pause();

  await page.locator('#delay').click();
  await page.locator('#delay').fill('10');
  await page.getByRole('link', { name: 'Load Content' }).click();
   
  //await page.locator('#image-holder > img').click({timeout: 3000}); //Action timeout can be set per action
  const loadingSpinner = page.locator('#spinner-holder > img');
  await loadingSpinner.waitFor({state: 'hidden', timeout: 60000})
  //await page.waitForSelector('#image-holder > img', { state: 'hidden', timeout: 6000 })
  await page.locator('#image-holder > img').click();
  await page.getByRole('link', { name: 'Home' }).click();
});

test("Waiting for a pop up window", async ({ page, context }) => {

  await page.goto("https://www.edgewordstraining.co.uk/webdriver2/docs/dynamicContent.html")

  //[a,b] = [10,20] - aray destructuring syntax will assign a=10 b=20
  //Below we discard the second promise return value - we only need the first which gets us a handle to the new page
  const [newSpawnedPage] = await Promise.all([ //When these two "future" actions complete return the new page fixture
    context.waitForEvent('page'),
    page.locator("#right-column > a[onclick='return popUpWindow();']").click()
  ])

  await page.waitForTimeout(2000); //Essentially a Thread.sleep(2000); - try to avoid this as other wait types can exit early if condition is met


  const closeBtn = newSpawnedPage.getByRole('link', { name: 'Close Window' })
  await closeBtn.click();

  await page.getByRole('link', { name: 'Load Content' }).click();

});

test('Screenshots and reporting @SomeTeg @SomeOtherTag', 
  
  {
    tag: ['@smoke', '@regression'],
    annotation: [
        { type: "Custom annotation 1", description: "This is a custom annotation" }, //Could be useful to include links to specific issues this test covers
        { type: "Custom annotation 2", description: "This is another custom annotation" }
    ]
},
    async ({ page, browserName }, testInfo) => { //testInfo givers access to the report, and other test information

        await page.goto('https://www.edgewordstraining.co.uk/webdriver2/docs/basicHtml.html');
        const screenshot = await page.screenshot(); //Capture screenshot bitmap in variable. Note there is not an easy way to assert on this currently. See workaround test.
        await page.screenshot({ path: './manualscreenshots/screenshot-viewport.png' });
        await page.screenshot({ path: './manualscreenshots/screenshot-fullpage.png', fullPage: true });

        const htmlTable = page.locator('#htmlTable');
        await htmlTable.screenshot({ path: './manualscreenshots/screenshot-table.png' }); //Just the table, not the whole page

        await page.locator('#htmlTable').screenshot({
            path: './manualscreenshots/highlight-htmltable.png',
            mask: [page.locator('#TableVal2')], //Redact or highlight this element
            maskColor: 'rgba(214, 21, 179,0.5)', //default mask colour is magenta #ff00ff
            style: `#htmlTable tr:nth-child(3) {border: 10px solid red}
            table#htmlTable {border-collapse: collapse}
    ` //HTML table rows cannot have a border unless the table's border collapse model is set to collapse
        })

        if (browserName === "chromium") { //PDF generation only works on Chromium browsers, and can be headless/headed (error is misleading)
            await page.pdf({ path: './manualscreenshots/printed.pdf' })
        }


        console.log("Appears in std out section of the report") //In report at bottom, displayed in terminal at run time
        //Attaching arbitary data to the report.
        await testInfo.attach('Write some arbitary text to the report', { body: 'Hello World', contentType: 'text/plain' });
        await testInfo.attach('Masked Screenshot', { path: './manualscreenshots/highlight-htmltable.png', contentType: 'image/png' });
        await testInfo.attach('Screenshot from variable', { body: screenshot, contentType: 'image/png' });
    });