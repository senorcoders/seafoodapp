import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { AddProductRoutingModule } from './add-product-routing.module';
import { AddProductComponent } from './add-product.component';

@NgModule({
  imports: [
    SharedModule,
    AddProductRoutingModule
  ],
  declarations: [AddProductComponent]
})
export class AddProductModule { }
