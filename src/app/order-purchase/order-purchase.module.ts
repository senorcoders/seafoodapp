import { NgModule } from '@angular/core';

import { OrderPurchaseRoutingModule } from './order-purchase-routing.module';
import { OrderPurchaseComponent } from './order-purchase.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    OrderPurchaseRoutingModule
  ],
  declarations: [OrderPurchaseComponent]
})
export class OrderPurchaseModule { }
