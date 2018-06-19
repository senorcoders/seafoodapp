import { Component, OnInit } from '@angular/core';
import{ProductService} from '../services/product.service';
declare var jQuery:any;
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-featured-seller',
  templateUrl: './featured-seller.component.html',
  styleUrls: ['./featured-seller.component.scss']
})
export class FeaturedSellerComponent implements OnInit {

  	products:any;
	stores:any;
	featureStores:any=[];
  	constructor(private productService:ProductService, private toast:ToastrService) { }

	ngOnInit() {
	  	jQuery('.stores').select2();
	  	this.productService.getData('api/store').subscribe(
	  		result => {
		      this.stores = result
	    	},
	    	error=>{
	    		console.log(error)
	    	}
	    )
	    jQuery('.stores').on('change', (e)=>{
	    	let name=jQuery(".stores option:selected").text();
	      	this.addStore(e.target.value, name);
	    })
  	}
  addStore(id,value){
  	console.log(id, value)
  	this.featureStores.push({id:id,name:value})
  }
  deleteFeatureStore(id){
  	this.featureStores.splice(id,1)
  }
  saveFeatures(){
  	this.featureStores.forEach((data)=>{
  		this.productService.saveData('featuredseller',data).subscribe(
  		result=>{
  			this.showSuccess('Featured Seller save')
  		},
  		error=>{
  			console.log('Error, try again')
  		}
	)
  	})
  	this.featureStores=[];
  }
  showError(e){
  	this.toast.error(e,"Error",{positionClass:"toast-top-center"})
  }
  showSuccess(s){
  	this.toast.success(s,"Well Done",{positionClass:"toast-top-center"})
  }

}
