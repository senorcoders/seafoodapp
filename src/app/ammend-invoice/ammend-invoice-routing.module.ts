import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AmmendInvoiceComponent } from './ammend-invoice.component';

const routes: Routes = [
  {path: '', component: AmmendInvoiceComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AmmendInvoiceRoutingModule { }
