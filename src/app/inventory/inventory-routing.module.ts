import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InventoryComponent } from './inventory.component'
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
  { path: "", component: InventoryComponent }
];

@NgModule({
  imports: [ SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryRoutingModule { }
