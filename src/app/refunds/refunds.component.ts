import { Component, OnInit } from '@angular/core';
import {ProductService} from '../services/product.service';
import { OrderService } from '../services/orders.service';
import {AuthenticationService} from '../services/authentication.service';
import { ToastrService } from '../toast.service';

@Component({
  selector: 'app-refunds',
  templateUrl: './refunds.component.html',
  styleUrls: ['./refunds.component.scss']
})
export class RefundsComponent implements OnInit {

  orders: any = [];

  constructor(
    private orderService: OrderService,
    private productService: ProductService,
    private toast: ToastrService,
    private auth: AuthenticationService
  ) { }

 ngOnInit() {
    this.getRefundItems();
  }

  getRefundItems() {
  	this.productService.getData( 'itemshopping/status/5c017b7047fb07027943a40e' ).subscribe(
  		result => {
        this.orders = result;

  		},
  		e => {
  			console.log(e);
  		}
  	);
  }

}
