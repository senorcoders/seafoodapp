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
import { AccountComponent } from './account/account.component';




import { FeaturedStoreComponent } from './featured-store/featured-store.component';
//import { environment } from '../../environments/environment';
import { BarRatingModule } from 'ngx-bar-rating';
import { VerifyUserComponent } from './verify-user/verify-user.component';
import { ChartComponent } from './chart/chart.component';
import { DocumentsComponent } from './documents/documents.component';
import { TrackingCodeComponent } from './tracking-code/tracking-code.component';
import { BrowseComponent } from './browse/browse.component';
import { SfsPayComponent } from './sfs-pay/sfs-pay.component';
import { HelpComponent } from './help/help.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { GuidesComponent } from './guides/guides.component';
import { TermsConditionsComponent } from './terms-conditions/terms-conditions.component';
import { AboutComponent } from './about/about.component';
import { FilterPipePipe } from './filter-pipe.pipe';
import { ShippingRatesComponent } from './shipping-rates/shipping-rates.component';
import { ShippingRatesService } from './services/shipping-rates.service';
import { CountriesService } from './services/countries.service';
import { PricingChargesService } from './services/pricing-charges.service';

import { PricingChargesComponent } from './pricing-charges/pricing-charges.component';
import { AdminOrdersComponent } from './admin-orders/admin-orders.component';
import { AdminOrdersShippedComponent } from './admin-orders-shipped/admin-orders-shipped.component';
import { ProductManagmentComponent } from './product-managment/product-managment.component';
import { PendingProductsComponent } from './pending-products/pending-products.component';
import { AdminOrderOutDeliveryComponent } from './admin-order-out-delivery/admin-order-out-delivery.component';
import { AdminOrderDeliveredComponent } from './admin-order-delivered/admin-order-delivered.component';
import { AdminOrderArrivedComponent } from './admin-order-arrived/admin-order-arrived.component';
import { PaymentsComponent } from './payments/payments.component';
import { RepaymentsComponent } from './repayments/repayments.component';
import { RefundsComponent } from './refunds/refunds.component';
import { RefundCasesComponent } from './refund-cases/refund-cases.component';
import { ManageOrdersComponent } from './manage-orders/manage-orders.component';
import { ProductListComponent } from './product-list/product-list.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule, OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
import { AdminCountriesComponent } from './admin-countries/admin-countries.component';
import { ShippingByCityComponent } from './shipping-by-city/shipping-by-city.component';
import { AdminLogisticManagmentComponent } from './admin-logistic-managment/admin-logistic-managment.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { CookiesPolicyComponent } from './cookies-policy/cookies-policy.component';
import { CitiManagmentComponent } from './citi-managment/citi-managment.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';


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
    loadChildren: './add-product/add-product.module#AddProductModule'
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
    loadChildren: './cart/cart-routing.module#CartModule',
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
    loadChildren: './fish-type-menu/fish-type-menu.module#FeaturedTypesModule',
    canActivate: [AdminRouterService]
  },
  {
    path: 'admin',
    loadChildren: './administrator/administrator.module#FeaturedTypesModule',
    canActivate: [AdminRouterService]
  },
  {
    path: 'tracking',
    loadChildren: './tracking/tracking.module#TrackingModule',
  },
  {
    path: 'products/:query/:page',
    loadChildren: './products/products.module#ProductsModule',
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
  { path: 'documents', component: DocumentsComponent, canActivate: [RouterProtectionService] },
  { path: 'tracking-code/:item', component: TrackingCodeComponent, canActivate: [RouterProtectionService] },
  { path: 'browse', component: BrowseComponent },
  { path: 'sfspay', component: SfsPayComponent },
  { path: 'help', component: HelpComponent },
  { path: 'contact-us', component: ContactUsComponent },
  { path: 'guides', component: GuidesComponent },
  { path: 'terms-conditions', component: TermsConditionsComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'cookies-policy', component: CookiesPolicyComponent },
  { path: 'about-us', component: AboutComponent },
  { path: 'shipping-rates', component: ShippingRatesComponent, canActivate: [AdminRouterService] },
  { path: 'pricing-charges', component: PricingChargesComponent, canActivate: [AdminRouterService] },
  { path: 'orders-shipped', component: AdminOrdersShippedComponent, canActivate: [AdminRouterService] },
  { path: 'orders-arrived', component: AdminOrderArrivedComponent, canActivate: [AdminRouterService] },
  { path: 'seller-fulfills-orders', component: AdminOrdersComponent, canActivate: [AdminRouterService] },
  { path: 'orders-out-for-delivery', component: AdminOrderOutDeliveryComponent, canActivate: [AdminRouterService] },
  { path: 'orders-delivered', component: AdminOrderDeliveredComponent, canActivate: [AdminRouterService] },
  { path: 'payment-management', component: PaymentsComponent, canActivate: [AdminRouterService] },
  { path: 'manage-orders', component: ManageOrdersComponent, canActivate: [AdminRouterService] },
  { path: 'logistic-management', component: AdminLogisticManagmentComponent, canActivate: [AdminRouterService] },
  { path: 'repayments', component: RepaymentsComponent, canActivate: [AdminRouterService] },
  { path: 'refunds', component: RefundsComponent, canActivate: [AdminRouterService] },
  { path: 'refund-cases', component: RefundCasesComponent, canActivate: [AdminRouterService] },
  { path: 'pending-products', component: PendingProductsComponent, canActivate: [AdminRouterService] },
  { path: 'products-list/page/:number', component: ProductListComponent, canActivate: [AdminRouterService] },
  { path: 'manage-countries', component: AdminCountriesComponent, canActivate: [AdminRouterService] },
  { path: 'manage-shipping-cities', component: ShippingByCityComponent, canActivate: [AdminRouterService] },
  { path: 'port-loading-management', component: CitiManagmentComponent, canActivate: [AdminRouterService] },
  { path: 'forgot-password', component: ForgotPasswordComponent }
];

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    MenuNavComponent,
    AppComponent,
    HomeComponent,
    AccountComponent,
    FeaturedStoreComponent,
    VerifyUserComponent,
    ChartComponent,
    DocumentsComponent,
    TrackingCodeComponent,
    BrowseComponent,
    SfsPayComponent,
    HelpComponent,
    ContactUsComponent,
    GuidesComponent,
    TermsConditionsComponent,
    AboutComponent,
    FilterPipePipe,
    ShippingRatesComponent,
    PricingChargesComponent,
    AdminOrdersComponent,
    AdminOrdersShippedComponent,
    ProductManagmentComponent,
    PendingProductsComponent,
    AdminOrderOutDeliveryComponent,
    AdminOrderDeliveredComponent,
    AdminOrderArrivedComponent,
    PaymentsComponent,
    RepaymentsComponent,
    RefundsComponent,
    RefundCasesComponent,
    ManageOrdersComponent,
    ProductListComponent,
    AdminCountriesComponent,
    ShippingByCityComponent,
    AdminLogisticManagmentComponent,
    PrivacyPolicyComponent,
    CookiesPolicyComponent,
    CitiManagmentComponent,
    ForgotPasswordComponent,
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
