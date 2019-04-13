import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrdersComponent } from './orders.component';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
  { path: "", component: OrdersComponent }
];

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersRoutingModule { }
