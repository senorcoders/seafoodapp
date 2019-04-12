import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { PendingProductsComponent } from './pending-products.component';

const routes: Routes = [
  { path: "", component: PendingProductsComponent }
];

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PendingProductsRoutingModule { }
