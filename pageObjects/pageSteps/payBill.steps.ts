import { Page } from "@playwright/test"
import { webCommons } from "../../commons/webCommons"
import payBill from "../pageElements/payBill-page.json"
import { config } from "../../config/config"
import { from } from "node:stream/iter"

export class payBillSteps {
    page: Page
    web: webCommons

    constructor(page: Page) {
        this.page = page,
            this.web = new webCommons(page);
    }
    async clickBillPay() {
        await this.page.click(payBill.billPay);
    }
    async verifybillPayTitle() {
        await this.web.waitForElement(payBill.titleBillPaymentservice);
        return await this.web.isElementVisible(payBill.titleBillPaymentservice);
    }
    async enterPayeeInformation(payeeName: string, address: string, city: string, state: string, zipCode: string, phoneNumber: string, payeeAccountNumber: string, verifyAccountNumber: string, amount: string) {
        await this.web.fillText(payBill.payeeName, payeeName);
        await this.web.fillText(payBill.address, address);
        await this.web.fillText(payBill.city, city);
        await this.web.fillText(payBill.state, state);
        await this.web.fillText(payBill.zipCode, zipCode);
        await this.web.fillText(payBill.phoneNumber, phoneNumber);
        await this.web.fillText(payBill.payeeAccountNumber, payeeAccountNumber);
        await this.web.fillText(payBill.verifyAccountNumber, verifyAccountNumber);
        await this.web.fillText(payBill.amount, amount);
    }
    async selectFromAccount(fromAccountNumber: string) {
        await this.web.selectDropdownByLabel(payBill.fromAccount, fromAccountNumber);
    }
    async clickSendPayment() {
        await this.web.click(payBill.clickButton);
    }
    async verifyTitlePaymentComplete() {
    const locator = this.web.element(payBill.title);
    await locator.waitFor({ state: 'visible' });
    return await locator.isVisible();
}
    async verifyTransferredPayeeName(): Promise<string> {
        const locator = this.web.element(payBill.transferredPayeeName);
        await locator.waitFor({ state: 'visible' });
        return (await locator.innerText()).trim();
    }
    async amountTransferred() {
        return (await this.web.getText(payBill.amountTransferred)) ?? '';
    }
    async verifyFromAccountNumber() {
        return (await this.web.getText(payBill.fromAccountTransferred)) ?? '';
    }
    async verifyMessageAccountActivity() {
        const locator = this.web.element(payBill.accountActivity);
        await locator.waitFor({ state: 'visible' });
        return await locator.isVisible();
    }
    async SendPayment() {
        return await this.web.click(payBill.clickSendPayment);
    }
    // Missing information
    async getAddressMissingError(): Promise<string> {
        return (await this.web.getText(payBill.addressMissing)) ?? '';
    }
    async getZipCodeMissingError(): Promise<string> {
        return (await this.web.getText(payBill.zipcodeMissing)) ?? '';
    }
}