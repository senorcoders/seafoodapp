import { NgModule } from '@angular/core';

import { BrowseRoutingModule } from './browse-routing.module';
import { BrowseComponent } from './browse.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    BrowseRoutingModule
  ],
  declarations: [BrowseComponent]
})
export class BrowseModule { }
