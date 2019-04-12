import { NgModule } from '@angular/core';

import { ForgotPasswordRoutingModule } from './forgot-password-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ForgotPasswordComponent } from './forgot-password.component';

@NgModule({
  imports: [
    SharedModule,
    ForgotPasswordRoutingModule
  ],
  declarations: [ForgotPasswordComponent]
})
export class ForgotPasswordModule { }
