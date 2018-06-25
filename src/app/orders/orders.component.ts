import { Component, OnInit } from '@angular/core';
import {ProductService} from '../services/product.service';
import { CartService } from '../core/cart/cart.service';
import {AuthenticationService} from '../services/authentication.service';
@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
	//buyer:string;
	userData:any;
	shoppingCarts:any;
	showLoading:boolean=true;
	showData:boolean=false;
  constructor(private productService: ProductService, private Cart: CartService, private auth:AuthenticationService) { }

  ngOnInit() {
  	// this.Cart.cart.subscribe((cart:any)=>{
  	// 	console.log(cart)
  	// 	if(cart){
  	// 		this.buyer=cart['id'];
  	// 		this.getCartPaid();
  	// 	}
  	// })
  	this.userData=this.auth.getLoginData()
  	this.getCartPaid();
  }
  getCartPaid(){
  	this.productService.getData(`shoppingcart/?where={"status":{"like":"paid"},"buyer":"${this.userData.id}"}`).subscribe(
  		result=>{
  			this.showLoading=false;
  			this.showData=true
  			this.shoppingCarts=result
  			console.log(this.shoppingCarts)
  		},
  		e=>{
  			console.log(e)
  		}
  	)
  }
}
