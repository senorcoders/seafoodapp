import { NgModule } from '@angular/core';

import { ChartRoutingModule } from './chart-routing.module';
import { ChartComponent } from './chart.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    ChartRoutingModule
  ],
  declarations: [ChartComponent]
})
export class ChartModule { }
