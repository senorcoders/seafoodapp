import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { AdminCountriesComponent } from './admin-countries.component';

const routes: Routes = [
  { path: "", component: AdminCountriesComponent }
];

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminCountriesRoutingModule { }
