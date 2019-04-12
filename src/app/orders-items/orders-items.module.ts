import { NgModule } from '@angular/core';

import { OrdersItemsRoutingModule } from './orders-items-routing.module';
import { OrdersItemsComponent } from './orders-items.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    OrdersItemsRoutingModule
  ],
  declarations: [OrdersItemsComponent]
})
export class OrdersItemsModule { }
