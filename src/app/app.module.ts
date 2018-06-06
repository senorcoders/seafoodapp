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
import { ArchiveProductsComponent } from './archive-products/archive-products.component';
import { SearchComponent } from './search/search.component';
import { FileUploadModule } from 'ng2-file-upload';
import { AddCategoryComponent } from './add-category/add-category.component';
import { SingleProductComponent } from './single-product/single-product.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { AccountComponent } from './account/account.component';
import {SellerRouterService} from './services/seller-router.service';
import {BuyerRouterService} from './services/buyer-router.service';
import {RouterProtectionService} from './services/router-protection.service';
import { MyProductsComponent } from './my-products/my-products.component';

const appRoutes: Routes=[
  {path:'', component:LoginComponent},
  {path:'home', component:HomeComponent},
  {path:'register', component:RegisterComponent},
  {path:'login', component:LoginComponent},
  {path:'add-product', component:AddProductComponent, canActivate:[SellerRouterService]},
  {path:'archive-product/:category', component:ArchiveProductsComponent, canActivate:[BuyerRouterService]},
  {path:'search', component:SearchComponent, canActivate:[BuyerRouterService]},
  {path:'product/:id', component:SingleProductComponent, canActivate:[RouterProtectionService]},
  {path:'add-category', component:AddCategoryComponent, canActivate:[SellerRouterService]},
  {path:'edit-product/:id', component:EditProductComponent, canActivate:[SellerRouterService]},
  {path:'account', component:AccountComponent, canActivate:[RouterProtectionService]},
  {path:'my-products', component:MyProductsComponent, canActivate:[SellerRouterService]},

]

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    AddProductComponent,
    ArchiveProductsComponent,
    SearchComponent,
    EditProductComponent,
    AddCategoryComponent,
    SingleProductComponent,
    AccountComponent,
    MyProductsComponent
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
    FileUploadModule,
  ],
  providers: [
    AuthenticationService, 
    MenuItems,
    IsLoginService,
    ProductService,
    SellerRouterService,
    BuyerRouterService,
    RouterProtectionService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
