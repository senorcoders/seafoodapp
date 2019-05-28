import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { StorefrontNewComponent } from './storefront-new.component';

const routes: Routes = [
  { path: '', component: StorefrontNewComponent }
];

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StorefrontNewRoutingModule { }
