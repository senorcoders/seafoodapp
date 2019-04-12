import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductsComponent } from './products.component';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
  { path: "", component: ProductsComponent }
];

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
