import { test as base, Page } from '@playwright/test';
import { loginSteps } from '../pageObjects/pageSteps/login-steps';
import { config } from '../config/config';

type Fixtures = {
    logInPage: Page;
};

export const test = base.extend<Fixtures>({
    logInPage: async ({ page }, use) => {
        const login = new loginSteps(page);

        await login.launchApplication();
        await login.fillText(config.userName, config.password);
        await login.clickLoginButton();

        await use(page);
    }
});

export { expect } from '@playwright/test';