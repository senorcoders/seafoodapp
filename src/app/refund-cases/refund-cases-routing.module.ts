import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RefundCasesComponent } from './refund-cases.component';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
  { path: "", component: RefundCasesComponent }
];

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RefundCasesRoutingModule { }
