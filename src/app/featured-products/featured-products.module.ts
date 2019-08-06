import { NgModule } from '@angular/core';

import { FeaturedProductsRoutingModule } from './featured-products-routing.module';
import { FeaturedProductsComponent } from './featured-products.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    FeaturedProductsRoutingModule
  ],
  declarations: [FeaturedProductsComponent]
})
export class FeaturedProductsModule { }
