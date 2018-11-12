import { NgModule } from '@angular/core';

import { EnginDietSharedLibsModule, JhiAlertComponent, JhiAlertErrorComponent } from './';

@NgModule({
    imports: [EnginDietSharedLibsModule],
    declarations: [JhiAlertComponent, JhiAlertErrorComponent],
    exports: [EnginDietSharedLibsModule, JhiAlertComponent, JhiAlertErrorComponent]
})
export class EnginDietSharedCommonModule {}
