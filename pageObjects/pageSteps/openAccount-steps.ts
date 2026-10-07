import { Page } from "@playwright/test";
import { webCommons } from "../../commons/webCommons";
import openAccount from '../pageElements/openAccount-page.json';

export class openAccountSteps {

    page: Page
    web: webCommons
    constructor(page: Page) {
        this.page = page;
        this.web = new webCommons(page);
    }
    async openNewAccount() {
        await this.web.click(openAccount.openNewAccount);
    }
    async selectAccountType(accountType: string) {
        await this.web.selectDropdownByLabel(openAccount.accountType, accountType);
    }
    async selectFromAccount() {
        await this.web.selectDropdownByIndex(openAccount.fromAccount, 0);
    }
    async clickNewAccount() {
        await this.web.click(openAccount.clickOpenNewAccount);
        await this.web.elementVisible(openAccount.newAccountID); // wait for result to actually appear
    }
    async accountCreated() {
        return await this.web.isElementVisible(openAccount.newAccountID);
    }
    async getNewAccountNumber(): Promise<string> {
        return (await this.web.getText(openAccount.newAccountID)) ?? '';
    }
}
