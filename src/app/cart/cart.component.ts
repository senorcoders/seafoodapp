import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { ProductService } from '../services/product.service';
import { ToastrService } from 'ngx-toastr';
import { element } from 'protractor';
import { CartService } from '../core/cart/cart.service';
import {Router} from '@angular/router';
import { OrdersService } from '../core/orders/orders.service';
import { environment } from '../../environments/environment';
import { OrderService } from '../services/orders.service';
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
  constructor(private auth: AuthenticationService, private productService: ProductService,
    private toast:ToastrService, private Cart: CartService, private router:Router, private orders:OrdersService, private cartService:OrderService) { }

  ngOnInit() {
    this.getCart();
    this.getItems()
  }

  getCart(){
    this.Cart.cart.subscribe((cart:any)=>{
      console.log(cart)
      if(cart && cart['items'] !=''){
        this.cart = cart;
        this.shoppingCartId=cart['id']
        this.products=cart['items'];
        this.total=cart['total'];
        this.buyerId=cart['buyer']
        this.lastMilteCost = cart['lastMileCost'];
        this.firstMileCost = cart['firstMileCosts'];
        this.sfsMargin = cart['sfsMargin'];
        this.uaeTaxes = cart['uaeTaxes'];
        this.customs = cart['customs'];

        this.empty=false;
        this.showLoading=false;
        
        this.getTotal();
      }
      else{
        this.showLoading=false;
        this.empty = true;
      }
    })
  }


  getTotal(){
    this.cartService.getCart( this.buyerId )
    .subscribe(
      res=> {
        this.total= res['subTotal'];
        this.shipping = res['shipping'];
        this.totalOtherFees = res['totalOtherFees']+res['uaeTaxes'];
        this.totalWithShipping = res['total'];
      },
      error=> {
        console.log( error );
      }
    )
    
  }

  getItems(){
    let cart = {
      "buyer": this.buyerId
    }
    this.productService.saveData("shoppingcart", cart).subscribe(result => {
      this.Cart.setCart(result)
      console.log(' calcular totales', result );
    },e=>{console.log(e)})
  }

  getTotalxItem(count, price){
    return count*price;
  }
  deleteItem(i, id){
    this.productService.deleteData(`itemshopping/${id}`).subscribe(
      result=>{
        this.getItems();
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
      //this.getItems()
      console.log( 'result', result );
      this.getCart();
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

  showConfirmModal(itemID:string){
		this.itemToDelete = itemID;
    jQuery('#confirmDelete').modal('show');
  }
}
