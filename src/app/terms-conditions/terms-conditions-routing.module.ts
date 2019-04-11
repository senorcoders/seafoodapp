import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { TermsConditionsComponent } from './terms-conditions.component';

const routes: Routes = [
  { path: "", component: TermsConditionsComponent }
];

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TermsConditionsRoutingModule { }
