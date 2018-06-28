import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../services/authentication.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-verify-user',
  templateUrl: './verify-user.component.html',
  styleUrls: ['./verify-user.component.scss']
})
export class VerifyUserComponent implements OnInit {
	users:any;
	showLoading:boolean=true;
	isInfo:boolean=false
  constructor(private auth:AuthenticationService, private toast:ToastrService) { }

  ngOnInit() {
  	this.getPendingUsers()
  }
  getPendingUsers(){
  	this.auth.getData('user?where={"status":""}').subscribe(
  		result=>{
  			if(result && result!=''){
  				this.users=result;
  				this.showLoading=false
  				this.isInfo=true
  			}
  			else{
  				this.showLoading=false;
  				this.isInfo=false
  			}
  		},
  		e=>{
  			console.log(e)
  			this.showLoading=false;
  			this.isInfo=false
  		}
  	)
  }
  accept(id){
  	this.auth.acceptUser(`user/status/${id}/accepted`).subscribe(
  		result=>{
			this.toast.success('User has been accepted', 'Well Done', { positionClass: "toast-top-right" })
  			this.getPendingUsers();
  		},
  		e=>{
			this.toast.error('Something wrong happened, Please try again', 'Error', { positionClass: "toast-top-right" })
  			console.log(e)
  		}
  	)
  }
  refuse(id){
	this.auth.acceptUser(`user/status/${id}/denied`).subscribe(
	  		result=>{
				this.toast.success('User has been refuse', 'Well Done', { positionClass: "toast-top-right" })
	  			this.getPendingUsers();
	  		},
	  		e=>{
				this.toast.error('Something wrong happened, Please try again', 'Error', { positionClass: "toast-top-right" })
	  			console.log(e)
	  		}
  	)
  }
}
