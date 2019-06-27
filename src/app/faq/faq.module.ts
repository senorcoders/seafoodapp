import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { FaqComponent } from './faq.component';
import { FaqRoutingModule } from './faq-routing.module';

@NgModule({
  imports: [
    SharedModule,
    FaqRoutingModule
  ],
  declarations: [FaqComponent]
})
export class FaqModule { }
