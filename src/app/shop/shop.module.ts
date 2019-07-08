import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ShopRoutingModule } from './shop-routing.module';
import { ShopComponent } from './shop.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@NgModule({
  imports: [
    SharedModule,
    ShopRoutingModule,
    InfiniteScrollModule
  ],
  declarations: [ShopComponent]
})
export class ShopModule { }
