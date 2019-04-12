import { NgModule } from '@angular/core';

import { EditAccountRoutingModule } from './edit-account-routing.module';
import { EditAccountComponent } from './edit-account.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    EditAccountRoutingModule
  ],
  declarations: [EditAccountComponent]
})
export class EditAccountModule { }
