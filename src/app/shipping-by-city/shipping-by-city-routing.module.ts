import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShippingByCityComponent } from './shipping-by-city.component';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
  { path: "", component: ShippingByCityComponent }
];

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShippingByCityRoutingModule { }
