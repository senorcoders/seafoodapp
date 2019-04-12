import { NgModule } from '@angular/core';

import { AdminLogisticManagmentRoutingModule } from './admin-logistic-managment-routing.module';
import { AdminLogisticManagmentComponent } from './admin-logistic-managment.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    AdminLogisticManagmentRoutingModule
  ],
  declarations: [AdminLogisticManagmentComponent]
})
export class AdminLogisticManagmentModule { }
