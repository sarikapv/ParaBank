import { test, expect } from '@playwright/test';
import { ApiClient } from '../../commons/apiCommons';
import testData from '../../testData/api/apiTestData.json';
import { XMLParser } from 'fast-xml-parser';

test('TC-API-19 - API chaining: create account, transfer and verify transaction', async ({ request }) => {

    const api = new ApiClient(request);
    const parser = new XMLParser();

    // 1. Create account
    const createResponse = await api.createAccount(testData.getCustomerDetails.customerId,testData.createAccount.savingsType,
    testData.postAccountDetails.fromAccountID);
    expect(createResponse.status()).toBe(200);
    const createBody = await createResponse.text();
    const createdAccount = parser.parse(createBody);
    const account = createdAccount.account ?? createdAccount;
    const newAccountId = Number(account.id);
    expect(Number.isFinite(newAccountId)).toBe(true);

    // 2. Read the newly created account
    const accountResponse = await api.getAccount(String(newAccountId));
    expect(accountResponse.status()).toBe(200);
    const accountBody = await accountResponse.text();
    const accountParsed = parser.parse(accountBody);
    const accountDetails = accountParsed.account ?? accountParsed;
    expect(Number(accountDetails.id)).toBe(newAccountId);

    // 3. Transfer money into the newly created account
    const transferResponse = await api.postAccount(testData.postAccountDetails.fromAccountID,String(newAccountId),
    testData.postAccountDetails.amount);
    expect(transferResponse.status()).toBe(200);

    // 4. Get transactions for the newly created account
    const transactionResponse = await api.getAccountTransactions(String(newAccountId));
    expect(transactionResponse.status()).toBe(200);
    const transactionBody = await transactionResponse.text();
    const transactionParsed = parser.parse(transactionBody);
    const transactions = transactionParsed.transactions.transaction;
    const transactionList = Array.isArray(transactions)
        ? transactions
        : [transactions];

    // 5. Verify the transfer appears

    const transferAmount = Number(testData.postAccountDetails.amount);
    const matchingTransaction = transactionList.find((transaction: any) =>
    Number(transaction.amount) === transferAmount &&transaction.type === 'Credit');
    expect(matchingTransaction).toBeDefined();
    expect(Number(matchingTransaction.accountId)).toBe(newAccountId);
});