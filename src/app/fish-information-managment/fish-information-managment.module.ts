import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { FishInformationManagmentRoutingModule } from './fish-information-managment-routing.module';
import { FishInformationManagmentComponent } from './fish-information-managment.component';

@NgModule({
  declarations: [FishInformationManagmentComponent],
  imports: [
    SharedModule,
    FishInformationManagmentRoutingModule
  ]
})
export class FishInformationManagmentModule { }
