import { NgModule } from '@angular/core';

import { ConfirmationRoutingModule } from './confirmation-routing.module';
import { ConfirmationComponent } from './confirmation.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    ConfirmationRoutingModule
  ],
  declarations: [ConfirmationComponent]
})
export class ConfirmationModule { }
