import { test, expect } from '@playwright/test';
import { ApiClient } from '../../commons/apiCommons';
import testData from '../../testData/api/apiTestData.json';
import { XMLParser } from 'fast-xml-parser';

test('TC-API-09 - Create a SAVINGS account', {tag:['@api', '@regression']},async ({ request }) => {
    const api = new ApiClient(request);
    const customerId = testData.getCustomerDetails.customerId;
    const response = await api.createAccount(customerId, testData.createAccount.savingsType, testData.getAccountDetails.accountId);
    expect(response.status()).toBe(200);
    const account = new XMLParser().parse(await response.text()).account;
    expect(Number(account.customerId)).toBe(Number(customerId));
    expect(account.type).toBe('SAVINGS');
    const newId = Number(account.id);
    expect(Number.isInteger(newId)).toBe(true);

    const listResponse = await api.getCustomerAccounts(customerId);
    const accounts = new XMLParser().parse(await listResponse.text()).accounts.account;
    const ids = (Array.isArray(accounts) ? accounts : [accounts]).map((a) => Number(a.id));
    expect(ids).toContain(newId);
});

test('TC-API-10 - Create an account with an invalid type',{tag:['@api', '@regression']}, async ({ request }) => {
    test.fail(); // Known defect DEF-API-01: ParaBank returns 500 with an HTML page; a 4xx is expected
    const api = new ApiClient(request);
    const response = await api.createAccount(
        testData.getCustomerDetails.customerId,
        testData.createAccountInvalidType.invalidType,
        testData.getAccountDetails.accountId
    );
    expect(response.status()).toBeGreaterThanOrEqual(400);
    expect(response.status()).toBeLessThan(500);
});