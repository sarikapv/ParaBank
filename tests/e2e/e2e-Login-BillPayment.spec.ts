import { test, expect } from '@playwright/test';
import { loginSteps } from '../../pageObjects/pageSteps/login-steps';
import { payBillSteps } from '../../pageObjects/pageSteps/payBill.steps';
import { config } from '../../config/config';
import testData from '../../testData/billPayData.json';

let loginPage: loginSteps;
let payBillPage: payBillSteps;

test.beforeEach(async ({ page }) => {
    loginPage = new loginSteps(page);
    payBillPage = new payBillSteps(page);
    await loginPage.launchApplication();
});

test('E2E-03 Login and Bill Payment', {tag:['@e2e', '@smoke', '@regression']},async () => {
    // Login
    await loginPage.fillText(config.userName, config.password);
    await loginPage.clickLoginButton();
    expect(await loginPage.isAccountServicesVisible()).toBe(true);

    // Bill Payment
    await payBillPage.clickBillPay();
    expect(await payBillPage.verifybillPayTitle()).toBe(true);
    await payBillPage.enterPayeeInformation(
        testData.validPayeeInformation.payeeName,
        testData.validPayeeInformation.address,
        testData.validPayeeInformation.city,
        testData.validPayeeInformation.state,
        testData.validPayeeInformation.zipcode1,
        testData.validPayeeInformation.phoneNumber,
        testData.validPayeeInformation.payeeAccountNumber,
        testData.validPayeeInformation.verifyAccountNumber,
        testData.validPayeeInformation.amount
    );
    await payBillPage.selectFromAccount(testData.validPayeeInformation.fromAccount);
    await payBillPage.clickSendPayment();

    // Verify payment
    expect(await payBillPage.verifyTitlePaymentComplete()).toBe(true);
    expect(await payBillPage.verifyTransferredPayeeName()).toBe(testData.validPayeeInformation.payeeName);
    expect(await payBillPage.amountTransferred()).toContain(testData.validPayeeInformation.amount);
    expect(await payBillPage.verifyFromAccountNumber()).toContain(testData.validPayeeInformation.fromAccount);
    expect(await payBillPage.verifyMessageAccountActivity()).toBe(true);
});