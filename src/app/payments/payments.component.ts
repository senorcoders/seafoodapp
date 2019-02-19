import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { OrderService } from '../services/orders.service';
import { AuthenticationService } from '../services/authentication.service';
import { ToastrService } from 'ngx-toastr';

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
  selectedItemID: any;
  user: any;

  constructor(
    private orderService: OrderService,
    private productService: ProductService,
    private toast: ToastrService,
    private auth: AuthenticationService) { }

  ngOnInit() {
    this.user = this.auth.getLoginData();

    this.getPayments();
    this.getPaymentStatus();
  }

  getPayments() {
    this.orderService.getPayedItems().subscribe(
      result => {
        if (result['length'] > 0) {
          this.orders = result;
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

  getPaymentStatus() {
    this.orderService.getPaymentStatus().subscribe(
      res => {
        this.orderStatus = res;
      },
      error => {
        console.log( error );
        this.toast.error('Something happend, please refresh the page', 'System Error', { positionClass: 'toast-top-right' });
      }
    );
  }


  markAsRepayed(itemID: string) {
    this.orderService.markItemAsRepayed(itemID).subscribe(
      result => {
        this.toast.success('Item marked as repayed!', 'Status Change', { positionClass: 'toast-top-right' });
        this.getPayments();
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
        this.getPayments();
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
    this.getPayments();
  }
  searchByOrderNumber(order) {
    if (order !== '') {
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
      )
    }
  }

  updateStatus() {
    let selectedStatus: string;
    let statusName: string = this.selectedStatus;
    let itemID: string = this.selectedItemID;

    this.orderStatus.map( status => {
      if ( status.status === statusName ) {
        selectedStatus = status.id;
      }
    } );
    this.orderService.updateStatus( selectedStatus, itemID, this.user ).subscribe(
      result => {
        this.toast.success(`Item marked as ${statusName}!` , 'Status Change', { positionClass: 'toast-top-right' });
        jQuery('#confirmUpdateStatus').modal('hide');
        this.getPayments();
      },
      error => {
        console.log( error );
      }
    );
    console.log( 'status', selectedStatus );
    console.log( 'item', itemID );
  }
  noUpdate() {
    jQuery('#confirmUpdateStatus').modal('hide');
  }

  confirmUpdatestatus( selectedStatus, selectedItemID ) {
    this.selectedStatus = selectedStatus;
    this.selectedItemID = selectedItemID;
    jQuery('#confirmUpdateStatus').modal('show');
  }
}
