import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { RegistrationSellerRoutingModule } from './registration-seller-routing.module';
import { RegistrationSellerComponent } from './registration-seller.component';

@NgModule({
  imports: [
    SharedModule,
    RegistrationSellerRoutingModule
  ],
  exports: [ SharedModule ],
  declarations: [RegistrationSellerComponent]
})
export class RegistrationSellerModule { }
