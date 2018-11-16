import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { EnginDietSharedModule } from 'app/shared';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import {
    SessionsComponent,
    PasswordStrengthBarComponent,
    RegisterComponent,
    ActivateComponent,
    PasswordComponent,
    PasswordResetInitComponent,
    PasswordResetFinishComponent,
    SettingsComponent,
    accountState
} from './';

@NgModule({
    imports: [EnginDietSharedModule, RouterModule.forChild(accountState), NgbModule.forRoot(), BrowserAnimationsModule],
    declarations: [
        ActivateComponent,
        RegisterComponent,
        PasswordComponent,
        PasswordStrengthBarComponent,
        PasswordResetInitComponent,
        PasswordResetFinishComponent,
        SessionsComponent,
        SettingsComponent
    ],
    bootstrap: [SessionsComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EnginDietAccountModule {}
