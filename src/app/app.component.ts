import { Component } from '@angular/core';
import { MenuItems } from './core/menu/menu-items';
import {AuthenticationService} from './services/authentication.service';
import {IsLoginService} from './core/login/is-login.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent{
  isLogged:boolean=false;
  constructor(private auth:AuthenticationService,private menuItems: MenuItems, private isLoggedSr: IsLoginService, private router:Router){
  }
  ngOnInit(){
    this.isLoggedSr.isLogged.subscribe((val:boolean)=>{
      this.isLogged=val
    })
    if(this.auth.isLogged()){
      this.isLoggedSr.setLogin(true)
    }else{
      this.isLoggedSr.setLogin(false)
    }
  }
  logOut(){
    this.isLoggedSr.setLogin(false)
    this.auth.logOut();
    this.router.navigate(["/home"]);
  }
}
