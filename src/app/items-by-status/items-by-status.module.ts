import { NgModule } from '@angular/core';

import { ItemsByStatusRoutingModule } from './items-by-status-routing.module';
import { ItemsByStatusComponent } from './items-by-status.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    ItemsByStatusRoutingModule
  ],
  declarations: [ItemsByStatusComponent]
})
export class ItemsByStatusModule { }
