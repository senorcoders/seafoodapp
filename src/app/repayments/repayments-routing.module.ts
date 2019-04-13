import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RepaymentsComponent } from './repayments.component';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
  { path: "", component: RepaymentsComponent }
];

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RepaymentsRoutingModule { }
