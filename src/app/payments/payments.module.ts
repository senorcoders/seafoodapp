import { NgModule } from '@angular/core';

import { PaymentsRoutingModule } from './payments-routing.module';
import { PaymentsComponent } from './payments.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    PaymentsRoutingModule
  ],
  declarations: [PaymentsComponent]
})
export class PaymentsModule { }
