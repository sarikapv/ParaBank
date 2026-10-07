import { test, expect } from "@playwright/test"
import { ApiClient } from "../../commons/apiCommons"
import testData from "../../testData/api/apiTestData.json"
import { captureResponse } from "../../utilities/apiResponsecapture";

test('TC-API-11 Transfer between two own accounts', {tag:['@api', '@regression','@smoke']},async ({ request }) => {

    const api = new ApiClient(request);
    const response = await api.postAccount(
        testData.postAccountDetails.fromAccountID,
        testData.postAccountDetails.toAccountID,
        testData.postAccountDetails.amount);
    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body).toBe(`Successfully transferred $${testData.postAccountDetails.amount} from account #${testData.postAccountDetails.fromAccountID} to account #${testData.postAccountDetails.toAccountID}`);

});

test('TC-API-12 Transfer to a non-existent account',{tag:['@api', '@regression']}, async ({ request }) => {

    const api = new ApiClient(request);
    const response = await api.postAccount(
        testData.postAccountDetails.fromAccountID,
        testData.nonExistentAccountId,
        testData.postAccountDetails.amount);
    expect(response.status()).toBe(400);
    const body = await response.text();
    expect(body).toBe(`Could not find account number ${testData.postAccountDetails.fromAccountID} and/or ${testData.nonExistentAccountId}`);

});

test('TC-API-13 Transfer with a missing required value',{tag:['@api', '@regression']}, async ({ request }, testInfo) => {

    const api = new ApiClient(request);
    const response = await api.postTransferMissingToAccount(
        testData.postAccountDetails.fromAccountID,
        testData.postAccountDetails.amount
    );
    const body = await response.text();
    // await captureResponse(testInfo, 'TC-API-13', response);
    expect(response.status()).toBe(400);
    expect(body).toBe(`Could not find account number ${testData.postAccountDetails.fromAccountID} and/or 0`
    );
});


