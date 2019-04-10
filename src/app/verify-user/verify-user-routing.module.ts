import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { VerifyUserComponent } from './verify-user.component';

const routes: Routes = [
  { path: "", component: VerifyUserComponent }
];

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VerifyUserRoutingModule { }
