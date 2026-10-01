import { Page } from "@playwright/test";
import { webCommons } from "../../commons/webCommons";
import registration from "../pageElements/registration-page.json";
import { config } from '../../config/config';

export class registrationSteps {
    page: Page
    web: webCommons

    constructor(page: Page) {
        this.page = page;
        this.web = new webCommons(page);
    }

    //Launch Application

    async navigateToRegistrationPage() {
        await this.web.launchApplication(config.baseUrl + 'register.htm');
    }

    async fillRegisterForm(firstName: string, lastName: string, address: string, city: string, state: string, zipCode: string, phoneNumber: string, ssn: string, userName: string, password: string) {
        await this.web.fillText(registration.firstName, firstName); //store locator, parameter
        await this.web.fillText(registration.lastName, lastName);
        await this.web.fillText(registration.address, address);
        await this.web.fillText(registration.city, city);
        await this.web.fillText(registration.state, state);
        await this.web.fillText(registration.zipCode, zipCode);
        await this.web.fillText(registration.phoneNumber, phoneNumber);
        await this.web.fillText(registration.ssn, ssn);
        await this.web.fillText(registration.userName, userName);
        await this.web.fillText(registration.password, password);
        await this.web.fillText(registration.confirmPassword, password);
    }

    async clickRegisterButton() {
        await this.web.click(registration.registerButton);
    }

   
    // specific, named methods - these ARE called from spec
    async getZipCodeError(): Promise<string> {
        return this.web.getFieldError(registration.zipcodeError);
    }

    async getSsnError(): Promise<string> {
        return this.web.getFieldError(registration.ssnError);
    }








}
