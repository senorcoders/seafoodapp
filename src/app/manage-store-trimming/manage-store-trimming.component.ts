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
        this.getTrimmingByStore()
  		},
  		e=>{
  			console.log(e)
  		}
  	)
  }
  getTrimmingByStore(){
    this.service.getData('storeTrimming/store/'+this.storeID).subscribe(
          result=>{
            this.trimmings=result;
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
  			this.toast.success("Trimmings Saved!",'Well Done',{positionClass:"toast-top-right"})
        this.getTrimmingByStore();
  		},
  		e=>{
  			this.toast.error("Please try again",'Error',{positionClass:"toast-top-right"})
  			console.log(e)
  		}
	)
  }
  delete(id){
    this.service.deleteData('storeTrimming/'+id).subscribe(
      res=>{
        this.toast.success("Trimmings Saved!",'Well Done',{positionClass:"toast-top-right"})
        this.getTrimmingByStore();
      },
      e=>{
        this.toast.error("Please try again",'Error',{positionClass:"toast-top-right"})
        console.log(e)
      }
    )
  }
  checked($event,type,part){
    let id;
    this.trimmings.forEach(res=>{
      if(type==res.trimmingType){
        if(part==res.processingParts.id){
          id=res.id
        }
      }
    })
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
