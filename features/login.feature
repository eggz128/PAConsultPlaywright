Feature: Login Functionality

  Scenario: Successful login with Valid Credentials
    Given the user is on the login page
    When the user enters valid credentials
    Then the user should be redirected to the Add A Record page

  Scenario: Successful login with Valid Credentials
    Given the user is on the login page
    When the user logs in with the credentials "edgewords" and "edgewords123"
    Then the user should be redirected to the Add A Record page
