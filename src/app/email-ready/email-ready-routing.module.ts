import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmailReadyComponent } from './email-ready.component';

const routes: Routes = [
  {path: "", component: EmailReadyComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmailReadyRoutingModule { }
