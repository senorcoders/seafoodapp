import { Component, OnInit } from '@angular/core';
import * as shajs from 'sha.js';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { ProductService } from '../services/product.service';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { OrdersService } from '../core/orders/orders.service';
import { CartService } from '../core/cart/cart.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {
  shoppingCartId:any;
  accessToken:any = 'Ddx5kJoJWr11sF6Hr6E4';
  merchantID:any = 'aZCWXhqJ';
  apiPass:any = 'bafgiwugfiwgfyyf';
  signature:any;
  email:any;
  amount:any;
  total:any;
  params:any = {
    "response" : {

    },
    "type": "AUTHORIZATION",
    "shoppingCart": ""

  };
  token:any;
  info:any;
  payFortApi:any = 'https://sbpaymentservices.payfort.com/FortAPI/paymentApi';
  //payFortApi = 'https://apiseafood.senorcoders.com/payfort/'
  description:any;
  buyerId:any;
  apiShopID:any;
  totalAPI:any;
  products:any = [];
  shipping:any;
  totalWithShipping:any;

  
  constructor(private route: ActivatedRoute, private auth: AuthenticationService, private product:ProductService, private http: HttpClient,
    private orders:OrdersService, private Cart: CartService, private router:Router, private toast:ToastrService) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      console.log(params);
      this.params.response = params;
      this.token = params.token_name;
      this.shoppingCartId = params.merchant_reference;
      this.params.shoppingCart = params.merchant_reference;
      this.amount=  localStorage.getItem('shoppingTotal');
      this.total = this.amount * 1000;
      this.getPersonalData();
      this.getCart();
      this.shipping = localStorage.getItem('shippingCost');
      this.shipping = this.shipping * 1000;
      this.totalWithShipping = localStorage.getItem('shoppingTotal');
      this.totalWithShipping = this.totalWithShipping * 1000;
      //this.generateSignature();

    })
  }

  getCart(){
    this.Cart.cart.subscribe((cart:any)=>{
      console.log("Cart", cart)
      if(cart && cart['items'] !=''){
        this.buyerId=cart['buyer'];
        this.apiShopID=cart['id']
        this.products=cart['items'];
        this.totalAPI=cart['total'] * 1000;    
       
      }
      
    })
  }
  generateSignature(){
    var string = `${this.apiPass}access_code=${this.accessToken}amount=${this.total}command=AUTHORIZATIONcurrency=AEDcustomer_email=${this.info['email']}language=enmerchant_identifier=${this.merchantID}merchant_reference=${this.shoppingCartId}order_description=${this.description}settlement_reference=Seafoodstoken_name=${this.token}${this.apiPass}`;
	
    console.log(string);
    //var string = `${this.apiPass}access_code=${this.accessToken}amount=${this.amount}command=AUTHORIZATIONcurrency=AEDcustomer_email=${this.info['email']}language=enmerchant_identifier=${this.merchantID}merchant_reference=${this.shoppingCartId}${this.apiPass}`;
    //this.apiPass + 'access_code='+this.accessToken+'language=enmerchant_identifier='+this.merchantID+'merchant_reference='+this.shoppingCartId+'command=AUTHORIZATIONamount='+ this.total +'=AEDcustomer_email=' + this.info['email'] + this.apiPass;
    //this.apiPass + 'access_code='+this.accessToken+'language=enmerchant_identifier='+this.merchantID+'merchant_reference='+this.shoppingCartId+'command=AUTHORIZATIONamount='+ this.total +'=AEDcustomer_email=' + this.info['email'] + this.apiPass;
    this.signature = shajs('sha256').update(string).digest('hex');
    console.log("Signature: ", this.signature);
  }

  getPersonalData(){
    this.info = this.auth.getLoginData();
    console.log("Info", this.info);
    this.email = this.info['email'];
  }

  saveinApi(){
    console.log(this.params);
    this.product.saveData('payments/payfort', this.params).subscribe(result => console.log(result))
  }

  clearCart(){
     let date= new Date();
    let data={
      status:'paid',
      paidDateTime: date.toISOString()
    }
    this.product.updateData(`api/shoppingcart/${this.apiShopID}`,data).subscribe(
      result=>{
         let cart={
          "buyer": this.buyerId
        }
        this.orders.setOrders(true)
        this.product.saveData("shoppingcart", cart).subscribe(
          result => {
          //set the new cart value
          this.Cart.setCart(result)
          this.router.navigate(['/thanks'])
          },
          e=>{
            console.log(e)
          }
        )
      },
      e=>{
        this.toast.error("Error, Try again!", "Error",{positionClass:"toast-top-right"} );
        this.orders.setOrders(false)
        console.log(e)
      }
    )
  }
    submit(){
     
      this.generateSignature()
      var body = {
        "command": "AUTHORIZATION",
        "access_code": this.accessToken,
        "merchant_identifier": this.merchantID,
        "merchant_reference": this.shoppingCartId,
        "currency": "AED",
        "language": "en",
        "token_name": this.token,
        "signature": this.signature,
        "settlement_reference": "Seafoods",        
        "customer_email": this.email,
        "amount": this.total,
        "order_description": this.description
      }
      console.log( JSON.stringify( body ) ) ;
      /*this.http.post(this.payFortApi, body,  {
        headers: new HttpHeaders({
          "charset": "utf-8",
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json; charset=utf-8'
        })
      }).subscribe(res => console.log(res))*/
      
      this.http.get(`https://apiseafood.senorcoders.com/payfort/authorization?command=AUTHORIZATION&access_code=Ddx5kJoJWr11sF6Hr6E4&merchant_identifier=${this.merchantID}&merchant_reference=${this.shoppingCartId}&currency=AED&language=en&token_name=${this.token}&signature=${this.signature}&settlement_reference=Seafoods&customer_email=${this.email}&amount=${this.total}&order_description=${this.description}`)
      .subscribe(res => {
        console.log(res);
        if(res['status'] == "20"){
          this.saveinApi();
          this.clearCart();
        }
      })



    }

    getTotalxItem(count, price){
      return (count*price) * 1000;
    }

}


