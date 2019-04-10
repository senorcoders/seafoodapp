import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConfirmationComponent } from '../confirmation/confirmation.component';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
  { path: "", component: ConfirmationComponent }
];

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfirmationEmailRoutingModule { }
