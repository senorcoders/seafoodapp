import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ItemsByStatusComponent } from './items-by-status.component';

const routes: Routes = [
  {path: "", component: ItemsByStatusComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItemsByStatusRoutingModule { }
