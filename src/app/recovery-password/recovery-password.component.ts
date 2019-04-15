import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {ProductService} from '../services/product.service';
import { ToastrService } from '../toast.service';
import { Router } from '@angular/router';
import { PasswordValidation } from '../password';

@Component({
  selector: 'app-recovery-password',
  templateUrl: './recovery-password.component.html',
  styleUrls: ['./recovery-password.component.scss']
})
export class RecoveryPasswordComponent implements OnInit {
	recoveryForm:FormGroup;
	regex:string='(?=.*)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9_]).{8,20}$';
  constructor(private fb:FormBuilder, private productSer:ProductService, private toast:ToastrService, private router:Router) { }

  ngOnInit() {
  	this.recoveryForm=this.fb.group({
  		code:['', Validators.required],
  		password:['', [Validators.required, Validators.pattern(this.regex)]],
  		rePassword:['', Validators.required]
  	},{
		validator : PasswordValidation.MatchPassword

	  })
  }
  recovery(){
	if(this.recoveryForm.valid){
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
	}else{
		this.validateAllFormFields(this.recoveryForm);
	}
  		
  	
  }

  validateAllFormFields(formGroup: FormGroup) {         
	Object.keys(formGroup.controls).forEach(field => { 
	  const control = formGroup.get(field);             
	  if (control instanceof FormControl) {             
		control.markAsTouched({ onlySelf: true });
	  } else if (control instanceof FormGroup) {        
		this.validateAllFormFields(control);            
	  }
	});
  }

}
