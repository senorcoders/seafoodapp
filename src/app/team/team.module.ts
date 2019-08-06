import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { TeamComponent } from './team.component';
import { TeamRoutingModule } from './team-routing.module';

@NgModule({
  imports: [
    SharedModule,
    TeamRoutingModule
  ],
  declarations: [TeamComponent]
})
export class TeamModule { }
