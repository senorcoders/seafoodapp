import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { ProductService } from '../services/product.service';
import { ToastrService } from 'ngx-toastr';
import {Router} from '@angular/router';
import { environment } from '../../environments/environment';
import { OrderService } from '../services/orders.service';
import { TitleService } from '../title.service';
declare var jQuery:any;
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  itemToDelete:any;
  buyerId:any;
  products:any = [];
  empty:boolean;
  showLoading:boolean=true;
  total:any;
  shoppingEnpoint:any = 'shoppingcart/items';
  shoppingCartId:string;
  API:any = environment.apiURLImg;
  countries:any = environment.countries;
  shipping:any =  0;
  cart:any;
  /******** Other fees ***********/
  lastMilteCost = 0;
  sfsMargin = 0;
  uaeTaxes = 0;
  customs=  0;
  firstMileCost = 0;
  handlingFees=0;

  totalCustoms;
  totalSFSMargin= 0;
  totalUAETaxes=0;
  totalFirstMileCost=0;
  totalLastMileCost=0;
  totalOtherFees:any = 0;
  totalHandlingFees=0;
  /******** END Other fees ***********/
  otherFees:number = 0;
  totalWithShipping:any;
  index:any;
  userinfo:any;
  constructor(private auth: AuthenticationService, private productService: ProductService,
    private toast:ToastrService, private router:Router, private cartService:OrderService, private titleS: TitleService) {  this.titleS.setTitle('Cart');}


  ngOnInit() {
    // this.getCart();
    //this.getItems()
    this.userinfo = this.auth.getLoginData();
    this.buyerId = this.userinfo['id'];
    this.getTotal();
  }




  getTotal(){
    this.cartService.getCart( this.buyerId )
    .subscribe(

      cart=> {
        console.log("Cart", cart);
        if(cart && cart.hasOwnProperty('items')){
          console.log("Si existe");
          if(cart['items'].length > 0){
            console.log("Si es mayor a cero");
            this.cart = cart;
            this.shoppingCartId=cart['id']
            this.products=cart['items'];
            this.buyerId=cart['buyer']
            this.lastMilteCost = cart['lastMileCost'];
            this.firstMileCost = cart['firstMileCosts'];
            this.sfsMargin = cart['sfsMargin'];
            this.uaeTaxes = cart['uaeTaxes'];
            this.customs = cart['customs'];
            this.total= cart['subTotal'];
            this.shipping = cart['shipping'];
            this.totalOtherFees = cart['totalOtherFees']+cart['uaeTaxes'];
            this.totalWithShipping = cart['total'];
    
            this.hideLoader();
            this.empty = false;
            
          }else{
            this.hideLoader();
          }
         
        } else{
          this.hideLoader();
        }
       
      },
      error=> {
        console.log( error );
      }
    )
    
  }

  hideLoader(){
    this.showLoading=false;
          this.empty = true;
  }

  getItems(){
    let cart = {
      "buyer": this.buyerId
    }
    this.productService.saveData("shoppingcart", cart).subscribe(result => {
      console.log(' calcular totales', result );
    },e=>{console.log(e)})
  }

  getTotalxItem(count, price){
    return count*price;
  }
  deleteItem(i, id){
    this.productService.deleteData(`itemshopping/${id}`).subscribe(
      result=>{
        console.log(result);
        this.products.splice(i, 1); 
        this.getItems();
        jQuery('#confirmDelete').modal('hide');

      },
      e=>{
        this.toast.error("Error deleting item!", "Error",{positionClass:"toast-top-right"} );
        console.log(e)
      }
    )
  }

  getAllProductsCount(){
    var items:any = {"items": []};
    this.products.forEach((element, index) => {
      let item = { 
        "id": element['id'],
        "quantity": {
          "type": element['quantity'].type,
          "value": element['quantity'].value
        }
      }
      items['items'].push(item);
      console.log( 'get Product Counts', item );
      if (items['items'].length == this.products.length){
        this.updatecart(items);
      } 
    });
  }

  updatecart(items){
    this.productService.updateData(this.shoppingEnpoint, items).subscribe(result => {
      // this.getItems()
      console.log( 'result', result );
      this.getTotal();
    }, error => {
      this.toast.error("Error updating cart!", "Error",{positionClass:"toast-top-right"} );

    })
  }
  checkout(){
    localStorage.setItem('shippingCost', this.shipping);
    localStorage.setItem('shoppingTotal', this.totalWithShipping);
    localStorage.setItem('shoppingCartId', this.shoppingCartId);
    localStorage.setItem('totalOtherFees', this.totalOtherFees);

    //this.router.navigate(['/checkout'],  {queryParams: {shoppingCartId: this.shoppingCartId}});
    this.router.navigate(['/reviewcart'],  {queryParams: {shoppingCartId: this.shoppingCartId}});
  
  }

   findCountryName(value) {
    for (var i = 0; i < this.countries.length; i++) {
        if (this.countries[i]['code'] === value) {
            return this.countries[i].name;
        }
    } 
    return null;
  }

  showConfirmModal(itemID:string, index){
    this.itemToDelete = itemID;
    this.index = index;
    jQuery('#confirmDelete').modal('show');
  }

  validateMax(i){
    console.log(this.products[i].quantity.value);
    if(this.products[i].quantity.value > this.products[i].fish.maximumOrder){
      this.products[i].quantity.value = this.products[i].fish.maximumOrder;
      this.getAllProductsCount();
    }else{
      this.getAllProductsCount();
    }
  }
}
  