import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CustomWorld } from '../support/world';

Given('I navigate to the Sauce Demo login page', async function (this: CustomWorld) {
  const loginPage = new LoginPage(this.page);
  await loginPage.navigateTo();
});

When('I login with {string} and {string}', async function (this: CustomWorld, user: string, pass: string) {
  const loginPage = new LoginPage(this.page);
  await loginPage.login(user, pass);
});

When('I login with {string} and {string} with a broken selector', async function (this: CustomWorld, user: string, pass: string) {
  const loginPage = new LoginPage(this.page);
  // Force break to trigger healing
  await loginPage.login(user, pass, true);
});

Then('I should see the inventory page', async function (this: CustomWorld) {
  const inventoryPage = new InventoryPage(this.page);
  const isVisible = await inventoryPage.isInventoryVisible();
  if (!isVisible) {
      throw new Error('Inventory page not visible');
  }
  const title = await inventoryPage.getTitleText();
  if (title !== 'Products') {
      throw new Error(`Expected title "Products" but got "${title}"`);
  }
});
