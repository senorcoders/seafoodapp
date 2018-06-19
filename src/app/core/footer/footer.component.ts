import { Component } from '@angular/core';
import { MenuItems } from '../menu/menu-items';
import {AuthenticationService} from '../../services/authentication.service';
import { Router } from '@angular/router';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {LanguageService} from '../language/language.service';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent{
  subscribeForm:FormGroup;
  language:any;
  MenuItems:any;
  constructor(private fb: FormBuilder,private menuItems: MenuItems, private router:Router, 
    private toast:ToastrService,private auth:AuthenticationService,private languageService:LanguageService, private menu:MenuItems){
    this.MenuItems=this.menu;
  }
  ngOnInit(){
    //language
    this.languageService.language.subscribe((value:any)=>{
      this.language=value;
    })
    this.subscribeForm=this.fb.group({
      email:['',[Validators.required, Validators.email]]
    })
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
