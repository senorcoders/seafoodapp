import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { HostListener } from '@angular/core'
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import { IsLoginService } from '../core/login/is-login.service';
import { CartService } from '../core/cart/cart.service';
import { ProductService } from '../services/product.service';
import { OrdersService } from '../core/orders/orders.service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

declare var jQuery;
declare var window;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @ViewChild("emailInput", { static: true }) nameField: ElementRef;
  loginForm: FormGroup;
  forgotForm: FormGroup;
  showForm: boolean = false;
  wrongData: boolean = false;
  email: FormControl;
  password: FormControl;
  isValid: boolean = false;
  loginText: any = 'LOGIN';
  role;
  verified:boolean = false;
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.setHeight(event.target.innerHeight);
  }
  public userNo: any;
  constructor(private auth: AuthenticationService, private router: Router,
    private isLoginService: IsLoginService, private cart: CartService,
    private product: ProductService, private orders: OrdersService,
    private translate: TranslateService, private zone: NgZone,
    private http: HttpClient, private route: ActivatedRoute
  ) {
    console.log(this.translate.currentLang, this.translate)
    this.redirectHome();
    this.route.queryParams.subscribe(async params => {
      this.verified = params['verified'];

    });

    //Check if is an android browser
    jQuery(document).ready(function ($) {

      var _originalSize = $(window).width() + $(window).height()
        $(window).resize(function(){
          if($(window).width() < 992){
            if($(window).width() + $(window).height() != _originalSize){
              jQuery('.introductory-title').css('opacity', '0');
              // jQuery('.login-nav-logo').css('display', 'none');
            }else{
              console.log("keyboard closed");
              jQuery('.introductory-title').css('opacity', '1');
              // jQuery('.login-nav-logo').css('display', 'flex');
            }
          }
          
  });

    });
     
  }

  ngOnInit() {
    this.createFormControls();
    this.createForm();
    this.setHeight(window.innerHeight);
    this.nameField.nativeElement.focus(); 
    
  }


  createFormControls() {
    this.email = new FormControl('', [Validators.email, Validators.required]);
    this.password = new FormControl('', Validators.required);
  }

  createForm() {
    this.loginForm = new FormGroup({
      email: this.email,
      password: this.password
    }, {
        updateOn: 'submit'
      });
  }
  redirectHome() {
    if (this.auth.isLogged()) {
      if (this.role == 1) {
        this.zone.run(() => this.router.navigate(["/my-products"]));
      } else if (this.role == 2) {
        this.zone.run(() => this.router.navigate(["/shop"]));
      } else {
        this.router.navigate(["/"]);
      }
      this.isValid = false;
      this.loginText = 'LOGIN';
    }
  }
  setHeight(h) {
    document.getElementById("hero").style.height = h + "px";
  }
  login() {
    if (this.loginForm.valid) {
      this.isValid = true;
      this.sendDataLogin();
    } else {
      this.validateAllFormFields(this.loginForm);
    }

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

  sendDataLogin() {
    this.loginText = 'Loading...';
    this.auth.login(this.loginForm.value).subscribe(
      data => {
        if (data['msg'] && data['msg'] === 'no verified') {
          this.isValid = false;
          this.loginText = 'Login';
          this.userNo = this.loginForm.value.email.toLowerCase();
          return jQuery('#confirm').modal('show')
        }
        console.log("Login Res", data);
        this.auth.setLoginData(data);
        this.role = data['role'];
        this.isLoginService.setLogin(true, data['role'])
        //get login data
        let login = this.auth.getLoginData();
        //set buyer id to get cart
        let buyer = { "buyer": login.id };
        //set orders if you have them
        this.product.getData(`shoppingcart/?where={"status":{"like":"paid"},"buyer":"${login.id}"}`).subscribe(
          result => {
            if (result && result != '') {
              this.orders.setOrders(true)
            }

          },
          e => {
            console.log(e);

          }
        )
        //get cart
        this.product.saveData("shoppingcart", buyer).subscribe(
          result => {
            //set the cart
            this.cart.setCart(result)
            this.redirectHome();
          },
          e => { console.log(e) }
        )
      },
      error => {
        console.log(error);
        this.showError(error.error);
        this.isValid = false;
        this.loginText = 'Login';
      }
    )
  }
  showError(e) {
    //this.toast.error(e,'Error',{positionClass:"toast-top-right"})
    this.wrongData = true;
  }

  public hideModal() {
    jQuery('#confirm').modal('hide');
  }

  public async confirm(res) {
    if (res === true)
      this.http.put('user/resendemail', { email: this.userNo }).toPromise();
    this.hideModal();
  }
}
