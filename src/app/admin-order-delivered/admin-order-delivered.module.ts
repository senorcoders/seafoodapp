import { NgModule } from '@angular/core';

import { AdminOrderDeliveredRoutingModule } from './admin-order-delivered-routing.module';
import { SharedModule } from '../shared/shared.module';
import { AdminOrderDeliveredComponent } from './admin-order-delivered.component';

@NgModule({
  imports: [
    SharedModule,
    AdminOrderDeliveredRoutingModule
  ],
  declarations: [AdminOrderDeliveredComponent]
})
export class AdminOrderDeliveredModule { }
