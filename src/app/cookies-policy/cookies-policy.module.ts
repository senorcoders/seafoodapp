import { NgModule } from '@angular/core';

import { CookiesPolicyRoutingModule } from './cookies-policy-routing.module';
import { SharedModule } from '../shared/shared.module';
import { CookiesPolicyComponent } from './cookies-policy.component';

@NgModule({
  imports: [
    SharedModule,
    CookiesPolicyRoutingModule
  ],
  declarations: [CookiesPolicyComponent]
})
export class CookiesPolicyModule { }
