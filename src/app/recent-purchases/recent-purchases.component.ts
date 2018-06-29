import { Component, OnInit } from '@angular/core';
import {ProductService} from '../services/product.service';
import {AuthenticationService} from '../services/authentication.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-recent-purchases',
  templateUrl: './recent-purchases.component.html',
  styleUrls: ['./recent-purchases.component.scss']
})
export class RecentPurchasesComponent implements OnInit {
	user:any;
	items:any;
	storeID:string;
	dates=[];
	firstShipped=[];
	shipped:any;
	datesShipping=[];
	showMore:boolean=false;
	showLess:boolean=false;
	showLoading:boolean=true;
	showProduct:boolean=false;
	showShipped:boolean=false;
  constructor(private productS:ProductService, private toast:ToastrService, private auth:AuthenticationService) { }

  ngOnInit() {
  	this.user=this.auth.getLoginData();
  	this.getStore();
  }
  getStore(){
  	this.productS.getData('api/store/user/'+this.user.id).subscribe(
  		result=>{
  			this.storeID=result[0].id;
  			this.getPurchases();
  			this.getPurchasesShipped();
  		},
  		e=>{
  			console.log(e)
  		}
  	)
  }
  getPurchases(){
  	this.productS.getData('api/store/fish/paid/'+this.storeID).subscribe(
  		result=>{
  			if(result && result!=''){
				this.items = result;
				this.showLoading = false;
				this.showProduct = true
				this.getDates();
  			}
  			else{
  				this.showProduct=false
  				this.showLoading=false
  			}
  		},
  		e=>{
  			console.log(e)
  		}
  	)
  }
  getPurchasesShipped(){
  	this.productS.getData('api/store/fish/items/paid/'+this.storeID).subscribe(
  		result=>{
  			if(result && result!=''){
  				this.shipped=result;
  				this.showShipped=true;
  				this.getFirstPurchases();
  				this.getDatesShipped();
  			}
  			else{
  				this.showShipped=false
  			}
  		},
  		e=>{
  			console.log(e)
  		}
  	)
  }
  getFirstPurchases(){
    this.firstShipped=[]
    this.shipped.forEach((data,index)=>{
      if(index<=10){
        this.firstShipped[index]=data;
      }
    })
    if(this.shipped.length>10){
      this.showMore=true
      this.showLess=false
    }
    else{
      this.showMore=false
      this.showLess=false
    }
  }
  getAllPurchases(){
    this.showMore=false;
    this.showLess=true;
    this.firstShipped=this.shipped
  }
  getDates(){
  	this.items.forEach((data, index)=>{
  		//convert date
  		let date=new Date(data.shoppingCart.paidDateTime)
  		this.dates[index]=date.toString().split("GMT",1)
  	})
  }
  getDatesShipped(){
  	this.shipped.forEach((data, index)=>{
  		//convert date
  		let date=new Date(data.shoppingCart.paidDateTime)
  		this.datesShipping[index]=date.toString().split("GMT",1)
  	})
  }
}
