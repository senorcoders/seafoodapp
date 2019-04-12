import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SfsPayComponent } from './sfs-pay.component';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
  { path: "", component: SfsPayComponent }
];

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SfsPayRoutingModule { }
