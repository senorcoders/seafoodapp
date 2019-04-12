import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommentsRoutingModule } from './comments-routing.module';
import { SharedModule } from '../shared/shared.module';
import { CommentsComponent } from './comments.component';

@NgModule({
  imports: [
    SharedModule,
    CommentsRoutingModule
  ],
  declarations: [CommentsComponent]
})
export class CommentsModule { }
