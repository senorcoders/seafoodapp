import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CitiManagmentComponent } from './citi-managment.component';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
  { path: "", component: CitiManagmentComponent }
];

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CitiManagmentRoutingModule { }
