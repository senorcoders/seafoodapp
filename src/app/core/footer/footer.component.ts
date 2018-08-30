import { Component } from '@angular/core';
import { MenuItems } from '../menu/menu-items';
import {AuthenticationService} from '../../services/authentication.service';
import { Router } from '@angular/router';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {LanguageService} from '../language/language.service';
import {IsLoginService} from '../login/is-login.service';
import * as AOS from 'aos';
declare var jQuery:any;
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent{
  subscribeForm:FormGroup;
  language:any;
  MenuItems:any;
  isLogged:boolean=false;
  constructor(private fb: FormBuilder,private menuItems: MenuItems, private router:Router, 
    private toast:ToastrService,private auth:AuthenticationService,private languageService:LanguageService, private menu:MenuItems,
    private isLoggedSr: IsLoginService){
    this.MenuItems=this.menu;
  }
  ngOnInit(){
    jQuery(document).ready(function(){
      AOS.init();
    })
    jQuery(window).on('load', function() {
      AOS.refresh();
    });
    //language
    this.languageService.language.subscribe((value:any)=>{
      this.language=value;
    })
    this.subscribeForm=this.fb.group({
      email:['',[Validators.required, Validators.email]]
    })
    this.isLoggedSr.isLogged.subscribe((val:boolean)=>{
      this.isLogged=val;
    })
  }
  logOut(){
    this.isLoggedSr.setLogin(false,-1)
    this.auth.logOut();
    this.router.navigate(["/home"]);
  }
  subscribe(){
    this.auth.subscribe(this.subscribeForm.get('email').value).subscribe(
      result=>{
        this.toast.success('Now you will receive all our news','Great !!!',{positionClass:"toast-top-right"})
      },
      error=>{
        console.log(error)
        if(error.error.code=="E_UNIQUE"){
          this.toast.error('Your email already exists in our database','Error',{positionClass:"toast-top-right"})
        }
        else{
          this.toast.error('Something bad happened. Please try again','Error',{positionClass:"toast-top-right"})
        }
      }
    )
  }
}
