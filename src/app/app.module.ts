import { NgModule } from '@angular/core';
import { SharedModule } from './shared/shared.module';
import { ToastrModule } from 'ngx-toastr';

import { SellerRouterService } from './services/seller-router.service';
import { BuyerRouterService } from './services/buyer-router.service';
import { RouterProtectionService } from './services/router-protection.service';
import { AdminRouterService } from './services/admin-router.service';
import { NonsellerRouterService } from './services/nonseller-router.service';

import { Routes, RouterModule } from '@angular/router';

// import { TranslateModule, TranslateLoader, TranslateStaticLoader, TranslatePipe, TranslateService } from 'ng2-translate';
// import { Http } from '@angular/http';

// import ngx-translate and the http loader
import { TranslateLoader, TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { MenuItems } from './core/menu/menu-items';
import { MenuNavComponent } from './core/menu/menu-nav.component';
import { HomeComponent } from './home/home.component';

import { CartService } from './core/cart/cart.service';
import { OrdersService } from './core/orders/orders.service';
import { FileUploadModule } from 'ng2-file-upload';




import { FeaturedStoreComponent } from './featured-store/featured-store.component';
//import { environment } from '../../environments/environment';
import { BarRatingModule } from 'ngx-bar-rating';
import { ShippingRatesService } from './services/shipping-rates.service';
import { CountriesService } from './services/countries.service';
import { PricingChargesService } from './services/pricing-charges.service';

import { OwlDateTimeModule, OwlNativeDateTimeModule, OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
import { ProductManagmentComponent } from './product-managment/product-managment.component';
import { AccountComponent } from './account/account.component';
import { CreateProductComponent } from './create-product/create-product.component';
import { FishFormComponent } from './form-add-product/fish-form/fish-form.component';
import { AvancedPricingComponent } from './form-add-product/avanced-pricing/avanced-pricing.component';
import { FishFeaturesComponent } from './form-add-product/fish-features/fish-features.component';


const appRoutes: Routes = [
  {
    path: '', component: HomeComponent,
  },
  {
    path: "login",
    loadChildren: './login/login.module#LoginModule'
  },
  {
    path: 'register',
    loadChildren: './registration-buyer/registration-buyer.module#RegistrationBuyerModule'
  },
  {
    path: 'register-seller',
    loadChildren: './registration-seller/registration-seller.module#RegistrationSellerModule'
  },
  {
    path: 'add-product',
    component: CreateProductComponent
  },
  {
    path: 'fish-type/:category/:page',
    loadChildren: './archive-products/archive-products.module#ArchiveProductsModule',
    canActivate: [BuyerRouterService]
  },
  {
    path: 'search/:search/:page',
    loadChildren: './search/search.module#SearchModule',
    canActivate: [BuyerRouterService]
  },
  {
    path: 'favorites',
    loadChildren: './favorites/favorites.module#FavoritesModule',
    canActivate: [BuyerRouterService]
  },
  {
    path: 'advanced-search',
    loadChildren: './advanced-search/advanced-search.module#AdvancedSearchModule',
    canActivate: [BuyerRouterService]
  },
  {
    path: 'reviewcart',
    loadChildren: './reviewcart/reviewcart.module#ReviewcartModule',
    canActivate: [BuyerRouterService]
  },
  {
    path: 'checkout',
    loadChildren: './checkout/checkout.module#CheckoutModule',
    canActivate: [BuyerRouterService]
  },
  {
    path: 'confirmation',
    loadChildren: './confirmation/confirmation.module#ConfirmationModule',
    canActivate: [BuyerRouterService]
  },
  {
    path: 'thanks',
    loadChildren: './thanks/thanks.module#ThanksModule',
    canActivate: [BuyerRouterService]
  },
  {
    path: 'items-status',
    loadChildren: './items-by-status/items-by-status.module#ItemsByStatusModule',
    canActivate: [BuyerRouterService]
  },
  {
    path: 'historical-orders',
    loadChildren: './canceled-delivered-items/canceled-delivered-items.module#CanceledDeliveredItemsModule',
    canActivate: [BuyerRouterService]
  },
  {
    path: 'product/:id',
    loadChildren: './single-product/single-product.module#SingleProductModule',
    canActivate: [NonsellerRouterService]
  },
  {
    path: 'edit-product/:id',
    loadChildren: './edit-product/edit-product.module#EditProductModule',
    canActivate: [SellerRouterService]
  },
  {
    path: 'my-products',
    loadChildren: './my-products/my-products.module#MyProductsModule',
    canActivate: [SellerRouterService]
  },
  {
    path: 'recent-purchases',
    loadChildren: './recent-purchases/recent-purchases.module#RecentPurchasesModule',
    canActivate: [SellerRouterService]
  },
  {
    path: 'order-purchase/:item',
    loadChildren: './order-purchase/order-purchase.module#OrderPurchaseModule',
    canActivate: [SellerRouterService]
  },
  {
    path: 'manage-store-trimming',
    loadChildren: './manage-store-trimming/manage-store-trimming.module#ManageStoreTrimmingModule',
    canActivate: [SellerRouterService]
  },
  {
    path: 'product-categories',
    loadChildren: './fish/fish.module#FishModule',
    canActivate: [AdminRouterService]
  },
  {
    path: 'account',
    loadChildren: './edit-account/edit-account.module#EditAccountModule',
    canActivate: [RouterProtectionService]
  },
  {
    path: 'manage-products',
    loadChildren: './my-products/my-products.module#MyProductsModule',
    canActivate: [RouterProtectionService]
  },
  {
    path: 'cart',
    loadChildren: './cart/cart.module#CartModule',
    canActivate: []
  },
  {
    path: 'verification/:userid/:id',
    loadChildren: './confirmation-email/confirmation-email.module#ConfirmationEmailModule',
    canActivate: []
  },
  {
    path: 'store/:id',
    loadChildren: './single-store/single-store.module#SingleStoreModule',
    canActivate: [RouterProtectionService]
  },
  {
    path: 'featured-products',
    loadChildren: './featured-products/featured-products.module#FeaturedProductsModule',
    canActivate: [AdminRouterService]
  },
  {
    path: 'featured-seller',
    loadChildren: './featured-seller/featured-seller.module#FeaturedSellerModule',
    canActivate: [AdminRouterService]
  },
  {
    path: 'featured-types',
    loadChildren: './featured-types/featured-types.module#FeaturedTypesModule',
    canActivate: [AdminRouterService]
  },
  {
    path: 'fish-types-menu',
    loadChildren: './fish-type-menu/fish-type-menu.module#FishTypeMenuModule',
    canActivate: [AdminRouterService]
  },
  {
    path: 'admin',
    loadChildren: './administrator/administrator.module#AdministratorModule',
    canActivate: [AdminRouterService]
  },
  {
    path: 'tracking',
    loadChildren: './tracking/tracking.module#TrackingModule',
  },
  {
    path: 'shop',
    loadChildren: './shop/shop.module#ShopModule',
    canActivate: [RouterProtectionService]
  },
  {
    path: 'seller',
    loadChildren: './seller/seller.module#SellerModule',
    canActivate: [AdminRouterService]
  },
  {
    path: 'buyer',
    loadChildren: './buyer/buyer.module#BuyerModule',
    canActivate: [AdminRouterService]
  },
  {
    path: 'orders',
    loadChildren: './orders/orders.module#OrdersModule',
    canActivate: [RouterProtectionService]
  },
  {
    path: 'orders-items/:id',
    loadChildren: './orders-items/orders-items.module#OrdersItemsModule',
    canActivate: [RouterProtectionService]
  },
  {
    path: 'comments',
    loadChildren: './comments/comments.module#CommentsModule',
    canActivate: [AdminRouterService]
  },
  {
    path: 'recovery-password/:code',
    loadChildren: './recovery-password/recovery-password.module#RecoveryPasswordModule',
  },
  {
    path: 'verify-users',
    loadChildren: './verify-user/verify-user.module#VerifyUserModule',
    canActivate: [AdminRouterService]
  },
  {
    path: 'chart',
    loadChildren: './chart/chart.module#ChartModule',
    canActivate: [AdminRouterService]
  },
  {
    path: 'documents',
    loadChildren: './documents/documents.module#DocumentsModule',
    canActivate: [AdminRouterService]
  },
  {
    path: 'tracking-code/:item',
    loadChildren: './tracking-code/tracking-code.module#TrackingCodeModule',
    canActivate: [RouterProtectionService]
  },
  {
    path: 'browse',
    loadChildren: './browse/browse.module#BrowseModule',
  },
  {
    path: 'sfspay',
    loadChildren: './sfs-pay/sfs-pay.module#SfsPayModule',
  },
  {
    path: 'help',
    loadChildren: './help/help.module#HelpModule',
  },
  {
    path: 'contact-us',
    loadChildren: './contact-us/contact-us.module#ContactUsModule',
  },
  {
    path: 'guides',
    loadChildren: './guides/guides.module#GuidesModule',
  },
  {
    path: 'terms-conditions',
    loadChildren: './terms-conditions/terms-conditions.module#TermsConditionsModule',
  },
  {
    path: 'privacy-policy',
    loadChildren: './privacy-policy/privacy-policy.module#PrivacyPolicyModule',
  },
  {
    path: 'cookies-policy',
    loadChildren: './cookies-policy/cookies-policy.module#CookiesPolicyModule',
  },
  {
    path: 'about-us',
    loadChildren: './about/about.module#AboutModule',
  },
  {
    path: 'shipping-rates',
    loadChildren: './shipping-rates/shipping-rates.module#ShippingRatesModule',
    canActivate: [AdminRouterService]
  },
  {
    path: 'pricing-charges',
    loadChildren: './pricing-charges/pricing-charges.module#PricingChargesModule',
    canActivate: [AdminRouterService]
  },
  {
    path: 'orders-shipped',
    loadChildren: './admin-orders-shipped/admin-orders-shipped.module#AdminOrdersShippedModule',
    canActivate: [AdminRouterService]
  },
  {
    path: 'orders-arrived',
    loadChildren: './admin-order-arrived/admin-order-arrived.module#AdminOrderArrivedModule',
    canActivate: [AdminRouterService]
  },
  {
    path: 'seller-fulfills-orders',
    loadChildren: './admin-orders/admin-orders.module#AdminOrdersModule',
    canActivate: [AdminRouterService]
  },
  {
    path: 'orders-out-for-delivery',
    loadChildren: './admin-order-out-delivery/admin-order-out-delivery.module#AdminOrderOutDeliveryModule',
    canActivate: [AdminRouterService]
  },
  {
    path: 'orders-delivered',
    loadChildren: './admin-order-delivered/admin-order-delivered.module#AdminOrderDeliveredModule',
    canActivate: [AdminRouterService]
  },
  {
    path: 'payment-management',
    loadChildren: './payments/payments.module#PaymentsModule',
    canActivate: [AdminRouterService]
  },
  {
    path: 'manage-orders',
    loadChildren: './manage-orders/manage-orders.module#ManageOrdersModule',
    canActivate: [AdminRouterService]
  },
  {
    path: 'logistic-management',
    loadChildren: './admin-logistic-managment/admin-logistic-managment.module#AdminLogisticManagmentModule',
    canActivate: [AdminRouterService]
  },
  {
    path: 'repayments',
    loadChildren: './repayments/repayments.module#RepaymentsModule',
    canActivate: [AdminRouterService]
  },
  {
    path: 'refunds',
    loadChildren: './refunds/refunds.module#RefundsModule',
    canActivate: [AdminRouterService]
  },
  {
    path: 'refund-cases',
    loadChildren: './refund-cases/refund-cases.module#RefundCasesModule',
    canActivate: [AdminRouterService]
  },
  {
    path: 'pending-products',
    loadChildren: './pending-products/pending-products.module#PendingProductsModule',
    canActivate: [AdminRouterService]
  },
  {
    path: 'products-list/page/:number',
    loadChildren: './product-list/product-list.module#ProductListModule',
    canActivate: [AdminRouterService]
  },
  {
    path: 'manage-countries',
    loadChildren: './admin-countries/admin-countries.module#AdminCountriesModule',
    canActivate: [AdminRouterService]
  },
  {
    path: 'manage-shipping-cities',
    loadChildren: './shipping-by-city/shipping-by-city.module#ShippingByCityModule',
    canActivate: [AdminRouterService]
  },
  {
    path: 'port-loading-management',
    loadChildren: './citi-managment/citi-managment.module#CitiManagmentModule',
    canActivate: [AdminRouterService]
  },
  {
    path: 'forgot-password',
    loadChildren: './forgot-password/forgot-password.module#ForgotPasswordModule',
    canActivate: [AdminRouterService]
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    MenuNavComponent,
    AppComponent,
    HomeComponent,
    FeaturedStoreComponent,
    ProductManagmentComponent,
    AccountComponent,
    CreateProductComponent,
    FishFormComponent,
    AvancedPricingComponent,
    FishFeaturesComponent
  ],
  imports: [
    BrowserAnimationsModule,
    SharedModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    RouterModule.forRoot(appRoutes),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    FileUploadModule,
    BarRatingModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
  ],
  exports: [
    SharedModule,
    TranslateModule
  ],
  providers: [
    RouterProtectionService,
    AdminRouterService,
    BuyerRouterService,
    SellerRouterService,
    NonsellerRouterService,
    CartService,
    OrdersService,
    ShippingRatesService,
    CountriesService,
    PricingChargesService,
    MenuItems,
    { provide: OWL_DATE_TIME_LOCALE, useValue: 'en' },
    // TranslateService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }