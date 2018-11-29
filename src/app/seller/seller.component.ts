import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../services/authentication.service';
import {ProductService} from '../services/product.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
@Component({
  selector: 'app-seller',
  templateUrl: './seller.component.html',
  styleUrls: ['./seller.component.scss']
})
export class SellerComponent implements OnInit {
	users:any;
	showLoading:boolean=true;
	sellerForm:FormGroup;
	user:any;
	countries=environment.countries;
  constructor(private auth: AuthenticationService, private toast: ToastrService,
   private router:Router, private fb:FormBuilder, private product:ProductService) { }

  ngOnInit() {
  	this.getUsers()
  	this.sellerForm=this.fb.group({
  		firstName:['',Validators.required],
		lastName: ['', Validators.required],
		country: ['', Validators.required],
		firstMileCost: [''],
		email: ['', [Validators.email, Validators.required]],
		tel: [''],
		uploadTradeLicense: [''],
		fullBakingInfo: [''],
		sfsAgreementForm: [''],
		ifLocal: [''],
  	})
  }
  userForm(){
  	this.sellerForm=this.fb.group({
  		firstName:[this.user.firstName,Validators.required],
		lastName: [this.user.lastName, Validators.required],
		country: [this.user.country, Validators.required],
		firstMileCost: [this.user.firstMileCost ],
		email: [this.user.email, [Validators.email, Validators.required]],
		tel: [this.user.dataExtra.tel],
		uploadTradeLicense: [this.user.dataExtra.uploadTradeLicense],
		fullBakingInfo: [this.user.dataExtra.fullBakingInfo],
		sfsAgreementForm: [''],
		ifLocal: [this.user.dataExtra.ifLocal],
  	})
  }
  getUsers(){
	this.auth.getData('user?where={"role":1}').subscribe(
		result=>{
			this.users=result
			this.showLoading=false
		},
		e=>{
			this.showLoading=false
			console.log(e)
		}
	)
  }
  deleteUser(id){
  	this.product.deleteData('api/user/'+id).subscribe(
  		result=>{
			this.toast.success('User has been deleted', 'Well Done', { positionClass: "toast-top-right" })
  			this.getUsers()
  		},
  		e=>{
			this.toast.error('Something wrong happened, Please try again', 'Error', { positionClass: "toast-top-right" })
  			console.log(e)
  		}
  	)
  }
  showEditForm(id){
  	this.auth.getData('user/'+id).subscribe(
  		result=>{
  			this.user=result
  			this.userForm()
  		},
  		e=>{
  			console.log(e)
			this.toast.error('Something wrong happened, Please try again', 'Error', { positionClass: "toast-top-right" })
  		}
  	)
  }
  editUser(){
	  let data=this.sellerForm.value;
	  //this.sellerForm.controls['firstMileCost'].setValue(5);
	  console.log(data);
	  console.log( this.sellerForm.controls['firstMileCost'].value );
  	this.product.updateData('user/'+this.user.id,data).subscribe(
  		result=>{
			this.toast.success('User has been edited', 'Well Done', { positionClass: "toast-top-right" })
  			this.sellerForm.reset();
  			this.getUsers();
  		},
  		error=>{
			this.toast.error('Something wrong happened, Please try again', 'Error', { positionClass: "toast-top-right" })
  			console.log(error)
  		}
  	)
  }
}
