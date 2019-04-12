import { NgModule } from '@angular/core';

import { AdminOrdersShippedRoutingModule } from './admin-orders-shipped-routing.module';
import { SharedModule } from '../shared/shared.module';
import { AdminOrdersShippedComponent } from './admin-orders-shipped.component';

@NgModule({
  imports: [
    SharedModule,
    AdminOrdersShippedRoutingModule
  ],
  declarations: [AdminOrdersShippedComponent]
})
export class AdminOrdersShippedModule { }
