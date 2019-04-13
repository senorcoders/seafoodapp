import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminLogisticManagmentComponent } from './admin-logistic-managment.component';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
  { path: "", component: AdminLogisticManagmentComponent }
];

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminLogisticManagmentRoutingModule { }
