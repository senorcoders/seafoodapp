import { NgModule } from '@angular/core';

import { ConfirmationEmailRoutingModule } from './confirmation-email-routing.module';
import { ConfirmationEmailComponent } from './confirmation-email.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    ConfirmationEmailRoutingModule
  ],
  declarations: [ConfirmationEmailComponent]
})
export class ConfirmationEmailModule { }
