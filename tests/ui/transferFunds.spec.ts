import { test, expect } from '../../fixtures/baseFixture';
import { transferFundsSteps } from "../../pageObjects/pageSteps/transferFunds-steps";
import testData from "../../testData/ui/transferFundsData.json";
import { openAccountSteps } from "../../pageObjects/pageSteps/openAccount-steps";
import openAccountData from '../../testData/ui/openAccountData.json';

test('TC-TXF-01-Successful transfer between own accounts', { tag: ['@ui', '@regression', '@smoke'] }, async ({ logInPage }) => {
    const openAccount = new openAccountSteps(logInPage);
    const transferFunds = new transferFundsSteps(logInPage);
    await openAccount.openNewAccount();
    await openAccount.selectAccountType(openAccountData.OpenNewAccount.accountType);
    await openAccount.selectFromAccount();
    await openAccount.clickNewAccount();
    expect(await openAccount.accountCreated()).toBe(true);
    const newAccountNumber = await openAccount.getNewAccountNumber();
    await transferFunds.clickTransferFunds();
    await transferFunds.enterAmount(testData.SufficientFunds.amount);

    const fromAccount = await transferFunds.getFirstFromAccount();
    await transferFunds.toAccount(newAccountNumber);

    await transferFunds.clickTransfer();

    const expectedAmount = `$${Number(testData.SufficientFunds.amount).toFixed(2)}`;
    expect(await transferFunds.amountTransferredIs()).toBe(expectedAmount);
    expect(await transferFunds.fromAccountIs()).toBe(fromAccount);
    expect(await transferFunds.toAccountIs()).toBe(newAccountNumber);
});

// test('TC-TXF-02-Transfer fails with insufficient funds', async({page}) =>{
//"KNOWN APPLICATION DEFECT - // "ParaBank does not provide the expected rejection/error behavior,
//so there is no clean application validation to assert for the planned negative scenario."


// test('TC-TXF-03-Transfer boundary — minimum/zero/negative amount', async({page}) =>{
//"KNOWN APPLICATION DEFECT - // "ParaBank does not provide the expected rejection/error behavior,
//so there is no clean application validation to assert for the planned negative scenario."
