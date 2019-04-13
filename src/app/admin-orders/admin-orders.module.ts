import { NgModule } from '@angular/core';

import { AdminOrdersRoutingModule } from './admin-orders-routing.module';
import { SharedModule } from '../shared/shared.module';
import { AdminOrdersComponent } from './admin-orders.component';

@NgModule({
  imports: [
    SharedModule,
    AdminOrdersRoutingModule
  ],
  declarations: [AdminOrdersComponent]
})
export class AdminOrdersModule { }
