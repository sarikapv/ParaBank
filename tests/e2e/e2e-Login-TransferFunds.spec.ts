import { test, expect } from '@playwright/test';
import { loginSteps } from '../../pageObjects/pageSteps/login-steps';
import { transferFundsSteps } from '../../pageObjects/pageSteps/transferFunds-steps';
import { config } from '../../config/config';
import transferFundsData from '../../testData/ui/transferFundsData.json';
import { openAccountSteps } from '../../pageObjects/pageSteps/openAccount-steps';
import openAccountData from '../../testData/ui/openAccountData.json';

let loginPage: loginSteps;
let transferFundsPage: transferFundsSteps;
let openAccountPage: openAccountSteps;

test.beforeEach(async ({ page }) => {
    loginPage = new loginSteps(page);
    transferFundsPage = new transferFundsSteps(page);
    openAccountPage = new openAccountSteps(page);
    await loginPage.launchApplication();
});

test('E2E-02 Login and Transfer Funds', { tag: ['@e2e', '@regression'] }, async () => {

    // Login
    await loginPage.fillText(config.userName, config.password);
    await loginPage.clickLoginButton();
    expect(await loginPage.isAccountServicesVisible()).toBe(true);

    await openAccountPage.openNewAccount();
    await openAccountPage.selectAccountType(openAccountData.OpenNewAccount.accountType);
    await openAccountPage.selectFromAccount();
    await openAccountPage.clickNewAccount();
    expect(await openAccountPage.accountCreated()).toBe(true);
    const newAccountNumber = await openAccountPage.getNewAccountNumber();

    // Transfer Funds
    await transferFundsPage.clickTransferFunds();
    await transferFundsPage.enterAmount(transferFundsData.SufficientFunds.amount);

    const fromAccount = await transferFundsPage.getFirstFromAccount();
    await transferFundsPage.fromAccount(fromAccount);
    await transferFundsPage.toAccount(newAccountNumber);
    await transferFundsPage.clickTransfer();

    // Verify transfer
    const expectedAmount = `$${Number(transferFundsData.SufficientFunds.amount).toFixed(2)}`;
    expect(await transferFundsPage.amountTransferredIs()).toBe(expectedAmount);

    expect(await transferFundsPage.fromAccountIs()).toBe(fromAccount);
    expect(await transferFundsPage.toAccountIs()).toBe(newAccountNumber);

});