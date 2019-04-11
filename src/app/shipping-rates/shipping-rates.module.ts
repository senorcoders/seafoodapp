import { NgModule } from '@angular/core';

import { ShippingRatesRoutingModule } from './shipping-rates-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ShippingRatesComponent } from './shipping-rates.component';

@NgModule({
  imports: [
    SharedModule,
    ShippingRatesRoutingModule
  ],
  declarations: [ShippingRatesComponent]
})
export class ShippingRatesModule { }
