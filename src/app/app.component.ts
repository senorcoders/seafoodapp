import { Component } from '@angular/core';
import { MenuItems } from './core/menu/menu-items';
import {AuthenticationService} from './services/authentication.service';
import {IsLoginService} from './core/login/is-login.service';
import {ProductService} from './services/product.service';
import { Router } from '@angular/router';
import * as jQuery from 'jquery';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent{
  isLogged:boolean=false;
  productsCategories:any;
  constructor(private auth:AuthenticationService,private menuItems: MenuItems, private isLoggedSr: IsLoginService, private router:Router, private productService: ProductService){
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
    this.getAllProductsCategories()
  }
  logOut(){
    this.isLoggedSr.setLogin(false)
    this.auth.logOut();
    this.router.navigate(["/home"]);
  }
  getAllProductsCategories(){
    this.productService.getAllCategoriesProducts().subscribe(
      result=>{
        this.productsCategories=result;
        this.addCategoryToMenu();
      },
      error=>{
        console.log(error)
      }
    )
  }
  addCategoryToMenu(){
    let obj={
        state:'archive-product',
        name:'Categories',
        type:'sub',
        children:[]
    };
    this.productsCategories.forEach((category)=>{
        obj.children.push({state: `archive-product/${category.name}`, name: category.name},)
    });
    this.menuItems.addMenuItem(obj)
  }
}
