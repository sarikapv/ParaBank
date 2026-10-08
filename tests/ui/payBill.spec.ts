import { expect, test } from "../../fixtures/baseFixture"
import { payBillSteps } from "../../pageObjects/pageSteps/payBill.steps"
import testData from "../../testData/ui/billPayData.json"

let payBill: payBillSteps;

test.beforeEach(async ({ logInPage }) => {
    payBill = new payBillSteps(logInPage);
});
test('TC-BILL-01 Successful bill payment with valid payee details', { tag: ['@ui', '@smoke', '@regression'] }, async ({ }) => {

    //Click billPay and enter the payee Information
    await payBill.clickBillPay();
    expect(await payBill.verifybillPayTitle()).toBe(true);
    await payBill.enterPayeeInformation(
        testData.validPayeeInformation.payeeName,
        testData.validPayeeInformation.address,
        testData.validPayeeInformation.city,
        testData.validPayeeInformation.state,
        testData.validPayeeInformation.zipcode1,
        testData.validPayeeInformation.phoneNumber,
        testData.validPayeeInformation.payeeAccountNumber,
        testData.validPayeeInformation.verifyAccountNumber,
        testData.validPayeeInformation.amount,
    );
    const fromAccount = await payBill.selectFromAccount();
    await payBill.clickSendPayment();
    //Verify Output values
    const expectedAmount = `$${Number(testData.validPayeeInformation.amount).toFixed(2)}`;
    expect(await payBill.verifyTransferredPayeeName()).toBe(testData.validPayeeInformation.payeeName);
    expect(await payBill.amountTransferred()).toBe(expectedAmount);
    expect(await payBill.verifyFromAccountNumber()).toBe(fromAccount);
    expect(await payBill.verifyMessageAccountActivity()).toBe(true);
});

test('TC-BILL-02  Bill payment fails with invalid/incomplete payee details', { tag: ['@ui', '@regression'] }, async ({ }) => {

    //Click billPay and enter the payee Information
    await payBill.clickBillPay();
    expect(await payBill.verifybillPayTitle()).toBe(true);
    await payBill.enterPayeeInformation(
        testData.validPayeeInformation.payeeName,
        testData.invalidOrMissingPayeeInformation.address,
        testData.invalidOrMissingPayeeInformation.city,
        testData.invalidOrMissingPayeeInformation.state,
        testData.invalidOrMissingPayeeInformation.zipcode,
        testData.invalidOrMissingPayeeInformation.phone,
        testData.invalidOrMissingPayeeInformation.accountNumber,
        testData.invalidOrMissingPayeeInformation.verifyAccount,
        testData.invalidOrMissingPayeeInformation.amount,

    );
    await payBill.SendPayment();
    expect(await payBill.getAddressMissingError()).toBe(testData.errorMessage.addressField);
    expect(await payBill.getZipCodeMissingError()).toBe(testData.errorMessage.ZipCode);

});

