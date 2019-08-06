import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { OrderService } from '../services/orders.service';
import { AuthenticationService } from '../services/authentication.service';
import { ToastrService } from '../toast.service';
import { environment } from '../../environments/environment';
import * as  moment from 'moment';

declare var jQuery: any;

@Component({
  selector: 'app-manage-orders',
  templateUrl: './manage-orders.component.html',
  styleUrls: ['./manage-orders.component.scss']
})
export class ManageOrdersComponent implements OnInit {

  orders: any = [];
  orderStatus: any = [];
  status: any;
  newStatus: any;
  orderNumber: any;
  user: any;
  selectedStatus: string;
  selectedItemID: string;
  showNoData: boolean = false;
  groupOrder = [];
  orderWithData = [];
  API: any = environment.apiURL;

  public date1 = new Date();
  public date2 = new Date();
  public useFilterDate = false;

  public page = 1;
  public limit = 20;
  public paginationNumbers = [];

  constructor(
    private orderService: OrderService,
    private productService: ProductService,
    private toast: ToastrService,
    private auth: AuthenticationService) { }

 ngOnInit() {
    this.date2.setMonth(new Date().getMonth() + 1);
    this.user = this.auth.getLoginData();
    this.status = '0';
    this.getStatus();
    this.getOrders(true);
  }

  clear() {
    this.status = '0';
    this.orderNumber = '';
    this.getOrders(true);
  }

  onItemChange(selectedItem: string) {
    this.status = selectedItem;
    this.getOrders(true);
  }

  getOrders(pagination?) { 
    if(pagination){
      this.page = 1;
    }
    this.showNoData = false;
    console.log('status', this.status);
    console.log('orderNumber', this.orderNumber);
    //this.orders = [];
    if (
      (this.status === undefined && this.orderNumber === undefined) ||
      (this.status === '0' && (this.orderNumber === undefined || this.orderNumber === ''))
    ) {
      this.orderService.getAllOrdersPagination(this.page, this.limit).subscribe(
        res => {
          this.calcPagination(res["pageAvailables"]);
          if (res['data'].length > 0) {
            this.orders = res["data"];
            this.showNoData = false;
            this.groupByOrders(res["data"])
          } else {
            this.showNoData = true;
          }
        },
        error => {
          console.log(error);
          this.toast.error('Something happend, please refresh the page', 'System Error', { positionClass: 'toast-top-right' });
        }
      );
    } else if (this.status !== '0' && (this.orderNumber === undefined || this.orderNumber === '')) {// by status
      this.orderService.getOrdersByStatusPagination(this.page, this.limit, this.status).subscribe(
        res => {
          this.calcPagination(res["pageAvailables"]);
          if (res['data'].length > 0) {
            this.orders = res["data"];
            this.showNoData = false;
            this.groupByOrders(res["data"])
          } else {
            this.showNoData = true;
          }
          console.log(res);
        },
        error => {
          console.log(error);
          this.toast.error('Something happend, please refresh the page', 'System Error', { positionClass: 'toast-top-right' });
        }
      );
    } else if ((this.orderNumber !== undefined || this.orderNumber > 0) && this.status === '0') {// by order number
      this.orderService.getOrdersByNumberPagination(this.page, this.limit, this.orderNumber).subscribe(
        res => {
          this.calcPagination(res["pageAvailables"]);
          if (res['data'].length > 0) {
            this.orders = res["data"];
            this.groupByOrders(res["data"]);
            this.showNoData = false;
          } else {
            this.showNoData = true;
          }
          console.log(res);
        },
        error => {
          console.log(error);
          this.toast.error('Something happend, please refresh the page', 'System Error', { positionClass: 'toast-top-right' });
        }
      );
    } else if (this.status !== '0' && this.orderNumber !== undefined || this.orderNumber !== '') {
      this.orderService.getOrdersByStatusAndNumberPagination(this.page, this.limit, this.status, this.orderNumber).subscribe(
        res => {
          this.calcPagination(res["pageAvailables"]);
          if (res['data'].length > 0) {
            this.orders = res["data"];
            this.showNoData = false;
            this.groupByOrders(res["data"]);
          } else {
            this.showNoData = true;
          }
          console.log(res);
        },
        error => {
          console.log(error);
          this.toast.error('Something happend, please refresh the page', 'System Error', { positionClass: 'toast-top-right' });
        }
      );
    } else {
      this.orderService.getAllOrdersPagination(this.page, this.limit).subscribe(
        res => {
          this.calcPagination(res["pageAvailables"]);
          this.orders = res["data"];
          if (res['data'].length > 0) {
            this.showNoData = false;
          } else {
            this.showNoData = true;
          }
          console.log(res);
        },
        error => {
          console.log(error);
          this.toast.error('Something happend, please refresh the page', 'System Error', { positionClass: 'toast-top-right' });
        }
      );
    }
  }

  public getOrdersPage(page){
    this.page = page;
    this.getOrders();
  }

  private calcPagination(length) {
    this.paginationNumbers = [];
    for (let i = 0; i < length; i++) {
      this.paginationNumbers.push(i);
    }
  }

  public nextPage() {
    this.paginationNumbers = [];
    this.page++;
    this.getOrders();
  }

  public previousPage() {
    this.paginationNumbers = [];
      if (this.page > 1) {
        this.page--;
      }
      this.getOrders();
  }

  getStatus() {
    this.orderService.getOrderStatus().subscribe(
      res => {
        this.orderStatus = res;
      },
      error => {
        console.log(error);
        this.toast.error('Something happend, please refresh the page', 'System Error', { positionClass: 'toast-top-right' });
      }
    );
  }

  groupByOrders(orders) {
    this.groupOrder = [];
    this.orderWithData = [];
    //get order with products.
    this.orders.forEach((val) => {
      if (val.fish && val.fish != '') {
        this.orderWithData.push(val)
      }
    })
    //group by orderNumber
    this.orderWithData.forEach((val, index) => {
      console.log(val);
      if (val.shoppingCart && val.shoppingCart.orderNumber) {
        if (index > 0) {
          if ((val.shoppingCart !== null && val.shoppingCart !== undefined) && val.shoppingCart.orderNumber != this.orderWithData[index - 1].shoppingCart.orderNumber) {
            this.groupOrder.push({
              orderNumber: val.shoppingCart.orderNumber, xeroRef: val.shoppingCart.xeroRef,
              invoice_pdf: val.shoppingCart.invoice_pdf, id: val.id, clones: val.shoppingCart.clones
            });
          }
        }
        else {
          this.groupOrder.push({
            orderNumber: val.shoppingCart.orderNumber, xeroRef: val.shoppingCart.xeroRef,
            invoice_pdf: val.shoppingCart.invoice_pdf, id: val.id, clones: val.shoppingCart.clones
          });
        }
      }
    })
    console.log(this.groupOrder);
    if (this.groupOrder.length == 0) {
      this.showNoData = true
    }
    else {
      this.showNoData = false;
    }
  }

  syncXero() {
    this.orderService.syncOrdersWithXeroInvoiceService().subscribe(
      result => {
        this.toast.success(`${result['ordersUpdated']} order has been sync with Xero Invoice Service `,
          'Xero Sync', { positionClass: 'toast-top-right' });
      }, error => {
        this.toast.error('something wrong happend, please refresh the page', 'Status Change', { positionClass: 'toast-top-right' });
      }
    );
  }

  public validateUpdateInfo(item, order) {
    return item.shoppingCart !== null && item.shoppingCart !== undefined ? item.shoppingCart.orderNumber === order.orderNumber && item.updateInfo : false;
  }

  public getFormDate(date) {
    return moment(date).format('MM/DD/YYYY');
  }

  public filterDateChange() {
  }

  public filter(val) {
    let status = true;
    let item = this.orderWithData.find(it => {
      return it.id === val.id;
    });
    if (item === undefined || item === null) return true;
    //Ahora hacemos filtros por date paid
    if (status === true && this.useFilterDate === true) {
      if (item.shoppingCart && item.shoppingCart.paidDateTime) {
        let date = moment(item.shoppingCart.paidDateTime);
        status = date.isBetween(this.date1, this.date2);
      }
    }

    return status;
  }
}
