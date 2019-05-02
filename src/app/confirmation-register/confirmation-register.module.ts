import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ConfirmationRegisterRoutingModule } from './confirmation-register-routing.module';
import { ConfirmationRegisterComponent } from './confirmation-register.component';

@NgModule({
  imports: [
    SharedModule,
    ConfirmationRegisterRoutingModule
  ],
  declarations: [ConfirmationRegisterComponent]
})
export class ConfirmationRegisterModule { }
