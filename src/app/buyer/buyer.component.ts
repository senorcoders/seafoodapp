import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../services/authentication.service';
import {ProductService} from '../services/product.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
@Component({
  selector: 'app-buyer',
  templateUrl: './buyer.component.html',
  styleUrls: ['./buyer.component.scss']
})
export class BuyerComponent implements OnInit {
	users:any;
	showLoading:boolean=true;
	buyerForm:FormGroup;
	user:any;
	countries=environment.countries;
  constructor(private auth: AuthenticationService, private toast: ToastrService,
   private router:Router, private fb:FormBuilder, private product:ProductService) { }

  ngOnInit() {
  	this.getUsers()
  	this.buyerForm=this.fb.group({
  		firstName:['',Validators.required],
		lastName: ['', Validators.required],
		country: ['', Validators.required],
		email: ['', [Validators.email, Validators.required]],
		tel: [''],
		fullBakingInfo: [''],
  	})
  }
  userForm(){
  	this.buyerForm=this.fb.group({
  		firstName:[this.user.firstName,Validators.required],
		lastName: [this.user.lastName, Validators.required],
		country: [this.user.dataExtra.country, Validators.required],
		email: [this.user.email, [Validators.email, Validators.required]],
		tel: [this.user.dataExtra.tel],
		fullBakingInfo: [this.user.dataExtra.fullBakingInfo],
  	})
  }
  getUsers(){
	this.auth.getData('user?where={"role":2}').subscribe(
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
  	let data=this.buyerForm.value;
  	this.product.updateData('user/'+this.user.id,data).subscribe(
  		result=>{
			this.toast.success('User has been edited', 'Well Done', { positionClass: "toast-top-right" })
  			this.buyerForm.reset();
  			this.getUsers();
  		},
  		error=>{
			this.toast.error('Something wrong happened, Please try again', 'Error', { positionClass: "toast-top-right" })
  			console.log(error)
  		}
  	)
  }
}
