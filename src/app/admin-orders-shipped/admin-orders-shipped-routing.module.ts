import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminOrdersShippedComponent } from './admin-orders-shipped.component';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
  { path: "", component: AdminOrdersShippedComponent }
];

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminOrdersShippedRoutingModule { }
