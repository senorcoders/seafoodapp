import { Component } from '@angular/core';
import { MenuItems } from './core/menu/menu-items';
import {AuthenticationService} from './services/authentication.service';
import {IsLoginService} from './core/login/is-login.service';
import {ProductService} from './services/product.service';
import { Router } from '@angular/router';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent{
  isLogged:boolean=false;
  role:any;
  productsCategories:any;
  userData:any;
  searchForm: FormGroup;
  constructor(private fb: FormBuilder ,private auth:AuthenticationService,private menuItems: MenuItems, private isLoggedSr: IsLoginService, private router:Router, private productService: ProductService){
  }
  ngOnInit(){
    this.isLoggedSr.isLogged.subscribe((val:boolean)=>{
      this.isLogged=val;
    })
    this.isLoggedSr.role.subscribe((role:number)=>{
      this.role=role
    })
    if(this.auth.isLogged()){
      this.userData=this.auth.getLoginData();
      this.isLoggedSr.setLogin(true, this.userData.role)
    }else{
      this.isLoggedSr.setLogin(false,-1)
    }
    this.getAllProductsCategories();
    this.searchForm=this.fb.group({
      search:['', Validators.required]
    })
  }
  logOut(){
    this.isLoggedSr.setLogin(false,-1)
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
  search(){
    this.router.navigate([`search/${this.searchForm.get('search').value}`]);
  }
  addCategoryToMenu(){
    let obj={
      state:'archive-product',
      name:'Fish Type',
      type:'sub',
      children:[]
    };
    this.productsCategories.forEach((category)=>{
      obj.children.push({state: `archive-product/${category.name}`, name: category.name},)
     });
    this.menuItems.addMenuItem(obj)
    
  }
}
