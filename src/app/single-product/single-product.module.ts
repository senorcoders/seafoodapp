import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SingleProductRoutingModule } from './single-product-routing.module';
import { SingleProductComponent } from './single-product.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    SingleProductRoutingModule
  ],
  declarations: [SingleProductComponent]
})
export class SingleProductModule { }
