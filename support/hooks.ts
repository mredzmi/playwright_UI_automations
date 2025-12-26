import { Before, After, setWorldConstructor, World } from '@cucumber/cucumber';
import { chromium, Browser, Page } from '@playwright/test';

class CustomWorld extends World {
  browser: Browser | undefined;
  page: Page | undefined;

  constructor(options: any) {
    super(options);
  }
}

setWorldConstructor(CustomWorld);

Before(async function (this: CustomWorld) {
  this.browser = await chromium.launch({ headless: true }); // Headless by default
  const context = await this.browser.newContext();
  this.page = await context.newPage();
});

After(async function (this: CustomWorld) {
  await this.page?.close();
  await this.browser?.close();
});
