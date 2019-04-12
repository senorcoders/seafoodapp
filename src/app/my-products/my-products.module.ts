import { NgModule } from '@angular/core';

import { MyProductsRoutingModule } from './my-products-routing.module';
import { MyProductsComponent } from './my-products.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    MyProductsRoutingModule
  ],
  declarations: [MyProductsComponent]
})
export class MyProductsModule { }
