import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { EnginDietSharedModule } from 'app/shared';
import { HOME_ROUTE, HomeComponent } from './';
import { MatFormFieldModule, MatProgressSpinnerModule, MatInputModule } from '@angular/material';
import {FormsModule, ReactiveFormsModule, FormControl} from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@NgModule({
    imports: [EnginDietSharedModule, RouterModule.forChild([HOME_ROUTE]),
        MatAutocompleteModule, MatFormFieldModule, FormsModule,
        ReactiveFormsModule, MatProgressSpinnerModule, MatInputModule, BrowserModule],
    declarations: [HomeComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EnginDietHomeModule {}
