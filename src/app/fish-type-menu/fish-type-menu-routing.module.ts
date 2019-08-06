import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FishTypeMenuComponent } from './fish-type-menu.component';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
  { path: "", component: FishTypeMenuComponent }
];

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FishTypeMenuRoutingModule { }
