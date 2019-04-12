import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FeaturedSellerComponent } from './featured-seller.component';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
  {path:"", component: FeaturedSellerComponent }, 
];

@NgModule({
  imports: [SharedModule,  RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeaturedSellerRoutingModule { }
