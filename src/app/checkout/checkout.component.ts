import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as shajs from 'sha.js';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { CartService } from '../core/cart/cart.service';
import { OrderService } from '../services/orders.service';
import { AuthenticationService } from '../services/authentication.service';
import { DateTimeAdapter } from 'ng-pick-datetime';
import { ToastrService } from 'ngx-toastr';
declare var jQuery:any;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  shoppingCartId: any;
  accessToken: any = 'Ddx5kJoJWr11sF6Hr6E4';
  merchantID: any = 'aZCWXhqJ';
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
  payForAPI: any = 'https://sbcheckout.PayFort.com/FortAPI/paymentPage';
  randomID: any;
  products: any = [];
  total: any;
  totalOtherFees: any;
  shipping: any;
  totalWithShipping: any;
  showShippingFields: boolean = false;
  check: boolean = false;
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

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private Cart: CartService,
    private auth: AuthenticationService,
    private orders: OrderService,
    private toast: ToastrService,
    dateAdapter: DateTimeAdapter<any>
  ) {
    this.min.setDate( this.today.getDate() + 3 );
    this.max.setDate( this.today.getDate() + 120 );

    dateAdapter.setLocale('en-EN'); // change locale to Japanese
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.shoppingCartId = params['shoppingCartId'];
      this.randomID = this.guid();
      this.generateSignature();
      this.getCart();
      this.getPersonalData();
      // this.shipping = localStorage.getItem('shippingCost');
      

    });
  }
  getPersonalData() {
    this.info = this.auth.getLoginData();
  }
  getCart() {


    this.Cart.cart.subscribe((cart: any) => {
      if (cart && cart['items'] !== '') {
        this.products = cart['items'];
        /*this.total=cart['total'];
        this.shipping=cart['shipping']
        this.totalOtherFees=cart['totalOtherFees']*/
        // this.totalWithShipping = this.total + this.shipping + this.totalOtherFees;
        this.buyerId = cart['buyer'];

        this.orders.getCart(this.buyerId)
          .subscribe(
            res => {
              console.log("Cart", res);
              this.total = res['subTotal'];
              this.shipping = res['shipping'];
              this.totalOtherFees = res['totalOtherFees'] + res['uaeTaxes'];
              this.totalWithShipping = res['total'];
              localStorage.setItem('shoppingTotal', this.totalWithShipping);

            },
            error => {
              console.log(error);
            }
          );
      }

    });
  }
  generateSignature() {
    const string = this.apiPass + 'access_code=' + this.accessToken + 'language=enmerchant_identifier=' + this.merchantID + 'merchant_reference=' + this.randomID + 'service_command=TOKENIZATION' + this.apiPass;
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
    

    //if ( all_medd_ok ) {
      
      /*this.orders.updateItemsETA( { etas: this.expectedDates } ).subscribe(
        res=>{
          this.toast.success('ETA updated', 'Success', { positionClass: 'toast-top-right' });
        },
        error => {
          this.toast.error('Error updating ETA', 'Error', { positionClass: 'toast-top-right' });
          console.log( error );
        }
      )*/
      /*if (this.checkoutForm.valid) {
        console.log('Valido');
        this.sendDataToPayfort().subscribe(res => {
          console.log(res);
        });
      } else {
        this.validateAllFormFields(this.checkoutForm);
      }*/
    //} else {
    //  this.toast.error('Please fill all Max Expected Delivery Dates', 'Error', { positionClass: 'toast-top-right' });
    //}


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
}
