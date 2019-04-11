import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './about.component';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
  { path: "", component: AboutComponent }
];

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AboutRoutingModule { }
