import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { OrderService } from '../services/orders.service';
import { AuthenticationService } from '../services/authentication.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-manage-orders',
  templateUrl: './manage-orders.component.html',
  styleUrls: ['./manage-orders.component.scss']
})
export class ManageOrdersComponent implements OnInit {

  orders: any = [];
  orderStatus: any = [];
  status: any;
  orderNumber: any;
  showNoData: boolean = false;

  constructor(
    private orderService: OrderService,
    private productService: ProductService,
    private toast: ToastrService,
    private auth: AuthenticationService
  ) { }

  ngOnInit() {
    this.status = '0';
    this.getStatus();
    this.getOrders();
  }

  clear() {
    this.status = '0';
    this.orderNumber = '';
    this.getOrders();
  }

  onItemChange( selectedItem: string ) {
    this.status = selectedItem;
    this.getOrders();
  }

  getOrders() {
    this.showNoData = false;
    console.log('status', this.status);
    console.log('orderNumber', this.orderNumber);
    this.orders = [];
    if (
        ( this.status === undefined && this.orderNumber === undefined) ||
        ( this.status === '0' && ( this.orderNumber === undefined || this.orderNumber === '' ) )
      ) {
      this.orderService.getAllOrders().subscribe(
        res => {
          if (res['length'] > 0) {
            this.orders = res;
            this.showNoData = false;
          } else {
            this.showNoData = true;
          }
        },
        error => {
          console.log( error );
          this.toast.error('Something happend, please refresh the page', 'System Error', { positionClass: 'toast-top-right' });
        }
      );
    } else if ( this.status !== '0' && ( this.orderNumber === undefined || this.orderNumber === '' ) ) {// by status
      this.orderService.getOrdersByStatus( this.status ).subscribe(
        res => {
          if (res['length'] > 0) {
            this.orders = res;
            this.showNoData = false;
          } else {
            this.showNoData = true;
          }
          console.log( res );
        },
        error => {
          console.log( error );
          this.toast.error('Something happend, please refresh the page', 'System Error', { positionClass: 'toast-top-right' });
        }
      );
    } else if ( ( this.orderNumber !== undefined || this.orderNumber > 0 ) &&  this.status === '0' ) {// by order number
      this.orderService.getOrdersByNumber( this.orderNumber ).subscribe(
        res => {
          if (res['length'] > 0) {
            this.orders = res;
            this.showNoData = false;
          } else {
            this.showNoData = true;
          }
          console.log( res );
        },
        error => {
          console.log( error );
          this.toast.error('Something happend, please refresh the page', 'System Error', { positionClass: 'toast-top-right' });
        }
      );
    } else if ( this.status !== '0' && this.orderNumber !== undefined || this.orderNumber !== '' ) {
      this.orderService.getOrdersByStatusAndNumber( this.status, this.orderNumber ).subscribe(
        res => {
          if (res['length'] > 0) {
            this.orders = res;
            this.showNoData = false;
          } else {
            this.showNoData = true;
          }
          console.log( res );
        },
        error => {
          console.log( error );
          this.toast.error('Something happend, please refresh the page', 'System Error', { positionClass: 'toast-top-right' });
        }
      );
    } else {
      this.orderService.getAllOrders().subscribe(
        res => {
          if (res['length'] > 0) {
            this.orders = res;
            this.showNoData = false;
          } else {
            this.showNoData = true;
          }
          console.log( res );
        },
        error => {
          console.log( error );
          this.toast.error('Something happend, please refresh the page', 'System Error', { positionClass: 'toast-top-right' });
        }
      );
    }
  }

  getStatus() {
    this.orderService.getOrderStatus().subscribe(
      res => {
        this.orderStatus = res;
      },
      error => {
        console.log( error );
        this.toast.error('Something happend, please refresh the page', 'System Error', { positionClass: 'toast-top-right' });
      }
    );
  }

  markAsRefounded( itemID: string ) {
    this.orderService.markItemAsRefounded( itemID ).subscribe(
      result => {
        this.toast.success('Item marked as Refounded!', 'Status Change', {positionClass: 'toast-top-right'});
        this.getOrders();
      },
      error => {
        console.log( error );
      }
    );
  }

  markAsRepayed(itemID: string) {
    this.orderService.markItemAsRepayed(itemID).subscribe(
      result => {
        this.toast.success('Item marked as out for delivery!', 'Status Change', { positionClass: 'toast-top-right' });
        this.getOrders();
      },
      error => {
        console.log(error);
      }
    );
  }

}
