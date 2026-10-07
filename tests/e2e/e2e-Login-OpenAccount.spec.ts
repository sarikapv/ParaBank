import { test, expect } from '@playwright/test';
import { loginSteps } from '../../pageObjects/pageSteps/login-steps';
import { openAccountSteps } from '../../pageObjects/pageSteps/openAccount-steps';
import { config } from '../../config/config';
import openAccountData from '../../testData/openAccountData.json';

let loginPage: loginSteps;
let openAccountPage: openAccountSteps;

test.beforeEach(async ({ page }) => {
    loginPage = new loginSteps(page);
    openAccountPage = new openAccountSteps(page);
    await loginPage.launchApplication();
});

test('E2E-01 Login and Open New Account',{tag:['@e2e','@regression']}, async () => {

    // Login
    await loginPage.fillText(config.userName,config.password);
    await loginPage.clickLoginButton();
    expect(await loginPage.isAccountServicesVisible()).toBe(true);

    // Open New Account
    await openAccountPage.openNewAccount();
    await openAccountPage.selectAccountType(openAccountData.OpenNewAccount.accountType);
    await openAccountPage.selectFromAccount();
    await openAccountPage.clickNewAccount();

    // Verify account creation
    expect(await openAccountPage.accountCreated()).toBe(true);

});