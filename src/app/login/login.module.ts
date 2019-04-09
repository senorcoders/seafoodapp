import { NgModule } from '@angular/core';
//import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';

import { TranslateModule, TranslateLoader, TranslateStaticLoader } from 'ng2-translate';
import { Http } from '@angular/http';

@NgModule({
  imports: [
    //CommonModule,
    SharedModule,
    LoginRoutingModule,
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: function (http: Http) { return new TranslateStaticLoader(http, '/assets/i18n', '.json'); },
      deps: [Http]
    }),
  ],
  exports:[ SharedModule ],
  declarations: [LoginComponent]
})
export class LoginModule { }
