import { Component, OnInit } from '@angular/core';
import {ProductService} from '../services/product.service';
import { OrderService } from '../services/orders.service';
import {AuthenticationService} from '../services/authentication.service';
import { ToastrService } from '../toast.service';

@Component({
  selector: 'app-admin-orders-shipped',
  templateUrl: './admin-orders-shipped.component.html',
  styleUrls: ['./admin-orders-shipped.component.scss']
})
export class AdminOrdersShippedComponent implements OnInit {

  orders:any = [];

  constructor( private orderService:OrderService, private productService:ProductService, 
    private toast:ToastrService, private auth:AuthenticationService) { }

  ngOnInit() {
    this.getOrdersShipped();
  }

  getOrdersShipped(){
  	this.productService.getData( 'itemshopping/status/5c017b0e47fb07027943a406' ).subscribe(
  		result=>{
        this.orders = result;
        
  		},
  		e=>{
  			console.log(e)
  		}
  	)
  }
  markAsArrived( itemID:string ){
    this.orderService.markItemAsArrived( itemID ).subscribe(
      result => {        
        this.toast.success("Item marked as Arrived!",'Status Change',{positionClass:"toast-top-right"});
        this.getOrdersShipped();
      },
      error => {
        console.log( error );
      }
    )
  }

}
