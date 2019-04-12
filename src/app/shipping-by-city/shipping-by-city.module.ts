import { NgModule } from '@angular/core';

import { ShippingByCityRoutingModule } from './shipping-by-city-routing.module';
import { ShippingByCityComponent } from './shipping-by-city.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    ShippingByCityRoutingModule
  ],
  declarations: [ShippingByCityComponent]
})
export class ShippingByCityModule { }
