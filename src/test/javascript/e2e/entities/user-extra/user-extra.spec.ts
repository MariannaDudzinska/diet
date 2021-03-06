/* tslint:disable no-unused-expression */
import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { UserExtraComponentsPage, UserExtraDeleteDialog, UserExtraUpdatePage } from './user-extra.page-object';

const expect = chai.expect;

describe('UserExtra e2e test', () => {
    let navBarPage: NavBarPage;
    let signInPage: SignInPage;
    let userExtraUpdatePage: UserExtraUpdatePage;
    let userExtraComponentsPage: UserExtraComponentsPage;
    let userExtraDeleteDialog: UserExtraDeleteDialog;

    before(async () => {
        await browser.get('/');
        navBarPage = new NavBarPage();
        signInPage = await navBarPage.getSignInPage();
        await signInPage.autoSignInUsing('admin', 'admin');
        await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
    });

    it('should load UserExtras', async () => {
        await navBarPage.goToEntity('user-extra');
        userExtraComponentsPage = new UserExtraComponentsPage();
        expect(await userExtraComponentsPage.getTitle()).to.eq('User Extras');
    });

    it('should load create UserExtra page', async () => {
        await userExtraComponentsPage.clickOnCreateButton();
        userExtraUpdatePage = new UserExtraUpdatePage();
        expect(await userExtraUpdatePage.getPageTitle()).to.eq('Create or edit a User Extra');
        await userExtraUpdatePage.cancel();
    });

    it('should create and save UserExtras', async () => {
        const nbButtonsBeforeCreate = await userExtraComponentsPage.countDeleteButtons();

        await userExtraComponentsPage.clickOnCreateButton();
        await promise.all([
            userExtraUpdatePage.setWeightInput('5'),
            userExtraUpdatePage.setHeightInput('5'),
            userExtraUpdatePage.lifestyleSelectLastOption(),
            userExtraUpdatePage.dietModeSelectLastOption(),
            userExtraUpdatePage.userSelectLastOption()
        ]);
        expect(await userExtraUpdatePage.getWeightInput()).to.eq('5');
        expect(await userExtraUpdatePage.getHeightInput()).to.eq('5');
        await userExtraUpdatePage.save();
        expect(await userExtraUpdatePage.getSaveButton().isPresent()).to.be.false;

        expect(await userExtraComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
    });

    it('should delete last UserExtra', async () => {
        const nbButtonsBeforeDelete = await userExtraComponentsPage.countDeleteButtons();
        await userExtraComponentsPage.clickOnLastDeleteButton();

        userExtraDeleteDialog = new UserExtraDeleteDialog();
        expect(await userExtraDeleteDialog.getDialogTitle()).to.eq('Are you sure you want to delete this User Extra?');
        await userExtraDeleteDialog.clickOnConfirmButton();

        expect(await userExtraComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
    });

    after(async () => {
        await navBarPage.autoSignOut();
    });
});
