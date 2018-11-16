/* tslint:disable no-unused-expression */
import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { NutrienComponentsPage, NutrienDeleteDialog, NutrienUpdatePage } from './nutrien.page-object';

const expect = chai.expect;

describe('Nutrien e2e test', () => {
    let navBarPage: NavBarPage;
    let signInPage: SignInPage;
    let nutrienUpdatePage: NutrienUpdatePage;
    let nutrienComponentsPage: NutrienComponentsPage;
    let nutrienDeleteDialog: NutrienDeleteDialog;

    before(async () => {
        await browser.get('/');
        navBarPage = new NavBarPage();
        signInPage = await navBarPage.getSignInPage();
        await signInPage.autoSignInUsing('admin', 'admin');
        await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
    });

    it('should load Nutriens', async () => {
        await navBarPage.goToEntity('nutrien');
        nutrienComponentsPage = new NutrienComponentsPage();
        expect(await nutrienComponentsPage.getTitle()).to.eq('Nutriens');
    });

    it('should load create Nutrien page', async () => {
        await nutrienComponentsPage.clickOnCreateButton();
        nutrienUpdatePage = new NutrienUpdatePage();
        expect(await nutrienUpdatePage.getPageTitle()).to.eq('Create or edit a Nutrien');
        await nutrienUpdatePage.cancel();
    });

    it('should create and save Nutriens', async () => {
        const nbButtonsBeforeCreate = await nutrienComponentsPage.countDeleteButtons();

        await nutrienComponentsPage.clickOnCreateButton();
        await promise.all([
            nutrienUpdatePage.setNutrientInput('nutrient'),
            nutrienUpdatePage.setUnitInput('unit'),
            nutrienUpdatePage.setValueInput('5'),
            nutrienUpdatePage.setGmInput('5'),
            nutrienUpdatePage.foodSelectLastOption()
        ]);
        expect(await nutrienUpdatePage.getNutrientInput()).to.eq('nutrient');
        expect(await nutrienUpdatePage.getUnitInput()).to.eq('unit');
        expect(await nutrienUpdatePage.getValueInput()).to.eq('5');
        expect(await nutrienUpdatePage.getGmInput()).to.eq('5');
        await nutrienUpdatePage.save();
        expect(await nutrienUpdatePage.getSaveButton().isPresent()).to.be.false;

        expect(await nutrienComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
    });

    it('should delete last Nutrien', async () => {
        const nbButtonsBeforeDelete = await nutrienComponentsPage.countDeleteButtons();
        await nutrienComponentsPage.clickOnLastDeleteButton();

        nutrienDeleteDialog = new NutrienDeleteDialog();
        expect(await nutrienDeleteDialog.getDialogTitle()).to.eq('Are you sure you want to delete this Nutrien?');
        await nutrienDeleteDialog.clickOnConfirmButton();

        expect(await nutrienComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
    });

    after(async () => {
        await navBarPage.autoSignOut();
    });
});
