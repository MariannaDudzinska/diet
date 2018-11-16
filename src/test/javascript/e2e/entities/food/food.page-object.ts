import { element, by, ElementFinder } from 'protractor';

export class FoodComponentsPage {
    createButton = element(by.id('jh-create-entity'));
    deleteButtons = element.all(by.css('jhi-food div table .btn-danger'));
    title = element.all(by.css('jhi-food div h2#page-heading span')).first();

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

export class FoodUpdatePage {
    pageTitle = element(by.id('jhi-food-heading'));
    saveButton = element(by.id('save-entity'));
    cancelButton = element(by.id('cancel-save'));
    nameInput = element(by.id('field_name'));
    quantityInput = element(by.id('field_quantity'));
    dateOfConsumptionInput = element(by.id('field_dateOfConsumption'));
    userExtraFoodSelect = element(by.id('field_userExtraFood'));

    async getPageTitle() {
        return this.pageTitle.getText();
    }

    async setNameInput(name) {
        await this.nameInput.sendKeys(name);
    }

    async getNameInput() {
        return this.nameInput.getAttribute('value');
    }

    async setQuantityInput(quantity) {
        await this.quantityInput.sendKeys(quantity);
    }

    async getQuantityInput() {
        return this.quantityInput.getAttribute('value');
    }

    async setDateOfConsumptionInput(dateOfConsumption) {
        await this.dateOfConsumptionInput.sendKeys(dateOfConsumption);
    }

    async getDateOfConsumptionInput() {
        return this.dateOfConsumptionInput.getAttribute('value');
    }

    async userExtraFoodSelectLastOption() {
        await this.userExtraFoodSelect
            .all(by.tagName('option'))
            .last()
            .click();
    }

    async userExtraFoodSelectOption(option) {
        await this.userExtraFoodSelect.sendKeys(option);
    }

    getUserExtraFoodSelect(): ElementFinder {
        return this.userExtraFoodSelect;
    }

    async getUserExtraFoodSelectedOption() {
        return this.userExtraFoodSelect.element(by.css('option:checked')).getText();
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

export class FoodDeleteDialog {
    private dialogTitle = element(by.id('jhi-delete-food-heading'));
    private confirmButton = element(by.id('jhi-confirm-delete-food'));

    async getDialogTitle() {
        return this.dialogTitle.getText();
    }

    async clickOnConfirmButton() {
        await this.confirmButton.click();
    }
}
