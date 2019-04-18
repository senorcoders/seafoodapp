import { Component, OnInit } from '@angular/core';
import {ProductService} from '../services/product.service';
import { OrderService } from '../services/orders.service';
import {AuthenticationService} from '../services/authentication.service';
import { ToastrService } from '../toast.service';

@Component({
  selector: 'app-admin-order-arrived',
  templateUrl: './admin-order-arrived.component.html',
  styleUrls: ['./admin-order-arrived.component.scss']
})
export class AdminOrderArrivedComponent implements OnInit {

  orders: any = [];

  constructor(
    private orderService: OrderService,
    private productService: ProductService,
    private toast: ToastrService) {}

  ngOnInit() {
    this.getOrdersArrived();
  }

  getOrdersArrived() {
  	this.productService.getData( 'itemshopping/status/5c017b1447fb07027943a407' ).subscribe(
  		result => {
        this.orders = result;

  		},
  		e => {
  			console.log(e);
  		}
  	);
  }
  markAsOutForDelivered( itemID: string ) {
    this.orderService.markItemAsOutForDelivery( itemID ).subscribe(
      result => {
        this.toast.success('Item marked as out for delivery!', 'Status Change', {positionClass: 'toast-top-right'});
        this.getOrdersArrived();
      },
      error => {
        console.log( error );
      }
    );
  }

}
