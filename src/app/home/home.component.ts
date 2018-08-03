import { Component, OnInit } from '@angular/core';
import {ProductService} from'../services/product.service';
import { AuthenticationService } from '../services/authentication.service';
import { CartService } from '../core/cart/cart.service';
import { DomSanitizer, SafeResourceUrl, SafeUrl,SafeStyle } from '@angular/platform-browser';
declare var jQuery:any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  products:any=[];
  API:string="https://apiseafood.senorcoders.com";
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
  // onResize(event) {
  //   this.setHeight(event.target.innerHeight);
  // }
  constructor(private product:ProductService, private auth: AuthenticationService, private sanitizer:DomSanitizer, private cart:CartService) {
    //this.videoURLSafe = sanitizer.bypassSecurityTrustResourceUrl(this.video); 
  }
  // setHeight(h){
  //   document.getElementById("hero").style.height = h+"px";
  // }
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
    // this.setHeight(window.innerHeight);
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
        console.log(result)
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
  getShortDesc(data){  
    if(data.length>20){
        let text=data.split(/\s+/).slice(0,20).join(" ")
        return text+'...' 
    }
    else{
      return data
    }
  }
  getLogos(){
    this.featuredSellers.forEach((data, index)=>{
      this.product.getData('store/'+data.id).subscribe(
        result=>{
          if(result['logo'] && result['logo']!=''){
            this.logos[index]=this.API+result['logo'];
          }
          else{
            this.logos[index]="../../assets/seafood-souq-seller-logo-default.png";
          }
        },
        error=>{
          console.log(error)
        }
      )
    })
  }
}
