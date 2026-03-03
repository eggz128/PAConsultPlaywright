import { test, expect } from '@playwright/test';

//1st arg = test name, 2nd arg = the test code (in an async funtion)
test('Login Test', async ({ page }) => { //"page" fixture is passed to the test. This takes are of openeing the browser and supplying a "page" to work with

  //Generally you should "await" things that require some action to occur in the browser. In this case "(a)wait" the page to complete loading
  await page.goto('/webdriver2/');

  //Tool--->Find something--->do something with it
  //await page.getByRole('link', { name: 'Login To' }).click();
  await page.getByText(/.*OGIN /i, //Find an element via RegEx that contains "OGIN" - case insensitive
    { exact: true }) //This would normally make the search case sensitive - but the regex already made it insensitive
    .click(); //Assuming there is an element found - click it.

  //If an element needs to be used multiple times, consider creating a "friendly named" variable to hold the locator
  const userName = page.getByRole('row', { name: 'User Name?' }).locator('#username').describe("The username field");
  await userName.click(); //You can then reference the variable when you want to perform actions
  await userName.fill('edgewords');

  //The equivalent WebDriver code here would fail
  await page.goBack();
  await page.goForward();
  await userName.fill('edgewords'); //WebDriver: Stale element - you would need to re-seach for the username before using the reference
  //In Playwright the search is performed *when the action occurs*. The act if fill() triggers a fresh search for the element.


  //WD: driver.findElement(By.cssSelector("#password")).click();
  //cy: cy.get('#password').click();
  await page.locator('#password').click(); //Using CSS. You could also use css=#password
  await page.locator('//*[@id="password"]').fill('edgewords123'); //Equivakent XPath

  //await page.getByRole('link', { name: 'Submit' }).click();
  await page.locator('a:left-of(:text("Clear"))').filter({ visible: true }).nth(0).click(); //Relational identifiers, filtering through multiple matches and picking n of a set of matches.

  expect(page.locator('h1')).toContainText('Add A Record To the Database');
});

test('Ecommerce', async ({ page }) => {
  await page.goto('https://www.edgewordstraining.co.uk/demo-site/');
  await page.getByRole('searchbox', { name: 'Search for:' }).click();
  await page.getByRole('searchbox', { name: 'Search for:' }).fill('belt');
  await page.getByRole('searchbox', { name: 'Search for:' }).press('Enter');
  await page.getByRole('button', { name: 'Add to cart' }).click();
  await page.getByRole('searchbox', { name: 'Search for:' })
})

test('all products', async ({ page }) => {

  await page.goto('https://www.edgewordstraining.co.uk/demo-site/');
  const newProducts = page.getByLabel('Recent Products');
  for (const prod of await newProducts.locator('h2:not(.section-title)').all()) { //gathers a collection of all() matching elements
    console.log(await prod.textContent()); //then loops over each individual matches logging the text
  }; //No need to await console, but you do need to await the locator. Or you will only get the "promise" of the text, not the actual text.

});

test('Locator Handler', async ({ page }) => { //How to handle unpredicatable modal "pop ups"
  // Setup the handler.
  const cookieConsent = page.getByRole('heading', { name: 'Hej! You are in control of your cookies.' });
  await page.addLocatorHandler(
    cookieConsent, //Locator to watch out for
    async () => { //If spotted, what to do
      await page.getByRole('button', { name: 'Accept' }).click();
    }
    , //Optional arguments - can be omitted
    {
      times: 10, //How many times the locator may appear before the handler should stop handling the locator
      //By default Playwright will wait for the locator to no longer be visible before continuing with the test.
      noWaitAfter: false //this can be overridden however
    }
  );

  // Now write the test as usual. If at any time the cookie consent form is shown it will be accepted.
  await page.goto('https://www.ikea.com/');
  await page.getByRole('link', { name: "40 years of the IKEA meatball" }).click();
  await expect(page.getByRole('heading', { name: "40 years of having a ball" })).toBeVisible();

  //If you're confident the locator will no longer be found you can de-register the handler
  //await page.removeLocatorHandler(cookieConsent);
  //If the cookie consent form appears from here on it may cause issues with the test...
  await page.waitForTimeout(5000); //Big dumb wait before finishing the test
})

test('Actions', async ({ page }) => {
  await page.goto('https://www.edgewordstraining.co.uk/webdriver2/');

  await page.getByRole('link', { name: 'Access Basic Examples Area' }).click();
  await page.getByRole('link', { name: 'Forms' }).click({ position: { x: 10, y: 10 } }); //Normally clicks happen in the center of an element
  
  //When "expecting"/"asserting" in PW you typically dont capture a value first and "expect" on that value directly
  //Instead supply a locator (in this case the page as a whole) - this means the assertion can be retried if the element doesnt hold the desired value straight away
  await expect(page).toHaveURL(/forms\.html$/) //Should be on forms.html (RegEx ensure URL ends with that)

  await page.locator('#textInput').click();
  await page.locator('#textInput').fill('Hello World');
  await page.locator('#textInput').fill('HELLO WORLD'); //Fill replaces any pre-existing text
  //await page.locator('#textInput').clear(); //fill() and clear() are 'magic' in that no actual keypresses are sent
  await page.locator('#textInput').press('Control+a'); //Press sends keypresses and can be used to simulate "real user" clears
  await page.locator('#textInput').press('Backspace');
  await page.locator('#textInput').pressSequentially('Hello World', { delay: 500 }); //PressSequentially is like WD .sendKeys() - it sends real keypresses and wont pre-clear text boxes

  await expect(page.locator('#textInput')).toHaveScreenshot('textbox.png', { //On first run a "golden sample" is captured and written to disc. Following runs cheack against that sample.
    threshold: 0.9, //Allowable colour variance 0-1
    //maxDiffPixelRatio: 0.9, //Allowable different pixels 0-1
    maxDiffPixels : 100 //Exact number of pixel allowed to differ
  }) //Will still fail regardless if the image sizes don't match

  //Aria snapshots can be used to verify the "coarse" page structure
  //If "soft" expects fail the test fails, but execution in test is allowed to continue
  await expect.soft(page.locator('#right-column')).toMatchAriaSnapshot(`
    - heading "Forms" [level=1]
    - paragraph: This form has an id of theForm.
    - table:
      - rowgroup:
        - row "Text Input with id/name textInput *":
          - cell "Text Input with id/name textInput *"
          - cell:
            - textbox
        - row "Text Area with id/name textArea":
          - cell "Text Area with id/name textArea"
          - cell:
            - textbox
        - row "Checkbox with id/name checkbox":
          - cell "Checkbox with id/name checkbox"
          - cell:
            - checkbox
        - row "Select with id/name select Selection One":
          - cell "Select with id/name select"
          - cell "Selection One":
            - combobox:
              - option "Selection One" [selected]
              - option "Selection Two"
              - option "Selection Three"
        - row "Radio buttons with id/name radio One Two Three":
          - cell "Radio buttons with id/name radio"
          - cell "One Two Three":
            - radio [checked]
            - text: ""
            - radio
            - text: ""
            - radio
            - text: ""
        - row "Password input with id/name password":
          - cell "Password input with id/name password"
          - cell:
            - textbox
        - row "File selector with id/name file Choose File":
          - cell "File selector with id/name file"
          - cell "Choose File":
            - button "Choose File"
        - row "Submit Clear":
          - cell
          - cell "Submit Clear":
            - link "Submit":
              - /url: "#"
            - link "Clear":
              - /url: "#"
        - row "* Mandatory field.":
          - cell "* Mandatory field."
    `);

  

  await page.locator('#textArea').click();
  await page.locator('#textArea').fill('steve\nwas\nhere\n');
  await page.locator('#checkbox').click(); //Checkboxes can be toggled on/off via click
  await page.locator('#checkbox').check(); //Or directly set "on" (regardless of previous state)
  await page.locator('#checkbox').uncheck();
  await page.locator('#select').selectOption('Selection Two');
  await expect(page.locator('input[type=radio]')) //Locator matches multiple elements
                                  .toHaveCount(3); //So we can verify their count
  
  await page.locator('#two').check();

  await expect(page.getByRole('heading', { name: 'Forms' })).toBeVisible();
  await expect(page.getByRole('paragraph')).toContainText('This form has an id of theForm.');
  await expect(page.locator('#textInput')).toHaveValue('Hello World');

  //await page.locator('#password').click();
  await page.locator('#password').fill('password');
  await page.getByRole('link', { name: 'Submit' }).click();
  await expect(page.locator('#textInputValue')).toContainText('Hello World');
})

test('Drag drop', async ({ page }) => {
  await page.goto('/webdriver2/docs/cssXPath.html');
  //Dragging and dropping one element to another is simple:
  //await page.locator('div#one').dragTo(page.locator('div#two'))

  //Dragging and dropping one element is a little trickier:
  await page.dragAndDrop('#slider a', //Source
                          '#slider a', //Target (same)
    { targetPosition: { x: 100, y: 0 }, //How far to drag
       force: true, //Dont do actionability checks (don't worry that we are dragging the source "outside" of itself)
       steps: 20 } //Smooth the movement over 20 steps
      )
});

test('Expect timeouts', async ({ page }) => {
  const slowExpect = expect.configure({ timeout: 8000 }) //Normally expect has 5 seconds. This creates a "custom" expect of 8 seconds
  await page.goto('https://www.edgewordstraining.co.uk/webdriver2/docs/dynamicContent.html');
  await page.locator('#delay').click();
  await page.locator('#delay').fill('10'); //Apple wont load in until 10 seconds
  await page.getByRole('link', { name: 'Load Content' }).click();
  await slowExpect.soft(page.locator('#image-holder > img')).toBeVisible(); //This will fail (because the timeout is too low) but execution continue because the expect is "soft"
  await page.getByRole('link', { name: 'Home' }).click(); //If the expect is not "soft" this line won't run
})

