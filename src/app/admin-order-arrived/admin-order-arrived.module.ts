import { NgModule } from '@angular/core';

import { AdminOrderArrivedRoutingModule } from './admin-order-arrived-routing.module';
import { AdminOrderArrivedComponent } from './admin-order-arrived.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    AdminOrderArrivedRoutingModule
  ],
  declarations: [AdminOrderArrivedComponent]
})
export class AdminOrderArrivedModule { }
