import { test, expect } from '@playwright/test';
import { loginSteps } from '../../pageObjects/pageSteps/login-steps';
import { openAccountSteps } from '../../pageObjects/pageSteps/openAccount-steps';
import { transferFundsSteps } from '../../pageObjects/pageSteps/transferFunds-steps';
import { config } from '../../config/config';
import openAccountData from '../../testData/ui/openAccountData.json';
import testData from '../../testData/ui/transferFundsData.json';

test.describe('E2E-04 Account & Transfer Journey', () => {

    let loginPage: loginSteps;
    let openAccountPage: openAccountSteps;
    let transferFundsPage: transferFundsSteps;

    test.beforeEach(async ({ page }) => {
        loginPage = new loginSteps(page);
        openAccountPage = new openAccountSteps(page);
        transferFundsPage = new transferFundsSteps(page);
        await loginPage.launchApplication();
    });

    test('E2E-04 Login, Open New Account and Transfer Funds', { tag: ['@e2e', '@smoke', '@regression'] }, async () => {

        // Login
        await loginPage.fillText(config.userName, config.password);
        await loginPage.clickLoginButton();
        expect(await loginPage.isAccountServicesVisible()).toBe(true);

        // Open New Account
        await openAccountPage.openNewAccount();
        await openAccountPage.selectAccountType(openAccountData.OpenNewAccount.accountType);
        await openAccountPage.selectFromAccount();
        await openAccountPage.clickNewAccount();

        // Verify account creation
        expect(await openAccountPage.accountCreated()).toBe(true);

        // Capture newly created account number
        const newAccountNumber = await openAccountPage.getNewAccountNumber();
        expect(newAccountNumber).toBeTruthy();

        // Transfer Funds to newly created account
        await transferFundsPage.clickTransferFunds();
        await transferFundsPage.enterAmount(testData.SufficientFunds.amount);
        const fromAccount = await transferFundsPage.getFirstFromAccount();
        await transferFundsPage.fromAccount(fromAccount);
        await transferFundsPage.toAccount(newAccountNumber);
        await transferFundsPage.clickTransfer();

        // Verify transfer
        expect(await transferFundsPage.amountTransferredIs()).toContain(testData.SufficientFunds.amount);
        expect(await transferFundsPage.toAccountIs()).toContain(newAccountNumber);
    });
});