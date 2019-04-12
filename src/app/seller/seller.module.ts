import { NgModule } from '@angular/core';

import { SellerRoutingModule } from './seller-routing.module';
import { SellerComponent } from './seller.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    SellerRoutingModule
  ],
  declarations: [SellerComponent]
})
export class SellerModule { }
