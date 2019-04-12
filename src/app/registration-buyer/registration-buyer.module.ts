import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { RegistrationBuyerComponent } from './registration-buyer.component';
import { RegistrationBuyerRoutingModule } from './registration-buyer-routing.module';

@NgModule({
  imports: [
    SharedModule,
    RegistrationBuyerRoutingModule
  ],
  exports: [SharedModule],
  declarations: [RegistrationBuyerComponent]
})
export class RegistrationBuyerModule { }
