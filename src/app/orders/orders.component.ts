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
	shoppingCarts:any=[];
	showLoading:boolean=true;
	showData:boolean=false;
	dates=[];
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
  	this.productService.getData(`api/cart/paid/${this.userData.id}`).subscribe(
  		result=>{
  			this.showLoading=false;
  			this.shoppingCarts=result
  			this.getDates();
  			this.showData=true
  		},
  		e=>{
  			console.log(e)
  		}
  	)
  }
  getDates(){
  	this.shoppingCarts.forEach((data, index)=>{
  		//convert date
  		let date=new Date(data.paidDateTime)
  		this.dates[index]=date.toString().split("GMT",1)
  	})
  }
}
