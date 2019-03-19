import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HostListener } from '@angular/core'
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {AuthenticationService} from '../services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import {IsLoginService} from '../core/login/is-login.service';
import {CartService} from '../core/cart/cart.service';
import {ProductService} from '../services/product.service';
import {OrdersService} from '../core/orders/orders.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @ViewChild("emailInput") nameField: ElementRef;
  loginForm: FormGroup; 
  forgotForm: FormGroup; 
  showForm:boolean=false;
  wrongData:boolean = false;
  email: FormControl;
  password: FormControl;
 @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.setHeight(event.target.innerHeight);
  }
  constructor(private fb:FormBuilder, private auth: AuthenticationService, private router:Router, 
    private isLoginService:IsLoginService, private cart:CartService,
    private product: ProductService, private orders:OrdersService) {
    this.redirectHome();
  }

  ngOnInit() {
    this.createFormControls();
    this.createForm();
    this.setHeight(window.innerHeight);
    this.nameField.nativeElement.focus();
  }


  createFormControls(){
    this.email = new FormControl('', [Validators.email, Validators.required]);
    this.password = new FormControl('', Validators.required);
  }

  createForm(){
    this.loginForm = new FormGroup({
        email: this.email,
        password: this.password
    }, {
      updateOn: 'submit'
    });
  }
  redirectHome(){
     if(this.auth.isLogged()){
      this.router.navigate(["/"])
    }
  }
  setHeight(h){
    document.getElementById("hero").style.height = h+"px";
  } 
  login(){
    if(this.loginForm.valid){
      this.sendDataLogin();
    }else{
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

  sendDataLogin(){
    this.auth.login(this.loginForm.value).subscribe(
      data=>{
        this.auth.setLoginData(data);
        this.isLoginService.setLogin(true,data['role'])
        //get login data
        let login=this.auth.getLoginData();
        //set buyer id to get cart
        let buyer={"buyer":login.id};
        //set orders if you have them
        this.product.getData(`shoppingcart/?where={"status":{"like":"paid"},"buyer":"${login.id}"}`).subscribe(
        result=>{
          if(result && result!=''){
            this.orders.setOrders(true)
          }
        },
        e=>{
          console.log(e)
        }
        )
        //get cart
        this.product.saveData("shoppingcart",buyer).subscribe(
          result=>{
            //set the cart
            this.cart.setCart(result)
            this.redirectHome();
          },
          e=>{console.log(e)}
        )
      },
      error=>{
        console.log(error);
        this.showError(error.error);
      } 
    )
  }
  showError(e){
    //this.toast.error(e,'Error',{positionClass:"toast-top-right"})
    this.wrongData = true;
  }
  
 
}
