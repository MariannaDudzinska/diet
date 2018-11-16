import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatFormFieldModule, MatProgressSpinnerModule, MatInputModule } from '@angular/material';
import {FormsModule, ReactiveFormsModule, FormControl} from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { EnginDietSharedModule } from 'app/shared';
import {
    FoodComponent,
    FoodDetailComponent,
    FoodUpdateComponent,
    FoodDeletePopupComponent,
    FoodDeleteDialogComponent,
    foodRoute,
    foodPopupRoute
} from './';

const ENTITY_STATES = [...foodRoute, ...foodPopupRoute];

@NgModule({
    imports: [EnginDietSharedModule, RouterModule.forChild(ENTITY_STATES), MatAutocompleteModule, MatFormFieldModule, FormsModule,
        ReactiveFormsModule, MatProgressSpinnerModule, MatInputModule, BrowserModule],
    declarations: [FoodComponent, FoodDetailComponent, FoodUpdateComponent, FoodDeleteDialogComponent, FoodDeletePopupComponent],
    entryComponents: [FoodComponent, FoodUpdateComponent, FoodDeleteDialogComponent, FoodDeletePopupComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EnginDietFoodModule {}
