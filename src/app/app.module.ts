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
import { FishComponent } from './fish/fish.component';
import { AccountComponent } from './account/account.component';

import { MyProductsComponent } from './my-products/my-products.component';
import { CartComponent } from './cart/cart.component';

import { ConfirmationEmailComponent } from './confirmation-email/confirmation-email.component';

import { SingleStoreComponent } from './single-store/single-store.component';

import { FeaturedProductsComponent } from './featured-products/featured-products.component';
import { FeaturedSellerComponent } from './featured-seller/featured-seller.component';
import { FeaturedStoreComponent } from './featured-store/featured-store.component';
import { AdministratorComponent } from './administrator/administrator.component';
//import { environment } from '../../environments/environment';
import { TrackingComponent } from './tracking/tracking.component';
import { ProductsComponent } from './products/products.component';
import { SellerComponent } from './seller/seller.component';
import { BuyerComponent } from './buyer/buyer.component';
import { CommentsComponent } from './comments/comments.component';
import { OrdersComponent } from './orders/orders.component';
import { OrdersItemsComponent } from './orders-items/orders-items.component';
import { RecoveryPasswordComponent } from './recovery-password/recovery-password.component';
import { BarRatingModule } from 'ngx-bar-rating';
import { VerifyUserComponent } from './verify-user/verify-user.component';
import { ChartComponent } from './chart/chart.component';
import { DocumentsComponent } from './documents/documents.component';
import { TrackingCodeComponent } from './tracking-code/tracking-code.component';
import { FeaturedTypesComponent } from './featured-types/featured-types.component';
import { FishTypeMenuComponent } from './fish-type-menu/fish-type-menu.component';
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
import { EditAccountComponent } from './edit-account/edit-account.component';
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
  { path: 'product-categories', component: FishComponent, canActivate: [AdminRouterService] },
  { path: 'account', component: EditAccountComponent, canActivate: [RouterProtectionService] },
  // { path: 'manage-products', component: MyProductsComponent, canActivate: [AdminRouterService] },
  { path: 'cart', component: CartComponent, canActivate: [RouterProtectionService] },
  { path: 'verification/:userid/:id', component: ConfirmationEmailComponent },
  { path: 'store/:id', component: SingleStoreComponent, canActivate: [RouterProtectionService] },
  { path: 'featured-products', component: FeaturedProductsComponent, canActivate: [AdminRouterService] },
  { path: 'featured-seller', component: FeaturedSellerComponent, canActivate: [AdminRouterService] },
  { path: 'featured-types', component: FeaturedTypesComponent, canActivate: [AdminRouterService] },
  { path: 'fish-types-menu', component: FishTypeMenuComponent, canActivate: [AdminRouterService] },
  { path: 'admin', component: AdministratorComponent, canActivate: [AdminRouterService] },
  { path: 'tracking', component: TrackingComponent },
  { path: 'products/:query/:page', component: ProductsComponent, canActivate: [RouterProtectionService] },
  { path: 'seller', component: SellerComponent, canActivate: [AdminRouterService] },
  { path: 'buyer', component: BuyerComponent, canActivate: [AdminRouterService] },
  { path: 'orders', component: OrdersComponent, canActivate: [RouterProtectionService] },
  { path: 'orders-items/:id', component: OrdersItemsComponent, canActivate: [RouterProtectionService] },
  { path: 'comments', component: CommentsComponent, canActivate: [AdminRouterService] },
  { path: 'recovery-password/:code', component: RecoveryPasswordComponent },
  { path: 'verify-users', component: VerifyUserComponent, canActivate: [AdminRouterService] },
  { path: 'chart', component: ChartComponent, canActivate: [AdminRouterService] },
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
    FishComponent,
    AccountComponent,
    CartComponent,
    ConfirmationEmailComponent,
    SingleStoreComponent,
    FeaturedProductsComponent,
    FeaturedSellerComponent,
    FeaturedStoreComponent,
    AdministratorComponent,
    TrackingComponent,
    ProductsComponent,
    SellerComponent,
    BuyerComponent,
    CommentsComponent,
    OrdersComponent,
    OrdersItemsComponent,
    RecoveryPasswordComponent,
    VerifyUserComponent,
    ChartComponent,
    DocumentsComponent,
    TrackingCodeComponent,
    FeaturedTypesComponent,
    FishTypeMenuComponent,
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
    EditAccountComponent,
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
