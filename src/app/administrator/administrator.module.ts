import { NgModule } from '@angular/core';

import { AdministratorRoutingModule } from './administrator-routing.module';
import { AdministratorComponent } from './administrator.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    AdministratorRoutingModule
  ],
  declarations: [AdministratorComponent]
})
export class AdministratorModule { }
