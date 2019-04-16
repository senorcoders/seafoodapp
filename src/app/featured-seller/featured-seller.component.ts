import { Component, OnInit } from '@angular/core';
import{ProductService} from '../services/product.service';
declare var jQuery:any;
import { ToastrService } from '../toast.service';

@Component({
  selector: 'app-featured-seller',
  templateUrl: './featured-seller.component.html',
  styleUrls: ['./featured-seller.component.scss']
})
export class FeaturedSellerComponent implements OnInit {

  products:any;
	stores:any;
	featureStores:any=[];
  featureLists:any;
  constructor(private productService:ProductService, private toast:ToastrService) { }

	ngOnInit() {
	  	jQuery('.stores').select2();
      this.getFeaturedList();
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
  getFeaturedList(){
    this.productService.getData('featuredseller').subscribe(
        result=>{
          this.featureLists=result
        },
        error=>{
          console.log(error)
        }
    )
  }
  addStore(id,value){
  	this.featureStores.push({id:id,name:value})
  }
  deleteFeatureStore(id){
  	this.featureStores.splice(id,1)
  }
  deletefeatureList(id){
    this.productService.deleteData('featuredseller/'+id).subscribe(
      result=>{
        this.showSuccess(result['name']+' has been deleted successfully')
        this.getFeaturedList();
      },
      err=>{
        this.showError('Something wrong happened, try again');
        console.log(err)
      }
    )
  }
  saveFeatures(){
  	this.featureStores.forEach((data)=>{
  		this.productService.saveData('featuredseller',data).subscribe(
  		result=>{
  			this.showSuccess('Featured Seller save')
        this.getFeaturedList();
  		},
  		error=>{
  			this.showError('Error, try again')
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
