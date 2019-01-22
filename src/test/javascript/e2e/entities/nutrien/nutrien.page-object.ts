import { element, by, ElementFinder } from 'protractor';

export class NutrienComponentsPage {
    createButton = element(by.id('jh-create-entity'));
    deleteButtons = element.all(by.css('jhi-nutrien div table .btn-danger'));
    title = element.all(by.css('jhi-nutrien div h2#page-heading span')).first();

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

export class NutrienUpdatePage {
    pageTitle = element(by.id('jhi-nutrien-heading'));
    saveButton = element(by.id('save-entity'));
    cancelButton = element(by.id('cancel-save'));
    nutrientInput = element(by.id('field_nutrient'));
    unitInput = element(by.id('field_unit'));
    valueInput = element(by.id('field_value'));
    gmInput = element(by.id('field_gm'));
    foodSelect = element(by.id('field_food'));

    async getPageTitle() {
        return this.pageTitle.getText();
    }

    async setNutrientInput(nutrient) {
        await this.nutrientInput.sendKeys(nutrient);
    }

    async getNutrientInput() {
        return this.nutrientInput.getAttribute('value');
    }

    async setUnitInput(unit) {
        await this.unitInput.sendKeys(unit);
    }

    async getUnitInput() {
        return this.unitInput.getAttribute('value');
    }

    async setValueInput(value) {
        await this.valueInput.sendKeys(value);
    }

    async getValueInput() {
        return this.valueInput.getAttribute('value');
    }

    async setGmInput(gm) {
        await this.gmInput.sendKeys(gm);
    }

    async getGmInput() {
        return this.gmInput.getAttribute('value');
    }

    async foodSelectLastOption() {
        await this.foodSelect
            .all(by.tagName('option'))
            .last()
            .click();
    }

    async foodSelectOption(option) {
        await this.foodSelect.sendKeys(option);
    }

    getFoodSelect(): ElementFinder {
        return this.foodSelect;
    }

    async getFoodSelectedOption() {
        return this.foodSelect.element(by.css('option:checked')).getText();
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

export class NutrienDeleteDialog {
    private dialogTitle = element(by.id('jhi-delete-nutrien-heading'));
    private confirmButton = element(by.id('jhi-confirm-delete-nutrien'));

    async getDialogTitle() {
        return this.dialogTitle.getText();
    }

    async clickOnConfirmButton() {
        await this.confirmButton.click();
    }
}
