import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanceledDeliveredItemsComponent } from './canceled-delivered-items.component';

const routes: Routes = [
  {path: "", component: CanceledDeliveredItemsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CanceledDeliveredItemsRoutingModule { }
