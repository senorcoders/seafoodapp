import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Interceptor } from '../interceptor/interceptor';
import { TranslateModule, TranslateLoader, TranslateStaticLoader } from 'ng2-translate';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { TooltipModule } from 'ng2-tooltip-directive';
import { ngfModule } from 'angular-file';
import { NgxLoadingModule, ngxLoadingAnimationTypes } from 'ngx-loading';
import { FilternumberPipe } from '../filternumber.pipe';
import { NgProgressModule } from 'ngx-progressbar';
import { Select2Module } from 'ng2-select2';
import { TitleService } from '../title.service';
import { Ng5SliderModule } from 'ng5-slider';
import { AngularFontAwesomeModule } from 'angular-font-awesome';


import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Http, HttpModule } from '@angular/http';

import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { FooterComponent } from '../core/footer/footer.component';

import { AuthenticationService } from '../services/authentication.service';
import { ProductService } from '../services/product.service';
import { IsLoginService } from '../core/login/is-login.service';
import { LanguageService } from '../core/language/language.service';
import { OrderService } from '../services/orders.service';

import { SellerRouterService } from '../services/seller-router.service';
import { BuyerRouterService } from '../services/buyer-router.service';
import { RouterProtectionService } from '../services/router-protection.service';
import { AdminRouterService } from '../services/admin-router.service';
import { NonsellerRouterService } from '../services/nonseller-router.service';


@NgModule({
  declarations: [    
    FooterComponent,
    FilternumberPipe,
  ],
  imports: [
    
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFontAwesomeModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: function (http: Http) { return new TranslateStaticLoader(http, '/assets/i18n', '.json'); },
      deps: [Http]
    }),
    NgxSmartModalModule.forRoot(),
    TooltipModule,
    ngfModule,
    NgxLoadingModule.forRoot({
      animationType: ngxLoadingAnimationTypes.wanderingCubes
    }),
    NgProgressModule,
    Select2Module,
    Ng5SliderModule,
    Select2Module
  ],
  exports: [
    CommonModule,
    FooterComponent,
    ngfModule,
    TooltipModule,
    NgProgressModule,
    FilternumberPipe,
    NgxLoadingModule, 
    Ng5SliderModule,
    NgxSmartModalModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFontAwesomeModule
  ],
  providers: [
    AuthenticationService,
   
    IsLoginService,
    ProductService,
    SellerRouterService,
    BuyerRouterService,
    NonsellerRouterService,
    RouterProtectionService,
    LanguageService,
    AdminRouterService,
    TitleService,
    OrderService, {
      provide: HTTP_INTERCEPTORS,
      useClass: Interceptor,
      multi: true,
    }
  ]
})
export class SharedModule { }
