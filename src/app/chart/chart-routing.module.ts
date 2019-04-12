import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChartComponent } from './chart.component';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
  { path: "", component: ChartComponent }
];

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChartRoutingModule { }
