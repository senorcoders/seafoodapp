import { NgModule } from '@angular/core';

import { RefundCasesRoutingModule } from './refund-cases-routing.module';
import { SharedModule } from '../shared/shared.module';
import { RefundCasesComponent } from './refund-cases.component';

@NgModule({
  imports: [
    SharedModule,
    RefundCasesRoutingModule
  ],
  declarations: [RefundCasesComponent]
})
export class RefundCasesModule { }
