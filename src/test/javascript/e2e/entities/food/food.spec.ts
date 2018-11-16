/* tslint:disable no-unused-expression */
import { browser, ExpectedConditions as ec, protractor, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { FoodComponentsPage, FoodDeleteDialog, FoodUpdatePage } from './food.page-object';

const expect = chai.expect;

describe('Food e2e test', () => {
    let navBarPage: NavBarPage;
    let signInPage: SignInPage;
    let foodUpdatePage: FoodUpdatePage;
    let foodComponentsPage: FoodComponentsPage;
    let foodDeleteDialog: FoodDeleteDialog;

    before(async () => {
        await browser.get('/');
        navBarPage = new NavBarPage();
        signInPage = await navBarPage.getSignInPage();
        await signInPage.autoSignInUsing('admin', 'admin');
        await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
    });

    it('should load Foods', async () => {
        await navBarPage.goToEntity('food');
        foodComponentsPage = new FoodComponentsPage();
        expect(await foodComponentsPage.getTitle()).to.eq('Foods');
    });

    it('should load create Food page', async () => {
        await foodComponentsPage.clickOnCreateButton();
        foodUpdatePage = new FoodUpdatePage();
        expect(await foodUpdatePage.getPageTitle()).to.eq('Create or edit a Food');
        await foodUpdatePage.cancel();
    });

    it('should create and save Foods', async () => {
        const nbButtonsBeforeCreate = await foodComponentsPage.countDeleteButtons();

        await foodComponentsPage.clickOnCreateButton();
        await promise.all([
            foodUpdatePage.setNameInput('name'),
            foodUpdatePage.setQuantityInput('5'),
            foodUpdatePage.setDateOfConsumptionInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
            foodUpdatePage.userExtraFoodSelectLastOption()
        ]);
        expect(await foodUpdatePage.getNameInput()).to.eq('name');
        expect(await foodUpdatePage.getQuantityInput()).to.eq('5');
        expect(await foodUpdatePage.getDateOfConsumptionInput()).to.contain('2001-01-01T02:30');
        await foodUpdatePage.save();
        expect(await foodUpdatePage.getSaveButton().isPresent()).to.be.false;

        expect(await foodComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
    });

    it('should delete last Food', async () => {
        const nbButtonsBeforeDelete = await foodComponentsPage.countDeleteButtons();
        await foodComponentsPage.clickOnLastDeleteButton();

        foodDeleteDialog = new FoodDeleteDialog();
        expect(await foodDeleteDialog.getDialogTitle()).to.eq('Are you sure you want to delete this Food?');
        await foodDeleteDialog.clickOnConfirmButton();

        expect(await foodComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
    });

    after(async () => {
        await navBarPage.autoSignOut();
    });
});
