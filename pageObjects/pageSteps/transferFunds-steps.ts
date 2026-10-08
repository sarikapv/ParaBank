import { Page } from '@playwright/test';
import transferFunds from '../pageElements/transferFunds-page.json'
import { webCommons } from '../../commons/webCommons';

export class transferFundsSteps {
    page: Page;
    web: webCommons

    constructor(page: Page) {

        this.page = page;
        this.web = new webCommons(page);
    }
    async clickTransferFunds() {
        await this.web.click(transferFunds.opentransferFunds);
    }
    async enterAmount(amount: string) {
        await this.web.fillText(transferFunds.enterAmount, amount);
    }
    async fromAccount(account: string) {
        await this.web.selectDropdownByValue(transferFunds.fromAccountId, account);
    }
    async getFirstFromAccount(): Promise<string> {
        const options = this.page.locator(transferFunds.fromAccountId).locator('option');
        await options.first().waitFor({ state: 'attached' });
        return (await options.first().textContent())?.trim() ?? '';
    }

    async toAccount(account: string) {
        const options = this.page.locator(transferFunds.toAccountId).locator('option');
        await options.first().waitFor({ state: 'attached' });
        await this.web.selectDropdownByValue(transferFunds.toAccountId, account);
    }
    async clickTransfer() {
        await this.web.click(transferFunds.clickTransfer);
    }
    async amountTransferredIs(): Promise<string> {
        await this.web.waitForElement(transferFunds.amountTransferred);
        return (await this.web.getText(transferFunds.amountTransferred)) ?? '';
    }
    async fromAccountIs(): Promise<string> {
        await this.web.waitForElement(transferFunds.fromAccountResult);
        return (await this.web.getText(transferFunds.fromAccountResult)) ?? '';
    }
    async toAccountIs(): Promise<string> {
        await this.web.waitForElement(transferFunds.toAccountResult);
        return (await this.web.getText(transferFunds.toAccountResult)) ?? '';
    }
}