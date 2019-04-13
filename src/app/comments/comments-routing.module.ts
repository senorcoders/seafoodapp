import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommentsComponent } from './comments.component';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
  { path: "", component: CommentsComponent }
];

@NgModule({
  imports: [SharedModule,  RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommentsRoutingModule { }
