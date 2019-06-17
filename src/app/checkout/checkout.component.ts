import { Component, OnInit } from '@angular/core';
import { Inject } from '@angular/core';
import {  ActivatedRoute, Router } from '@angular/router';
import * as shajs from 'sha.js';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { OrderService } from '../services/orders.service';
import { AuthenticationService } from '../services/authentication.service';
import { DateTimeAdapter } from 'ng-pick-datetime';
import { environment } from '../../environments/environment';
import { Location, DOCUMENT } from '@angular/common';
import { ToastrService } from '../toast.service';

declare var jQuery:any;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  shoppingCartId: any;
  accessToken: any = 'chArgcTLiDtoP5wO1hFh';//'Ddx5kJoJWr11sF6Hr6E4';
  merchantID: any = 'xqNrOYgH';//'aZCWXhqJ';
  apiPass: any = 'bafgiwugfiwgfyyf';
  signatureCode: any;
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
  payForAPI: any = 'https://checkout.PayFort.com/FortAPI/paymentPage';
  randomID: any;
  products: any = [];
  total: any = 0;
  totalOtherFees: any  = 0;
  shipping: any  = 0;
  totalWithShipping: any  = 0;
  showShippingFields: boolean = false;
  check: boolean = false;
  env: any;
  info: any;
  buyerId: string;
  today = new Date();
  min = new Date();
  max = new Date();
  expectedDates: any = [];
  all_medd_ok: Boolean = false;
  selectYear:any = "19";
  selectMonth:any = "01";
  expiryDate:any;
  error:boolean = false;
  name:any;
  address:any;
  formAction: string = '';
  formMethod: string = 'POST';
  vat:any = 0;
  taxesPer: any;

  private cart:any;
  public CODPayment = false;
  public codEnable = false;
  showSnackBar:boolean = false;
  itemsDeleted: any =  [];

  constructor(
    @Inject(DOCUMENT) private _document,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private auth: AuthenticationService,
    private orders: OrderService,
    private _location: Location,
    private toast:ToastrService,
    dateAdapter: DateTimeAdapter<any>)
    {  
    this.min.setDate( this.today.getDate() + 3 );
    this.max.setDate( this.today.getDate() + 120 );

    dateAdapter.setLocale('en-EN'); // change locale to Japanese
  }

  ngOnInit() {
    this.env = environment;
    //this.addFingerPrintScript();
    // bypass payfort, payfort only works in main domain
    if ( this.env.payfort ) {
      this.formAction = 'https://checkout.PayFort.com/FortAPI/paymentPage';

     
    } else {
      this.formAction = '/confirmation';
      this.formMethod = 'GET';
    }

    console.log(this.formAction, this.formMethod);

    this.route.queryParams.subscribe(async params => {
      this.shoppingCartId = params['shoppingCartId'];
      this.error = params['creditIssue'];
      this.randomID = this.guid();
      this.getPersonalData();
      await this.validateCart();
      this.getCart();
      // this.shipping = localStorage.getItem('shippingCost');
      this.name = localStorage.getItem('billingInformationName');
      this.address = localStorage.getItem('billingInformationAddress');
      

    });
  }

  public goToConfirmation(){
    if(this.cart.total>this.cart.buyer.cod.available){
      return this.toast.error("TThe credit you have available is not enough for you to pay with COD");
    }
    this.http.patch("shoppingcart/"+ this.cart.id, {isCOD:true}).subscribe(it=>{
      this.router.navigate(["confirmation"]);
    });
  }

  setCod(boolean){
    this.CODPayment = boolean;
  }
 
  getPersonalData() {
    this.info = this.auth.getLoginData();
    this.buyerId = this.info['id'];
  }

    //VALIDATING CART 
    async validateCart(){
      await new Promise((resolve, reject) => {
        this.orders.validateCart(this.buyerId).subscribe(val =>{
          console.log("Cart Validation", val);
          if(val['items'].length > 0){
            this.itemsDeleted = val['items'];
            this.showSnackBar = true;
          }
          resolve();
        }, error =>{
          reject();
        })
      });
    }
  getCart() {

      this.orders.getCart(this.buyerId)
          .subscribe(
            res => {
              if (res && res['items'] !== '') {

              console.log("Cart", res);
              this.cart = res;
              this.codEnable = res["buyer"].cod !== undefined && res["buyer"].cod.usage === true;
              this.products = res['items'];
              this.total = res['subTotal'];
              this.shipping = res['shipping'];
              this.totalOtherFees = res['totalOtherFees'];
              this.totalWithShipping = res['total'];
              this.vat = res['uaeTaxes'];
              this.taxesPer = res['currentCharges']['uaeTaxes'];

              localStorage.setItem('shoppingTotal', this.totalWithShipping);
              this.generateSignature();

            //si se entra el pagina checkout el cod se pone false, porque quizas se entro de confirmation a checkout
            this.http.patch("shoppingcart/"+ this.cart.id, {isCOD:false}).subscribe(it=>{
              console.log("back inside");
            });

            }

            },
            error => {
              console.log(error);
            }
          );
      

  }
  generateSignature() {
    //const finger: HTMLInputElement = <HTMLInputElement>document.getElementById( 'device_fingerprint' );
    //console.log('finger', finger.value);
    const string = this.apiPass + 'access_code=' + this.accessToken +'language=enmerchant_identifier=' + this.merchantID + 'merchant_reference=' + this.randomID + 'service_command=TOKENIZATION' + this.apiPass;
    console.log(string);
    this.signatureCode = shajs('sha256').update(string).digest('hex');
    console.log(this.signatureCode);
  }

  createFormControls() {
    this.access_code = new FormControl('', [Validators.required]);
    this.card_number = new FormControl('', [Validators.required]);
    this.card_security_code = new FormControl('', [Validators.required]);
    this.expiry_date = new FormControl('', [Validators.required]);
    this.language = new FormControl('', [Validators.required]);
    this.merchant_identifier = new FormControl('', [Validators.required]);
    this.merchant_reference = new FormControl('', [Validators.required]);
    this.service_command = new FormControl('', [Validators.required]);
    this.signature = new FormControl('', [Validators.required]);
  }

  createForm() {
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

  setValues() {
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

  emitValue() {
    let localOk = true;
    this.expectedDates = [];
    this.products.map( ( product, index ) => {
      console.log('product', product);
      const expectedDate = jQuery( `#medd${product.id}` ).val();
      console.log( 'expected', expectedDate );
      if ( expectedDate === '' || expectedDate === undefined ) {
        localOk = false;
        this.all_medd_ok = false;
      } else {
        this.orders.updateETA( product.id, expectedDate ).subscribe(
          result => {
            console.log( 'leng', this.products.length );
            console.log( 'index', index + 1 );
            if ( this.products.length === index + 1 ) {
              if ( localOk ) {
                this.all_medd_ok = true;
              } else {
                this.all_medd_ok = false;
                
              }
            }
          }, error => {
            console.log(error);
          }
        )
        this.expectedDates.push( { id: product.id, buyerExpectedDeliveryDate: expectedDate  } );
      }

    } );
  }

  onSubmit() {
    

    this.validateCreditCardNumber();


  }

  changeDate(value) {
    console.log( 'change date input', value );
  }

  sendDataToPayfort() {
    const formBody = new FormData();
    formBody.set('access_code', this.checkoutForm.get('access_code').value);
    formBody.set('card_number', this.checkoutForm.get('card_number').value);
    formBody.set('card_security_code', this.checkoutForm.get('card_security_code').value);
    formBody.set('expiry_date', this.checkoutForm.get('expiry_date').value);
    formBody.set('language', this.checkoutForm.get('language').value);
    formBody.set('merchant_identifier', this.checkoutForm.get('merchant_identifier').value);
    formBody.set('merchant_reference', this.checkoutForm.get('merchant_reference').value);
    formBody.set('service_command', this.checkoutForm.get('service_command').value);
    formBody.set('signature', this.checkoutForm.get('signature').value);
    formBody.set('MaxDeliveryDate', this.expectedDates );

    return this.http.post(this.payForAPI,
      formBody, {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      });
  }
  guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }

  getTotalxItem(count, price) {
    return count * price;
  }

  onInputChange(value) {
    console.log(value.currentTarget.checked);

    console.log(this.check);
    if (this.check === true) {
      this.showShippingFields = true;
    } else {
      this.showShippingFields = false;
    }
  }


  onDateChange(){
    let val = this.selectYear + this.selectMonth;
    console.log(val);
    this.expiryDate = val;

  }

  saveArray(){
    console.log(this.name, this.address);
    localStorage.setItem('billingInformationName', this.name);
    localStorage.setItem('billingInformationAddress', this.address)

  }
  validateLength(event: any, min:number, max: number, id: string) {
    const pattern = /[0-9]/;
    const inputChar = String.fromCharCode(event.charCode);
    const icard_number = <HTMLInputElement> document.getElementById(id);
    //this.validateCreditCardNumber(icard_number.value+inputChar);
    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
    console.log( icard_number.value.length, max );
    if ( icard_number.value.length >= max ) {
      this.all_medd_ok = false;
      event.preventDefault();
    } else if ( icard_number.value.length < min ) {
      this.all_medd_ok = false;
    } else {
      this.all_medd_ok = true;
    }
  }

  back(){
    this._location.back();
  }

  validateccvNumber() { 
 
    const ccv = <HTMLInputElement> document.getElementById('card_security_code');
   
    if ( ccv.value.length > 4 ) {
      this.all_medd_ok = false;    
      this.toast.error('Please enter a valid ccv number.', 'Error', { positionClass: 'toast-top-right' });
    } else if ( ccv.value.length < 3 ) {
      this.all_medd_ok = false;
      this.toast.error('Please enter a valid ccv number.', 'Error', { positionClass: 'toast-top-right' });
    } else {
      this.all_medd_ok = true;
    }
  }

 validateCreditCardNumber() {
  const icard_number = <HTMLInputElement> document.getElementById('card_number');
  if ( icard_number.value.length > 16 ) {
    this.all_medd_ok = false;
    this.toast.error('Please enter a valid card number.', 'Error', { positionClass: 'toast-top-right' });
  } else if ( icard_number.value.length < 13 ) {
    this.all_medd_ok = false;
    this.toast.error('Please enter a valid card number.', 'Error', { positionClass: 'toast-top-right' });
  } else {
    this.all_medd_ok = true;
  }

}

closeSnackBar(){
  this.showSnackBar = false;
}

}
