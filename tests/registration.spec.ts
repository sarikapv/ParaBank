import { test, expect } from '@playwright/test';
import testData from "../testData/registrationData.json";
import { registrationSteps } from '../pageObjects/pageSteps/registration-steps';
import { generateUniqueUsername } from '../utilities/generateUniqueUsername';

//registration is declared outside both the hook and the tests, so both tests can access the same variable
// but it gets freshly created before each test runs, so there's no leftover state between them.
let registration: registrationSteps;

test.beforeEach(async ({ page }) => {
    registration = new registrationSteps(page);
    await registration.navigateToRegistrationPage();
});

test('TC-REG-01-Successful registration with valid details', async () => {
    const uniqueUsername = generateUniqueUsername('sarika');

    await registration.fillRegisterForm(
        testData.validUser.firstName,
        testData.validUser.lastName,
        testData.validUser.address,
        testData.validUser.city,
        testData.validUser.state,
        testData.validUser.zipCode,
        testData.validUser.phoneNumber,
        testData.validUser.ssn,
        //testData.validUser.username,
        uniqueUsername,
        testData.validUser.password
    );
    await registration.clickRegisterButton();
});

test('TC-REG-02-Registration fails with missing/invalid mandatory fields', async () => {
    await registration.fillRegisterForm(
        testData.InvalidUser.firstName,
        testData.InvalidUser.lastName,
        testData.InvalidUser.address,
        testData.InvalidUser.city,
        testData.InvalidUser.state,
        testData.InvalidUser.zipCode,
        testData.InvalidUser.phoneNumber,
        testData.InvalidUser.ssn,
        testData.InvalidUser.username,
        testData.InvalidUser.password
    );
    await registration.clickRegisterButton();
    expect(await registration.getZipCodeError()).toBe("Zip Code is required.");
    expect(await registration.getSsnError()).toBe("Social Security Number is required.");

});