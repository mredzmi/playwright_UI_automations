import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  // Selectors
  private readonly usernameInput = '#user-name';
  private readonly passwordInput = '#password';
  private readonly loginButton = '#login-button';

  async navigateTo() {
    await this.navigate('https://www.saucedemo.com/');
  }

  async login(username: string, password: string, forceBreak: boolean = false) {
    // If forceBreak is true, we use a bad selector to demonstrate healing
    const loginBtnSelector = forceBreak ? '#incorrect-login-btn-id' : this.loginButton;

    await this.smartFill(this.usernameInput, username, { tag: 'input' });
    await this.smartFill(this.passwordInput, password, { tag: 'input' });

    // We pass "Login" as context text to help the healer find the button if the ID fails
    await this.smartClick(loginBtnSelector, { text: 'Login', tag: 'input' });
  }
}
