import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ShopComponent } from './shop.component';
import { ShopRoutingModule } from './shop-routing.module';

@NgModule({
  imports: [
    SharedModule,
    ShopRoutingModule
  ],
  declarations: [ShopComponent]
})
export class ShopModule { }
