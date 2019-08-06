import { NgModule } from '@angular/core';

import { ContactUsRoutingModule } from './contact-us-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ContactUsComponent } from './contact-us.component';

@NgModule({
  imports: [
    SharedModule,
    ContactUsRoutingModule
  ],
  declarations: [ContactUsComponent]
})
export class ContactUsModule { }
