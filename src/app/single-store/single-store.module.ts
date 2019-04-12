import { NgModule } from '@angular/core';

import { SingleStoreRoutingModule } from './single-store-routing.module';
import { SingleStoreComponent } from './single-store.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    SingleStoreRoutingModule
  ],
  declarations: [SingleStoreComponent]
})
export class SingleStoreModule { }
