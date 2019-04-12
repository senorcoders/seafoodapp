import { NgModule } from '@angular/core';

import { ThanksRoutingModule } from './thanks-routing.module';
import { ThanksComponent } from './thanks.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    ThanksRoutingModule
  ],
  declarations: [ThanksComponent]
})
export class ThanksModule { }
