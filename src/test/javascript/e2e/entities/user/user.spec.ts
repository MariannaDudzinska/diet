/* tslint:disable no-unused-expression */
import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { UserComponentsPage, UserDeleteDialog, UserUpdatePage } from './user.page-object';

const expect = chai.expect;

describe('User e2e test', () => {
    let navBarPage: NavBarPage;
    let signInPage: SignInPage;
    let userUpdatePage: UserUpdatePage;
    let userComponentsPage: UserComponentsPage;
    let userDeleteDialog: UserDeleteDialog;

    before(async () => {
        await browser.get('/');
        navBarPage = new NavBarPage();
        signInPage = await navBarPage.getSignInPage();
        await signInPage.autoSignInUsing('admin', 'admin');
        await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
    });

    it('should load Users', async () => {
        await navBarPage.goToEntity('user');
        userComponentsPage = new UserComponentsPage();
        expect(await userComponentsPage.getTitle()).to.eq('Users');
    });

    it('should load create User page', async () => {
        await userComponentsPage.clickOnCreateButton();
        userUpdatePage = new UserUpdatePage();
        expect(await userUpdatePage.getPageTitle()).to.eq('Create or edit a User');
        await userUpdatePage.cancel();
    });

    it('should create and save Users', async () => {
        const nbButtonsBeforeCreate = await userComponentsPage.countDeleteButtons();

        await userComponentsPage.clickOnCreateButton();
        await promise.all([]);
        await userUpdatePage.save();
        expect(await userUpdatePage.getSaveButton().isPresent()).to.be.false;

        expect(await userComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
    });

    it('should delete last User', async () => {
        const nbButtonsBeforeDelete = await userComponentsPage.countDeleteButtons();
        await userComponentsPage.clickOnLastDeleteButton();

        userDeleteDialog = new UserDeleteDialog();
        expect(await userDeleteDialog.getDialogTitle()).to.eq('Are you sure you want to delete this User?');
        await userDeleteDialog.clickOnConfirmButton();

        expect(await userComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
    });

    after(async () => {
        await navBarPage.autoSignOut();
    });
});
