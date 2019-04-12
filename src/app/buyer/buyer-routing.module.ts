import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { BuyerComponent } from './buyer.component';

const routes: Routes = [
  { path: "", component: BuyerComponent }
];

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BuyerRoutingModule { }
