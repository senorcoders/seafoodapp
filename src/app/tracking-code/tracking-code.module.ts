import { NgModule } from '@angular/core';

import { TrackingCodeRoutingModule } from './tracking-code-routing.module';
import { SharedModule } from '../shared/shared.module';
import { TrackingCodeComponent } from './tracking-code.component';

@NgModule({
  imports: [
    SharedModule,
    TrackingCodeRoutingModule
  ],
  declarations: [TrackingCodeComponent]
})
export class TrackingCodeModule { }
