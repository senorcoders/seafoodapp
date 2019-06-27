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
import { InventoryService } from './services/inventory.service';


import { OwlDateTimeModule, OwlNativeDateTimeModule, OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
import { ProductManagmentComponent } from './product-managment/product-managment.component';
import { AccountComponent } from './account/account.component';
import { ToastrService } from './toast.service';
import { CDNCheck } from './cdn-check';
import { CookieService } from 'ngx-cookie-service';
import { Homeve2Component } from './homeve2/homeve2.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { NgwWowModule } from 'ngx-wow';



const appRoutes: Routes = [
  {
    path: '', component: Homeve2Component,
  },
  {
    path: "login",
    loadChildren: () => import('app/login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'register',
    loadChildren: () => import('app/registration-form/registration-form.module').then(m => m.RegistrationFormModule)
  },
  {
    path: 'add-product',
    loadChildren: () => import('app/create-product/create-product.module').then(m => m.CreateProductModule),
    canActivate: [SellerRouterService]
  },
  {
    path: 'fish-type/:category/:page',
    loadChildren: () => import('app/archive-products/archive-products.module').then(m => m.ArchiveProductsModule),
    canActivate: [BuyerRouterService]
  },
  {
    path: 'search/:search/:page',
    loadChildren: () => import('app/search/search.module').then(m => m.SearchModule),
    canActivate: [BuyerRouterService]
  },
  {
    path: 'favorites',
    loadChildren: () => import('app/favorites/favorites.module').then(m => m.FavoritesModule),
    canActivate: [BuyerRouterService]
  },
  {
    path: 'advanced-search',
    loadChildren: () => import('app/advanced-search/advanced-search.module').then(m => m.AdvancedSearchModule),
    canActivate: [BuyerRouterService]
  },
  {
    path: 'reviewcart',
    loadChildren: () => import('app/reviewcart/reviewcart.module').then(m => m.ReviewcartModule),
    canActivate: [BuyerRouterService]
  },
  {
    path: 'checkout',
    loadChildren: () => import('app/checkout/checkout.module').then(m => m.CheckoutModule),
    canActivate: [BuyerRouterService]
  },
  {
    path: 'confirmation',
    loadChildren: () => import('app/confirmation/confirmation.module').then(m => m.ConfirmationModule),
    canActivate: [BuyerRouterService]
  },
  {
    path: 'thanks',
    loadChildren: () => import('app/thanks/thanks.module').then(m => m.ThanksModule),
    canActivate: [BuyerRouterService]
  },
  {
    path: 'items-status',
    loadChildren: () => import('app/items-by-status/items-by-status.module').then(m => m.ItemsByStatusModule),
    canActivate: [BuyerRouterService]
  },
  {
    path: 'historical-orders',
    loadChildren: () => import('app/canceled-delivered-items/canceled-delivered-items.module').then(m => m.CanceledDeliveredItemsModule),
    canActivate: [BuyerRouterService]
  },
  {
    path: 'product/:id',
    loadChildren: () => import('app/single-product/single-product.module').then(m => m.SingleProductModule),
    canActivate: [NonsellerRouterService]
  },
  {
    path: 'product/:id/:kg/:fishOption/:variationId',
    loadChildren: () => import('app/single-product/single-product.module').then(m => m.SingleProductModule),
    canActivate: [NonsellerRouterService]
  },
  {
    path: 'edit-product/:id',
    loadChildren: () => import('app/create-product/create-product.module').then(m => m.CreateProductModule),
    canActivate: [SellerRouterService]
  },
  {
    path: 'my-products',
    loadChildren: () => import('app/my-products/my-products.module').then(m => m.MyProductsModule),
    canActivate: []
  },
  {
    path: 'recent-purchases',
    loadChildren: () => import('app/recent-purchases/recent-purchases.module').then(m => m.RecentPurchasesModule),
    canActivate: [SellerRouterService]
  },
  {
    path: 'order-purchase/:item',
    loadChildren: () => import('app/order-purchase/order-purchase.module').then(m => m.OrderPurchaseModule),
    canActivate: [SellerRouterService]
  },
  {
    path: 'manage-store-trimming',
    loadChildren: () => import('app/manage-store-trimming/manage-store-trimming.module').then(m => m.ManageStoreTrimmingModule),
    canActivate: [SellerRouterService]
  },
  {
    path: 'product-categories',
    loadChildren: () => import('app/fish/fish.module').then(m => m.FishModule),
    canActivate: [AdminRouterService]
  },
  {
    path: 'account',
    loadChildren: () => import('app/edit-account/edit-account.module').then(m => m.EditAccountModule),
    canActivate: [RouterProtectionService]
  },
  {
    path: 'manage-products',
    loadChildren: () => import('app/my-products/my-products.module').then(m => m.MyProductsModule),
    canActivate: [RouterProtectionService]
  },
  {
    path: 'cart',
    loadChildren: () => import('app/cart/cart.module').then(m => m.CartModule),
    canActivate: [BuyerRouterService]
  },
  {
    path: 'verification/:userid/:code',
    loadChildren: () => import('app/confirmation-email/confirmation-email.module').then(m => m.ConfirmationEmailModule),
    canActivate: []
  },
  {
    path: 'register-verification',
    loadChildren: () => import('app/confirmation-register/confirmation-register.module').then(m => m.ConfirmationRegisterModule),
    canActivate: []
  },
  {
    path: 'vendor/:id',
    loadChildren: () => import('app/single-store/single-store.module').then(m => m.SingleStoreModule)
    // canActivate: [RouterProtectionService]
  },
  {
    path: 'featured-products',
    loadChildren: () => import('app/featured-products/featured-products.module').then(m => m.FeaturedProductsModule),
    canActivate: [AdminRouterService]
  },
  {
    path: 'featured-seller',
    loadChildren: () => import('app/featured-seller/featured-seller.module').then(m => m.FeaturedSellerModule),
    canActivate: [AdminRouterService]
  },
  {
    path: 'featured-types',
    loadChildren: () => import('app/featured-types/featured-types.module').then(m => m.FeaturedTypesModule),
    canActivate: [AdminRouterService]
  },
  {
    path: 'fish-types-menu',
    loadChildren: () => import('app/fish-type-menu/fish-type-menu.module').then(m => m.FishTypeMenuModule),
    canActivate: [AdminRouterService]
  },
  {
    path: 'admin',
    loadChildren: () => import('app/administrator/administrator.module').then(m => m.AdministratorModule),
    canActivate: [AdminRouterService]
  },
  {
    path: 'tracking',
    loadChildren: () => import('app/tracking/tracking.module').then(m => m.TrackingModule),
  },
  {
    path: 'shop',
    loadChildren: () => import('app/shop/shop.module').then(m => m.ShopModule),
    canActivate: []
  },
  {
    path: 'seller',
    loadChildren: () => import('app/seller/seller.module').then(m => m.SellerModule),
    canActivate: [AdminRouterService]
  },
  {
    path: 'buyer',
    loadChildren: () => import('app/buyer/buyer.module').then(m => m.BuyerModule),
    canActivate: [AdminRouterService]
  },
  {
    path: 'orders',
    loadChildren: () => import('app/orders/orders.module').then(m => m.OrdersModule),
    canActivate: [RouterProtectionService]
  },
  {
    path: 'orders-items/:id',
    loadChildren: () => import('app/orders-items/orders-items.module').then(m => m.OrdersItemsModule),
    canActivate: [RouterProtectionService]
  },
  {
    path: 'comments',
    loadChildren: () => import('app/comments/comments.module').then(m => m.CommentsModule),
    canActivate: [AdminRouterService]
  },
  {
    path: 'recovery-password/:code',
    loadChildren: () => import('app/recovery-password/recovery-password.module').then(m => m.RecoveryPasswordModule),
  },
  {
    path: 'verify-users',
    loadChildren: () => import('app/verify-user/verify-user.module').then(m => m.VerifyUserModule),
    canActivate: [AdminRouterService]
  },
  {
    path: 'chart',
    loadChildren: () => import('app/chart/chart.module').then(m => m.ChartModule),
    canActivate: [AdminRouterService]
  },
  {
    path: 'custom-rates',
    loadChildren: () => import('app/custom-rates/custom-rates.module').then(m => m.CustomRatesModule),
    canActivate: [AdminRouterService]
  },
  {
    path: 'documents',
    loadChildren: () => import('app/documents/documents.module').then(m => m.DocumentsModule),
    canActivate: [AdminRouterService]
  },
  {
    path: 'tracking-code/:item',
    loadChildren: () => import('app/tracking-code/tracking-code.module').then(m => m.TrackingCodeModule),
    canActivate: [RouterProtectionService]
  },
  {
    path: 'browse',
    loadChildren: () => import('app/browse/browse.module').then(m => m.BrowseModule),
  },
  {
    path: 'sfspay',
    loadChildren: () => import('app/sfs-pay/sfs-pay.module').then(m => m.SfsPayModule),
  },
  {
    path: 'help',
    loadChildren: () => import('app/help/help.module').then(m => m.HelpModule),
  },
  {
    path: 'contact-us',
    loadChildren: () => import('app/contact-us/contact-us.module').then(m => m.ContactUsModule),
  },
  {
    path: 'guides',
    loadChildren: () => import('app/guides/guides.module').then(m => m.GuidesModule),
  },
  {
    path: 'terms-conditions',
    loadChildren: () => import('app/terms-conditions/terms-conditions.module').then(m => m.TermsConditionsModule),
  },
  {
    path: 'privacy-policy',
    loadChildren: () => import('app/privacy-policy/privacy-policy.module').then(m => m.PrivacyPolicyModule),
  },
  {
    path: 'cookies-policy',
    loadChildren: () => import('app/cookies-policy/cookies-policy.module').then(m => m.CookiesPolicyModule),
  },
  {
    path: 'about-us',
    loadChildren: () => import('app/about/about.module').then(m => m.AboutModule),
  },
  {
    path: 'shipping-rates',
    loadChildren: () => import('app/shipping-rates/shipping-rates.module').then(m => m.ShippingRatesModule),
    canActivate: [AdminRouterService]
  },
  {
    path: 'pricing-charges',
    loadChildren: () => import('app/pricing-charges/pricing-charges.module').then(m => m.PricingChargesModule),
    canActivate: [AdminRouterService]
  },
  {
    path: 'inventory',
    loadChildren: () => import('app/inventory/inventory.module').then(m => m.InventoryModule),
    canActivate: [AdminRouterService]
  },
  {
    path: 'orders-shipped',
    loadChildren: () => import('app/admin-orders-shipped/admin-orders-shipped.module').then(m => m.AdminOrdersShippedModule),
    canActivate: [AdminRouterService]
  },
  {
    path: 'orders-arrived',
    loadChildren: () => import('app/admin-order-arrived/admin-order-arrived.module').then(m => m.AdminOrderArrivedModule),
    canActivate: [AdminRouterService]
  },
  {
    path: 'newstore/:id',
    loadChildren: () => import('app/storefront-new/storefront-new.module').then(m => m.StorefrontNewModule),
    canActivate: [RouterProtectionService]
  },
  {
    path: 'seller-fulfills-orders',
    loadChildren: () => import('app/admin-orders/admin-orders.module').then(m => m.AdminOrdersModule),
    canActivate: [AdminRouterService]
  },
  {
    path: 'orders-out-for-delivery',
    loadChildren: () => import('app/admin-order-out-delivery/admin-order-out-delivery.module').then(m => m.AdminOrderOutDeliveryModule),
    canActivate: [AdminRouterService]
  },
  {
    path: 'orders-delivered',
    loadChildren: () => import('app/admin-order-delivered/admin-order-delivered.module').then(m => m.AdminOrderDeliveredModule),
    canActivate: [AdminRouterService]
  },
  {
    path: 'payment-management',
    loadChildren: () => import('app/payments/payments.module').then(m => m.PaymentsModule),
    canActivate: [AdminRouterService]
  },
  {
    path: 'manage-orders',
    loadChildren: () => import('app/manage-orders/manage-orders.module').then(m => m.ManageOrdersModule),
    canActivate: [AdminRouterService]
  },
  {
    path: 'logistic-management',
    loadChildren: () => import('app/admin-logistic-managment/admin-logistic-managment.module').then(m => m.AdminLogisticManagmentModule),
    canActivate: [AdminRouterService]
  },
  {
    path: 'repayments',
    loadChildren: () => import('app/repayments/repayments.module').then(m => m.RepaymentsModule),
    canActivate: [AdminRouterService]
  },
  {
    path: 'refunds',
    loadChildren: () => import('app/refunds/refunds.module').then(m => m.RefundsModule),
    canActivate: [AdminRouterService]
  },
  {
    path: 'refund-cases',
    loadChildren: () => import('app/refund-cases/refund-cases.module').then(m => m.RefundCasesModule),
    canActivate: [AdminRouterService]
  },
  {
    path: 'pending-products',
    loadChildren: () => import('app/pending-products/pending-products.module').then(m => m.PendingProductsModule),
    canActivate: [AdminRouterService]
  },
  {
    path: 'products-list/page/:number',
    loadChildren: () => import('app/product-list/product-list.module').then(m => m.ProductListModule),
    canActivate: [AdminRouterService]
  },
  {
    path: 'manage-countries',
    loadChildren: () => import('app/admin-countries/admin-countries.module').then(m => m.AdminCountriesModule),
    canActivate: [AdminRouterService]
  },
  {
    path: 'manage-shipping-cities',
    loadChildren: () => import('app/shipping-by-city/shipping-by-city.module').then(m => m.ShippingByCityModule),
    canActivate: [AdminRouterService]
  },
  {
    path: 'port-loading-management',
    loadChildren: () => import('app/citi-managment/citi-managment.module').then(m => m.CitiManagmentModule),
    canActivate: [AdminRouterService]
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('app/forgot-password/forgot-password.module').then(m => m.ForgotPasswordModule),
    // canActivate: [AdminRouterService]
  },
  {
    path: 'faq',
    loadChildren: () => import('app/faq/faq.module').then(m => m.FaqModule),
  },
  {
    path: '404', component: NotfoundComponent
  },
  {
    path: 'my-cart',
    redirectTo: 'cart',
    pathMatch: 'full'
  },
  {
    path: 'my-orders',
    redirectTo: 'orders',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/404',
    pathMatch: 'full'
  }
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
    Homeve2Component,
    NotfoundComponent      ],
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
    NgwWowModule
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
    InventoryService,
    MenuItems,
    { provide: OWL_DATE_TIME_LOCALE, useValue: 'en', },
    ToastrService
    // TranslateService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
