import { Component, OnInit, HostListener } from '@angular/core';
import {ProductService} from'../services/product.service';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @HostListener('window:resize', ['$event'])
  products:any;
  API:string="http://138.68.19.227:7000";
  user:any;
  onResize(event) {
    this.setHeight(event.target.innerHeight);
  }
  constructor(private product:ProductService, private auth: AuthenticationService) { }
  setHeight(h){
    document.getElementById("hero").style.height = h+"px";
  }
  ngOnInit() {
    let data={
      pageNumber:0,
      numberProduct: 9
    }
   this.product.listProduct(data).subscribe(
    result=>{
      this.products=result;
      console.log(this.products)
    },error=>{
      console.log(error)
    }
   )
    this.setHeight(window.innerHeight);
    if(this.auth.isLogged()){
      this.creatCart();
    }
  }

  creatCart(){
    this.user = this.auth.getLoginData();
    console.log("User", this.user);
    let cart = {
      "buyer": this.user['id']
    }

    this.product.saveData("shoppingcart", cart).subscribe(result => {
         this.auth.setCart(result);
    })
  }


}
