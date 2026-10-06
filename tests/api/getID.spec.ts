import { test, expect } from '@playwright/test';
import { ApiClient } from '../../commons/apiCommons';
import testData from '../../testData/api/apiTestData.json'
import { XMLParser } from 'fast-xml-parser';

test('TC-API-03 - Get details for the customer returned by login', async ({ request }) => {

    const api = new ApiClient(request);
    const response = await api.getCustomerID(testData.getCustomerDetails.customerId);
    expect(response.status()).toBe(200);
    const body = await response.text();
    const parser = new XMLParser();
    const parsedBody = parser.parse(body);
    const customer = parsedBody.customer;


    expect(customer.id).toBe(Number(testData.getCustomerDetails.customerId));
    expect(`${customer.firstName} ${customer.lastName}`).toBe(testData.getCustomerDetails.name);
    expect(`${customer.address.street},${customer.address.city},${customer.address.state},${customer.address.zipCode}`
    ).toBe(testData.getCustomerDetails.address);

})

test('TC-API-04 - Get details for a non-existent customer ID', async ({ request }) => {
    const api = new ApiClient(request);

    const response = await api.getCustomerID(testData.nonExistentCustomerId);
    const body = await response.text();
    expect(response.status()).toBe(400);
    expect(body).toBe(`Could not find customer #${testData.nonExistentCustomerId}`);

})
