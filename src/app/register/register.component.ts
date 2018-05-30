import { Component, OnInit, HostListener } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService} from '../services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
registerForm: FormGroup;
 @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.setHeight(event.target.innerHeight);
  }
  constructor(private fb:FormBuilder, private auth: AuthenticationService, private router:Router, private toast:ToastrService) {
    this.redirectHome();
  }

  ngOnInit() {
    this.registerForm=this.fb.group({
      firstName:['',Validators.required],
      lastName:['',Validators.required],
      location:['',Validators.required],
      email:['',[Validators.email, Validators.required]],
      password:['', Validators.required],
      rePassword:['', Validators.required]
    })
    this.setHeight(window.innerHeight);
  }
  redirectHome(){
     if(this.auth.isLogged()){
      this.router.navigate(["/home"])
    }
  }
  setHeight(h){
    document.getElementById("hero").style.height = h+"px";
  }
  register(){
    if(this.registerForm.get('password').value==this.registerForm.get('rePassword').value){
      this.auth.register(this.registerForm.value).subscribe(
        result=>{
          this.auth.login(this.registerForm.value).subscribe(
            result=>{
              this.auth.setLoginData(result);
              this.redirectHome();
            },error=>{
                this.showError(error.error)
              }
          )
        },
        error=>{
          console.log(error);
          this.showError(error.error);
        }
      )
    }
    else{
      this.showError("Passwords not match");
    }
  }
  showError(e){
    this.toast.error(e,'Error',{positionClass:"toast-top-right"})
  }
   showSuccess(s){
    this.toast.success(s,'Well Done',{positionClass:"toast-top-right"})
  }
}
