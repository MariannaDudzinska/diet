import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { EnginDietUserExtraModule } from './user-extra/user-extra.module';
import { EnginDietUsersWeightModule } from './users-weight/users-weight.module';
import { EnginDietFoodModule } from './food/food.module';
/* jhipster-needle-add-entity-module-import - JHipster will add entity modules imports here */

@NgModule({
    // prettier-ignore
    imports: [
        EnginDietUserExtraModule,
        EnginDietUsersWeightModule,
        EnginDietFoodModule
        /* jhipster-needle-add-entity-module - JHipster will add entity modules here */
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EnginDietEntityModule {}
