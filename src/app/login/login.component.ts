import { Component, OnInit } from '@angular/core';
import { HostListener } from '@angular/core'
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
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
  loginForm: FormGroup; 
  forgotForm: FormGroup; 
  showForm:boolean=false;
 @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.setHeight(event.target.innerHeight);
  }
  constructor(private fb:FormBuilder, private auth: AuthenticationService, private router:Router, 
    private toast:ToastrService, private isLoginService:IsLoginService, private cart:CartService,
    private product: ProductService, private orders:OrdersService) {
    this.redirectHome();
  }

  ngOnInit() {
    this.loginForm=this.fb.group({
      email:['',[Validators.email, Validators.required]],
      password:['', Validators.required]
    })
    this.setHeight(window.innerHeight);
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
    this.toast.error(e,'Error',{positionClass:"toast-top-right"})
  }
  showPopup(){
    this.forgotForm=this.fb.group({
      email:['',[Validators.required, Validators.email]]
    })
    this.showForm=true
  }
  closeForm(){
    this.showForm=false
  }
  forgotPassword(){
    this.product.saveData('api/user/forgot', this.forgotForm.value).subscribe(
      result=>{
        this.toast.success('We send you a mail to your email','Well Done',{positionClass:"toast-top-right"})
        this.showForm=false
      },
      e=>{
        this.showError(e.error)
        console.log(e)
      }
    )
  }
}
