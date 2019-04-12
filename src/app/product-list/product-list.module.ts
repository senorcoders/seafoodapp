import { NgModule } from '@angular/core';

import { ProductListRoutingModule } from './product-list-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ProductListComponent } from './product-list.component';

@NgModule({
  imports: [
    SharedModule,
    ProductListRoutingModule
  ],
  declarations: [ProductListComponent]
})
export class ProductListModule { }
