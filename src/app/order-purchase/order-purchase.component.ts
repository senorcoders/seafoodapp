import { Component, OnInit } from '@angular/core';
import {ProductService} from '../services/product.service';
import {AuthenticationService} from '../services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-order-purchase',
  templateUrl: './order-purchase.component.html',
  styleUrls: ['./order-purchase.component.scss']
})
export class OrderPurchaseComponent implements OnInit {
	item:any;
	date:any;
	itemId:any;
	showLoading:boolean=true;
	showProduct:boolean=false;
  constructor(private route: ActivatedRoute, private productS:ProductService, private toast:ToastrService, private auth:AuthenticationService) {
  	this.route.params.subscribe(params => {
	      this.itemId=(this.route.snapshot.params['item']);
	}) 
  }

  ngOnInit() {
  	this.getItem();
  }
  getItem(){
  	this.productS.getData('itemshopping/'+this.itemId).subscribe(
  		result=>{
  			if(result && result!=''){
  				console.log(result)
  				this.item=result;
  				this.showLoading=false;
  				this.showProduct=true;
  				//convert date
		  		let date=new Date(result['shoppingCart'].paidDateTime)
		  		this.date=date.toString().split("GMT",1)

  			}else{
  				this.showLoading=false
  				this.showProduct=false;
  			}
  		},
  		e=>{
  			this.showProduct=false
  			console.log(e)
  		}
  	)
  }
  setShipped(){
  	let data={
  		shippingStatus:"shipped"
  	}
  	this.productS.updateData('itemshopping/'+this.itemId, data).subscribe(
  		result=>{
  			this.toast.success('Product Shipped','Well Done',{positionClass:"toast-top-right"})
  			this.getItem();
  		},
  		e=>{
  			this.toast.error('Something wrong happened, please try again','Error',{positionClass:"toast-top-right"})
  		}
  	)
  }
  setPending(){
  	let data={
  		shippingStatus:"pending"
  	}
  	this.productS.updateData('itemshopping/'+this.itemId, data).subscribe(
  		result=>{
  			this.toast.success('Product Mark like pending','Well Done',{positionClass:"toast-top-right"})
  			this.getItem();
  		},
  		e=>{
  			this.toast.error('Something wrong happened, please try again','Error',{positionClass:"toast-top-right"})
  		}
  	)
  }
}
