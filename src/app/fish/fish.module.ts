import { NgModule } from '@angular/core';

import { FishRoutingModule } from './fish-routing.module';
import { FishComponent } from './fish.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    FishRoutingModule
  ],
  declarations: [FishComponent]
})
export class FishModule { }
