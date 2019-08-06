import { Component, OnInit } from '@angular/core';
import{ProductService} from '../services/product.service';
declare var jQuery:any;
import { ToastrService } from '../toast.service';

@Component({
  selector: 'app-fish-type-menu',
  templateUrl: './fish-type-menu.component.html',
  styleUrls: ['./fish-type-menu.component.scss']
})
export class FishTypeMenuComponent implements OnInit {
	types:any;
	fishMenu:any;
	menuList:any=[];
	menuListSaved:any=[];
	child:string;
	parent:string;
  constructor(private product: ProductService, private toast:ToastrService) { }

 ngOnInit() {
  	jQuery('.types').select2();
  	 jQuery('.child').select2();
  	this.getFishType()
  	this.getMenuList()
    jQuery('.types').on('change', (e)=>{
    	let name=jQuery(".types option:selected").text();
      	//this.typeSelected=e.target.value;
      	this.addToList(e.target.value, name)
    })
    jQuery('.child').on('change', (e)=>{
      	this.child=e.target.value
    })
  }
  getFishType(){
  	this.product.getData('FishType?limit=100').subscribe(
  		result=>{
  			this.types=result
  		},
  		e=>{
  			console.log(e)
  		}
  	)
  }
  getMenuList(){
  	// this.product.getData('featuredtypes-menu/').subscribe(
  	// 	result=>{
  	// 		this.menuListSaved=result
  	// 	},
  	// 	e=>{
  	// 		console.log(e)
  	// 	}
  	// )
  }
  selectParent(id){
  	this.parent=id;
  }
  addChild(){
  	if(this.child!=''){
  		let data={
  			"parent":this.parent,
  			"child":this.child
  		}
  		this.product.saveData('parenttype',data).subscribe(
  			result=>{
  				this.parent='';
  				this.child='';
  				jQuery('#addChild').modal('toggle');
  				this.getMenuList()
  				this.showSuccess('child added')
  			},
  			e=>{
  				console.log(e);
  				this.showError('error try again')
  			}
  		)
  	}
  	else{
  		this.showError('Choose a child')
  	}

  }
  addToList(id,name){
  	let data={
  		id:id,
  		name:name
  	}
  	this.menuList.push(data);
  }
  saveMenuItems(){
	this.menuList.forEach((data)=>{
	  	this.menuListSaved["featuredsID"].push(data.id)
	 })
	let featuredsID={"featuredsID":this.menuListSaved["featuredsID"]};
  	this.product.saveData('featuredtypes-menu',featuredsID).subscribe(
  		result=>{
  			this.menuListSaved=result;
  			this.showSuccess('Menu items save')
  		},
  		error=>{
  			console.log(error)
  			this.showError('Error, try again')
  		}
	)
  	this.menuList=[];
  }
  deleteMenuItem(i){
  	this.menuList.splice(i,1)
  }
  deleteMenuList(i){
  	this.menuListSaved.featuredsID.splice(i,1);
    this.product.saveData('featuredtypes-menu/',this.menuListSaved).subscribe(
      result=>{
        this.showSuccess('Menu item has been deleted successfully')
        this.menuListSaved=result;
      },
      err=>{
        this.showError('Something wrong happened, try again');
        console.log(err)
      }
    )
  }
  deleteChild(id){
  	this.product.deleteData('parenttype/'+id).subscribe(
  		result=>{
  			this.showSuccess('item deleted')
  			console.log(result)
  			this.getMenuList()
  		},
  		e=>{
  			console.log(e)
  			this.showError('something wrong happened. Please try again')
  		}
  	)
  }
  showError(e){
    this.toast.error(e,'Error',{positionClass:"toast-top-right"})
  }
  showSuccess(e){
    this.toast.success(e,'Well Done',{positionClass:"toast-top-right"})
  }
}
