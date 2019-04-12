import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminOrderDeliveredComponent } from './admin-order-delivered.component';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
  { path: "", component: AdminOrderDeliveredComponent }
];

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminOrderDeliveredRoutingModule { }
