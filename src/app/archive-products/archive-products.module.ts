import { NgModule } from '@angular/core';

import { ArchiveProductsRoutingModule } from './archive-products-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ArchiveProductsComponent } from './archive-products.component';

@NgModule({
  imports: [
    SharedModule,
    ArchiveProductsRoutingModule
  ],
  declarations: [ArchiveProductsComponent]
})
export class ArchiveProductsModule { }
