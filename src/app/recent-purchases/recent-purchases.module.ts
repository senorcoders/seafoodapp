import { NgModule } from '@angular/core';

import { RecentPurchasesRoutingModule } from './recent-purchases-routing.module';
import { RecentPurchasesComponent } from './recent-purchases.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    RecentPurchasesRoutingModule
  ],
  declarations: [RecentPurchasesComponent]
})
export class RecentPurchasesModule { }
