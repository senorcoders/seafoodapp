import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecentPurchasesComponent } from './recent-purchases.component';

const routes: Routes = [
  {path: "", component: RecentPurchasesComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecentPurchasesRoutingModule { }
