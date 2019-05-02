import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { RegistrationFormRoutingModule } from './registration-form-routing.module';
import { RegistrationFormComponent } from './registration-form.component';
import { RegistrationBuyerComponent } from '../registration-buyer/registration-buyer.component';
import { RegistrationSellerComponent } from '../registration-seller/registration-seller.component';

@NgModule({
  imports: [
    SharedModule,
    RegistrationFormRoutingModule
  ],
  exports: [SharedModule],
  declarations: [RegistrationFormComponent, RegistrationBuyerComponent, RegistrationSellerComponent]
})
export class RegistrationFormModule { }
