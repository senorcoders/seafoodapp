import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RefundsComponent } from './refunds.component';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
  { path: "", component: RefundsComponent }
];

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RefundsRoutingModule { }
