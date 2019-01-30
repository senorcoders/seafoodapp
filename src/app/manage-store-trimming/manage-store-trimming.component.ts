import { Component, OnInit } from '@angular/core';
import {ReactiveFormsModule,FormsModule,FormGroup,FormControl, Validators, FormBuilder} from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { ProductService } from '../services/product.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-manage-store-trimming',
  templateUrl: './manage-store-trimming.component.html',
  styleUrls: ['./manage-store-trimming.component.scss']
})
export class ManageStoreTrimmingComponent implements OnInit {
	types:any;
	parts:any;
	info:any;
	storeID:any;
	myform: FormGroup;
	store:any;
  trimmings:any;
  groupOrder=[];
  showNoData:boolean=false;
  default=[2,3,4,3,5];
  constructor(private service:ProductService, private auth:AuthenticationService, private fb:FormBuilder,private toast:ToastrService) { }

  ngOnInit() {
  	this.myform=this.fb.group({
  		trimmingType:['', Validators.required],
		processingParts:['', Validators.required]
  	})
  	this.getPersonalData()
  	this.getParts();
  	this.getTrimming();
  }
  getPersonalData(){
    this.info = this.auth.getLoginData();
    this.getStoreData();
  }
  getStoreData(){
  	this.service.getData('api/store/user/'+this.info.id).subscribe(
  		res=>{
  			this.storeID=res[0].id;
        console.log(res)
        this.getTrimmingByStore()
  		},
  		e=>{
  			console.log(e)
  		}
  	)
  	//this.trimmingType=this.info.
  }
  getTrimmingByStore(){
    this.service.getData('storeTrimming/store/'+this.storeID).subscribe(
          result=>{
            console.log(result)
            this.trimmings=result;
            // this.orderData()
          },
          e=>{
            console.log(e)
          }
        )
  }
  getTrimming(){
  	this.service.getData('trimmingtype').subscribe(
  		result=>{
  			this.types=result;
  			console.log(result)
  		},
  		e=>{
  			console.log(e)
  		}
  	)
  }
  getParts(){
  	this.service.getData('processingParts').subscribe(
  		result=>{
  			this.parts=result;
  			console.log(result)
  		},
  		e=>{
  			console.log(e)
  		}
  	)
  }
  saveData(types,parts){
  	let data={
  		"processingParts": parts,
	    "store": this.storeID,
	    "trimmingType": types
	}
  	this.service.saveData('storeTrimming',data).subscribe(
  		res=>{
  			this.toast.success("Your Store information has been updated successfully!",'Well Done',{positionClass:"toast-top-right"})
  			console.log(res)
        this.getTrimmingByStore();
  		},
  		e=>{
  			this.toast.error("Something wrong happened. Please try again",'Error',{positionClass:"toast-top-right"})
  			console.log(e)
  		}
	)
  }
  delete(id){
    this.service.deleteData('storeTrimming/'+id).subscribe(
      res=>{
        this.toast.success("Trimming deleted successfully!",'Well Done',{positionClass:"toast-top-right"})
        this.getTrimmingByStore();
      },
      e=>{
        this.toast.error("Something wrong happened. Please try again",'Error',{positionClass:"toast-top-right"})
        console.log(e)
      }
    )
  }
  orderData(){
    this.groupOrder=[];
    //group by orderNumber
    this.trimmings.forEach((val,index)=>{
      console.log(val.type[0])
      if(index>0){
      //   console.log(this.groupOrder)
      //   console.log(this.groupOrder[index-1])
        if(val.type[0].id!=this.groupOrder[index-1].id){
          console.log('si')
          this.groupOrder.push(val.type[0])
        }
        else{
          console.log('no')
        }
      }
      else{
         this.groupOrder.push(val.type[0]);
      }
    })
    console.log(this.groupOrder)
    // if(this.groupOrder.length==0){
    //   this.showNoData=true
    // }
    // else{
    //   this.showNoData = false;
    // }
  }
  checked($event,type,part){
    console.log($event)
    console.log(type)
    console.log(part)
    let id;
    this.trimmings.forEach(res=>{
      if(type==res.trimmingType){
        if(part==res.processingParts.id){
          id=res.id
        }
      }
    })
    console.log(id)
    if($event.target.checked){
      this.saveData(type,part);
    }
    else{
      this.delete(id)
    }
  }
  checkData(type,part){
    let val;
    this.trimmings.forEach(res=>{
      if(type==res.trimmingType){
        if(part==res.processingParts.id){
          val=true;
        }
      }
    })
    return val;
  }
}
