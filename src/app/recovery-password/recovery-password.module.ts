import { NgModule } from '@angular/core';

import { RecoveryPasswordRoutingModule } from './recovery-password-routing.module';
import { RecoveryPasswordComponent } from './recovery-password.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    RecoveryPasswordRoutingModule
  ],
  declarations: [RecoveryPasswordComponent]
})
export class RecoveryPasswordModule { }
