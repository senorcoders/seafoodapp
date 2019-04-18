import { NgModule } from '@angular/core';

import { CreateProductRoutingModule } from './create-product-routing.module';
import { SharedModule } from '../shared/shared.module';
import { FishFeaturesComponent } from '../form-add-product/fish-features/fish-features.component';
import { FishFormComponent } from '../form-add-product/fish-form/fish-form.component';
import { AvancedPricingComponent } from '../form-add-product/avanced-pricing/avanced-pricing.component';
import { CreateProductComponent } from './create-product.component';

@NgModule({
  imports: [
    SharedModule,
    CreateProductRoutingModule
  ],
  declarations: [
    CreateProductComponent,
    FishFormComponent,
    FishFeaturesComponent,
    AvancedPricingComponent
  ]
})
export class CreateProductModule { }
