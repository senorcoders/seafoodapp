import { NgModule } from '@angular/core';

import { EditAccountRoutingModule } from './edit-account-routing.module';
import { EditAccountComponent } from './edit-account.component';
import { SharedModule } from '../shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    SharedModule,
    EditAccountRoutingModule,
    NgSelectModule, FormsModule
  ],
  declarations: [EditAccountComponent]
})
export class EditAccountModule { }
