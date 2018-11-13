import { element, by, ElementFinder } from 'protractor';

export class UsersWeightComponentsPage {
    createButton = element(by.id('jh-create-entity'));
    deleteButtons = element.all(by.css('jhi-users-weight div table .btn-danger'));
    title = element.all(by.css('jhi-users-weight div h2#page-heading span')).first();

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

export class UsersWeightUpdatePage {
    pageTitle = element(by.id('jhi-users-weight-heading'));
    saveButton = element(by.id('save-entity'));
    cancelButton = element(by.id('cancel-save'));
    dateOfLogInput = element(by.id('field_dateOfLog'));
    valueInKgInput = element(by.id('field_valueInKg'));
    userExtraSelect = element(by.id('field_userExtra'));

    async getPageTitle() {
        return this.pageTitle.getText();
    }

    async setDateOfLogInput(dateOfLog) {
        await this.dateOfLogInput.sendKeys(dateOfLog);
    }

    async getDateOfLogInput() {
        return this.dateOfLogInput.getAttribute('value');
    }

    async setValueInKgInput(valueInKg) {
        await this.valueInKgInput.sendKeys(valueInKg);
    }

    async getValueInKgInput() {
        return this.valueInKgInput.getAttribute('value');
    }

    async userExtraSelectLastOption() {
        await this.userExtraSelect
            .all(by.tagName('option'))
            .last()
            .click();
    }

    async userExtraSelectOption(option) {
        await this.userExtraSelect.sendKeys(option);
    }

    getUserExtraSelect(): ElementFinder {
        return this.userExtraSelect;
    }

    async getUserExtraSelectedOption() {
        return this.userExtraSelect.element(by.css('option:checked')).getText();
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

export class UsersWeightDeleteDialog {
    private dialogTitle = element(by.id('jhi-delete-usersWeight-heading'));
    private confirmButton = element(by.id('jhi-confirm-delete-usersWeight'));

    async getDialogTitle() {
        return this.dialogTitle.getText();
    }

    async clickOnConfirmButton() {
        await this.confirmButton.click();
    }
}
