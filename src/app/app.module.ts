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
import {MenuNavComponent} from './core/menu/menu-nav.component';
import {FooterComponent} from './core/footer/footer.component';
import { HomeComponent } from './home/home.component';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { IsLoginService } from './core/login/is-login.service';
import { LanguageService } from './core/language/language.service';
import { CartService } from './core/cart/cart.service';
import { OrdersService } from './core/orders/orders.service';
import { AddProductComponent } from './add-product/add-product.component';
import { ArchiveProductsComponent } from './archive-products/archive-products.component';
import { SearchComponent } from './search/search.component';
import { FileUploadModule } from 'ng2-file-upload';
import { FishComponent } from './fish/fish.component';
import { SingleProductComponent } from './single-product/single-product.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { AccountComponent } from './account/account.component';
import {SellerRouterService} from './services/seller-router.service';
import {BuyerRouterService} from './services/buyer-router.service';
import {RouterProtectionService} from './services/router-protection.service';
import {AdminRouterService} from './services/admin-router.service';
import { MyProductsComponent } from './my-products/my-products.component';
import { CartComponent } from './cart/cart.component';
import { Http, HttpModule } from '@angular/http';
import { ConfirmationEmailComponent } from './confirmation-email/confirmation-email.component';
import { TranslateModule,TranslateLoader, TranslateStaticLoader  } from 'ng2-translate';
import { SingleStoreComponent } from './single-store/single-store.component';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { FeaturedProductsComponent } from './featured-products/featured-products.component';
import { FeaturedSellerComponent } from './featured-seller/featured-seller.component';
import { FeaturedStoreComponent } from './featured-store/featured-store.component';
import { AdministratorComponent } from './administrator/administrator.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { environment } from '../../environments/environment';
import { TrackingComponent } from './tracking/tracking.component';
import { ProductsComponent } from './products/products.component';
import { SellerComponent } from './seller/seller.component';
import { BuyerComponent } from './buyer/buyer.component';
import { CommentsComponent } from './comments/comments.component';
import { OrdersComponent } from './orders/orders.component';
import { OrdersItemsComponent } from './orders-items/orders-items.component';
import { RecoveryPasswordComponent } from './recovery-password/recovery-password.component';
import { BarRatingModule } from "ngx-bar-rating";
import { VerifyUserComponent } from './verify-user/verify-user.component';
import { RecentPurchasesComponent } from './recent-purchases/recent-purchases.component';
import { OrderPurchaseComponent } from './order-purchase/order-purchase.component';
import { ChartComponent } from './chart/chart.component';
import { DocumentsComponent } from './documents/documents.component';
import { TrackingCodeComponent } from './tracking-code/tracking-code.component';

const appRoutes: Routes=[
  {path:'', component:HomeComponent},
  {path:'home', redirectTo: '/'},
  {path:'register', component:RegisterComponent},
  {path:'login', component:LoginComponent},
  {path:'add-product', component:AddProductComponent, canActivate:[SellerRouterService]},
  {path:'fish-type/:category', component:ArchiveProductsComponent, canActivate:[BuyerRouterService]},
  {path:'search/:search', component:SearchComponent, canActivate:[BuyerRouterService]},
  {path:'product/:id', component:SingleProductComponent},
  {path:'fish-type', component:FishComponent, canActivate:[SellerRouterService]},
  {path:'edit-product/:id', component:EditProductComponent, canActivate:[SellerRouterService]},
  {path:'account', component:AccountComponent, canActivate:[RouterProtectionService]},
  {path:'my-products', component:MyProductsComponent, canActivate:[SellerRouterService]},
  {path:'cart', component:CartComponent, canActivate:[RouterProtectionService]},
  {path:'verification/:id/:id', component:ConfirmationEmailComponent},
  {path:'store/:id', component:SingleStoreComponent},
  {path:'featured-products', component:FeaturedProductsComponent, canActivate:[AdminRouterService]},
  {path:'featured-seller', component:FeaturedSellerComponent, canActivate:[AdminRouterService]},
  {path:'admin', component:AdministratorComponent, canActivate:[AdminRouterService]},
  {path:'favorites', component:FavoritesComponent, canActivate:[BuyerRouterService]},
  {path: 'tracking', component:TrackingComponent},
  {path: 'products', component:ProductsComponent, canActivate:[AdminRouterService]},
  {path:'seller', component:SellerComponent, canActivate:[AdminRouterService]},
  {path:'buyer', component:BuyerComponent, canActivate:[AdminRouterService]},
  {path:'orders', component:OrdersComponent, canActivate:[RouterProtectionService]},
  {path:'orders-items/:id', component:OrdersItemsComponent, canActivate:[RouterProtectionService]},
  {path:'comments', component:CommentsComponent, canActivate:[AdminRouterService]},
  {path:'recovery-password/:code', component:RecoveryPasswordComponent},
  {path:'verify-users', component:VerifyUserComponent, canActivate:[AdminRouterService]},
  {path:'recent-purchases', component:RecentPurchasesComponent, canActivate:[SellerRouterService]},
  {path:'order-purchase/:item', component:OrderPurchaseComponent, canActivate:[SellerRouterService]},
  {path:'chart', component:ChartComponent, canActivate:[AdminRouterService]},
  {path:'documents', component:DocumentsComponent, canActivate:[RouterProtectionService]},
  {path:'tracking-code/:item', component:TrackingCodeComponent, canActivate:[RouterProtectionService]},
]

@NgModule({
  declarations: [
    AppComponent,
    MenuNavComponent,
    FooterComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    AddProductComponent,
    ArchiveProductsComponent,
    SearchComponent,
    EditProductComponent,
    FishComponent,
    SingleProductComponent,
    AccountComponent,
    MyProductsComponent,
    CartComponent,
    ConfirmationEmailComponent,
    SingleStoreComponent,
    FeaturedProductsComponent,
    FeaturedSellerComponent,
    FeaturedStoreComponent,
    AdministratorComponent,
    FavoritesComponent,
    TrackingComponent,
    ProductsComponent,
    SellerComponent,
    BuyerComponent,
    CommentsComponent,
    OrdersComponent,
    OrdersItemsComponent,
    RecoveryPasswordComponent,
    VerifyUserComponent,
    RecentPurchasesComponent,
    OrderPurchaseComponent,
    ChartComponent,
    DocumentsComponent,
    TrackingCodeComponent
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
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: function(http: Http){ return new TranslateStaticLoader(http, '/assets/i18n', '.json') },
      deps: [Http]
    }),  
    NgxSmartModalModule.forRoot(),
    BarRatingModule
  ],
  providers: [
    AuthenticationService, 
    MenuItems,
    IsLoginService,
    ProductService,
    SellerRouterService,
    BuyerRouterService,
    RouterProtectionService,
    LanguageService,
    AdminRouterService,
    CartService,
    OrdersService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
