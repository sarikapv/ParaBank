import { test,expect } from '../fixtures/baseFixture';
import { transferFundsSteps } from "../pageObjects/pageSteps/transferFunds-steps";
import testData from "../testData/transferFundsData.json"

test('TC-TXF-01-Successful transfer between own accounts',{tag:['@ui', '@regression', '@smoke']} , async({logInPage }) =>{

const transferFunds = new transferFundsSteps(logInPage);
await transferFunds.clickTransferFunds();
await transferFunds.enterAmount(testData.SufficientFunds.amount);
await transferFunds.fromAccount(testData.SufficientFunds.fromAccount);
await transferFunds.toAccount(testData.SufficientFunds.toAccount);
await transferFunds.clickTransfer();
// console.log("URL:", page.url());
const expectedAmount = `$${Number(testData.SufficientFunds.amount).toFixed(2)}`;
expect (await transferFunds.amountTransferredIs()).toBe(expectedAmount);
expect (await transferFunds.fromAccountIs()).toBe(testData.SufficientFunds.fromAccount);
expect (await transferFunds.toAccountIs()).toBe(testData.SufficientFunds.toAccount);

});

// test('TC-TXF-02-Transfer fails with insufficient funds', async({page}) =>{
//"KNOWN APPLICATION DEFECT - // "ParaBank does not provide the expected rejection/error behavior, 
//so there is no clean application validation to assert for the planned negative scenario."


// test('TC-TXF-03-Transfer boundary — minimum/zero/negative amount', async({page}) =>{
//"KNOWN APPLICATION DEFECT - // "ParaBank does not provide the expected rejection/error behavior, 
//so there is no clean application validation to assert for the planned negative scenario."
