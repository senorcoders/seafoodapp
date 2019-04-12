import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { RegistrationBuyerComponent } from './registration-buyer.component';

const routes: Routes = [
  { path: '', component: RegistrationBuyerComponent }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class RegistrationBuyerRoutingModule { }
