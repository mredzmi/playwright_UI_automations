Feature: Sauce Demo Login and Self-Healing

  Scenario: Successful Login (Standard)
    Given I navigate to the Sauce Demo login page
    When I login with "standard_user" and "secret_sauce"
    Then I should see the inventory page

  Scenario: Self-Healing Login (Broken Selector)
    Given I navigate to the Sauce Demo login page
    When I login with "standard_user" and "secret_sauce" with a broken selector
    Then I should see the inventory page
