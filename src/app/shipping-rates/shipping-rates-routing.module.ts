import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShippingRatesComponent } from './shipping-rates.component';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
  { path: "", component: ShippingRatesComponent }
];

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShippingRatesRoutingModule { }
