import { Component } from '@angular/core';
import { MenuItems } from './core/menu/menu-items';
import {AuthenticationService} from './services/authentication.service';
declare const jQuery:any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent{
  isLogged:boolean=false;
  constructor(private auth:AuthenticationService,private menuItems: MenuItems){
  }
  ngOnInit(){
    if(this.auth.isLogged()){
      this.isLogged=true;
    }
    jQuery('.hasChildren').on('click', function(){
      jQuery(this).parent().find('.submenu').toggle('slow')
    })
  }
}
