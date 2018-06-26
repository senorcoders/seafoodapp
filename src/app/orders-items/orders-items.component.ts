import { Component, OnInit } from '@angular/core';
import {ActivatedRoute,Router} from '@angular/router';
import { ProductService } from '../services/product.service';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-orders-items',
  templateUrl: './orders-items.component.html',
  styleUrls: ['./orders-items.component.scss']
})
export class OrdersItemsComponent implements OnInit {
	shoppingCartId:any;
	products:any;
	showLoading:boolean=true;
	showData:boolean=false;
	images=[];
	API="http://138.68.19.227:7000";
  constructor(private productService:ProductService, private router:ActivatedRoute,private auth:AuthenticationService) { }

  ngOnInit() {
  	this.router.params.subscribe(params => {
      this.shoppingCartId= this.router.snapshot.params['id'];
      this.getItems();
    })
  }
  getItems(){
    this.productService.getData(`api/items/${this.shoppingCartId}`).subscribe(
    	result => {
    		this.products=result;
    		this.showLoading=false;
    		this.showData=true
    		this.getImages();
      		console.log(result)
    	},
    	e=>{console.log(e)}
    )
  }
  getImages(){
  	this.products.forEach((data, index)=>{
  		if(data.fish.imagePrimary && data.fish.imagePrimary!=''){
  			this.images[index]=this.API+data.fish.imagePrimary;
  		}
  		else if(data.fish.images && data.fish.images!=''){
  			this.images[index]=this.API+data.fish.images[0].src;
  		}
  		else{
  			this.images[index]="../../assets/default-img-product.jpg";
  		}
  	})
  	console.log(this.images)
  }
}
