import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecoveryPasswordComponent } from './recovery-password.component';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
  { path: "", component: RecoveryPasswordComponent }
];

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecoveryPasswordRoutingModule { }
