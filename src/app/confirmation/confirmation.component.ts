
import { Component, OnInit } from '@angular/core';
import {  Inject } from '@angular/core';


import * as shajs from 'sha.js';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { ProductService } from '../services/product.service';
import {  HttpClient, HttpBackend } from '@angular/common/http';
import { OrdersService } from '../core/orders/orders.service';
import { CartService } from '../core/cart/cart.service';
import { ToastrService } from '../toast.service';
import { environment } from '../../environments/environment';
import { Location, DOCUMENT } from '@angular/common';
import { OrderService } from '../services/orders.service';
declare var jQuery;
@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {
  loadAPI: Promise<any>;
  shoppingCartId: any;
  accessToken: any = 'chArgcTLiDtoP5wO1hFh';//'Ddx5kJoJWr11sF6Hr6E4';
  merchantID: any = 'xqNrOYgH';//'aZCWXhqJ';
  apiPass: any = 'bafgiwugfiwgfyyf';
  command: string = 'PURCHASE';
  signature: any;
  email: any;
  amount: any;
  total: any = '';
  ip: string;
  customerTotal: any;
  params: any = {
    'response' : {

    },
    'type': 'PURCHASE',
    'shoppingCart': ''

  };
  token: any;
  info: any;
  payFortApi: any = 'https://sbpaymentservices.payfort.com/FortAPI/paymentApi';
  // payFortApi = 'https://apiseafood .senorcoders.com/payfort/'
  description: any;
  buyerId: any;
  apiShopID: any;
  totalAPI: any = 0;
  products: any = [];
  shipping: any = 0;
  totalWithShipping: any = 0;
  totalOtherFees: any = 0;
  responseCode: string;
  env: any;
  vat:any = 0;
  taxesPer: any;
  isValid: boolean = false;
  loginText: any = 'COMPLETE CHECKOUT';
  public cart:any;

  constructor(private route: ActivatedRoute,
    private auth: AuthenticationService,
    private product: ProductService,
    private http: HttpClient,
    private httpO: HttpClient,
    private orders: OrdersService,
    private orderS: OrderService,
    private router: Router,
    private toast: ToastrService,
    private Cart: CartService,
    private _location:Location,
    @Inject(DOCUMENT) private _document,
    handler: HttpBackend) { 
      this.httpO = new HttpClient(handler);
      

      this.loadAPI = new Promise((resolve) => {
        this.loadScript();
        resolve(true);
      });

     

    }

  async ngOnInit() { 
    jQuery('body').removeClass('home-header');    
    this.env = environment;
    // bypass payfort, payfort only works in production
    if ( this.env.payfort ) {
      this.route.queryParams.subscribe(params => {
        this.responseCode = params.response_code;
        if(
          params.response_code !== '18000' &&
          params.response_code !== '02000' &&
          params.response_code !== '14000' &&
          params.response_code !== '15777' &&
          params.response_code !== undefined /* if is undefined could be a COD order, let check in getCart function */ ) {
          console.log(params.response_message);
          this.toast.error( params.response_message + ' , You will be redirected and please fill your billing information again!', 
            params.response_message,
            { positionClass: 'toast-top-right' }
          );

          //this.saveinApi();
          setTimeout(() => {
            this.router.navigate(['/checkout'],  {queryParams: {shoppingCartId: this.params.shoppingCart, creditIssue: true}});  
          }, 5000)
          
        } 
      this.getRealIp();
      
      this.params.response = params;
      this.token = params.token_name;
      this.shoppingCartId = params.merchant_reference;
      this.params.shoppingCart = params.merchant_reference;
      this.params.shoppingCart = this.shoppingCartId;
     });
    }
        
    this.getPersonalData();
    await this.getCart();
  }
  public loadScript() {        
    var isFound = false;
    var scripts = document.getElementsByTagName("script")
    for (var i = 0; i < scripts.length; ++i) {
        if (scripts[i].getAttribute('src') != null && scripts[i].getAttribute('src').includes("snare")) {
            isFound = true;
        }
    }

    if (!isFound) {
        var dynamicScripts = ["https://devapi.seafoodsouq.com/cdn/snare.js"];

        for (var i = 0; i < dynamicScripts .length; i++) {
            let node = document.createElement('script');
            node.src = dynamicScripts [i];
            node.type = 'text/javascript';
            node.async = false;
            node.charset = 'utf-8';
            document.getElementsByTagName('head')[0].appendChild(node);
        }

    }
}
  
  async getCart() {
    await new Promise((resolve, reject) => {
    this.orderS.getCart(this.buyerId).subscribe(cart=> {
      console.log('Cart', cart);
      if (cart && cart['items'] !== '') {
        // checking if is a cod function
        if ( this.responseCode === undefined && !cart['isCOD'] && this.env.payfort  ) {
          this.toast.error( 'We are not able to process your order, You will be redirected and please fill your billing information again!', 
            '',
            { positionClass: 'toast-top-right' }
          );

          //this.saveinApi();
          setTimeout(() => {
            this.router.navigate(['/checkout'],  {queryParams: {shoppingCartId: cart['id'], creditIssue: true}});  
          }, 5000)
        }

        this.cart = cart;
        this.apiShopID = cart['id'];
        this.products = cart['items'];
        this.totalAPI = cart['subTotal'];
        this.shipping = cart['shipping'];
        this.totalOtherFees = cart['totalOtherFees'];
        this.totalWithShipping = cart['total'];
        this.vat = cart['uaeTaxes'];
        this.total = Math.trunc( this.totalWithShipping * 100 );
        this.taxesPer = cart['currentCharges']['uaeTaxes'];        
        this.customerTotal = (this.totalWithShipping).toFixed(2);
        resolve();
	      // if we came from 3d secure url and its successfull, let's go to thankyou page and set the cart paid	
      	if ( ( this.responseCode == '02000' && this.total > 0 ) || ( this.responseCode == '14000' && this.total > 0 ) || ( this.responseCode == '15777' && this.total > 0 )  ) {
		      
        	this.saveinApi(); // save payfort reponse
        	this.clearCart(); // set cart paid
        }
      }

    }, error =>{
      reject();
    })
  });

  }
  getRealIp(){
  this.http.get( '/user/ip' )
	//this.httpO.get( 'https://jsonip.com/' )
	.subscribe(
      	  res=>{
          this.ip = res['ip'];
	  console.log( 'real', this.ip );
	  //this.generateSignature();
	},
	 error=>{
          console.log( 'payfort error', error );
          this.toast.error(error, 'Payfort Error', {positionClass: 'toast-top-right'} );
        })
  }
  generateSignature() {

//    this.http.get( 'https://jsonip.com/' ) 
//    .subscribe(
//	res=>{
	 // this.ip = res['ip'];
	  /*console.log( 'real', this.ip );
	  const finger: HTMLInputElement = <HTMLInputElement>document.getElementById( 'device_fingerprint' );
	  console.log('finger', finger.value);*/

	  //const string = `${this.apiPass}access_code=${this.accessToken}amount=${this.total}command=${this.command}currency=AEDcustomer_email=${this.info['email']}customer_ip=${this.ip}device_fingerprint=${finger.value}language=enmerchant_identifier=${this.merchantID}merchant_reference=${this.shoppingCartId}order_description=${this.description}settlement_reference=Seafood stoken_name=${this.token}${this.apiPass}`;
    //const string = `${this.apiPass}access_code=${this.accessToken}amount=${this.total}command=${this.command}currency=AEDcustomer_email=${this.info['email']}customer_ip=${this.ip}device_fingerprint=${finger.value}language=enmerchant_identifier=${this.merchantID}merchant_reference=${this.shoppingCartId}order_description=${this.description}token_name=${this.token}${this.apiPass}`;
    const string = `${this.apiPass}access_code=${this.accessToken}amount=${this.total}command=${this.command}currency=AEDcustomer_email=${this.info['email']}customer_ip=${this.ip}language=enmerchant_identifier=${this.merchantID}merchant_reference=${this.shoppingCartId}order_description=${this.description}token_name=${this.token}${this.apiPass}`;
	  console.log(string);
	  // var string = `${this.apiPass}access_code=${this.accessToken}amount=${this.amount}command=AUTHORIZATIONcurrency=AEDcustomer_email=${this.info['email']}language=enmerchant_identifier=${this.merchantID}merchant_reference=${this.shoppingCartId}${this.apiPass}`;
	  // this.apiPass + 'access_code='+this.accessToken+'language=enmerchant_identifier='+this.merchantID+'merchant_reference='+this.shoppingCartId+'command=AUTHORIZATIONamount='+ this.total +'=AEDcustomer_email=' + this.info['email'] + this.apiPass;
	  // this.apiPass + 'access_code='+this.accessToken+'language=enmerchant_identifier='+this.merchantID+'merchant_reference='+this.shoppingCartId+'command=AUTHORIZATIONamount='+ this.total +'=AEDcustomer_email=' + this.info['email'] + this.apiPass;
	  this.signature = shajs('sha256').update(string).digest('hex');
	  console.log('Signature: ', this.signature);
//	},
//	error=>{
//	  console.log( 'payfort error', error );
  //        this.toast.error(error, 'Payfort Error', {positionClass: 'toast-top-right'} );
//	})
  }

  getPersonalData() {
    this.info = this.auth.getLoginData();
    console.log('Info', this.info);
    this.email = this.info['email'];
    this.buyerId = this.info['id'];
  }

  saveinApi() {
    this.params.shoppingCart = this.apiShopID;
    if ( this.env.payfort ) {
      this.product.saveData('payments/payfort', this.params).subscribe(result => console.log(result));
    }
  }

  clearCart() {
     const date = new Date();
    const data = {
      status: 'paid',
      paidDateTime: date.toISOString()
    };
    this.product.updateData(`api/shoppingcart/${this.apiShopID}`, data).subscribe(
      result => {
         const cart = {
          'buyer': this.buyerId
        };
        this.orders.setOrders(true);
        this.product.saveData('shoppingcart', cart).subscribe(
          result => {
          // set the new cart value
          this.Cart.setCart(result);
	  setTimeout(() => {
                  this.router.navigate(['/thanks']);
          }, 3000)
          //this.router.navigate(['/thanks']);
          },
          e => {
            console.log(e);
          }
        );
      
      },
      e => {
        this.toast.error('Error, Try again!', 'Error', {positionClass: 'toast-top-right'} );
        this.orders.setOrders(false);
        console.log(e);
        this.isValid = false;
        this.loginText = 'COMPLETE CHECKOUT';
      }
    );
  }
    submit() {
      console.log("Submitting...");
      this.isValid = true;
      this.loginText = 'Loading...';

      if(this.cart.isCOD === true){
        return this.clearCart();
      }
      //const finger: HTMLInputElement = <HTMLInputElement>document.getElementById( 'device_fingerprint' );
      //console.log('finger', finger.value);
      this.generateSignature();
      const body = {        
        'command': this.command,
        'access_code': this.accessToken,
        'merchant_identifier': this.merchantID,
        'merchant_reference': this.shoppingCartId,
        'currency': 'AED',
        'language': 'en',
        'token_name': this.token,
        'signature': this.signature,
        'settlement_reference': 'Seafoods',
        'customer_email': this.email,
        'amount': (this.total).toString(),
        'order_description': this.description,
	'customer_ip': this.ip
      };
      console.log( 'payfort body', JSON.stringify( body ) ) ;

      // bypass payfort, payfort only works in main domain
      if ( this.env.payfort ) {
      //this.http.post(`payfort/authorization?command=${this.command}&customer_ip=${this.ip}&access_code=${this.accessToken}&merchant_identifier=${this.merchantID}&merchant_reference=${this.shoppingCartId}&currency=AED&language=en&token_name=${this.token}&signature=${this.signature}&settlement_reference=Seafood s&customer_email=${this.email}&amount=${this.total}&order_description=${this.description}`, { 'device_fingerprint': finger.value } )
      this.http.post(`payfort/authorization?command=${this.command}&customer_ip=${this.ip}&access_code=chArgcTLiDtoP5wO1hFh&merchant_identifier=${this.merchantID}&merchant_reference=${this.shoppingCartId}&currency=AED&language=en&token_name=${this.token}&signature=${this.signature}&customer_email=${this.email}&amount=${this.total}&order_description=${this.description}`, { } )
      //this.http.post( `${API}payfort/authorization`, body )
      .subscribe(res => {
        console.log(res);
        if (res['status'] === '20') {
          console.log( '3ds url', res['3ds_url'] );
          if ( res['response_code'] === '20064' ) {
          this.toast.success( res['response_message'], 'Seafood souq', {positionClass: 'toast-top-right'} );
          console.log( '3ds url', res['3ds_url'] );
          setTimeout(() => {
            window.location.assign( res['3ds_url'] );
                      }, 5000)
          //window.location.assign( res['3ds_url'] );
        
          } else {
          //this.saveinApi();
          //this.clearCart();
          }
       } else {
	        this.toast.error(res['response_message'] + ' , You will be redirected and please fill your billing information again!', '', {positionClass: 'toast-top-right'} );
          this.saveinApi(); // save payfort reponse
          setTimeout(() => {
            this.router.navigate(['/checkout'],  {queryParams: {shoppingCartId: this.params.shoppingCart, creditIssue: true}});
            
            
          }, 5000)
          //this.saveinApi();
          //this.clearCart();
          }
        },
        error => {
          console.log( 'payfort error', error );
          this.toast.error(error, 'Payfort Error', {positionClass: 'toast-top-right'} );
        }
        );
      } else {
        this.saveinApi();
        this.clearCart();
      }
      



    }

    getTotalxItem(count, price) {
      return (count * price);
    }

    back(){
      this._location.back(); 
    }

}


