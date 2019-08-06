import { NgModule } from '@angular/core';

import { InventoryRoutingModule } from './inventory-routing.module';

import { SharedModule } from '../shared/shared.module';

import { InventoryComponent } from './inventory.component';
@NgModule({
  imports: [
    SharedModule,
    InventoryRoutingModule
  ],
  declarations: [ InventoryComponent ]
})
export class InventoryModule { }
