import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TrackingComponent } from '../tracking/tracking.component';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
  { path: "", component: TrackingComponent }
];

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrackingCodeRoutingModule { }
