import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { RegistrationFormComponent } from './registration-form.component';

const routes: Routes = [
  { path: '', component: RegistrationFormComponent }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class RegistrationFormRoutingModule { }
