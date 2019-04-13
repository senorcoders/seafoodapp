import { NgModule } from '@angular/core';

import { PricingChargesRoutingModule } from './pricing-charges-routing.module';
import { SharedModule } from '../shared/shared.module';
import { PricingChargesComponent } from './pricing-charges.component';

@NgModule({
  imports: [
    SharedModule,
    PricingChargesRoutingModule
  ],
  declarations: [PricingChargesComponent]
})
export class PricingChargesModule { }
