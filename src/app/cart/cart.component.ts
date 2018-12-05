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

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
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
  totalOtherFees= 0;
  totalHandlingFees=0;
  /******** END Other fees ***********/
  otherFees:number = 0;
  totalWithShipping:any;
  constructor(private auth: AuthenticationService, private productService: ProductService,
    private toast:ToastrService, private Cart: CartService, private router:Router, private orders:OrdersService, private cartService:OrderService) { }

  ngOnInit() {
    this.getCart();
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
        this.getShippingTotal();
        this.getTotal();
      }
      else{
        this.showLoading=false;
        this.empty = true;
      }
    })
  }

  getShippingTotal(){
    this.shipping = 0;

    
    this.totalHandlingFees = 0;
    this.products.forEach(p => {
      console.log( 'hand ' + this.cart.handlingFees );
      this.shipping += (p['shippingCost'] * p['quantity']['value']);
      this.totalHandlingFees += ( this.cart.handlingFees * p['quantity']['value']);
      this.totalSFSMargin += ( ( p['fish']['type']['sfsMargin'] / 100 ) *  p['quantity']['value']) ;
      this.totalFirstMileCost += p['owner']['firstMileCost'] ;
      

    });
    
  }

  

  getTotal(){
    this.totalOtherFees = 0;

    this.totalCustoms = (this.total * ( this.customs / 100 + 1 ) ) ;
    this.totalUAETaxes = (this.total * ( this.uaeTaxes / 100 + 1 ) );
    //this.totalFirstMileCost = this.cart;
    //this.totalLastMileCost = 0;
    
    this.totalOtherFees = this.totalCustoms + this.totalUAETaxes + this.totalHandlingFees + this.totalLastMileCost + this.totalSFSMargin + this.totalFirstMileCost ;// + this.totalFirstMileCost + + +  ;
    this.totalWithShipping = ( this.totalOtherFees + this.shipping + this.total );

    this.cartService.updateCart( this.shoppingCartId, 
      { 
        "shipping": this.shipping,
        "totalOtherFees": this.totalOtherFees,
        "total": this.total
      } 
      ).subscribe(
      result => {
        console.log( "Shipping Updated" )
        console.log( 'total Customs '+this.totalCustoms); 
        console.log( 'total uaeTaxes '+this.uaeTaxes); 
        console.log( 'total Last Mile '+this.totalLastMileCost); 
        console.log( 'total first Mile '+this.firstMileCost); 
        console.log( 'total handling fees '+this.totalHandlingFees); 
        console.log( 'total SFSMArgin fees '+this.totalSFSMargin); 
      },
      error => {
        console.error( error );
      }
    )
  }

  getItems(){
    let cart = {
      "buyer": this.buyerId
    }
    this.productService.saveData("shoppingcart", cart).subscribe(result => {
      this.Cart.setCart(result)
      this.toast.success("Cart updated!",'Well Done',{positionClass:"toast-top-right"})
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
      if (items['items'].length == this.products.length){
        this.updatecart(items);
      } 
    });
  }

  updatecart(items){
    this.productService.updateData(this.shoppingEnpoint, items).subscribe(result => {
      this.getItems()
    }, error => {
      this.toast.error("Error updating cart!", "Error",{positionClass:"toast-top-right"} );

    })
  }
  checkout(){
    // let date= new Date();
    // let data={
    //   status:'paid',
    //   paidDateTime: date.toISOString()
    // }
    // this.productService.updateData(`api/shoppingcart/${this.shoppingCartId}`,data).subscribe(
    //   result=>{
    //      let cart={
    //       "buyer": this.buyerId
    //     }
    //     this.orders.setOrders(true)
    //     this.productService.saveData("shoppingcart", cart).subscribe(
    //       result => {
    //       //set the new cart value
    //       this.Cart.setCart(result)
    //       this.router.navigate(['/orders'])
    //       },
    //       e=>{
    //         console.log(e)
    //       }
    //     )
    //   },
    //   e=>{
    //     this.toast.error("Error, Try again!", "Error",{positionClass:"toast-top-right"} );
    //     this.orders.setOrders(false)
    //     console.log(e)
    //   }
    // )
    localStorage.setItem('shippingCost', this.shipping);
    localStorage.setItem('shoppingTotal', this.totalWithShipping);
    localStorage.setItem('shoppingCartId', this.shoppingCartId);

    this.router.navigate(['/checkout'],  {queryParams: {shoppingCartId: this.shoppingCartId}});
  
  }

   findCountryName(value) {
    for (var i = 0; i < this.countries.length; i++) {
        if (this.countries[i]['code'] === value) {
            return this.countries[i].name;
        }
    }
    return null;
  }

}
