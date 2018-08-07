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
  showLoading:boolean=true;
  featuredSellers:any;
  showError:boolean=false;
  error:string;
  logos=[];
  featuredProducts:any;
  images=[];
  featuredTypesImages=[];
  loadProduct:boolean=true;
  featuredtypes:any;
  constructor(private product:ProductService, private auth: AuthenticationService, private sanitizer:DomSanitizer, private cart:CartService) {
  }
  ngOnInit() {
   this.getFeaturedSeller();
   this.getFeaturedProducts();
   this.getFeaturedTypes();
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
  getFeaturedTypes(){
    this.product.getData('featuredtypes/').subscribe(
      result=>{
        this.featuredtypes=result['featureds'];
        this.featuredtypes.forEach((data, index)=>{
          if(data.images && data.images.length>0){
            this.featuredTypesImages[index]=this.sanitizer.bypassSecurityTrustStyle(`url(${this.API}${data.images[0].src})`)
          }
          else{
            this.featuredTypesImages[index]=this.sanitizer.bypassSecurityTrustStyle("url(../../assets/default.jpg)")
          }
        })
        jQuery(document).ready(function(){
          jQuery('#featuredtype2').appendTo('#featured1')
        jQuery('#featured2').remove();
        })
        console.log(this.featuredtypes)
        console.log(this.featuredTypesImages)
      },
      error=>{
        console.log(error)
      }
    )
  }
}
