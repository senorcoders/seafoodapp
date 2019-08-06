import { NgModule } from '@angular/core';

import { TrackingRoutingModule } from './tracking-routing.module';
import { TrackingComponent } from './tracking.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    TrackingRoutingModule
  ],
  declarations: [TrackingComponent]
})
export class TrackingModule { }
