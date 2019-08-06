import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { RegisterComponent } from './register.component';
import { RegisterRoutingModule } from './register-routing.module';


@NgModule({
  imports: [
    SharedModule,
    RegisterRoutingModule
    ],
  exports: [SharedModule],
  declarations: [RegisterComponent]
})
export class RegisterModule { }
