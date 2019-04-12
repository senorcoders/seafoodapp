import { NgModule } from '@angular/core';

import { GuidesRoutingModule } from './guides-routing.module';
import { SharedModule } from '../shared/shared.module';
import { GuidesComponent } from './guides.component';

@NgModule({
  imports: [
    SharedModule,
    GuidesRoutingModule
  ],
  declarations: [GuidesComponent]
})
export class GuidesModule { }
