import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AuthenticationService } from './services/authentication.service';
import { ProductService } from './services/product.service';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { RegisterComponent } from './register/register.component';
import { MenuItems } from './core/menu/menu-items';
import { MenuNavComponent } from './core/menu/menu-nav.component';
import { FooterComponent } from './core/footer/footer.component';
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
import { SellerRouterService } from './services/seller-router.service';
import { BuyerRouterService } from './services/buyer-router.service';
import { RouterProtectionService } from './services/router-protection.service';
import { AdminRouterService } from './services/admin-router.service';
import { MyProductsComponent } from './my-products/my-products.component';
import { CartComponent } from './cart/cart.component';
import { Http, HttpModule } from '@angular/http';
import { ConfirmationEmailComponent } from './confirmation-email/confirmation-email.component';
import { TranslateModule, TranslateLoader, TranslateStaticLoader } from 'ng2-translate';
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
import { BarRatingModule } from 'ngx-bar-rating';
import { VerifyUserComponent } from './verify-user/verify-user.component';
import { RecentPurchasesComponent } from './recent-purchases/recent-purchases.component';
import { OrderPurchaseComponent } from './order-purchase/order-purchase.component';
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
import { AdvancedSearchComponent } from './advanced-search/advanced-search.component';
import { Interceptor } from './interceptor/interceptor';
import { FilterPipePipe } from './filter-pipe.pipe';
import { ShippingRatesComponent } from './shipping-rates/shipping-rates.component';
import { ShippingRatesService } from './services/shipping-rates.service';
import { CheckoutComponent } from './checkout/checkout.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { CountriesService } from './services/countries.service';
import { PricingChargesService } from './services/pricing-charges.service';
import { OrderService } from './services/orders.service';
import { ThanksComponent } from './thanks/thanks.component';
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
import { ItemsByStatusComponent } from './items-by-status/items-by-status.component';
import { CanceledDeliveredItemsComponent } from './canceled-delivered-items/canceled-delivered-items.component';
import { ProductListComponent } from './product-list/product-list.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule, OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
import { AdminCountriesComponent } from './admin-countries/admin-countries.component';
import { ShippingByCityComponent } from './shipping-by-city/shipping-by-city.component';
import { ManageStoreTrimmingComponent } from './manage-store-trimming/manage-store-trimming.component';
import { ReviewcartComponent } from './reviewcart/reviewcart.component';
import { AdminLogisticManagmentComponent } from './admin-logistic-managment/admin-logistic-managment.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { CookiesPolicyComponent } from './cookies-policy/cookies-policy.component';
import { CitiManagmentComponent } from './citi-managment/citi-managment.component';
import { EditAccountComponent } from './edit-account/edit-account.component';
import {TooltipModule} from 'ng2-tooltip-directive';
import { ngfModule } from 'angular-file';
import { NgxLoadingModule } from 'ngx-loading';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', redirectTo: '/' },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'add-product', component: AddProductComponent, canActivate: [SellerRouterService] },
  { path: 'fish-type/:category/:page', component: ArchiveProductsComponent, canActivate: [BuyerRouterService] },
  { path: 'search/:search/:page', component: SearchComponent, canActivate: [BuyerRouterService] },
  { path: 'product/:id', component: SingleProductComponent },
  { path: 'product-categories', component: FishComponent, canActivate: [AdminRouterService] },
  { path: 'edit-product/:id', component: EditProductComponent, canActivate: [SellerRouterService] },
  { path: 'account', component: EditAccountComponent, canActivate: [RouterProtectionService] },
  { path: 'my-products', component: MyProductsComponent, canActivate: [SellerRouterService] },
  { path: 'manage-products', component: MyProductsComponent, canActivate: [AdminRouterService] },
  { path: 'cart', component: CartComponent, canActivate: [RouterProtectionService] },
  { path: 'verification/:userid/:id', component: ConfirmationEmailComponent },
  { path: 'store/:id', component: SingleStoreComponent },
  { path: 'featured-products', component: FeaturedProductsComponent, canActivate: [AdminRouterService] },
  { path: 'featured-seller', component: FeaturedSellerComponent, canActivate: [AdminRouterService] },
  { path: 'featured-types', component: FeaturedTypesComponent, canActivate: [AdminRouterService] },
  { path: 'fish-types-menu', component: FishTypeMenuComponent, canActivate: [AdminRouterService] },
  { path: 'admin', component: AdministratorComponent, canActivate: [AdminRouterService] },
  { path: 'favorites', component: FavoritesComponent, canActivate: [BuyerRouterService] },
  { path: 'tracking', component: TrackingComponent },
  { path: 'products/:query/:page', component: ProductsComponent, canActivate: [RouterProtectionService] },
  { path: 'seller', component: SellerComponent, canActivate: [AdminRouterService] },
  { path: 'buyer', component: BuyerComponent, canActivate: [AdminRouterService] },
  { path: 'orders', component: OrdersComponent, canActivate: [RouterProtectionService] },
  { path: 'orders-items/:id', component: OrdersItemsComponent, canActivate: [RouterProtectionService] },
  { path: 'comments', component: CommentsComponent, canActivate: [AdminRouterService] },
  { path: 'recovery-password/:code', component: RecoveryPasswordComponent },
  { path: 'verify-users', component: VerifyUserComponent, canActivate: [AdminRouterService] },
  { path: 'recent-purchases', component: RecentPurchasesComponent, canActivate: [SellerRouterService] },
  { path: 'order-purchase/:item', component: OrderPurchaseComponent, canActivate: [SellerRouterService] },
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
  { path: 'advanced-search', component: AdvancedSearchComponent, canActivate: [BuyerRouterService] },
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
  { path: 'reviewcart', component: ReviewcartComponent, canActivate: [BuyerRouterService] },
  { path: 'checkout', component: CheckoutComponent, canActivate: [BuyerRouterService] },
  { path: 'confirmation', component: ConfirmationComponent, canActivate: [BuyerRouterService] },
  { path: 'thanks', component: ThanksComponent, canActivate: [BuyerRouterService] },
  { path: 'items-status', component: ItemsByStatusComponent, canActivate: [BuyerRouterService] },
  { path: 'pending-products', component: PendingProductsComponent, canActivate: [AdminRouterService] },
  { path: 'canceled-delivered-items', component: CanceledDeliveredItemsComponent, canActivate: [BuyerRouterService] },
  { path: 'products-list/page/:number', component: ProductListComponent, canActivate: [AdminRouterService] },
  { path: 'manage-countries', component: AdminCountriesComponent, canActivate: [AdminRouterService] },
  { path: 'manage-shipping-cities', component: ShippingByCityComponent, canActivate: [AdminRouterService] },
  { path: 'manage-store-trimming', component: ManageStoreTrimmingComponent, canActivate: [SellerRouterService] },
  { path: 'port-loading-management', component: CitiManagmentComponent, canActivate: [AdminRouterService] }
];

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
    AdvancedSearchComponent,
    FilterPipePipe,
    ShippingRatesComponent,
    CheckoutComponent,
    ConfirmationComponent,
    ThanksComponent,
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
    ItemsByStatusComponent,
    CanceledDeliveredItemsComponent,
    ProductListComponent,
    AdminCountriesComponent,
    ShippingByCityComponent,
    ManageStoreTrimmingComponent,
    ReviewcartComponent,
    AdminLogisticManagmentComponent,
    PrivacyPolicyComponent,
    CookiesPolicyComponent,
    CitiManagmentComponent,
    EditAccountComponent,
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
      useFactory: function (http: Http) { return new TranslateStaticLoader(http, '/assets/i18n', '.json'); },
      deps: [Http]
    }),
    NgxSmartModalModule.forRoot(),
    BarRatingModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    TooltipModule,
    ngfModule,
    NgxLoadingModule.forRoot({}),

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
    OrdersService,
    ShippingRatesService,
    CountriesService,
    PricingChargesService,
    {provide: OWL_DATE_TIME_LOCALE, useValue: 'en'},
    OrderService   // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: Interceptor,
    //   multi: true,
    // }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
