import { test, expect } from '@playwright/test';
import { ApiClient } from '../../commons/apiCommons';
import testData from '../../testData/api/apiTestData.json';
import { XMLParser } from 'fast-xml-parser';

test('TC-API-05 - Get list of customer accounts',{tag:['@api', '@regression']}, async ({ request }) => {

    const api = new ApiClient(request);
    const response = await api.getCustomerAccounts(testData.getCustomerDetails.customerId);
    expect(response.status()).toBe(200);
    const body = await response.text();
    const parser = new XMLParser();
    const parsedBody = parser.parse(body);
    const accounts = parsedBody.accounts.account;
    const accountList = Array.isArray(accounts) ? accounts : [accounts];
    expect(accountList.length).toBeGreaterThan(0);
    for (const account of accountList) {
        expect(Number(account.customerId)).toBe(Number(testData.getCustomerDetails.customerId));
    }
});

test('TC-API-06 - Get one account',{tag:['@api', '@regression','@smoke']}, async ({ request }) => {

    const api = new ApiClient(request);
    const response = await api.getAccount(testData.getAccountDetails.accountId);
    expect(response.status()).toBe(200);
    const body = await response.text();
    const parser = new XMLParser();
    const parsedBody = parser.parse(body);
    const account = parsedBody.account ?? parsedBody;
    expect(Number(account.id)).toBe(Number(testData.getAccountDetails.accountId));
    expect(['CHECKING', 'SAVINGS', 'LOAN']).toContain(account.type);
    expect(Number.isFinite(Number(account.balance))).toBe(true);
});

test('TC-API-07 - Get a non-existent account',{tag:['@api', '@regression']}, async ({ request }) => {
    const api = new ApiClient(request);
    const response = await api.getAccount(testData.nonExistentAccountId);
    expect(response.status()).toBe(400);
    expect(await response.text()).toBe(`Could not find account #${testData.nonExistentAccountId}`);
});

test('TC-API-08 - Get an account with a non-numeric ID', {tag:['@api', '@regression']},async ({ request }) => {
    const api = new ApiClient(request);
    const response = await api.getAccount(testData.invalidAccountId);
    expect(response.status()).toBe(404);
    expect(await response.text()).toBe('');
});