import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReviewcartComponent } from './reviewcart.component';

const routes: Routes = [
  { path: "", component: ReviewcartComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReviewcartRoutingModule { }
