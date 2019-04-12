import { NgModule } from '@angular/core';

import { ReviewcartRoutingModule } from './reviewcart-routing.module';
import { ReviewcartComponent } from './reviewcart.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    ReviewcartRoutingModule
  ],
  declarations: [ReviewcartComponent]
})
export class ReviewcartModule { }
