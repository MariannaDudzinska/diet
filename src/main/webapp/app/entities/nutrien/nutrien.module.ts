import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { EnginDietSharedModule } from 'app/shared';
import {
    NutrienComponent,
    NutrienDetailComponent,
    NutrienUpdateComponent,
    NutrienDeletePopupComponent,
    NutrienDeleteDialogComponent,
    nutrienRoute,
    nutrienPopupRoute
} from './';

const ENTITY_STATES = [...nutrienRoute, ...nutrienPopupRoute];

@NgModule({
    imports: [EnginDietSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        NutrienComponent,
        NutrienDetailComponent,
        NutrienUpdateComponent,
        NutrienDeleteDialogComponent,
        NutrienDeletePopupComponent
    ],
    entryComponents: [NutrienComponent, NutrienUpdateComponent, NutrienDeleteDialogComponent, NutrienDeletePopupComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EnginDietNutrienModule {}
