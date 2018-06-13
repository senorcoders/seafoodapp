import { Component, OnInit } from '@angular/core';
import { HostListener } from '@angular/core'
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService} from '../services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import {IsLoginService} from '../core/login/is-login.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup; 
 @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.setHeight(event.target.innerHeight);
  }
  constructor(private fb:FormBuilder, private auth: AuthenticationService, private router:Router, private toast:ToastrService, private isLoginService:IsLoginService) {
    this.redirectHome();
  }

  ngOnInit() {
    this.loginForm=this.fb.group({
      email:['',[Validators.email, Validators.required]],
      password:['', Validators.required]
    })
    this.setHeight(window.innerHeight);
  }
  redirectHome(){
     if(this.auth.isLogged()){
      this.router.navigate(["/"])
    }
  }
  setHeight(h){
    document.getElementById("hero").style.height = h+"px";
  }
  login(){
    this.auth.login(this.loginForm.value).subscribe(
      data=>{
        this.auth.setLoginData(data);
        this.isLoginService.setLogin(true,data['role'])
        this.redirectHome();
      },
      error=>{
        console.log(error);
        this.showError(error.error);
      }
    )
  }
  showError(e){
    this.toast.error(e,'Error',{positionClass:"toast-top-right"})
  }
}
