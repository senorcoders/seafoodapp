import { NgModule } from '@angular/core';

import { EmailReadyRoutingModule } from './email-ready-routing.module';
import { EmailReadyComponent } from './email-ready.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    EmailReadyRoutingModule
  ],
  declarations: [EmailReadyComponent]
})
export class EmailReadyModule { }
