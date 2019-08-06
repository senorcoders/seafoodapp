import { NgModule } from '@angular/core';

import { FeaturedTypesRoutingModule } from './featured-types-routing.module';
import { FeaturedTypesComponent } from './featured-types.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    FeaturedTypesRoutingModule
  ],
  declarations: [FeaturedTypesComponent]
})
export class FeaturedTypesModule { }
