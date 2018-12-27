import { Component, OnInit } from '@angular/core';
import {ProductService} from '../services/product.service';
import { OrderService } from '../services/orders.service';
import {AuthenticationService} from '../services/authentication.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-repayments',
  templateUrl: './repayments.component.html',
  styleUrls: ['./repayments.component.scss']
})
export class RepaymentsComponent implements OnInit {

  orders: any = [];

  constructor(
    private orderService: OrderService,
    private productService: ProductService,
    private toast: ToastrService,
    private auth: AuthenticationService
  ) { }

  ngOnInit() {
    this.getOrdersRepaids();
  }

  getOrdersRepaids() {
  	this.productService.getData( 'itemshopping/status/5c017b4f47fb07027943a40b' ).subscribe(
  		result => {
        this.orders = result;

  		},
  		e => {
  			console.log(e);
  		}
  	);
  }

}
