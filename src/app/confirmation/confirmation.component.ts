import { Component, OnInit } from '@angular/core';
import * as shajs from 'sha.js';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { ProductService } from '../services/product.service';

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
    "shoppingCart": this.shoppingCartId

  };
  info:any;
  constructor(private route: ActivatedRoute, private storage: Storage, private auth: AuthenticationService, private product:ProductService) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      console.log(params);
      this.params.response = params;
      this.shoppingCartId = params.merchant_reference;
      this.generateSignature();
      this.amount= this.storage.getItem('shoppingTotal');
      this.total = this.amount * 1000;
      this.getPersonalData();
    })
  }

  generateSignature(){
    var string = this.apiPass + 'access_code='+this.accessToken+'language=enmerchant_identifier='+this.merchantID+'merchant_reference='+this.shoppingCartId+'command=AUTHORIZATIONamount='+ this.total +'=AEDcustomer_email=' + this.info.email + this.apiPass;
    this.signature = shajs('sha256').update(string).digest('hex');
    console.log(this.signature);
  }

  getPersonalData(){
    this.info = this.auth.getLoginData();
    console.log("Info", this.info);
  }

  saveinApi(){
    this.product.saveData('api/shoppingcart/' + this.shoppingCartId, this.params).subscribe(result => console.log(result))
  }

}
