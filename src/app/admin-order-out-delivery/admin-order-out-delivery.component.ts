import { Component, OnInit } from '@angular/core';
import {ProductService} from '../services/product.service';
import { OrderService } from '../services/orders.service';
import {AuthenticationService} from '../services/authentication.service';
import { ToastrService } from '../toast.service';
import { TitleService } from '../title.service';

@Component({
  selector: 'app-admin-order-out-delivery',
  templateUrl: './admin-order-out-delivery.component.html',
  styleUrls: ['./admin-order-out-delivery.component.scss']
})
export class AdminOrderOutDeliveryComponent implements OnInit {

  orders:any = [];

  constructor( private orderService:OrderService, private productService:ProductService, 
    private toast:ToastrService, private auth:AuthenticationService,
    private titleS: TitleService) {     this.titleS.setTitle('Out Delivery'); }

  ngOnInit() {
    this.getOrdersOutForDelivery();
  }

  getOrdersOutForDelivery(){
  	this.productService.getData( 'itemshopping/status/5c017b2147fb07027943a408' ).subscribe(
  		result=>{
        this.orders = result;
        
  		},
  		e=>{
  			console.log(e)
  		}
  	)
  }
  markAsDelivered( itemID:string ){
    this.orderService.markItemAsDelivered( itemID ).subscribe(
      result => {        
        this.toast.success("Item marked as Delivered!",'Status Change',{positionClass:"toast-top-right"});
        this.getOrdersOutForDelivery();
      },
      error => {
        console.log( error );
      }
    )
  }

}
