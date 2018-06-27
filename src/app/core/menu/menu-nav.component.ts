import { Component } from '@angular/core';
import { MenuItems } from './menu-items';
import {AuthenticationService} from '../../services/authentication.service';
import {IsLoginService} from '../login/is-login.service';
import {ProductService} from '../../services/product.service';
import { Router } from '@angular/router';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {TranslateService} from 'ng2-translate';
import {LanguageService} from '../language/language.service';
import { CartService } from '../cart/cart.service';
import { OrdersService } from '../orders/orders.service';
const defaultLanguage = "en";
const additionalLanguages = ["es"];
const languages: string[] = [defaultLanguage].concat(additionalLanguages);
@Component({
  selector: 'app-menu-nav',
  templateUrl: './menu-nav.component.html',
  styleUrls: ['./menu-nav.component.scss']
})
export class MenuNavComponent{
  isLogged:boolean=false;
  role:any;
  productsCategories:any;
  userData:any;
  searchForm: FormGroup;
  fishTypeMenu:any=[];
  showCart:boolean=false;
  cartItem:any;
  showSuggestion:boolean=false;
  results:any;
  lang:any;
  showOrders:boolean=false;
  constructor(private fb: FormBuilder ,private auth:AuthenticationService,private menuItems: MenuItems,
   private isLoggedSr: IsLoginService, private router:Router, private productService: ProductService,
   private toast:ToastrService, private translate: TranslateService,private languageService:LanguageService,
   private cart:CartService, private orders:OrdersService){
  }
  ngOnInit(){
    //language
    this.translate.setDefaultLang(defaultLanguage);
    this.translate.addLangs(additionalLanguages);
    let initLang = this.translate.getBrowserLang();
    this.lang=initLang;
    if (languages.indexOf(initLang) === -1) {
      initLang = defaultLanguage;
    }
    this.translate.use(initLang);
    this.languageService.setLanguage(initLang);
    this.isLoggedSr.isLogged.subscribe((val:boolean)=>{
      this.isLogged=val;
    })
    this.isLoggedSr.role.subscribe((role:number)=>{
      this.role=role
    })
    if(this.auth.isLogged()){
      this.userData=this.auth.getLoginData();
      this.isLoggedSr.setLogin(true, this.userData.role)
      //create the cart
      let cart={
        "buyer": this.userData['id']
      }
      this.productService.saveData("shoppingcart", cart).subscribe(result => {
        //set cart value
        this.cart.setCart(result)
        if(result && result['total']!==0){
          this.showCart=true;
        }
        else{
          this.showCart=false;
        }
      },
      e=>{console.log(e);
        this.showCart=false
      })
      //check if the user has orders
      if(this.isLoggedSr.role.value==2){
        this.productService.getData(`shoppingcart/?where={"status":{"like":"paid"},"buyer":"${this.userData.id}"}`).subscribe(
        result=>{
          if(result && result!=''){
            this.showOrders=true;
            this.orders.setOrders(true)
          }
        },
        e=>{
          this.showOrders=false;
          this.orders.setOrders(false)
          console.log(e)
        })
      }
    }else{
      this.isLoggedSr.setLogin(false,-1)
    }
    //subscribe to cart service to get the cart items.
    this.cart.cart.subscribe((cart:any)=>{
      this.cartItem=cart
      if(this.cartItem && this.cartItem.total!==0){
          this.showCart=true;
        }
        else{
          this.showCart=false;
        }
    })
    this.orders.hasOrders.subscribe((hasOrder:any)=>{
      this.showOrders=hasOrder
    })
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
    this.showSuggestion=false;
    this.results='';
    this.router.navigate([`search/${this.searchForm.get('search').value}`]);
    this.searchForm.reset()
  }
  searchBySuggestion(name){
    this.searchForm.reset()
    this.results='';
    this.showSuggestion=false;
    this.router.navigate([`search/${name}`]);
  }
  goCart(){
    this.router.navigate(['/cart']);
  }
  addCategoryToMenu(){
    // let obj={
    //   state:'archive-product',
    //   name:'Fish Type',
    //   type:'sub',
    //   children:[]
    // };
    // this.productsCategories.forEach((category)=>{
    //   obj.children.push({state: `archive-product/${category.name}`, name: category.name},)
    //  });
    // this.menuItems.addMenuItem(obj)
    this.productsCategories.forEach((category)=>{
      this.fishTypeMenu.push({state: `archive-product/${category.name}`, name: category.name},)
    });
    
  }
  suggestions(){
    let search=this.searchForm.get('search').value
    if(search && search.length>=3){
      search={
        name:search
      }
      this.productService.suggestions(search).subscribe(
        result=>{
          this.results=result;
          this.showSuggestion=true;
        },
        error=>{
          console.log(error)
        }
      )
    }
    else{
      this.showSuggestion=false
    }
  }
  closeSuggestion(){
    this.showSuggestion=false
  }
  changeLanguage(e){
    let value=e.srcElement.value;
    if(value!=this.lang){
      this.translate.use(value);
      this.lang=value
      this.languageService.setLanguage(value);
    }
  }
}
