import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FishInformationManagmentComponent } from './fish-information-managment.component';

const routes: Routes = [
  { path: '', component: FishInformationManagmentComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FishInformationManagmentRoutingModule { }
