import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { OrderService } from '../services/orders.service';
import { AuthenticationService } from '../services/authentication.service';
import { ToastrService } from '../toast.service';
declare var jQuery: any;
@Component({
  selector: 'app-items-by-status',
  templateUrl: './items-by-status.component.html',
  styleUrls: ['./items-by-status.component.scss']
})
export class ItemsByStatusComponent implements OnInit {

  orders: any = [];
  orderStatus: any = [];
  status: any;
  newStatus: any;
  orderNumber: any;
  user: any;
  selectedStatus: string;
  selectedItemID: string;
  showNoData: boolean = false;
  itemID:any;
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
      this.orderService.getAllBuyerOrders( this.user['id'] ).subscribe(
        res => {
          console.log(res);
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
      this.orderService.getOrdersBuyerByStatus( this.user['id'], this.status ).subscribe(
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
      this.orderService.getOrdersBuyerByNumber( this.user['id'], this.orderNumber ).subscribe(
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
    } else if ( this.status !== '0' && this.orderNumber !== undefined || this.orderNumber !== '' ) {
      this.orderService.getOrdersBuyerByStatusAndNumber( this.user['id'], this.status, this.orderNumber ).subscribe(
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

  cancelItem( itemID: string ) {
    const cancelStatus = '5c017b5a47fb07027943a40c';
    this.orderService.updateStatus( cancelStatus, itemID, this.user ).subscribe(
      result => { 
        jQuery('#confirm').modal('hide');
        this.toast.success(`Item marked as Cancelled!` , 'Status Change', { positionClass: 'toast-top-right' });
      },
      error => {
        console.log( 'error' );
      }
    )
  }
  showModal(id){
    this.itemID=id;
    jQuery('#confirm').modal('show');
  }
  confirm(val){
    if(val){
      this.cancelItem(this.itemID)
    }
    else{
       jQuery('#confirm').modal('hide');
    }
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
      if(val.shoppingCart && val.shoppingCart.orderNumber){
        if(index>0){
          if(val.shoppingCart.orderNumber!=this.orderWithData[index-1].shoppingCart.orderNumber){
            this.groupOrder.push(val.shoppingCart.orderNumber)
          }
        }
        else{
          this.groupOrder.push(val.shoppingCart.orderNumber);
        }
      }
    })
    if(this.groupOrder.length==0){
      this.showNoData=true
    }
    else{
      this.showNoData = false;
    }
  }
}
