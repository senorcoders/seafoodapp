import { NgModule } from '@angular/core';

import { FeaturedSellerRoutingModule } from './featured-seller-routing.module';
import { FeaturedSellerComponent } from './featured-seller.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    FeaturedSellerRoutingModule
  ],
  declarations: [FeaturedSellerComponent]
})
export class FeaturedSellerModule { }
