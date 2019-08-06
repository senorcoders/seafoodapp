import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrdersItemsComponent } from './orders-items.component';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
  { path: "", component: OrdersItemsComponent }
];

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersItemsRoutingModule { }
