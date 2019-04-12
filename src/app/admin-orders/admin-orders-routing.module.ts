import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminOrdersComponent } from './admin-orders.component';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
  { path: "", component: AdminOrdersComponent }
];

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminOrdersRoutingModule { }
