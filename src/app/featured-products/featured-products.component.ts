import { Component, OnInit } from '@angular/core';
import{ProductService} from '../services/product.service';
declare var jQuery:any;
import { ToastrService } from '../toast.service';
@Component({
  selector: 'app-featured-products',
  templateUrl: './featured-products.component.html',
  styleUrls: ['./featured-products.component.scss']
})
export class FeaturedProductsComponent implements OnInit {
	products:any;
	stores:any;
	featureProducts:any=[];
  featuredLists:any;
  constructor(private productService:ProductService, private toast:ToastrService) { }

 ngOnInit() {
  	jQuery('.stores').select2();
    jQuery('.products').select2();
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
      this.getProducts(e.target.value);
    })
    jQuery('.products').on('change', (e)=>{
    	let name=jQuery(".products option:selected").text();
      this.addProduct(e.target.value,name);
    })
  }
  getFeaturedList(){
    this.productService.getData('featuredproducts').subscribe(
        result=>{
          this.featuredLists=result
        },
        error=>{
          console.log(error)
        }
    )
  }
  getProducts(data){
    this.productService.getData('store/' + data).subscribe(result => {
      this.products = result['fishs'];
      jQuery('.products').select2()
    })
  }
  addProduct(id,value){
  	console.log(id, value)
  	this.featureProducts.push({id:id,name:value})
  }
  deleteFeatureProduct(id){
  	this.featureProducts.splice(id,1)
  }
  deletefeaturedList(id){
    this.productService.deleteData('featuredproducts/'+id).subscribe(
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
  	this.featureProducts.forEach((data)=>{
  		this.productService.saveData('featuredproducts',data).subscribe(
  		result=>{
  			this.showSuccess('Featured Product save')
        this.getFeaturedList();
  		},
  		error=>{
  			this.showError('Error, try again')
  		}
	)
  	})
  	this.featureProducts=[];
  }
  showError(e){
  	this.toast.error(e,"Error",{positionClass:"toast-top-center"})
  }
  showSuccess(s){
  	this.toast.success(s,"Well Done",{positionClass:"toast-top-center"})
  }

}
