import { NgModule } from '@angular/core';


import { SharedModule } from '../shared/shared.module';
import { AdminCategoryUpdateRoutingModule } from './admin-category-update-routing.module';
import { AdminCategoryUpdateComponent } from './admin-category-update.component';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [AdminCategoryUpdateComponent],
  imports: [
    SharedModule,
    NgSelectModule,
    AdminCategoryUpdateRoutingModule
  ]
})
export class AdminCategoryUpdateModule { }
