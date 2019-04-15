import { Component, OnInit } from '@angular/core';
import {ProductService} from '../services/product.service';
import { OrderService } from '../services/orders.service';
import {AuthenticationService} from '../services/authentication.service';
import { ToastrService } from '../toast.service';
import { TitleService } from '../title.service';

@Component({
  selector: 'app-admin-order-delivered',
  templateUrl: './admin-order-delivered.component.html',
  styleUrls: ['./admin-order-delivered.component.scss']
})
export class AdminOrderDeliveredComponent implements OnInit {

  orders: any = [];

  constructor( private orderService: OrderService, private productService: ProductService, 
    private toast: ToastrService, private auth: AuthenticationService, private titleS: TitleService) {
           this.titleS.setTitle('Delivered'); }

  ngOnInit() {
    this.getOrdersDelivered();
  }

  getOrdersDelivered() {
  	this.productService.getData( 'itemshopping/status/5c017b3c47fb07027943a409' ).subscribe(
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
        this.getOrdersDelivered();
      },
      error => {
        console.log( error );
      }
    );
  }

}
