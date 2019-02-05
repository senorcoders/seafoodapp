import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { OrderService } from '../services/orders.service';
import { AuthenticationService } from '../services/authentication.service';
import { ToastrService } from 'ngx-toastr';
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
  groupOrder=[];
  orderWithData=[];
  constructor(
    private orderService: OrderService,
    private productService: ProductService,
    private toast: ToastrService,
    private auth: AuthenticationService
  ) { }

  ngOnInit() {
    this.user = this.auth.getLoginData();
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
    //this.orders = [];
    if (
        ( this.status === undefined && this.orderNumber === undefined) ||
        ( this.status === '0' && ( this.orderNumber === undefined || this.orderNumber === '' ) )
      ) {
      this.orderService.getAllOrders().subscribe(
        res => {
          if (res['length'] > 0) {
            this.orders = res;
            this.showNoData = false;
            this.groupByOrders(res)
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
            this.groupByOrders(res)
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
            this.groupByOrders(res);
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
            this.groupByOrders(res);
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
        this.toast.success('Item marked as Repayed!', 'Status Change', { positionClass: 'toast-top-right' });
        this.getOrders();
      },
      error => {
        console.log(error);
      }
    );
  }

  fullfillSubmit(itemid){
    this.orderService.markItemAsShipped(itemid)
    .subscribe(
      result => {
        console.log( result );
        this.toast.success('Item marked as shipped!', 'Status Change', { positionClass: 'toast-top-right' });
        this.getOrders();
      },
      error => {
        console.log( error );
      }
    );
  }

  markAsArrived( itemID: string ) {
    this.orderService.markItemAsArrived( itemID ).subscribe(
      result => {
        this.toast.success('Item marked as arrived!', 'Status Change', { positionClass: 'toast-top-right' });
        this.getOrders();
      },
      error => {
        console.log( error );
      }
    );
  }

  markAsOutForDelivered( itemID: string ) {
    this.orderService.markItemAsOutForDelivery( itemID ).subscribe(
      result => {
        this.toast.success('Item marked as out for delivery!', 'Status Change', {positionClass: 'toast-top-right'});
        this.getOrders();
      },
      error => {
        console.log( error );
      }
    );
  }

  markAsDelivered( itemID: string ){
    this.orderService.markItemAsDelivered( itemID ).subscribe(
      result => {
        this.toast.success('Item marked as delivered!', 'Status Change', { positionClass: 'toast-top-right' });
        this.getOrders();
      },
      error => {
        console.log( error );
      }
    );
  }

  confirmUpdatestatus( selectedStatus, selectedItemID ) {
    this.selectedStatus = selectedStatus;
    this.selectedItemID = selectedItemID;
    jQuery('#confirmUpdateStatus').modal('show');
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
        this.getOrders();
        jQuery('#confirmUpdateStatus').modal('hide');
      },
      error => {
        console.log( error );
      }
    );
    console.log( 'status', selectedStatus );
    console.log( 'item', itemID );
  }
  noUpdate(){
    jQuery('#confirmUpdateStatus').modal('hide');
  }
  groupByOrders(orders){
    this.groupOrder=[];
    this.orderWithData=[];
    //get order with products.
    this.orders.forEach((val)=>{
      if(val.fish && val.fish!=''){
        this.orderWithData.push(val)
      }
    })
    //group by orderNumber
    this.orderWithData.forEach((val,index)=>{
      console.log(val);
      if(val.shoppingCart && val.shoppingCart.orderNumber){
        if(index>0){
          if(val.shoppingCart.orderNumber!=this.orderWithData[index-1].shoppingCart.orderNumber){
            this.groupOrder.push( { orderNumber: val.shoppingCart.orderNumber, xeroRef: val.shoppingCart.xeroRef } );
          }
        }
        else{
          this.groupOrder.push( { orderNumber: val.shoppingCart.orderNumber, xeroRef: val.shoppingCart.xeroRef } );
        }
      }
    })
    console.log( this.groupOrder );
    if(this.groupOrder.length==0){
      this.showNoData=true
    }
    else{
      this.showNoData = false;
    }
  }

  syncXero() {
    this.orderService.syncOrdersWithXeroInvoiceService().subscribe(
      result => {
        this.toast.success(`${result['ordersUpdated']} order has been sync with Xero Invoice Service `, 
        'Xero Sync', {positionClass: 'toast-top-right'});
      }, error => {
        this.toast.error('something wrong happend, please refresh the page', 'Status Change', {positionClass: 'toast-top-right'});
      }
    );
  }
}
