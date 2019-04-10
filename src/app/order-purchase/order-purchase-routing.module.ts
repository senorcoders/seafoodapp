import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrderPurchaseComponent } from './order-purchase.component';

const routes: Routes = [
  {path: "", component: OrderPurchaseComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderPurchaseRoutingModule { }
