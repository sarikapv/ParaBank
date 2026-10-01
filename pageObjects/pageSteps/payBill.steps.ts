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
        return await this.web.isElementVisible(payBill.title);
    }

    //     async verifyTransferredPayeeName(): Promise<string> {
    //     return (await this.web.getInnerText(payBill.transferredPayeeName)) ?? '';
    // }
    async verifyTransferredPayeeName(): Promise<string> {
        const locator = this.web.element(payBill.transferredPayeeName);
        // console.log("COUNT:", await locator.count());
        // console.log("TEXT CONTENTS:", await locator.allTextContents());
        return (await locator.textContent()) ?? '';
    }

    async amountTransferred() {
        return (await this.web.getText(payBill.amountTransferred)) ?? '';

    }

    async verifyFromAccountNumber() {
        return (await this.web.getText(payBill.fromAccountTransferred)) ?? '';

    }

    async verifyMessageAccountActivity() {
        return await this.web.isElementVisible(payBill.accountActivity);
    }

    async SendPayment(){
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