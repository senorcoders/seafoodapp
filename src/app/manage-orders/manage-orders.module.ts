import { NgModule } from '@angular/core';

import { ManageOrdersRoutingModule } from './manage-orders-routing.module';
import { ManageOrdersComponent } from './manage-orders.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    ManageOrdersRoutingModule
  ],
  declarations: [ManageOrdersComponent]
})
export class ManageOrdersModule { }
