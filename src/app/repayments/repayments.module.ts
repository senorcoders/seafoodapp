import { NgModule } from '@angular/core';

import { RepaymentsRoutingModule } from './repayments-routing.module';
import { RepaymentsComponent } from './repayments.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    RepaymentsRoutingModule
  ],
  declarations: [RepaymentsComponent]
})
export class RepaymentsModule { }
