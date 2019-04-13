import { NgModule } from '@angular/core';

import { EditProductRoutingModule } from './edit-product-routing.module';
import { EditProductComponent } from './edit-product.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    EditProductRoutingModule
  ],
  declarations: [EditProductComponent]
})
export class EditProductModule { }
