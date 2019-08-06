import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FeaturedProductsComponent } from './featured-products.component';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
  {path: "", component: FeaturedProductsComponent }
];

@NgModule({
  imports: [SharedModule,  RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeaturedProductsRoutingModule { }
