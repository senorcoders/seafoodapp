import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {Routes,RouterModule} from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import {AuthenticationService} from './services/authentication.service';
import {ProductService} from './services/product.service';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { RegisterComponent } from './register/register.component';
import { MenuItems } from './core/menu/menu-items';
import { HomeComponent } from './home/home.component';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { IsLoginService } from './core/login/is-login.service';
import { AddProductComponent } from './add-product/add-product.component';
import { FileUploadModule } from 'ng2-file-upload';


const appRoutes: Routes=[
  {path:'', component:LoginComponent},
  {path:'home', component:HomeComponent},
  {path:'register', component:RegisterComponent},
  {path:'login', component:LoginComponent},
  {path:'add', component:AddProductComponent},

]

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    AddProductComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    FormsModule, 
    ReactiveFormsModule,
    HttpClientModule, 
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    AngularFontAwesomeModule,
    FileUploadModule

  ],
  providers: [
    AuthenticationService, 
    MenuItems,
    IsLoginService,
    ProductService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
