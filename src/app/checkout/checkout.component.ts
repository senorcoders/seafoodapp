import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as shajs from 'sha.js';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Http, RequestOptions } from '@angular/http';
import { HttpHeaders, HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  shoppingCartId:any;
  accessToken:any = 'Ddx5kJoJWr11sF6Hr6E4';
  merchantID:any = 'aZCWXhqJ';
  apiPass:any = 'bafgiwugfiwgfyyf';
  signatureCode:any;
  access_code: FormControl;
  card_number: FormControl;
  card_security_code: FormControl;
  expiry_date: FormControl;
  language: FormControl;
  merchant_identifier: FormControl;
  merchant_reference: FormControl;
  service_command: FormControl;
  signature: FormControl;
  checkoutForm: FormGroup;
  payForAPI:any = 'https://sbcheckout.PayFort.com/FortAPI/paymentPage';


  constructor(private router:Router,  private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      console.log(params);
      this.shoppingCartId = params['shoppingCartId'];
      this.generateSignature();
      this.createFormControls();
      this.createForm();
      this.setValues();
    })
  }

  generateSignature(){
    var string = this.apiPass + 'access_code='+this.accessToken+'language?enmerchant_identifier='+this.merchantID+'merchant_reference='+this.shoppingCartId+'service_command=TOKENIZATION';
    this.signatureCode = shajs('sha256').update(string).digest('hex');
    console.log(this.signatureCode);
  }

  createFormControls(){
    this.access_code= new FormControl('', [Validators.required]);
    this.card_number= new FormControl('', [Validators.required]);
    this.card_security_code= new FormControl('', [Validators.required]);
    this.expiry_date= new FormControl('', [Validators.required]);
    this.language= new FormControl('', [Validators.required]);
    this.merchant_identifier= new FormControl('', [Validators.required]);
    this.merchant_reference= new FormControl('', [Validators.required]);
    this.service_command= new FormControl('', [Validators.required]);
    this.signature= new FormControl('', [Validators.required]); 
  }

  createForm(){
    this.checkoutForm = new FormGroup({
      access_code: this.access_code,
      card_number: this.card_number,
      card_security_code: this.card_security_code,
      expiry_date: this.expiry_date,
      language: this.language,
      merchant_identifier: this.merchant_identifier,
      merchant_reference: this.merchant_reference,
      service_command: this.service_command,
      signature: this.signature

    }, {
      updateOn: 'submit'
    });
  }

  setValues(){
    this.checkoutForm.controls['access_code'].setValue(this.accessToken);
    this.checkoutForm.controls['language'].setValue('en');
    this.checkoutForm.controls['merchant_identifier'].setValue(this.merchantID);
    this.checkoutForm.controls['merchant_reference'].setValue(this.shoppingCartId);
    this.checkoutForm.controls['service_command'].setValue('TOKENIZATION');
    this.checkoutForm.controls['signature'].setValue(this.signatureCode);
  }
  validateAllFormFields(formGroup: FormGroup) {         
    Object.keys(formGroup.controls).forEach(field => { 
      const control = formGroup.get(field);             
      if (control instanceof FormControl) {             
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {        
        this.validateAllFormFields(control);            
      }
    });
  }

  onSubmit(){
    if(this.checkoutForm.valid){
      console.log("Valido");
      this.sendDataToPayfort().subscribe(res =>{
        console.log(res);
      });
    }else{
      this.validateAllFormFields(this.checkoutForm);
    }
   
  }
  

  sendDataToPayfort(){
    var formBody = new FormData();
    formBody.set("access_code", this.checkoutForm.get('access_code').value);
    formBody.set("card_number", this.checkoutForm.get('card_number').value);
    formBody.set("card_security_code", this.checkoutForm.get('card_security_code').value);
    formBody.set("expiry_date", this.checkoutForm.get('expiry_date').value);
    formBody.set("language", this.checkoutForm.get('language').value);
    formBody.set("merchant_identifier", this.checkoutForm.get('merchant_identifier').value);
    formBody.set("merchant_reference", this.checkoutForm.get('merchant_reference').value);
    formBody.set("service_command", this.checkoutForm.get('service_command').value);
    formBody.set("signature", this.checkoutForm.get('signature').value);
    

    return this.http.post(this.payForAPI, 
      this.checkoutForm.value,  {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
    })
  }

}
