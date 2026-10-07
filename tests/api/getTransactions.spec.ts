import { test, expect } from '@playwright/test';
import { ApiClient } from '../../commons/apiCommons';
import testData from '../../testData/api/apiTestData.json';
import { XMLParser } from 'fast-xml-parser';

test('TC-API-16 - List all transactions for an account',{tag:['@api', '@regression']}, async ({ request }) => {

    const api = new ApiClient(request);
    const response = await api.getAccountTransactions(testData.getAccountDetails.accountId);
    expect(response.status()).toBe(200);
    const body = await response.text();
    const parser = new XMLParser();
    const parsedBody = parser.parse(body);
    const transactions = parsedBody.transactions.transaction;
    const transactionList = Array.isArray(transactions)
        ? transactions
        : [transactions];

    expect(transactionList.length).toBeGreaterThan(0);
    for (const transaction of transactionList) {
        expect(transaction.id).toBeDefined();
        expect(Number(transaction.accountId)).toBe(Number(testData.getAccountDetails.accountId));
        expect(Number.isFinite(Number(transaction.amount))).toBe(true);
        expect(['Credit', 'Debit']).toContain(transaction.type);
    }
});

test('TC-API-17 - Filter transactions by month and type',{tag:['@api', '@regression']}, async ({ request }) => {

    const api = new ApiClient(request);
    const response = await api.getTransactionsByMonthAndType(
        testData.getTransactionFilter.accountId,
        testData.getTransactionFilter.month,
        testData.getTransactionFilter.type
    );
    expect(response.status()).toBe(200);
    const body = await response.text();
    const parser = new XMLParser();
    const parsedBody = parser.parse(body);
    const transactions = parsedBody.transactions.transaction;
    const transactionList = Array.isArray(transactions)
        ? transactions
        : [transactions];
    for (const transaction of transactionList) {
        expect(transaction.type.toLowerCase())
            .toBe(testData.getTransactionFilter.type.toLowerCase());
    }
});