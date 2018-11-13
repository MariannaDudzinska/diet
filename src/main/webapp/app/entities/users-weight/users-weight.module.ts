import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { EnginDietSharedModule } from 'app/shared';
import {
    UsersWeightComponent,
    UsersWeightDetailComponent,
    UsersWeightUpdateComponent,
    UsersWeightDeletePopupComponent,
    UsersWeightDeleteDialogComponent,
    usersWeightRoute,
    usersWeightPopupRoute
} from './';

const ENTITY_STATES = [...usersWeightRoute, ...usersWeightPopupRoute];

@NgModule({
    imports: [EnginDietSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        UsersWeightComponent,
        UsersWeightDetailComponent,
        UsersWeightUpdateComponent,
        UsersWeightDeleteDialogComponent,
        UsersWeightDeletePopupComponent
    ],
    entryComponents: [UsersWeightComponent, UsersWeightUpdateComponent, UsersWeightDeleteDialogComponent, UsersWeightDeletePopupComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EnginDietUsersWeightModule {}
