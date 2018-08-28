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
declare var jQuery:any;
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
  fishTypeMenu:any;
  userData:any;
  searchForm: FormGroup;
  fishTypeMenuList:any=[];
  showCart:boolean=false;
  cartItem:any;
  showSuggestion:boolean=false;
  results:any;
  lang:any;
  show:boolean=false;
  showOrders:boolean=false;
  constructor(private fb: FormBuilder ,private auth:AuthenticationService,private menuItems: MenuItems,
   private isLoggedSr: IsLoginService, private router:Router, private productService: ProductService,
   private toast:ToastrService, private translate: TranslateService,private languageService:LanguageService,
   private cart:CartService, private orders:OrdersService){
  }
  ngOnInit(){
    jQuery(document).ready(function(){
      jQuery('#search-icon').on('click',function(){
        setTimeout(function(){jQuery('#search-input').focus()},300)
        })
    })
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
    this.getFishTypeMenu();
    this.searchForm=this.fb.group({
      search:['', Validators.required]
    })
  }
  logOut(){
    this.isLoggedSr.setLogin(false,-1)
    this.auth.logOut();
    this.router.navigate(["/home"]);
  }
  openSearch(){
    if(this.show){
      this.show=false
    }
    else{
      this.show=true
    }
  }
  getFishTypeMenu(){
    this.productService.getData('featuredtypes-menu').subscribe(
      result=>{
        this.fishTypeMenu=result;
        this.addFishTypeMenu();
      },
      error=>{
        console.log(error)
      }
    )
  }
  search(){
    this.showSuggestion=false;
    this.show=false;
    this.results='';
    this.router.navigate([`search/${this.searchForm.get('search').value}/1`]);
    this.searchForm.reset()
  }
  searchBySuggestion(name){
    this.searchForm.reset();
    this.results='';
    this.showSuggestion=false;
    this.show=false;
    this.router.navigate([`search/${name}`]);
  }
  goCart(){
    this.router.navigate(['/cart']);
  }
  addFishTypeMenu(){
    this.fishTypeMenu.featureds.forEach((category)=>{
      if(category.childsTypes.length>0){
        let data={"children":[]};
        category.childsTypes.forEach((children)=>{
          data['children'].push({state:`fish-type/${children.child.name}/1`,name:children.child.name, translate:{en:{name:children.child.name},es:{name:children.child.name}}})
        })
        this.fishTypeMenuList.push(
          {
            state: `fish-type/${category.name}/1`,type:'sub',children:data.children,
            translate:{
              en:{
                name:category.childsTypes[0].parent.name
              },
              es:{
                name:category.childsTypes[0].parent.name
              }
            }
          }
        )
      }
      else{
        this.fishTypeMenuList.push({state: `fish-type/${category.name}/1`,type: 'link',translate:{en:{name:category.name},es:{name:category.name}}})
      }
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
    this.show=false
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
