import { NgModule } from '@angular/core';

import { FishTypeMenuRoutingModule } from './fish-type-menu-routing.module';
import { FishTypeMenuComponent } from './fish-type-menu.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    FishTypeMenuRoutingModule
  ],
  declarations: [FishTypeMenuComponent]
})
export class FishTypeMenuModule { }
