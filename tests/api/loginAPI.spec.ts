import { test, expect } from '@playwright/test';
import { ApiClient } from '../../commons/apiCommons';
import { config } from '../../config/config';
//import { captureResponse } from '../../utilities/apiResponsecapture';
import testData from '../../testData/api/apiTestData.json'

test.describe('Login API', () => {
    test('TC-API-01 Login with valid credentials returns customer details', async ({ request }) => {
        const api = new ApiClient(request);

        const response = await api.login(config.userName, config.password);

        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(typeof body.id).toBe('number');
        expect(body.firstName).toBeTruthy();
        expect(body.lastName).toBeTruthy();
    });

    test('TC-API-02 Login with a wrong password return Invalid message', async ({ request }, testInfo) => {
        const api = new ApiClient(request);
        const response = await api.login(config.userName, testData.invalidLogin.password);
        expect(response.status()).toBe(400);
        const body = await response.text();
        expect(body).toBe('Invalid username and/or password');
        
        // // Capture mode: records the real status and message. Exact assertions replace this once known.
        // await captureResponse(testInfo, 'TC-API-02', response);
    });


});