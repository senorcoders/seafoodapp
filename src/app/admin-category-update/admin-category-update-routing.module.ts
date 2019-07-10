import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminCategoryUpdateComponent } from './admin-category-update.component';

const routes: Routes = [
  { path: '', component: AdminCategoryUpdateComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminCategoryUpdateRoutingModule { }
