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
            let data:any=result
            let order=[];
            this.trimmings=result;
            // data.forEach((res, index)=>{
            //   if(index>0){
            //     console.log(order.includes(res.trimmingType.id))
            //     if(order.includes(res.trimmingType.id)==false){
            //       order.push(res)
            //     }
            //   }
            //   else{
            //     order.push(res)
            //   }
            // })
            // console.log(order)
            // this.store=result[0];
            // if(result['length']>0){
            //   this.myform=this.fb.group({
            //     trimmingType:[this.store.processingParts.id, Validators.required],
              // processingParts:[this.store.trimmingType.id, Validators.required]
            //   })
            // }
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
  saveData(){
  	let data={
  		"processingParts": this.myform.get('processingParts').value,
	    "store": this.storeID,
	    "trimmingType": this.myform.get('trimmingType').value
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
    console.log(id)
  }
}
