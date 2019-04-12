import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PendingProductsRoutingModule } from './pending-products-routing.module';
import { SharedModule } from '../shared/shared.module';
import { PendingProductsComponent } from './pending-products.component';

@NgModule({
  imports: [
    SharedModule,
    PendingProductsRoutingModule
  ],
  declarations: [PendingProductsComponent]
})
export class PendingProductsModule { }
