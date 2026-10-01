import {test,expect} from '../fixtures/baseFixture';
import { openAccountSteps } from '../pageObjects/pageSteps/openAccount-steps';
import testData  from "../testData/openAccountData.json";


test('TC-OPENACC-01-Successfully open a new account', async ({ logInPage }) => {


const openAccount = new openAccountSteps(logInPage);

// Click Open new Account and enter data
await openAccount.openNewAccount();
await openAccount.selectAccountType(testData.OpenNewAccount.accountType);
await openAccount.selectFromAccount();
await openAccount.clickNewAccount();
expect(await openAccount.accountCreated()).toBe(true);

});