import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BrowseComponent } from './browse.component';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
  { path: "", component: BrowseComponent }
];

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BrowseRoutingModule { }
