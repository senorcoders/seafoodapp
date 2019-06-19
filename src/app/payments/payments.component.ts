import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { OrderService } from '../services/orders.service';
import { AuthenticationService } from '../services/authentication.service';
import { PricingChargesService } from '../services/pricing-charges.service';
import { ToastrService } from '../toast.service';
import { environment } from '../../environments/environment';
declare var jQuery: any;

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})
export class PaymentsComponent implements OnInit {

  orders: any = [];
  orderStatus: any = [];
  showNoData: boolean = false;
  selectedStatus: any;
  public selectedStatusName = '';
  selectedItemID: any;
  user: any;
  exchangeRate: number;
  public API: any = environment.apiURL;

  public page = 1;
  public limit = 20;
  public paginationNumbers = [];
  public searchActive = false;

  constructor(
    private orderService: OrderService,
    private toast: ToastrService,
    private auth: AuthenticationService,
    private pricingService: PricingChargesService) { }

 ngOnInit() {
    this.user = this.auth.getLoginData();
    this.getExchangeRates();
    this.getPayments(true);
    this.getPaymentStatus();
  }

  getPayments(pagination?) {
    this.searchActive = false;
    if (pagination)
      this.page = 1;
    this.orderService.getPayedItemsPagination(this.page, this.limit).subscribe(
      result => {
        this.calcPagination(result["pageAvailables"]);
        if (result['data'].length > 0) {
          this.orders = result["data"];
          this.showNoData = false;
        } else {
          this.showNoData = true;
        }
      },
      e => {
        console.log(e);
      }
    );
  }

  public getOrdersPage(page) {
    this.page = page;
    this.getPayments();
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
    this.getPayments();
  }

  public previousPage() {
    this.paginationNumbers = [];
    if (this.page > 1) {
      this.page--;
    }
    this.getPayments();
  }

  getExchangeRates() {
    this.pricingService.getCurrentPricingCharges().subscribe(
      res => {
        this.exchangeRate = res['exchangeRates'];
      }, error => {
        console.log(error);
      }
    )
  }

  getPaymentStatus() {
    this.orderService.getPaymentStatus().subscribe(
      res => {
        this.orderStatus = res; 
      },
      error => {
        console.log(error);
        this.toast.error('Something happend, please refresh the page', 'System Error', { positionClass: 'toast-top-right' });
      }
    );
  }


  markAsRepayed(itemID: string) {
    this.orderService.markItemAsRepayed(itemID).subscribe(
      result => {
        this.toast.success('Item marked as repayed!', 'Status Change', { positionClass: 'toast-top-right' });
        this.getPayments(true);
      },
      error => {
        console.log(error);
      }
    );
  }
  markAsRefunded(itemID: string) {
    this.orderService.markItemAsRefounded(itemID).subscribe(
      result => {
        this.toast.success('Item marked as refunded!', 'Status Change', { positionClass: 'toast-top-right' });
        this.getPayments(true);
      },
      error => {
        console.log(error);
      }
    );
  }

  isCancelled(status: string) {
    if (status === '5c06f4bf7650a503f4b731fd' || status === '5c017b5a47fb07027943a40c') {
      return true;
    } else {
      return false;
    }
  }
  clear() {
    this.getPayments(true);
  }
  searchByOrderNumber(order) {
    
    if (order !== '') {
      this.searchActive = true;
      this.orderService.getItemsPayedByOrderNumber(order).subscribe(
        res => {
          if (res['length'] > 0) {
            this.orders = res;
            this.showNoData = false;
          } else {
            this.showNoData = true;
          }
        },
        e => {
          console.log(e);
        }
      );
    }
  }

  updateStatus() {
    // let selectedStatus: string;
    const statusName: string = this.selectedStatus;
    const itemID: string = this.selectedItemID;

    this.orderService.updateStatus(this.selectedStatus, itemID, this.user).subscribe(
      result => {
        this.toast.success(`Item marked as ${statusName}!`, 'Status Change', { positionClass: 'toast-top-right' });
        jQuery('#confirmUpdateStatus').modal('hide');
        this.getPayments(true);
      },
      error => {
        console.log(error);
      }
    );
    console.log('status', this.selectedStatus);
    console.log('item', itemID);
  }

  noUpdate() {
    jQuery('#confirmUpdateStatus').modal('hide');
  }

  confirmUpdatestatus(selectedStatus, selectedItemID) {
    let nameIndex = this.orderStatus.findIndex(it=>{
      return it.id === selectedStatus;
    });
    this.selectedStatusName = nameIndex === -1 ? '' : this.orderStatus[nameIndex].status;
    this.selectedStatus = selectedStatus;
    this.selectedItemID = selectedItemID;
    jQuery('#confirmUpdateStatus').modal('show');
  }
}
