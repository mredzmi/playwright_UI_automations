import { Page, Locator } from '@playwright/test';
import { AIHealer } from '../utils/AIHealer';

export abstract class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigates to a URL.
   */
  async navigate(url: string) {
    await this.page.goto(url);
  }

  /**
   * Attempts to click an element. If it fails, attempts to heal the selector and retry.
   * @param selector The CSS selector.
   * @param contextInfo Optional context info (e.g. text content) to help healing.
   */
  async smartClick(selector: string, contextInfo?: { text?: string, tag?: string }) {
    try {
      console.log(`[BasePage] Clicking "${selector}"...`);
      await this.page.click(selector, { timeout: 2000 }); // Short timeout to trigger healing faster
    } catch (error) {
      console.warn(`[BasePage] Click failed for "${selector}". Attempting self-healing...`);
      const newSelector = await this.healSelector(selector, contextInfo);
      if (newSelector) {
        console.log(`[BasePage] Retrying click with healed selector: "${newSelector}"`);
        await this.page.click(newSelector);
      } else {
        throw error; // Re-throw if healing failed
      }
    }
  }

  /**
   * Attempts to fill an input. If it fails, attempts to heal.
   * @param selector The CSS selector.
   * @param value The value to type.
   * @param contextInfo Optional context info.
   */
  async smartFill(selector: string, value: string, contextInfo?: { text?: string, tag?: string }) {
    try {
      console.log(`[BasePage] Filling "${selector}" with "${value}"...`);
      await this.page.fill(selector, value, { timeout: 2000 });
    } catch (error) {
      console.warn(`[BasePage] Fill failed for "${selector}". Attempting self-healing...`);
      const newSelector = await this.healSelector(selector, contextInfo);
      if (newSelector) {
        console.log(`[BasePage] Retrying fill with healed selector: "${newSelector}"`);
        await this.page.fill(newSelector, value);
      } else {
        throw error;
      }
    }
  }

  /**
   * Checks if an element is visible.
   */
  async isVisible(selector: string): Promise<boolean> {
     try {
         return await this.page.isVisible(selector);
     } catch {
         return false;
     }
  }

  /**
   * Retrieves the HTML content and invokes the AIHealer.
   */
  private async healSelector(failedSelector: string, context?: { text?: string, tag?: string }): Promise<string | null> {
    const html = await this.page.content();
    return AIHealer.heal(html, failedSelector, context?.text, context?.tag);
  }
}
