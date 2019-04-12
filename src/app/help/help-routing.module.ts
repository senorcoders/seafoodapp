import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HelpComponent } from './help.component';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
  { path: "", component: HelpComponent }
];

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HelpRoutingModule { }
