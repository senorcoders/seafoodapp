import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PricingChargesComponent } from './pricing-charges.component';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
  { path: "", component: PricingChargesComponent }
];

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PricingChargesRoutingModule { }
