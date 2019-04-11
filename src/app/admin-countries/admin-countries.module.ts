import { NgModule } from '@angular/core';

import { AdminCountriesRoutingModule } from './admin-countries-routing.module';
import { SharedModule } from '../shared/shared.module';
import { AdminCountriesComponent } from './admin-countries.component';

@NgModule({
  imports: [
    SharedModule,
    AdminCountriesRoutingModule
  ],
  declarations: [AdminCountriesComponent]
})
export class AdminCountriesModule { }
