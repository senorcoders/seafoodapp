import { Component, OnInit } from '@angular/core';
import { OrderService  } from '../services/orders.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.scss']
})
export class AdminOrdersComponent implements OnInit {
  items:any
  constructor( private toast:ToastrService, private orderService:OrderService ) { }

  ngOnInit() {
    this.getItems();
  }

  getItems(){
    this.orderService.getSellerFulfillsOrders()
    .subscribe(
      result => {
        this.items = result;        
      },
      error => {
        console.log( error );
        this.showError( 'Something wrong happened, please refresh the page' )
      }
    )
  }
  showSuccess(s){
    this.toast.success(s, 'Well Done', { positionClass: "toast-top-right" })
  }
  showError(e){
    this.toast.error(e, 'Error', { positionClass: "toast-top-right" })
  }

}
