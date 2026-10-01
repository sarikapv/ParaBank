import { test, expect } from '@playwright/test';
import { loginSteps } from "../pageObjects/pageSteps/login-steps";
import testData from "../testData/loginData.json";
import { config } from "../config/config"

let loginPage: loginSteps;

test.beforeEach(async ({ page }) => {
    loginPage = new loginSteps(page);
    await loginPage.launchApplication();
});

test('TC-LOGIN-01-Successful login with valid credentials', async ({}) => {

    await loginPage.fillText(config.userName, config.password);
    await loginPage.clickLoginButton();
    expect(await loginPage.isAccountServicesVisible()).toBe(true);

});

test('TC-LOGIN-02-Login fails with invalid credentials', async ({}) => {
    await loginPage.fillText(testData.InvalidCredentials.username,testData.InvalidCredentials.password);
    await loginPage.clickLoginButton()
    const erroText = await loginPage.getErrorMessage();
    expect(erroText).toBe("The username and password could not be verified.");


});