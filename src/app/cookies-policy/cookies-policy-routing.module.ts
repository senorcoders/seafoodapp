import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CookiesPolicyComponent } from './cookies-policy.component';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
  { path: "", component: CookiesPolicyComponent }
];

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CookiesPolicyRoutingModule { }
