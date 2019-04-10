import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FeaturedTypesComponent } from './featured-types.component';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
  {path:"", component: FeaturedTypesComponent },
];

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeaturedTypesRoutingModule { }
