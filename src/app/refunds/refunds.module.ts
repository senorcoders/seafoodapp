import { NgModule } from '@angular/core';

import { RefundsRoutingModule } from './refunds-routing.module';
import { RefundsComponent } from './refunds.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    RefundsRoutingModule
  ],
  declarations: [RefundsComponent]
})
export class RefundsModule { }
