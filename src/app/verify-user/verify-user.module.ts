import { NgModule } from '@angular/core';

import { VerifyUserRoutingModule } from './verify-user-routing.module';
import { VerifyUserComponent } from './verify-user.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    VerifyUserRoutingModule
  ],
  declarations: [VerifyUserComponent]
})
export class VerifyUserModule { }
