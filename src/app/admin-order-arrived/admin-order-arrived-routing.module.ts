import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminOrderArrivedComponent } from './admin-order-arrived.component';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
  { path: "", component: AdminOrderArrivedComponent }
];

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminOrderArrivedRoutingModule { }
