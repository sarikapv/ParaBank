import { test, expect } from "@playwright/test"
import { ApiClient } from "../../commons/apiCommons"
import testData from "../../testData/api/apiTestData.json"
import { XMLParser } from 'fast-xml-parser';


//Known application defect / expected failure.
// The ParaBank /customers/update/{customerId} endpoint is failing in the application.
test('TC-API-18 - Update customer information', async ({ request }) => {

test.fail(); // Known defect DEF-API-04: the update endpoint fails in the application

    const api = new ApiClient(request);

    const response = await api.updateCustomer(
        testData.getCustomerDetails.customerId,
        testData.getCustomerDetails.firstname,
        testData.getCustomerDetails.lastName,
        testData.getCustomerDetails.street,
        testData.getCustomerDetails.city,
        testData.getCustomerDetails.state,
        testData.getCustomerDetails.zipCode,
        testData.getCustomerDetails.phoneNumber,
        testData.getCustomerDetails.ssnNumber,
        testData.validLogin.userName,
        testData.validLogin.password
    );

    expect(response.status()).toBe(200);
});
