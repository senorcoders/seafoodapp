import { Component, OnInit } from '@angular/core';
import {ProductService} from'../services/product.service';
import { AuthenticationService } from '../services/authentication.service';
import { DomSanitizer, SafeResourceUrl, SafeUrl,SafeStyle } from '@angular/platform-browser';
declare var jQuery:any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  products:any;
  API:string="http://138.68.19.227:7000";
  user:any;
  video:string="http://senorcoders.com/Water Sea Ocean.mp4";
  videoURLSafe:any;
  showLoading:boolean=true;
  featuredSellers:any;
  showError:boolean=false;
  error:string;
  logos:SafeStyle=[];
  onResize(event) {
    this.setHeight(event.target.innerHeight);
  }
  constructor(private product:ProductService, private auth: AuthenticationService, private sanitizer:DomSanitizer) {
    this.videoURLSafe = sanitizer.bypassSecurityTrustResourceUrl(this.video); 
  }
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
   );
   this.getFeaturedSeller();
    this.setHeight(window.innerHeight);
    if(this.auth.isLogged()){
      console.log(this.auth.getCart());
      if(this.auth.getCart() == null){
        this.creatCart();
      }
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
  getFeaturedSeller(){
    this.product.getData('featuredseller').subscribe(
      result=>{
        this.featuredSellers=result;
        this.getLogos();
      },
      error=>{
        console.log(error);
        this.showError=true;
        this.error="No Seller found"
      }
    )
  }
  getLogos(){
    this.featuredSellers.forEach((data, index)=>{
      this.product.getData('store/'+data.id).subscribe(
        result=>{
          if(result['logo'] && result['logo']!=''){
            this.logos[index]=this.sanitizer.bypassSecurityTrustStyle(`url(${this.API}${result['logo']})`);
          }
          else{
            this.logos[index]=this.sanitizer.bypassSecurityTrustStyle('url(../../assets/seafood-souq-seller-logo-default.jpg)');
          }
          console.log(this.logos)
        },
        error=>{
          console.log(error)
        }
      )
    })
  }
}
