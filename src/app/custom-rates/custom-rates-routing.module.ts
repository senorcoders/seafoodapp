import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomRatesComponent } from './custom-rates.component';

const routes: Routes = [
  {path: "", component: CustomRatesComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomRatesRoutingModule { }
