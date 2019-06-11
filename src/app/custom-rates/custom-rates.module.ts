import { NgModule } from '@angular/core';

import { CustomRatesRoutingModule } from './custom-rates-routing.module';
import { SharedModule } from '../shared/shared.module';
import { CustomRatesComponent } from './custom-rates.component';

@NgModule({
  imports: [
    SharedModule,
    CustomRatesRoutingModule
  ],
  declarations: [
    CustomRatesComponent
  ]
})
export class CustomRatesModule { }
