/* tslint:disable no-unused-expression */
import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { UsersWeightComponentsPage, UsersWeightDeleteDialog, UsersWeightUpdatePage } from './users-weight.page-object';

const expect = chai.expect;

describe('UsersWeight e2e test', () => {
    let navBarPage: NavBarPage;
    let signInPage: SignInPage;
    let usersWeightUpdatePage: UsersWeightUpdatePage;
    let usersWeightComponentsPage: UsersWeightComponentsPage;
    /*let usersWeightDeleteDialog: UsersWeightDeleteDialog;*/

    before(async () => {
        await browser.get('/');
        navBarPage = new NavBarPage();
        signInPage = await navBarPage.getSignInPage();
        await signInPage.autoSignInUsing('admin', 'admin');
        await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
    });

    it('should load UsersWeights', async () => {
        await navBarPage.goToEntity('users-weight');
        usersWeightComponentsPage = new UsersWeightComponentsPage();
        expect(await usersWeightComponentsPage.getTitle()).to.eq('Users Weights');
    });

    it('should load create UsersWeight page', async () => {
        await usersWeightComponentsPage.clickOnCreateButton();
        usersWeightUpdatePage = new UsersWeightUpdatePage();
        expect(await usersWeightUpdatePage.getPageTitle()).to.eq('Create or edit a Users Weight');
        await usersWeightUpdatePage.cancel();
    });

    /* it('should create and save UsersWeights', async () => {
        const nbButtonsBeforeCreate = await usersWeightComponentsPage.countDeleteButtons();

        await usersWeightComponentsPage.clickOnCreateButton();
        await promise.all([
            usersWeightUpdatePage.setDateOfLogInput('2000-12-31'),
            usersWeightUpdatePage.setValueInKgInput('5'),
            usersWeightUpdatePage.userExtraSelectLastOption(),
        ]);
        expect(await usersWeightUpdatePage.getDateOfLogInput()).to.eq('2000-12-31');
        expect(await usersWeightUpdatePage.getValueInKgInput()).to.eq('5');
        await usersWeightUpdatePage.save();
        expect(await usersWeightUpdatePage.getSaveButton().isPresent()).to.be.false;

        expect(await usersWeightComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
    });*/

    /* it('should delete last UsersWeight', async () => {
        const nbButtonsBeforeDelete = await usersWeightComponentsPage.countDeleteButtons();
        await usersWeightComponentsPage.clickOnLastDeleteButton();

        usersWeightDeleteDialog = new UsersWeightDeleteDialog();
        expect(await usersWeightDeleteDialog.getDialogTitle())
            .to.eq('Are you sure you want to delete this Users Weight?');
        await usersWeightDeleteDialog.clickOnConfirmButton();

        expect(await usersWeightComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
    });*/

    after(async () => {
        await navBarPage.autoSignOut();
    });
});
