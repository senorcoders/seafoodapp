import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BuyerRoutingModule } from './buyer-routing.module';
import { SharedModule } from '../shared/shared.module';
import { BuyerComponent } from './buyer.component';

@NgModule({
  imports: [
    SharedModule,
    BuyerRoutingModule
  ],
  declarations: [BuyerComponent]
})
export class BuyerModule { }
