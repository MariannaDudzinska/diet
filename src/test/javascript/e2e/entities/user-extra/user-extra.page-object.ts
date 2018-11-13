import { element, by, ElementFinder } from 'protractor';

export class UserExtraComponentsPage {
    createButton = element(by.id('jh-create-entity'));
    deleteButtons = element.all(by.css('jhi-user-extra div table .btn-danger'));
    title = element.all(by.css('jhi-user-extra div h2#page-heading span')).first();

    async clickOnCreateButton() {
        await this.createButton.click();
    }

    async clickOnLastDeleteButton() {
        await this.deleteButtons.last().click();
    }

    async countDeleteButtons() {
        return this.deleteButtons.count();
    }

    async getTitle() {
        return this.title.getText();
    }
}

export class UserExtraUpdatePage {
    pageTitle = element(by.id('jhi-user-extra-heading'));
    saveButton = element(by.id('save-entity'));
    cancelButton = element(by.id('cancel-save'));
    weightInput = element(by.id('field_weight'));
    heightInput = element(by.id('field_height'));
    lifestyleSelect = element(by.id('field_lifestyle'));
    dietModeSelect = element(by.id('field_dietMode'));
    userSelect = element(by.id('field_user'));

    async getPageTitle() {
        return this.pageTitle.getText();
    }

    async setWeightInput(weight) {
        await this.weightInput.sendKeys(weight);
    }

    async getWeightInput() {
        return this.weightInput.getAttribute('value');
    }

    async setHeightInput(height) {
        await this.heightInput.sendKeys(height);
    }

    async getHeightInput() {
        return this.heightInput.getAttribute('value');
    }

    async setLifestyleSelect(lifestyle) {
        await this.lifestyleSelect.sendKeys(lifestyle);
    }

    async getLifestyleSelect() {
        return this.lifestyleSelect.element(by.css('option:checked')).getText();
    }

    async lifestyleSelectLastOption() {
        await this.lifestyleSelect
            .all(by.tagName('option'))
            .last()
            .click();
    }

    async setDietModeSelect(dietMode) {
        await this.dietModeSelect.sendKeys(dietMode);
    }

    async getDietModeSelect() {
        return this.dietModeSelect.element(by.css('option:checked')).getText();
    }

    async dietModeSelectLastOption() {
        await this.dietModeSelect
            .all(by.tagName('option'))
            .last()
            .click();
    }

    async userSelectLastOption() {
        await this.userSelect
            .all(by.tagName('option'))
            .last()
            .click();
    }

    async userSelectOption(option) {
        await this.userSelect.sendKeys(option);
    }

    getUserSelect(): ElementFinder {
        return this.userSelect;
    }

    async getUserSelectedOption() {
        return this.userSelect.element(by.css('option:checked')).getText();
    }

    async save() {
        await this.saveButton.click();
    }

    async cancel() {
        await this.cancelButton.click();
    }

    getSaveButton(): ElementFinder {
        return this.saveButton;
    }
}

export class UserExtraDeleteDialog {
    private dialogTitle = element(by.id('jhi-delete-userExtra-heading'));
    private confirmButton = element(by.id('jhi-confirm-delete-userExtra'));

    async getDialogTitle() {
        return this.dialogTitle.getText();
    }

    async clickOnConfirmButton() {
        await this.confirmButton.click();
    }
}
