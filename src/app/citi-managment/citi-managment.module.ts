import { NgModule } from '@angular/core';

import { CitiManagmentRoutingModule } from './citi-managment-routing.module';
import { SharedModule } from '../shared/shared.module';
import { CitiManagmentComponent } from './citi-managment.component';

@NgModule({
  imports: [
    SharedModule,
    CitiManagmentRoutingModule
  ],
  declarations: [CitiManagmentComponent]
})
export class CitiManagmentModule { }
