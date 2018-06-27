import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ProductService} from '../services/product.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recovery-password',
  templateUrl: './recovery-password.component.html',
  styleUrls: ['./recovery-password.component.scss']
})
export class RecoveryPasswordComponent implements OnInit {
	recoveryForm:FormGroup;
  constructor(private fb:FormBuilder, private productSer:ProductService, private toast:ToastrService, private router:Router) { }

  ngOnInit() {
  	this.recoveryForm=this.fb.group({
  		code:['', Validators.required],
  		password:['', Validators.required],
  		repassword:['', Validators.required]
  	})
  }
  recovery(){
  	if(this.recoveryForm.get('password').value != this.recoveryForm.get('repassword').value){
    	this.toast.error('passwords not matched','Error',{positionClass:"toast-top-right"})
  	}
  	else{
  		let data={
  			password:this.recoveryForm.get('password').value,
  			code:this.recoveryForm.get('code').value
  		}
  		this.productSer.updateData('api/user/password',data).subscribe(
  			result=>{
  				this.toast.success('Your password has been changed','Well Done',{positionClass:"toast-top-right"})
  				this.router.navigate(['/login']);
  			},
  			e=>{
		    	this.toast.error(e.error,'Error',{positionClass:"toast-top-right"})
  				console.log(e)
  			}
  		)
  	}
  }

}
