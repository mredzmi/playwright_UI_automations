import { BasePage } from './BasePage';

export class InventoryPage extends BasePage {
  private readonly inventoryContainer = '.inventory_list';
  private readonly pageTitle = '.title';

  async isInventoryVisible(): Promise<boolean> {
    return await this.isVisible(this.inventoryContainer);
  }

  async getTitleText(): Promise<string> {
    return await this.page.textContent(this.pageTitle) || '';
  }
}
