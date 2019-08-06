import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { ConfirmationRegisterComponent } from './confirmation-register.component';

const routes: Routes = [
  { path: "", component: ConfirmationRegisterComponent }
];

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfirmationRegisterRoutingModule { }
