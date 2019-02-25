import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { OrderService } from '../services/orders.service';
import { AuthenticationService } from '../services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../environments/environment';
declare var jQuery: any;

@Component({
  selector: 'app-admin-logistic-managment',
  templateUrl: './admin-logistic-managment.component.html',
  styleUrls: ['./admin-logistic-managment.component.scss']
})
export class AdminLogisticManagmentComponent implements OnInit {
  orders: any = [];
  orderStatus: any = [];
  status: any;
  newStatus: any;
  orderNumber: any;
  user: any;
  selectedStatus: string;
  selectedItemID: string;
  showNoData: boolean = false;
  rows:any =[];
  API: string = environment.apiURL;
  constructor(
    private orderService: OrderService,
    private productService: ProductService,
    private toast: ToastrService,
    private auth: AuthenticationService
  ) { }

  ngOnInit() {
    this.user = this.auth.getLoginData();
    this.status = '0';
    this.getManagement();
    this.getStatus();
  }

  getStatus() {
    this.orderService.getLogisticOrderStatus().subscribe(
      res => {
        this.orderStatus = res;
      },
      error => {
        console.log( error );
        this.toast.error('Something happend, please refresh the page', 'System Error', { positionClass: 'toast-top-right' });
      }
    );
  }


  getManagement(){
    this.productService.getData('api/shoppingcart/orderlogistic').subscribe(data => {
      console.log("Manag", data);
      this.rows = data;
    })

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
        this.getManagement();
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
