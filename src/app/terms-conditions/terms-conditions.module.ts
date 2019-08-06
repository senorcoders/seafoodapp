import { NgModule } from '@angular/core';

import { TermsConditionsRoutingModule } from './terms-conditions-routing.module';
import { SharedModule } from '../shared/shared.module';
import { TermsConditionsComponent } from './terms-conditions.component';

@NgModule({
  imports: [
    SharedModule,
    TermsConditionsRoutingModule
  ],
  declarations: [TermsConditionsComponent]
})
export class TermsConditionsModule { }
