import { NgModule } from '@angular/core';

import { SfsPayRoutingModule } from './sfs-pay-routing.module';
import { SharedModule } from '../shared/shared.module';
import { SfsPayComponent } from './sfs-pay.component';

@NgModule({
  imports: [
    SharedModule,
    SfsPayRoutingModule
  ],
  declarations: [SfsPayComponent]
})
export class SfsPayModule { }
