// See hooks.ts for World implementation.
// We are using the default World extended in hooks.ts
// But we need a type definition for TS to know about 'page' and 'browser' on 'this'

import { World } from '@cucumber/cucumber';
import { Browser, Page } from '@playwright/test';

export interface CustomWorld extends World {
  browser: Browser;
  page: Page;
}
