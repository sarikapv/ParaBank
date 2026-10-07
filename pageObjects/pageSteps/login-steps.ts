import { Page } from "@playwright/test";
import { webCommons } from "../../commons/webCommons";
import login from "../pageElements/login-page.json";
import { config } from '../../config/config';

export class loginSteps {

    web: webCommons
    page: Page

    constructor(page: Page) {
        this.page = page;
        this.web = new webCommons(page);
    }
    //launch Application
    async launchApplication() {
        await this.web.launchApplication(config.baseUrl);
    }
    //login
    async fillText(username: string, password: string) {
        await this.web.fillText(login.userName, username);
        await this.web.fillText(login.password, password);
    }
    async clickLoginButton(){
        await this.web.click(login.loginButton);
    }
    async isAccountServicesVisible(){
       return await this.web.isElementVisible(login.acountOverview);
    }
    async getErrorMessage():Promise<string>{
        return (await this.web.getText(login.errorMessage))??'';
    }
}