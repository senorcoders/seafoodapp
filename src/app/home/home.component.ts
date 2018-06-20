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
  products:any=[];
  API:string="http://138.68.19.227:7000";
  user:any;
  //video:string="http://senorcoders.com/Water Sea Ocean.mp4";
  //videoURLSafe:any;
  showLoading:boolean=true;
  featuredSellers:any;
  showError:boolean=false;
  error:string;
  logos=[];
  featuredProducts:any;
  images=[];
  loadProduct:boolean=true;
  onResize(event) {
    this.setHeight(event.target.innerHeight);
  }
  constructor(private product:ProductService, private auth: AuthenticationService, private sanitizer:DomSanitizer) {
    //this.videoURLSafe = sanitizer.bypassSecurityTrustResourceUrl(this.video); 
  }
  setHeight(h){
    document.getElementById("hero").style.height = h+"px";
  }
  ngOnInit() {
   //  let data={
   //    pageNumber:0,
   //    numberProduct: 9
   //  }
   // this.product.listProduct(data).subscribe(
   //  result=>{
   //    this.products=result;
   //  },error=>{
   //    console.log(error)
   //  }
   // );
   this.getFeaturedSeller();
   this.getFeaturedProducts();
    this.setHeight(window.innerHeight);
    if(this.auth.isLogged()){
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
  getFeaturedProducts(){
    this.product.getData('featuredproducts').subscribe(
      result=>{
        this.featuredProducts=result;
        this.getImages();
      },
      error=>{
        console.log(error);
        this.showError=true;
        this.error="No Seller found"
      }
    )
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
  getImages(){
    let val=this.featuredProducts.length;
    this.featuredProducts.forEach((data, index)=>{
      this.product.getProductDetail(data.id).subscribe(result => {
        this.products[index]=result;
        if(result['imagePrimary'] && result['imagePrimary']!=''){
          this.images[index]=this.API+result['imagePrimary']
        }
        else if(result['images'] && result['images'].length>0){
          this.images[index]=this.API+result['images'][0].src
        }
        else{
          this.images[index]="../../assets/default-img-product.jpg"
        }
        if (val-1==index) {
          this.loadProduct=false
        }
      },error=>{
        console.log(error)
      })
    })
  }
  getLogos(){
    this.featuredSellers.forEach((data, index)=>{
      this.product.getData('store/'+data.id).subscribe(
        result=>{
          if(result['logo'] && result['logo']!=''){
            this.logos[index]=this.API+result['logo'];
          }
          else{
            this.logos[index]="../../assets/seafood-souq-seller-logo-default.jpg";
          }
        },
        error=>{
          console.log(error)
        }
      )
    })
  }
}
