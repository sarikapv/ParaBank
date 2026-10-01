import { Page, Locator, expect } from "@playwright/test";

export class webCommons {

    page: Page;
    constructor(page: Page) {
        this.page = page;

    }

    // Navigation & Page Load

    // navigateTo(url) — go to a URL
    async launchApplication(url: string) {
        await this.page.goto(url);
    }

    element(locator: string): Locator {
        return this.page.locator(locator);
    }

    // waitForPageLoad() — wait for network idle / load state
    async waitForPageLoad(): Promise<void> {
        await this.page.waitForLoadState('load');
    }

    async waitForElement(locator: string): Promise<void> {
        const element = this.element(locator);
        await element.waitFor({ state: 'visible' });
    }

    // getCurrentUrl() / getPageTitle()

    async getCurrentUrl(): Promise<string> {
        return this.page.url();
    }

    async getPageTitle(): Promise<string> {
        return await this.page.title();
    }

    // Element Interaction

    // click(locator)
    async click(locator: string) {
        const element = this.element(locator);
        await element.click();
    }
    // doubleClick(locator)
    async doubleClick(locator: string): Promise<void> {
        const element = this.element(locator);
        await element.dblclick();
    }

    // fillText(locator, text)
    async fillText(locator: string, text: string): Promise<void> {
        const element = this.element(locator);
        await element.fill(text);

    }

    // clearText(locator)
    async clearText(locator: string): Promise<void> {
        const element = this.element(locator);
        await element.clear();
    }
    // typeText(locator, text) — character-by-character, for fields with JS validation/masking
    async typeText(locator: string, text: string): Promise<void> {
        const element = this.element(locator);
        await element.pressSequentially(text);

    }
    // pressKey(locator, key) — e.g., Enter, Tab
    async pressKey(locator: string, key: string): Promise<void> {
        const element = this.element(locator);
        await element.press(key);
    }

    // hover(locator)
    async hover(locator: string): Promise<void> {
        const element = this.element(locator);
        await element.hover();
    }
    // selectDropdownByValue(locator, value) / 
    async selectDropdownByValue(locator: string, value: string): Promise<void> {
        const element = this.element(locator);
        await element.selectOption({ value: value });
    }

    //selectDropdownByLabel(locator, label)
    async selectDropdownByLabel(locator: string, label: string): Promise<void> {
        const element = this.element(locator);
        await element.selectOption({ label: label });
    }

    async selectDropdownByIndex(locator: string, index: number) {
    await this.page.locator(locator).selectOption({ index });
}
    // checkCheckbox(locator) / uncheckCheckbox(locator)
    async checkBox(locator: string): Promise<void> {
        const element = this.element(locator);
        await element.check();
    }

    async unCheckBox(locator: string): Promise<void> {
        const element = this.element(locator);
        await element.uncheck();
    }

    // Element State / Retrieval

    // isVisible(locator)
    async isElementVisible(locator: string): Promise<boolean> {
        const element = this.element(locator);
        return await element.isVisible();
    }

    // isEnabled(locator)
    async isEnabled(locator: string): Promise<boolean> {
        const element = this.element(locator);
        return await element.isEnabled();
    }


    // isChecked(locator)
    // async isChecked(locator: string): Promise<boolean> {
    //     const element = this.element(locator);
    //     return await element.isChecked();
    // }

    async selectCheckbox(locator: string) {
        const element = this.element(locator);
        const isChecked = await element.isChecked();
        if (!isChecked) {
            await element.check();
        }
    }
    // getText(locator)
    async getText(locator: string): Promise<string | null> {
        const element = this.element(locator);
        return await element.textContent();

    }

    async getInnerText(locator: string): Promise<string> {
    const element = this.element(locator);
    return await element.innerText();
}
    // getAttribute(locator, attrName)
    async getAttribute(locator: string, attribute: string): Promise<string | null> {
        const element = this.element(locator);
        return await element.getAttribute(attribute);
    }

    // getElementCount(locator) — useful for verifying list/table row counts
    async getElementCount(locator: string): Promise<number> {
        const element = this.element(locator);
        return await element.count();
    }

    // Waits

    // waitForElement(locator)
    async elementVisible(locator: string): Promise<void> {
        const element = this.element(locator);
        await element.waitFor({ state: 'visible' });
    }

    // waitForElementToDisappear(locator)

    async elementDisappear(locator: string): Promise<void> {
        const element = this.element(locator);
        await element.waitFor({ state: 'detached' });
    }

    //wait for hiddenelement
    async elementHidden(locator: string): Promise<void> {
        const element = this.element(locator);
        await element.waitFor({ state: 'hidden' });
    }

    // waitForTimeout(ms) — used sparingly, mainly as a fallback
    //   async waitForTimeout(ms: number): Promise<void> {
    //     await this.page.waitForTimeout(ms);
    // }

    // Scrolling

    // scrollIntoView(locator)
    async scrollIntoView(locator: string): Promise<void> {
        const element = this.element(locator);
        await element.scrollIntoViewIfNeeded();
    }
    // scrollToTop() / scrollToBottom()
    async scrollToTop(): Promise<void> {
        await this.page.evaluate(() => window.scrollTo(0, 0));
    }

    async scrollToBottom(): Promise<void> {
        await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    }

    // Alerts / New windows (less common in ParaBank, but standard in frameworks)

    // switchToNewTab()
    async launchNewTab(url: string) {
        const newPage = await this.page.context().newPage();
        return newPage.goto(url);
        return newPage;
    }

    // acceptAlert() / dismissAlert()
    // NOTE: Must be called BEFORE the action that triggers the dialog (e.g., before clicking a button that opens a confirm()/alert() popup). 
    // This registers a listener that needs to be armed in advance — Playwright dialogs must be handled proactively, not reactively after they appear.
    async handleAlert(action: 'accept' | 'dismiss', promptText?: string): Promise<void> {
        await this.page.once('dialog', async dialog => {
            if (action === 'accept') {
                await dialog.accept(promptText);
            } else {
                await dialog.dismiss();
            }
        })
    }

    // assertTextEquals(locator, expectedText)
    async verifyValueContains(actualValue: string, expectedValue: string): Promise<void> {
        await expect(actualValue).toContain(expectedValue);
    }

    // Screenshot/debug utility // takeScreenshot(name) — useful for failure evidence in reports
    async takeScreenshot(path: string): Promise<string | void> {
        await this.page.screenshot({ path: path });

    }
    async getInputValue(locator: string): Promise<string> {
        const element = this.element(locator);
        return await element.inputValue();
    }

     // generic internal helper - not called directly from spec
    async getFieldError(fieldLocator: string): Promise<string> {
        return (await this.getText(fieldLocator)) ?? '';
    }

}









