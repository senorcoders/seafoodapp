import { Component, OnInit } from '@angular/core';
import {ProductService} from '../services/product.service';
import { OrderService } from '../services/orders.service';
import {AuthenticationService} from '../services/authentication.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-refund-cases',
  templateUrl: './refund-cases.component.html',
  styleUrls: ['./refund-cases.component.scss']
})
export class RefundCasesComponent implements OnInit {
  
  orders: any = [];

  constructor(
    private orderService: OrderService,
    private productService: ProductService,
    private toast: ToastrService,
    private auth: AuthenticationService
  ) { }

  ngOnInit() {
    this.getCancelItems();
  }

  getCancelItems() {
  	this.orderService.getCanceledItems().subscribe(
  		result => {
        this.orders = result;

  		},
  		e => {
  			console.log(e);
  		}
  	);
  }
  markAsRefounded( itemID: string ) {
    this.orderService.markItemAsRefounded( itemID ).subscribe(
      result => {
        this.toast.success('Item marked as Refounded!', 'Status Change', {positionClass: 'toast-top-right'});
        this.getCancelItems();
      },
      error => {
        console.log( error );
      }
    );
  }

}
