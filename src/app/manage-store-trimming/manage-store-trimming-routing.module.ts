import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageStoreTrimmingComponent } from './manage-store-trimming.component';

const routes: Routes = [
  {path: "", component: ManageStoreTrimmingComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageStoreTrimmingRoutingModule { }
