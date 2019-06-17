import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from '../toast.service';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  forgotForm: FormGroup; 
  email: FormControl;

  constructor( private toast:ToastrService, private product: ProductService) { }

 ngOnInit() {
    this.createFormControls();
    this.createForm();
    this.setHeight(window.innerHeight);

  }

  setHeight(h){
    document.getElementById("hero").style.height = h+"px";
  } 

  createFormControls(){
    this.email = new FormControl('', [Validators.email, Validators.required]);
  }

  createForm(){
    this.forgotForm = new FormGroup({
        email: this.email
          });
  }

  forgotPassword(){
    this.product.saveData('api/user/forgot', this.forgotForm.value).subscribe(
      result=>{
        this.toast.success('Please check your email for password reset instructions','',{positionClass:"toast-top-right"})
        this.forgotForm.reset();
      },
      e=>{
         this.toast.error(e.error,'Error',{positionClass:"toast-top-right"})
        console.log(e)
        this.forgotForm.reset();

      }
    )
  }

}
