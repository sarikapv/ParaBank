import { test, expect } from '@playwright/test';
import { loginSteps } from '../../pageObjects/pageSteps/login-steps';
import { transferFundsSteps } from '../../pageObjects/pageSteps/transferFunds-steps';
import { config } from '../../config/config';
import transferFundsData from '../../testData/transferFundsData.json';

let loginPage: loginSteps;
let transferFundsPage: transferFundsSteps;

test.beforeEach(async ({ page }) => {
    loginPage = new loginSteps(page);
    transferFundsPage = new transferFundsSteps(page);
    await loginPage.launchApplication();
});

test('E2E-02 Login and Transfer Funds',{tag:['@e2e','@regression']},async () => {

    // Login
    await loginPage.fillText(config.userName, config.password);
    await loginPage.clickLoginButton();
    expect(await loginPage.isAccountServicesVisible()).toBe(true);

    // Transfer Funds
    await transferFundsPage.clickTransferFunds();
    await transferFundsPage.enterAmount(transferFundsData.SufficientFunds.amount);
    await transferFundsPage.fromAccount(transferFundsData.SufficientFunds.fromAccount);
    await transferFundsPage.toAccount(transferFundsData.SufficientFunds.toAccount);
    await transferFundsPage.clickTransfer();

    // Verify transfer
    const expectedAmount = `$${Number(transferFundsData.SufficientFunds.amount).toFixed(2)}`;
    expect(await transferFundsPage.amountTransferredIs()).toBe(expectedAmount);
    expect(await transferFundsPage.fromAccountIs()).toBe(transferFundsData.SufficientFunds.fromAccount);
    expect(await transferFundsPage.toAccountIs()).toBe(transferFundsData.SufficientFunds.toAccount);
});