import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { StorefrontNewRoutingModule } from './storefront-new-routing.module';
import { StorefrontNewComponent } from './storefront-new.component';

@NgModule({
  imports: [
    SharedModule,
    StorefrontNewRoutingModule
  ],
  declarations: [StorefrontNewComponent]
})
export class StorefrontNewModule { }
