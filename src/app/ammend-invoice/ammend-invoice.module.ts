import { NgModule } from '@angular/core';

import { AmmendInvoiceRoutingModule } from './ammend-invoice-routing.module';
import { SharedModule } from '../shared/shared.module';
import { AmmendInvoiceComponent } from './ammend-invoice.component';

@NgModule({
  imports: [
    SharedModule,
    AmmendInvoiceRoutingModule
  ],
  declarations: [AmmendInvoiceComponent]
})
export class AmmendInvoiceModule { }
