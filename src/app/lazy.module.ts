import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Http, HttpModule } from '@angular/http';
import { NgxLoadingModule, ngxLoadingAnimationTypes } from 'ngx-loading';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { BarRatingModule } from 'ngx-bar-rating';
import { FilternumberPipe } from './filternumber.pipe';
import { FilterPipePipe } from './filter-pipe.pipe';

import { Routes, RouterModule } from '@angular/router';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';

import { SellerRouterService } from './services/seller-router.service';
import { BuyerRouterService } from './services/buyer-router.service';
import { AdminRouterService } from './services/admin-router.service';
import { RouterProtectionService } from './services/router-protection.service';
import { NonsellerRouterService } from './services/nonseller-router.service';

import { AddProductComponent } from './add-product/add-product.component';
import { ArchiveProductsComponent } from './archive-products/archive-products.component';
import { SearchComponent } from './search/search.component';
import { FileUploadModule } from 'ng2-file-upload';
import { FishComponent } from './fish/fish.component';
import { SingleProductComponent } from './single-product/single-product.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { AccountComponent } from './account/account.component';

import { AdminLogisticManagmentComponent } from './admin-logistic-managment/admin-logistic-managment.component';

import { MyProductsComponent } from './my-products/my-products.component';
import { CartComponent } from './cart/cart.component';
import { SingleStoreComponent } from './single-store/single-store.component';
import { TrackingComponent } from './tracking/tracking.component';
import { CommentsComponent } from './comments/comments.component';
import { OrdersComponent } from './orders/orders.component';
import { OrdersItemsComponent } from './orders-items/orders-items.component';
import { RecentPurchasesComponent } from './recent-purchases/recent-purchases.component';
import { OrderPurchaseComponent } from './order-purchase/order-purchase.component';
import { ChartComponent } from './chart/chart.component';
import { DocumentsComponent } from './documents/documents.component';
import { TrackingCodeComponent } from './tracking-code/tracking-code.component';
import { FeaturedTypesComponent } from './featured-types/featured-types.component';
import { FishTypeMenuComponent } from './fish-type-menu/fish-type-menu.component';
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
import { CitiManagmentComponent } from './citi-managment/citi-managment.component';
import { EditAccountComponent } from './edit-account/edit-account.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule, OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';

import { NgProgressModule } from 'ngx-progressbar';
import { TranslateModule, TranslateLoader, TranslateStaticLoader } from 'ng2-translate';

const appRoutes: Routes = [
  {
    path: 'add-product',
    component: AddProductComponent,
    canActivate: [SellerRouterService],
    data: { preload: false, delay: true }
  },
  {
    path: 'fish-type/:category/:page',
    component: ArchiveProductsComponent,
    canActivate: [BuyerRouterService],
    data: { preload: false, delay: true }
  },
  {
    path: 'search/:search/:page',
    component: SearchComponent,
    canActivate: [BuyerRouterService],
    data: { preload: false, delay: true }
  },
  {
    path: 'product/:id',
    component: SingleProductComponent,
    canActivate: [NonsellerRouterService],
    data: { preload: false, delay: true }
  },
  {
    path: 'product-categories',
    component: FishComponent, canActivate: [AdminRouterService],
    data: { preload: false, delay: true }
  },
  {
    path: 'edit-product/:id',
    component: EditProductComponent,
    canActivate: [SellerRouterService],
    data: { preload: false, delay: true }
  },
  {
    path: 'account',
    component: EditAccountComponent,
    canActivate: [RouterProtectionService],
    data: { preload: false, delay: true }
  },
  {
    path: 'my-products',
    component: MyProductsComponent,
    canActivate: [SellerRouterService],
    data: { preload: false, delay: true }
  },
  {
    path: 'manage-products',
    component: MyProductsComponent,
    canActivate: [AdminRouterService],
    data: { preload: false, delay: true }
  },
  {
    path: 'cart',
    component: CartComponent,
    canActivate: [RouterProtectionService],
    data: { preload: false, delay: true }
  },
  
  {
    path: 'store/:id',
    component: SingleStoreComponent,
    canActivate: [RouterProtectionService],
    data: { preload: false, delay: true }
  },
  
  {
    path: 'featured-types',
    component: FeaturedTypesComponent,
    canActivate: [AdminRouterService],
    data: { preload: false, delay: true }
  },
  {
    path: 'fish-types-menu',
    component: FishTypeMenuComponent,
    canActivate: [AdminRouterService],
    data: { preload: false, delay: true }
  },
  {
    path: 'orders',
    component: OrdersComponent,
    canActivate: [RouterProtectionService],
    data: { preload: false, delay: true }
  },
  {
    path: 'orders-items/:id',
    component: OrdersItemsComponent,
    canActivate: [RouterProtectionService],
    data: { preload: false, delay: true }
  },
  {
    path: 'comments', component: CommentsComponent, canActivate: [AdminRouterService],
    data: { preload: false, delay: true }
  },
  
  {
    path: 'recent-purchases', component: RecentPurchasesComponent, canActivate: [SellerRouterService],
    data: { preload: false, delay: true }
  },
  {
    path: 'order-purchase/:item', component: OrderPurchaseComponent, canActivate: [SellerRouterService],
    data: { preload: false, delay: true }
  },
  {
    path: 'chart', component: ChartComponent, canActivate: [AdminRouterService],
    data: { preload: false, delay: true }
  },
  {
    path: 'documents', component: DocumentsComponent, canActivate: [RouterProtectionService],
    data: { preload: false, delay: true }
  },
  {
    path: 'tracking-code/:item', component: TrackingCodeComponent, canActivate: [RouterProtectionService],
    data: { preload: false, delay: true }
  },
  {
    path: 'orders-shipped', component: AdminOrdersShippedComponent, canActivate: [AdminRouterService],
    data: { preload: false, delay: true }
  },
  {
    path: 'orders-arrived', component: AdminOrderArrivedComponent, canActivate: [AdminRouterService],
    data: { preload: false, delay: true }
  },
  {
    path: 'seller-fulfills-orders', component: AdminOrdersComponent, canActivate: [AdminRouterService],
    data: { preload: false, delay: true }
  },
  {
    path: 'orders-out-for-delivery', component: AdminOrderOutDeliveryComponent, canActivate: [AdminRouterService],
    data: { preload: false, delay: true }
  },
  {
    path: 'orders-delivered', component: AdminOrderDeliveredComponent, canActivate: [AdminRouterService],
    data: { preload: false, delay: true }
  },
  {
    path: 'payment-management', component: PaymentsComponent, canActivate: [AdminRouterService],
    data: { preload: false, delay: true }
  },
  {
    path: 'manage-orders', component: ManageOrdersComponent, canActivate: [AdminRouterService],
    data: { preload: false, delay: true }
  },
  {
    path: 'logistic-management', component: AdminLogisticManagmentComponent, canActivate: [AdminRouterService],
    data: { preload: false, delay: true }
  },
  {
    path: 'repayments', component: RepaymentsComponent, canActivate: [AdminRouterService],
    data: { preload: false, delay: true }
  },
  {
    path: 'refunds', component: RefundsComponent, canActivate: [AdminRouterService],
    data: { preload: false, delay: true }
  },
  {
    path: 'refund-cases', component: RefundCasesComponent, canActivate: [AdminRouterService],
    data: { preload: false, delay: true }
  },
  {
    path: 'items-status', component: ItemsByStatusComponent, canActivate: [BuyerRouterService],
    data: { preload: false, delay: true }
  },
  {
    path: 'pending-products', component: PendingProductsComponent, canActivate: [AdminRouterService],
    data: { preload: false, delay: true }
  },
  {
    path: 'historical-orders', component: CanceledDeliveredItemsComponent, canActivate: [BuyerRouterService],
    data: { preload: false, delay: true }
  },
  {
    path: 'products-list/page/:number', component: ProductListComponent, canActivate: [AdminRouterService],
    data: { preload: false, delay: true }
  },
  {
    path: 'port-loading-management', component: CitiManagmentComponent, canActivate: [AdminRouterService],
    data: { preload: false, delay: true }
  },
  {
    path: 'tracking',
    component: TrackingComponent,
    data: { preload: false, delay: true }
  },
];

@NgModule({
  imports: [
    CommonModule,
    FileUploadModule,
    NgProgressModule,
    HttpClientModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    BrowserAnimationsModule,
    BarRatingModule,
    ToastrModule.forRoot(),
    NgxLoadingModule.forRoot({
      animationType: ngxLoadingAnimationTypes.wanderingCubes
    }),
    AngularFontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: function (http: Http) { return new TranslateStaticLoader(http, '/assets/i18n', '.json'); },
      deps: [Http]
    }),
    RouterModule.forRoot(appRoutes),
  ],
  declarations: [
    FilterPipePipe,
    FilternumberPipe,
    AddProductComponent,
    ArchiveProductsComponent,
    SearchComponent,
    EditProductComponent,
    FishComponent,
    SingleProductComponent,
    AccountComponent,
    MyProductsComponent,
    CartComponent,
    SingleStoreComponent,
    AdminLogisticManagmentComponent,
    TrackingComponent,
    CommentsComponent,
    OrdersComponent,
    OrdersItemsComponent,
    RecentPurchasesComponent,
    OrderPurchaseComponent,
    ChartComponent,
    DocumentsComponent,
    TrackingCodeComponent,
    FeaturedTypesComponent,
    FishTypeMenuComponent,
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
    CitiManagmentComponent,
    EditAccountComponent,
  ],
  providers: [
    SellerRouterService,
    BuyerRouterService,
    NonsellerRouterService,
    RouterProtectionService,
    AdminRouterService,
    { provide: OWL_DATE_TIME_LOCALE, useValue: 'en' },
  ],
})
export class LazyModule { }
