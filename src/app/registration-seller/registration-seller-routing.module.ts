import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { RegistrationSellerComponent } from './registration-seller.component';

const routes: Routes = [
  { path: '', component: RegistrationSellerComponent }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class RegistrationSellerRoutingModule { }
