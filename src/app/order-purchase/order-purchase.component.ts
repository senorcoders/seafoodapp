import { Component, OnInit } from '@angular/core';
import {ProductService} from '../services/product.service';
import {AuthenticationService} from '../services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import {FormBuilder, FormGroup} from '@angular/forms';

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
	showPopup:boolean=false;
	trackingForm:FormGroup;
	fileToUpload:any= [];
	showButton:boolean=true;
	showTrackingFile:boolean=false;
	API="https://apiseafood.senorcoders.com";
  constructor(private fb:FormBuilder,private route: ActivatedRoute, private productS:ProductService, private toast:ToastrService, private auth:AuthenticationService) {
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
  				this.item=result;
  				this.showLoading=false;
  				this.showProduct=true;
  				//convert date
		  		let date=new Date(result['shoppingCart'].paidDateTime)
		  		this.date=date.toString().split("GMT",1)
		  		//hide or show button
		  		if(result['shippingStatus']=="shipped"){
		  			this.showButton=false;
		  		}
		  		//show or hide tracking image
		  		if(result['trackingFile']!=""){
		  			this.showTrackingFile=true
		  		}
		  		else{
		  			this.showTrackingFile=false
		  		}
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
  	this.productS.setShippedProduct('api/itemshopping/status/'+this.itemId).subscribe(
  		result=>{
  			this.toast.success('Product Shipped','Well Done',{positionClass:"toast-top-right"})
  			this.getItem();
  			this.closeForm();
  			this.showButton=false;
  		},
  		e=>{
  			this.toast.error('Something wrong happened, please try again','Error',{positionClass:"toast-top-right"})
  		}
  	)
  }
  // setPending(){
  // 	let data={
  // 		shippingStatus:"pending"
  // 	}
  // 	this.productS.updateData('itemshopping/'+this.itemId, data).subscribe(
  // 		result=>{
  // 			this.toast.success('Product Mark like pending','Well Done',{positionClass:"toast-top-right"})
  // 			this.getItem();
  // 		},
  // 		e=>{
  // 			this.toast.error('Something wrong happened, please try again','Error',{positionClass:"toast-top-right"})
  // 		}
  // 	)
  // }
  showPopupForm(){
  	this.trackingForm=this.fb.group({
  		code:['']
  	})
  	this.showPopup=true;
  }
  handleFileInput(files: FileList) {
    this.fileToUpload = files;
  }
  sendTracking(){
  	if(this.trackingForm.get('code').value !='' || this.fileToUpload!=''){
  		if(this.fileToUpload!=''){
  			this.uploadFile()
  		}
  		if(this.trackingForm.get('code').value !=''){
			let data = {
				trackingID: this.trackingForm.get('code').value,
			}
			this.productS.updateData('itemshopping/' + this.itemId, data).subscribe(
				result => {
					this.setShipped();
				},
				e => {
					console.log(e)
					this.toast.error('Something wrong happened, please try again', 'Error', { positionClass: "toast-top-right" })

				}
			)
		}
  		this.closeForm();
  	}
  	else{
  		this.toast.error('You have to add a code or a code picture','Error',{positionClass:"toast-top-right"})
  	}
  }
	uploadFile(){
	    if(this.fileToUpload.length>0){
	      this.productS.uploadFile('api/itemshopping/trackingfile/'+this.itemId, "file", this.fileToUpload).subscribe(result => {
	        this.toast.success("Your tracking's Image has been upload successfully!",'Well Done',{positionClass:"toast-top-right"})
	      }, error => {
	        this.toast.error("Something wrong happened, please try again", "Error",{positionClass:"toast-top-right"} );
	      })
	    }
	}
	closeForm(){
		this.showPopup=false;
	}
}
