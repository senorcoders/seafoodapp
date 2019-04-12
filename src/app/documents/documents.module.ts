import { NgModule } from '@angular/core';

import { DocumentsRoutingModule } from './documents-routing.module';
import { SharedModule } from '../shared/shared.module';
import { DocumentsComponent } from './documents.component';

@NgModule({
  imports: [
    SharedModule,
    DocumentsRoutingModule
  ],
  declarations: [DocumentsComponent]
})
export class DocumentsModule { }
