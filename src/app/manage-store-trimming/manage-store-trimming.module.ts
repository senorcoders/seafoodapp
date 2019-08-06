import { NgModule } from '@angular/core';

import { ManageStoreTrimmingRoutingModule } from './manage-store-trimming-routing.module';
import { ManageStoreTrimmingComponent } from './manage-store-trimming.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    ManageStoreTrimmingRoutingModule
  ],
  declarations: [ManageStoreTrimmingComponent]
})
export class ManageStoreTrimmingModule { }
