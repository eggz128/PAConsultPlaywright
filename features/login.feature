@web @mobileweb
Feature: Login Functionality

  Scenario: Successful login with Valid Credentials
    Given the user is on the login page
    When the user enters valid credentials
    Then the user should be redirected to the Add A Record page

  Scenario Outline: Successful login with Valid Credentials
    Given the user is on the login page
    When the user logs in with the credentials "<username>" and "<password>"
    Then the user should be redirected to the Add A Record page

    Examples:
      | username  | password     |
      | edgewords | edgewords123 |
      | webdriver | edgewords123 |
      | notvalid  | notvalid     |
          #This one will fail

  Scenario: Login page should have both a login and register menu option
    Given the user is on the login page
    Then the page should have these links visible:
      | Text     |
      | Login    |
      | Register |
