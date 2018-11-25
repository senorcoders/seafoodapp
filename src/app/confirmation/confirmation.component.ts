import { Component, OnInit } from '@angular/core';
import * as shajs from 'sha.js';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { ProductService } from '../services/product.service';
import { HttpHeaders, HttpClient } from '@angular/common/http';

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
  description:any;
  
  constructor(private route: ActivatedRoute, private auth: AuthenticationService, private product:ProductService, private http: HttpClient) { }

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
      this.generateSignature();

    })
  }

  generateSignature(){
    var string = this.apiPass + 'access_code='+this.accessToken+'language=enmerchant_identifier='+this.merchantID+'merchant_reference='+this.shoppingCartId+'command=AUTHORIZATIONamount='+ this.total +'=AEDcustomer_email=' + this.info['email'] + this.apiPass;
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
        "settlement_reference": "Seafood buy on date",
        "return_url": "https://platform.seafoodsouq.com/thanks",
        "customer_email": this.email,
        "amount": this.total,
        "order_description": this.description
      }
      console.log(body);
      this.http.post(this.payFortApi, body,  {
        headers: new HttpHeaders({
          "charset": "utf-8",
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        })
      }).subscribe(res => console.log(res))
    }

}


