import { NgModule } from '@angular/core';

import { CanceledDeliveredItemsRoutingModule } from './canceled-delivered-items-routing.module';
import { CanceledDeliveredItemsComponent } from './canceled-delivered-items.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    CanceledDeliveredItemsRoutingModule
  ],
  declarations: [CanceledDeliveredItemsComponent]
})
export class CanceledDeliveredItemsModule { }
