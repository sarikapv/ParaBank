import { test, expect } from "@playwright/test"
import { ApiClient } from "../../commons/apiCommons"
import testData from "../../testData/api/apiTestData.json"
import { XMLParser } from 'fast-xml-parser';


test('TC-API-14 Pay a valid payee', { tag: ['@api', '@regression','@smoke'] },async ({ request }) => {

    const api = new ApiClient(request);
    const response = await api.postBillPay(testData.postBillPay.accountID,testData.postBillPay.billPayAmount,testData.postBillPay.payee);
    expect(response.status()).toBe(200);
    const body = await response.text();
    const parser = new XMLParser();
    const parsedBody = parser.parse(body);
    const billPayResult = parsedBody.billPayResult;
    expect(Number(billPayResult.accountId)).toBe(Number(testData.postBillPay.accountID));
    expect(Number(billPayResult.amount)).toBe(Number(testData.postBillPay.billPayAmount));
    expect(billPayResult.payeeName).toBe(testData.postBillPay.payee.name);
});

//this as an application validation defect, not as a passing negative test.
//this ParaBank implementation accepts both -100 and 0 and returns 200.
test('TC-API-15 Pay with an invalid amount',{tag: ['@api', '@regression'] }, async ({ request }) => {

    test.fail();
    const api = new ApiClient(request);
    const response = await api.postBillPay(testData.postBillPay.accountID,'-100',testData.postBillPay.payee);

    expect(response.status()).toBe(400);
});

