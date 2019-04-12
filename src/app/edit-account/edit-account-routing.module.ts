import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { EditAccountComponent } from './edit-account.component';

const routes: Routes = [
  { path: "", component: EditAccountComponent }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditAccountRoutingModule { }
