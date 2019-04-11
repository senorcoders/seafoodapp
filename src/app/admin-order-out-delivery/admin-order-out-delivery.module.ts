import { NgModule } from '@angular/core';

import { AdminOrderOutDeliveryRoutingModule } from './admin-order-out-delivery-routing.module';
import { SharedModule } from '../shared/shared.module';
import { AdminOrderOutDeliveryComponent } from './admin-order-out-delivery.component';

@NgModule({
  imports: [
    SharedModule,
    AdminOrderOutDeliveryRoutingModule
  ],
  declarations: [AdminOrderOutDeliveryComponent]
})
export class AdminOrderOutDeliveryModule { }
