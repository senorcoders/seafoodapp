import { Component, OnInit } from '@angular/core';
import{ProductService} from '../services/product.service';
declare var jQuery:any;
import { ToastrService } from '../toast.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-featured-types',
  templateUrl: './featured-types.component.html',
  styleUrls: ['./featured-types.component.scss']
})
export class FeaturedTypesComponent implements OnInit {
  types:any;
  API:string=environment.apiURLImg;
  showNotFound=false;
  showLoading:boolean=true;
  owner:any;
  featuredtypes:any;
  featuredLists:any=[];
  constructor(private product: ProductService, private toast:ToastrService) { }

 ngOnInit() {
	jQuery('.types').select2();
    this.getFeaturedList();
  	this.getFishType()
    jQuery('.types').on('change', (e)=>{
    	let name=jQuery(".types option:selected").text();
      	this.addTypes(e.target.value,name);
    })
  }
  addTypes(id,name){
  	this.featuredLists.push({featuredsID:id,name:name})
  }
  deleteFeatureStore(id){
  	this.featuredLists.splice(id,1)
  }
  getFeaturedList(){
	this.product.getData('featuredtypes/').subscribe(
      result=>{
        this.featuredtypes=result['featureds'];
        this.showLoading=false;
        if(this.featuredtypes.length==0){
          this.showNotFound=true;
        }
        else{
          this.showNotFound=false;
        }
      },
      error=>{
        console.log(error)
      }
    )
  }
  getFishType(){
  	this.product.getData('FishType/').subscribe(
  		result=>{
  			this.types=result
  		},
  		e=>{
  			console.log(e)
  		}
  	)
  }
  deletefeatureList(index){
  	let featuredsID={"featuredsID":[]};
  	this.featuredtypes.forEach((data)=>{
  		featuredsID["featuredsID"].push(data.id)
  	})
  	featuredsID.featuredsID.splice(index,1);
    this.product.saveData('featuredtypes/',featuredsID).subscribe(
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
  	let featuredsID={"featuredsID":[]};
  	this.featuredtypes.forEach((data)=>{
  		featuredsID["featuredsID"].push(data.id)
  	})
  	this.featuredLists.forEach((data)=>{
  		featuredsID["featuredsID"].push(data.featuredsID)
  	})
  	this.product.saveData('featuredtypes',featuredsID).subscribe(
	  		result=>{
	  			console.log(result)
	  			this.showSuccess('Featured Types save')
	        	this.getFeaturedList();
	  		},
	  		error=>{
	  			this.showError('Error, try again')
	  		}
		)
  	this.featuredLists=[];
  }
   showError(e){
    this.toast.error(e,'Error',{positionClass:"toast-top-right"})
  }
  showSuccess(e){
    this.toast.success(e,'Well Done',{positionClass:"toast-top-right"})
  }

}
