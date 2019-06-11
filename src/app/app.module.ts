import { NgModule, APP_INITIALIZER } from '@angular/core';
import { SharedModule } from './shared/shared.module';

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
import { ToastrService } from './toast.service';
import { CDNCheck } from './cdn-check';
import { CookieService } from 'ngx-cookie-service';
import { Homeve2Component } from './homeve2/homeve2.component';

const appRoutes: Routes = [
  {
    path: '', component: Homeve2Component,
  },
  {
    path: "login",
    loadChildren: 'app/login/login.module#LoginModule'
  },
  {
    path: 'register',
    loadChildren: 'app/registration-form/registration-form.module#RegistrationFormModule'
  },
  {
    path: 'add-product',
    loadChildren: 'app/create-product/create-product.module#CreateProductModule',
    canActivate: [SellerRouterService]
  },
  {
    path: 'fish-type/:category/:page',
    loadChildren: 'app/archive-products/archive-products.module#ArchiveProductsModule',
    canActivate: [BuyerRouterService]
  },
  {
    path: 'search/:search/:page',
    loadChildren: 'app/search/search.module#SearchModule',
    canActivate: [BuyerRouterService]
  },
  {
    path: 'favorites',
    loadChildren: 'app/favorites/favorites.module#FavoritesModule',
    canActivate: [BuyerRouterService]
  },
  {
    path: 'advanced-search',
    loadChildren: 'app/advanced-search/advanced-search.module#AdvancedSearchModule',
    canActivate: [BuyerRouterService]
  },
  {
    path: 'reviewcart',
    loadChildren: 'app/reviewcart/reviewcart.module#ReviewcartModule',
    canActivate: [BuyerRouterService]
  },
  {
    path: 'checkout',
    loadChildren: 'app/checkout/checkout.module#CheckoutModule',
    canActivate: [BuyerRouterService]
  },
  {
    path: 'confirmation',
    loadChildren: 'app/confirmation/confirmation.module#ConfirmationModule',
    canActivate: [BuyerRouterService]
  },
  {
    path: 'thanks',
    loadChildren: 'app/thanks/thanks.module#ThanksModule',
    canActivate: [BuyerRouterService]
  },
  {
    path: 'items-status',
    loadChildren: 'app/items-by-status/items-by-status.module#ItemsByStatusModule',
    canActivate: [BuyerRouterService]
  },
  {
    path: 'historical-orders',
    loadChildren: 'app/canceled-delivered-items/canceled-delivered-items.module#CanceledDeliveredItemsModule',
    canActivate: [BuyerRouterService]
  },
  {
    path: 'product/:id',
    loadChildren: 'app/single-product/single-product.module#SingleProductModule',
    canActivate: [NonsellerRouterService]
  },
  {
    path: 'product/:id/:kg/:fishOption/:variationId',
    loadChildren: 'app/single-product/single-product.module#SingleProductModule',
    canActivate: [NonsellerRouterService]
  },
  {
    path: 'edit-product/:id',
    loadChildren: 'app/create-product/create-product.module#CreateProductModule',
    canActivate: [SellerRouterService]
  },
  {
    path: 'my-products',
    loadChildren: 'app/my-products/my-products.module#MyProductsModule',
    canActivate: []
  },
  {
    path: 'recent-purchases',
    loadChildren: 'app/recent-purchases/recent-purchases.module#RecentPurchasesModule',
    canActivate: [SellerRouterService]
  },
  {
    path: 'order-purchase/:item',
    loadChildren: 'app/order-purchase/order-purchase.module#OrderPurchaseModule',
    canActivate: [SellerRouterService]
  },
  {
    path: 'manage-store-trimming',
    loadChildren: 'app/manage-store-trimming/manage-store-trimming.module#ManageStoreTrimmingModule',
    canActivate: [SellerRouterService]
  },
  {
    path: 'product-categories',
    loadChildren: 'app/fish/fish.module#FishModule',
    canActivate: [AdminRouterService]
  },
  {
    path: 'account',
    loadChildren: 'app/edit-account/edit-account.module#EditAccountModule',
    canActivate: [RouterProtectionService]
  },
  {
    path: 'manage-products',
    loadChildren: 'app/my-products/my-products.module#MyProductsModule',
    canActivate: [RouterProtectionService]
  },
  {
    path: 'cart',
    loadChildren: 'app/cart/cart.module#CartModule',
    canActivate: []
  },
  {
    path: 'verification/:userid/:code',
    loadChildren: 'app/confirmation-email/confirmation-email.module#ConfirmationEmailModule',
    canActivate: []
  },
  {
    path: 'register-verification',
    loadChildren: 'app/confirmation-register/confirmation-register.module#ConfirmationRegisterModule',
    canActivate: []
  },
  {
    path: 'vendor/:id',
    loadChildren: 'app/single-store/single-store.module#SingleStoreModule'
    // canActivate: [RouterProtectionService]
  },
  {
    path: 'featured-products',
    loadChildren: 'app/featured-products/featured-products.module#FeaturedProductsModule',
    canActivate: [AdminRouterService]
  },
  {
    path: 'featured-seller',
    loadChildren: 'app/featured-seller/featured-seller.module#FeaturedSellerModule',
    canActivate: [AdminRouterService]
  },
  {
    path: 'featured-types',
    loadChildren: 'app/featured-types/featured-types.module#FeaturedTypesModule',
    canActivate: [AdminRouterService]
  },
  {
    path: 'fish-types-menu',
    loadChildren: 'app/fish-type-menu/fish-type-menu.module#FishTypeMenuModule',
    canActivate: [AdminRouterService]
  },
  {
    path: 'admin',
    loadChildren: 'app/administrator/administrator.module#AdministratorModule',
    canActivate: [AdminRouterService]
  },
  {
    path: 'tracking',
    loadChildren: 'app/tracking/tracking.module#TrackingModule',
  },
  {
    path: 'shop',
    loadChildren: 'app/shop/shop.module#ShopModule',
    canActivate: []
  },
  {
    path: 'seller',
    loadChildren: 'app/seller/seller.module#SellerModule',
    canActivate: [AdminRouterService]
  },
  {
    path: 'buyer',
    loadChildren: 'app/buyer/buyer.module#BuyerModule',
    canActivate: [AdminRouterService]
  },
  {
    path: 'orders',
    loadChildren: 'app/orders/orders.module#OrdersModule',
    canActivate: [RouterProtectionService]
  },
  {
    path: 'orders-items/:id',
    loadChildren: 'app/orders-items/orders-items.module#OrdersItemsModule',
    canActivate: [RouterProtectionService]
  },
  {
    path: 'comments',
    loadChildren: 'app/comments/comments.module#CommentsModule',
    canActivate: [AdminRouterService]
  },
  {
    path: 'recovery-password/:code',
    loadChildren: 'app/recovery-password/recovery-password.module#RecoveryPasswordModule',
  },
  {
    path: 'verify-users',
    loadChildren: 'app/verify-user/verify-user.module#VerifyUserModule',
    canActivate: [AdminRouterService]
  },
  {
    path: 'chart',
    loadChildren: 'app/chart/chart.module#ChartModule',
    canActivate: [AdminRouterService]
  },
  {
    path: 'custom-rates',
    loadChildren: 'app/custom-rates/custom-rates.module#CustomRatesModule',
    canActivate: [AdminRouterService]
  },
  {
    path: 'documents',
    loadChildren: 'app/documents/documents.module#DocumentsModule',
    canActivate: [AdminRouterService]
  },
  {
    path: 'tracking-code/:item',
    loadChildren: 'app/tracking-code/tracking-code.module#TrackingCodeModule',
    canActivate: [RouterProtectionService]
  },
  {
    path: 'browse',
    loadChildren: 'app/browse/browse.module#BrowseModule',
  },
  {
    path: 'sfspay',
    loadChildren: 'app/sfs-pay/sfs-pay.module#SfsPayModule',
  },
  {
    path: 'help',
    loadChildren: 'app/help/help.module#HelpModule',
  },
  {
    path: 'contact-us',
    loadChildren: 'app/contact-us/contact-us.module#ContactUsModule',
  },
  {
    path: 'guides',
    loadChildren: 'app/guides/guides.module#GuidesModule',
  },
  {
    path: 'terms-conditions',
    loadChildren: 'app/terms-conditions/terms-conditions.module#TermsConditionsModule',
  },
  {
    path: 'privacy-policy',
    loadChildren: 'app/privacy-policy/privacy-policy.module#PrivacyPolicyModule',
  },
  {
    path: 'cookies-policy',
    loadChildren: 'app/cookies-policy/cookies-policy.module#CookiesPolicyModule',
  },
  {
    path: 'about-us',
    loadChildren: 'app/about/about.module#AboutModule',
  },
  {
    path: 'shipping-rates',
    loadChildren: 'app/shipping-rates/shipping-rates.module#ShippingRatesModule',
    canActivate: [AdminRouterService]
  },
  {
    path: 'pricing-charges',
    loadChildren: 'app/pricing-charges/pricing-charges.module#PricingChargesModule',
    canActivate: [AdminRouterService]
  },
  {
    path: 'orders-shipped',
    loadChildren: 'app/admin-orders-shipped/admin-orders-shipped.module#AdminOrdersShippedModule',
    canActivate: [AdminRouterService]
  },
  {
    path: 'orders-arrived',
    loadChildren: 'app/admin-order-arrived/admin-order-arrived.module#AdminOrderArrivedModule',
    canActivate: [AdminRouterService]
  },
  {
    path: 'newstore/:id',
    loadChildren: 'app/storefront-new/storefront-new.module#StorefrontNewModule',
    canActivate: [RouterProtectionService]
  },
  {
    path: 'seller-fulfills-orders',
    loadChildren: 'app/admin-orders/admin-orders.module#AdminOrdersModule',
    canActivate: [AdminRouterService]
  },
  {
    path: 'orders-out-for-delivery',
    loadChildren: 'app/admin-order-out-delivery/admin-order-out-delivery.module#AdminOrderOutDeliveryModule',
    canActivate: [AdminRouterService]
  },
  {
    path: 'orders-delivered',
    loadChildren: 'app/admin-order-delivered/admin-order-delivered.module#AdminOrderDeliveredModule',
    canActivate: [AdminRouterService]
  },
  {
    path: 'payment-management',
    loadChildren: 'app/payments/payments.module#PaymentsModule',
    canActivate: [AdminRouterService]
  },
  {
    path: 'manage-orders',
    loadChildren: 'app/manage-orders/manage-orders.module#ManageOrdersModule',
    canActivate: [AdminRouterService]
  },
  {
    path: 'logistic-management',
    loadChildren: 'app/admin-logistic-managment/admin-logistic-managment.module#AdminLogisticManagmentModule',
    canActivate: [AdminRouterService]
  },
  {
    path: 'repayments',
    loadChildren: 'app/repayments/repayments.module#RepaymentsModule',
    canActivate: [AdminRouterService]
  },
  {
    path: 'refunds',
    loadChildren: 'app/refunds/refunds.module#RefundsModule',
    canActivate: [AdminRouterService]
  },
  {
    path: 'refund-cases',
    loadChildren: 'app/refund-cases/refund-cases.module#RefundCasesModule',
    canActivate: [AdminRouterService]
  },
  {
    path: 'pending-products',
    loadChildren: 'app/pending-products/pending-products.module#PendingProductsModule',
    canActivate: [AdminRouterService]
  },
  {
    path: 'products-list/page/:number',
    loadChildren: 'app/product-list/product-list.module#ProductListModule',
    canActivate: [AdminRouterService]
  },
  {
    path: 'manage-countries',
    loadChildren: 'app/admin-countries/admin-countries.module#AdminCountriesModule',
    canActivate: [AdminRouterService]
  },
  {
    path: 'manage-shipping-cities',
    loadChildren: 'app/shipping-by-city/shipping-by-city.module#ShippingByCityModule',
    canActivate: [AdminRouterService]
  },
  {
    path: 'port-loading-management',
    loadChildren: 'app/citi-managment/citi-managment.module#CitiManagmentModule',
    canActivate: [AdminRouterService]
  },
  {
    path: 'forgot-password',
    loadChildren: 'app/forgot-password/forgot-password.module#ForgotPasswordModule',
    // canActivate: [AdminRouterService]
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  },
];

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function jokesProviderFactory(provider: CDNCheck) {
  return () => provider.load();
}

@NgModule({
  declarations: [
    MenuNavComponent,
    AppComponent,
    HomeComponent,
    FeaturedStoreComponent,
    ProductManagmentComponent,
    AccountComponent,
    Homeve2Component
      ],
  imports: [
    BrowserAnimationsModule,
    SharedModule,
    HttpClientModule,
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
    CookieService,
    CDNCheck, 
    { provide: APP_INITIALIZER, useFactory: jokesProviderFactory, deps: [CDNCheck], multi: true },
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
    { provide: OWL_DATE_TIME_LOCALE, useValue: 'en', },
    ToastrService
    // TranslateService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
